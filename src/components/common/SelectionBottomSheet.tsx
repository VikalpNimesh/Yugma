import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Modal,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

type SelectionBottomSheetProps = {
    visible: boolean;
    onClose: () => void;
    title: string;
    options: any[];
    selectedKey?: string;
    onSelect: (option: any) => void;
    searchable?: boolean;
    searchPlaceholder?: string;
    keyExtractor?: (item: any) => string;
    labelExtractor?: (item: any) => string;
};

export const SelectionBottomSheet: React.FC<SelectionBottomSheetProps> = ({
    visible,
    onClose,
    title,
    options,
    selectedKey,
    onSelect,
    searchable = false,
    searchPlaceholder = "Search...",
    keyExtractor = (item) => item.key || item.value || String(item),
    labelExtractor = (item) => item.label || item.name || String(item),
}) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Reset search query when modal is closed/opened
    useEffect(() => {
        if (!visible) {
            setSearchQuery("");
        }
    }, [visible]);

    const filteredOptions = searchable
        ? options.filter((option) =>
              labelExtractor(option)
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
          )
        : options;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardContainer}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.modalContent}
                    >
                        {/* Drag Handle Indicator */}
                        <View style={styles.dragHandle} />

                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        {/* Search Bar */}
                        {searchable && (
                            <View style={styles.searchContainer}>
                                <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder={searchPlaceholder}
                                    placeholderTextColor="#888"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    autoCapitalize="none"
                                />
                                {searchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                                        <Ionicons name="close-circle" size={18} color="#888" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        {/* Options List */}
                        <FlatList
                            data={filteredOptions}
                            keyExtractor={keyExtractor}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => {
                                const key = keyExtractor(item);
                                const label = labelExtractor(item);
                                const isSelected = selectedKey === key;

                                return (
                                    <TouchableOpacity
                                        style={[
                                            styles.optionItem,
                                            isSelected && styles.optionItemActive,
                                        ]}
                                        onPress={() => {
                                            onSelect(item);
                                            onClose();
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.optionItemText,
                                                isSelected && styles.optionItemTextActive,
                                            ]}
                                        >
                                            {label}
                                        </Text>
                                        {isSelected && (
                                            <Ionicons name="checkmark-circle" size={22} color="#FF3366" />
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="alert-circle-outline" size={48} color="#999" />
                                    <Text style={styles.emptyText}>No results found</Text>
                                </View>
                            }
                        />
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    keyboardContainer: {
        flex: 1,
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 10,
        paddingHorizontal: 20,
        maxHeight: "75%",
        minHeight: "40%",
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: "#E0E0E0",
        borderRadius: 2.5,
        alignSelf: "center",
        marginBottom: 15,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1A1A1A",
    },
    closeButton: {
        padding: 5,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        borderRadius: 24,
        paddingHorizontal: 16,
        marginBottom: 16,
        height: 48,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: "#1A1A1A",
        fontSize: 16,
        padding: 0,
    },
    optionItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F5F5F5",
    },
    optionItemActive: {
        backgroundColor: "rgba(255, 51, 102, 0.06)",
        borderRadius: 12,
    },
    optionItemText: {
        fontSize: 16,
        color: "#4A4A4A",
    },
    optionItemTextActive: {
        fontWeight: "700",
        color: "#FF3366",
    },
    listContent: {
        paddingBottom: 40,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        gap: 10,
    },
    emptyText: {
        color: "#999",
        fontSize: 16,
        fontWeight: "500",
    },
});
