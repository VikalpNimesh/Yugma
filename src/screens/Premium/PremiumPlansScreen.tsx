import React, { useState, useMemo, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Platform,
    StatusBar,
    Modal,
    Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";
import { useGlobalIAP as useIAP } from "../../context/IapContext";
import { RootState } from "../../redux/store";
import axiosInstance from "../../api/axios/axiosInstance";

interface Feature {
    text: string;
    icon: string;
}

const PREMIUM_FEATURES: Feature[] = [
    { text: "Unlimited Likes & Swipes", icon: "heart" },
    { text: "See Who Liked You", icon: "eye" },
    { text: "5 Free Super Likes Weekly", icon: "star" },
    { text: "1 Monthly Profile Boost", icon: "flash" },
    { text: "Travel Mode to any location", icon: "planet" },
    { text: "Advanced Filtering & No Ads", icon: "options" },
];

const PLAN_SUBTEXTS: Record<string, string> = {
    weekly: "Best value for money",
    monthly: "Great to get started",
    quarterly: "Perfect for a season",
    halfyearly: "Best for finding 'The One'",
    yearly: "Ultimate dating experience",
};

const PremiumPlansScreen = () => {
    const navigation = useNavigation();
    const { 
        products, 
        activeSubscriptions, 
        isLoading, 
        error, 
        currentPurchase,
        lastError,
        requestSubscription,
        clearPurchaseState
    } = useIAP();
    const { user } = useSelector((state: RootState) => state.auth);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);

    // Verify purchase with backend API
    useEffect(() => {
        const verifyPurchase = async () => {
            if (currentPurchase && user) {
                try {
                    const payload = {
                        userId: user.id,
                        productId: currentPurchase.productId || "premium",
                        purchaseToken: currentPurchase.purchaseToken || currentPurchase.transactionReceipt,
                        transactionId: currentPurchase.transactionId || (currentPurchase as any).id,
                        transactionDate: currentPurchase.transactionDate,
                        packageName: (currentPurchase as any).packageNameAndroid || "com.yugma.dating",
                        basePlan: selectedPlanId || "monthly"
                    };

                    const response = await axiosInstance.post('/subscription/verify', payload);

                    if (response.status === 200 || response.status === 201) {
                        console.log('Subscription verified successfully');
                    } else {
                        console.error('Subscription verification failed', response.data);
                    }
                } catch (err) {
                    console.error('API Verification error:', err);
                }
            }
        };

        verifyPurchase();
    }, [currentPurchase, user, selectedPlanId]);

    // Identify the currently active plan
    const activePlan = useMemo(() => {
        return activeSubscriptions.find(sub => sub.isActive && sub.productId === 'premium');
    }, [activeSubscriptions]);

    // Process subscriptions and filter out the active one
    const plans = useMemo(() => {
        if (!products || products.length === 0) return [];

        // Find your 'premium' product from the array you provided
        // v14 Nitro version uses 'id' instead of 'productId'
        const premiumSub = products.find(p => p.id === 'premium' || (p as any).productId === 'premium');
        if (!premiumSub) return [];

        if (Platform.OS === 'android') {
            // Using the subscriptionOfferDetailsAndroid field from your JSON
            const offers = (premiumSub as any).subscriptionOfferDetailsAndroid;
            if (!offers || !Array.isArray(offers)) return [];

            return offers.map((offer: any) => {
                const basePlanId = offer.basePlanId;
                // Get price from the first pricing phase
                const price = offer.pricingPhases.pricingPhaseList[0].formattedPrice;

                // Map display labels based on basePlanId
                const labels: Record<string, string> = {
                    weekly: "Weekly Premium",
                    monthly: "Monthly Premium",
                    quarterly: "Quarterly Premium",
                    halfyearly: "Half-Yearly Premium",
                    yearly: "Yearly Premium"
                };

                const periods: Record<string, string> = {
                    weekly: "/week",
                    monthly: "/month",
                    quarterly: "/3 months",
                    halfyearly: "/6 months",
                    yearly: "/year"
                };

                const savings: Record<string, string> = {
                    quarterly: "SAVE 15%",
                    halfyearly: "SAVE 30%",
                    yearly: "50% OFF"
                };

                // Check if this specific base plan is active
                const isActive = activePlan?.basePlanIdAndroid === basePlanId;

                return {
                    id: basePlanId,
                    sku: premiumSub.id,
                    offerToken: offer.offerToken, // Important for the purchase flow
                    title: labels[basePlanId] || basePlanId.charAt(0).toUpperCase() + basePlanId.slice(1) + " Plan",
                    subtext: PLAN_SUBTEXTS[basePlanId] || "Save more with longer plans",
                    price: price,
                    period: periods[basePlanId] || "",
                    features: PREMIUM_FEATURES,
                    badge: savings[basePlanId] || null,
                    isPopular: basePlanId === 'yearly',
                    isActive: isActive,
                };
            })
                .filter(plan => !plan.isActive) // Hide current active plan from listing
                .sort((a: any, b: any) => {
                    // Keep the order: Monthly -> Quarterly -> Half-Yearly -> Yearly
                    const order = ['weekly', 'monthly', 'quarterly', 'halfyearly', 'yearly'];
                    return order.indexOf(a.id) - order.indexOf(b.id);
                });
        }

        return []; // iOS logic remains separate
    }, [products, activePlan]);

    // Set default selection
    React.useEffect(() => {
        if (plans.length > 0 && !selectedPlanId) {
            setSelectedPlanId(plans[0].id);
        }
    }, [plans, selectedPlanId]);

    const handleSelectPlan = async (plan: any) => {
        try {
            setIsPurchasing(true);
            await requestSubscription(plan.sku, plan.offerToken);
        } catch (err) {
            console.error('Purchase failed', err);
        } finally {
            setIsPurchasing(false);
        }
    };

    const SuccessModal = () => {
        if (!currentPurchase) return null;
        
        // Find the plan that was just bought using selectedPlanId
        const purchasedPlan = plans.find(p => p.id === selectedPlanId) || { title: 'Premium Plan' };

        return (
            <Modal transparent visible={!!currentPurchase} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.successContainer}>
                        <LinearGradient colors={['#FFD700', '#FFA000']} style={styles.successIconBadge}>
                            <Ionicons name="checkmark" size={50} color="#FFF" />
                        </LinearGradient>
                        
                        <Text style={styles.successTitle}>Payment Successful!</Text>
                        <Text style={styles.successSub}>Welcome to Yugma Premium. Your account has been upgraded.</Text>
                        
                        <View style={styles.receiptContainer}>
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>Order ID</Text>
                                <Text style={styles.receiptValue} numberOfLines={1}>{currentPurchase.transactionId || (currentPurchase as any).id}</Text>
                            </View>
                            <View style={styles.receiptDivider} />
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>Plan</Text>
                                <Text style={styles.receiptValue}>{purchasedPlan.title}</Text>
                            </View>
                            <View style={styles.receiptDivider} />
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>Date</Text>
                                <Text style={styles.receiptValue}>{new Date(currentPurchase.transactionDate).toLocaleDateString()}</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.closeBtn} onPress={() => {
                            clearPurchaseState();
                            navigation.goBack();
                        }}>
                            <LinearGradient colors={['#FF5F6D', '#FF3366']} style={styles.closeBtnGradient}>
                                <Text style={styles.closeBtnText}>Start Matching</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    const FailureModal = () => {
        if (!lastError || lastError === 'CANCELLED') return null;

        return (
            <Modal transparent visible={!!lastError} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.failureContainer}>
                        <View style={styles.failureIconCircle}>
                            <Ionicons name="close-outline" size={40} color="#FF5252" />
                        </View>
                        
                        <Text style={styles.failureTitle}>Payment Failed</Text>
                        <Text style={styles.failureSub}>{lastError}</Text>
                        
                        <TouchableOpacity style={styles.retryBtnLarge} onPress={clearPurchaseState}>
                            <Text style={styles.retryBtnTextLarge}>Dismiss</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    const handleRestore = async () => {
        try {
            await IAP.restorePurchases();
            // Handle success (e.g. show toast)
        } catch (err) {
            console.error('Restore failed', err);
        }
    };

    const handleRedeem = async () => {
        if (Platform.OS === 'android') {
            try {
                // For Android, we can show the redemption sheet
                // In some versions of react-native-iap this might be different
                // or you might need to link to Play Store
            } catch (err) {
                console.error('Redeem failed', err);
            }
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF3366" />
                <Text style={styles.loadingText}>Fetching plans...</Text>
            </View>
        );
    }

    if (error && plans.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={64} color="#FF5F6D" />
                <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.retryBtnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            <SuccessModal />
            <FailureModal />

            {isPurchasing && (
                <View style={styles.purchaseLoader}>
                    <ActivityIndicator size="large" color="#FF3366" />
                    <Text style={styles.purchaseLoaderText}>Processing Transaction...</Text>
                </View>
            )}

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerIconContainer}>
                    <LinearGradient
                        colors={["#FF5F6D", "#FF3366"]}
                        style={styles.iconCircle}
                    >
                        <Ionicons name="heart" size={30} color="#FFF" />
                    </LinearGradient>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>{activePlan ? "Upgrade your plan" : "Go Premium."}</Text>
                    <Text style={styles.subTitle}>
                        {activePlan
                            ? "Level up your dating experience with our high-value plans."
                            : "Unlock the best of Yugma and find your perfect match today."
                        }
                    </Text>
                </View>

                {/* Current Active Plan Section */}
                {activePlan && (
                    <View style={styles.activePlanSection}>
                        <Text style={styles.sectionTitle}>Your Current Plan</Text>
                        <View style={styles.activePlanCard}>
                            <View style={styles.activePlanHeader}>
                                <View style={styles.activeIconContainer}>
                                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                                </View>
                                <View style={styles.activeTextContainer}>
                                    <Text style={styles.activePlanTitle}>Premium Active</Text>
                                    <Text style={styles.activePlanStatus}>Auto-renewing</Text>
                                </View>
                                <View style={styles.activeBadge}>
                                    <Text style={styles.activeBadgeText}>ACTIVE</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.sectionTitle}>Available Upgrades</Text>
                    </View>
                )}

                {plans.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    return (
                        <TouchableOpacity
                            key={plan.id}
                            activeOpacity={0.9}
                            onPress={() => setSelectedPlanId(plan.id)}
                            style={[
                                styles.planCard,
                                isSelected && styles.selectedPlanCard,
                                plan.isPopular && styles.popularCard
                            ]}
                        >
                            {plan.badge && (
                                <View style={styles.badgeContainer}>
                                    <LinearGradient
                                        colors={["#FFD700", "#FFA000"]}
                                        style={styles.badgeGradient}
                                    >
                                        <Text style={styles.badgeText}>{plan.badge}</Text>
                                    </LinearGradient>
                                </View>
                            )}
                            {/* Left Accent Bar */}
                            <View style={styles.accentBarWrapper}>
                                <LinearGradient
                                    colors={isSelected ? ["#FF5F6D", "#FF3366"] : ["#E0E0E0", "#BDBDBD"]}
                                    style={styles.accentBar}
                                />
                            </View>

                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <View>
                                        <Text style={styles.planName}>{plan.title}</Text>
                                        <Text style={styles.planSubtext}>{plan.subtext}</Text>
                                    </View>
                                    <View style={styles.priceContainer}>
                                        <Text style={styles.planPrice}>{plan.price}</Text>
                                        <Text style={styles.planPeriod}>{plan.period}</Text>
                                    </View>
                                </View>

                                {isSelected && (
                                    <View style={styles.featuresContainer}>
                                        {plan.features.map((feature, idx) => (
                                            <View key={idx} style={styles.featureRow}>
                                                <View style={styles.featureIconContainer}>
                                                    <Ionicons name={feature.icon} size={16} color="#FF3366" />
                                                </View>
                                                <Text style={styles.featureText}>{feature.text}</Text>
                                            </View>
                                        ))}

                                        <TouchableOpacity
                                            style={[styles.selectBtn, plan.isActive && styles.disabledBtn]}
                                            onPress={() => handleSelectPlan(plan)}
                                            disabled={plan.isActive}
                                        >
                                            <LinearGradient
                                                colors={plan.isActive ? ["#E0E0E0", "#BDBDBD"] : ["#FF5F6D", "#FF3366"]}
                                                style={styles.selectBtnGradient}
                                            >
                                                <Text style={styles.selectBtnText}>
                                                    {plan.isActive ? "Current Plan" : "Select this plan"}
                                                </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>

                            {/* Current Badge for active plan */}
                            {plan.isActive && (
                                <View style={styles.currentBadge}>
                                    <Ionicons name="checkmark-circle" size={14} color="#FFA000" />
                                    <Text style={styles.currentBadgeText}>Current</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}

                {/* Footer Actions */}
                {/* <View style={styles.footerActions}>
                    <TouchableOpacity style={styles.footerBtn} onPress={handleRestore}>
                        <Text style={styles.footerBtnText}>Restore Purchase</Text>
                        <Ionicons name="refresh-outline" size={18} color="#666" />
                    </TouchableOpacity>
                    <View style={styles.footerDivider} />
                    <TouchableOpacity style={styles.footerBtn} onPress={handleRedeem}>
                        <Text style={styles.footerBtnText}>Use Promo Code</Text>
                        <Ionicons name="gift-outline" size={18} color="#666" />
                    </TouchableOpacity>
                </View> */}

                <Text style={styles.termsText}>
                    Recurring billing. Cancel anytime. Terms and conditions apply.
                </Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#fff',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginTop: 20,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
        lineHeight: 20,
    },
    retryBtn: {
        marginTop: 30,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
        backgroundColor: '#FF3366',
    },
    retryBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIconContainer: {
        flex: 1,
        alignItems: 'center',
        marginRight: 40, // Offset for back button
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#FF3366",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    titleContainer: {
        alignItems: 'center',
        marginVertical: 25,
    },
    mainTitle: {
        fontSize: 34,
        fontWeight: "800",
        color: "#1A1C1E",
        textAlign: "center",
        letterSpacing: -1,
    },
    subTitle: {
        fontSize: 16,
        color: "#6C727A",
        textAlign: "center",
        marginTop: 8,
        paddingHorizontal: 20,
        lineHeight: 22,
        fontWeight: "500",
    },
    activePlanSection: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#ADB5BD',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    activePlanCard: {
        backgroundColor: '#F0FFF4',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#C6F6D5',
        marginBottom: 20,
    },
    activePlanHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    activeTextContainer: {
        flex: 1,
    },
    activePlanTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#2D3748',
    },
    activePlanStatus: {
        fontSize: 13,
        color: '#48BB78',
        fontWeight: '600',
    },
    activeBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    activeBadgeText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '900',
    },
    planCard: {
        backgroundColor: "#fff",
        borderRadius: 24,
        marginBottom: 16,
        flexDirection: "row",
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#F5F5F5",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    selectedPlanCard: {
        borderColor: "#FF3366",
        backgroundColor: "#FFF",
    },
    popularCard: {
        transform: [{ scale: 1.02 }],
    },
    badgeContainer: {
        position: 'absolute',
        top: 0,
        right: 20,
        zIndex: 10,
    },
    badgeGradient: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    accentBarWrapper: {
        width: 6,
        height: '100%',
    },
    accentBar: {
        flex: 1,
    },
    cardContent: {
        flex: 1,
        padding: 20,
        paddingTop: 24,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    planName: {
        fontSize: 19,
        fontWeight: "800",
        color: "#1A1C1E",
        marginBottom: 2,
    },
    planSubtext: {
        fontSize: 14,
        color: "#6C727A",
        fontWeight: "600",
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    planPrice: {
        fontSize: 24,
        fontWeight: "900",
        color: "#1A1C1E",
    },
    planPeriod: {
        fontSize: 13,
        color: "#6C727A",
        fontWeight: "600",
        marginTop: -2,
    },
    featuresContainer: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
    },
    featureRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },
    featureIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFF0F3',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    featureText: {
        fontSize: 15,
        color: "#343A40",
        fontWeight: "600",
    },
    selectBtn: {
        marginTop: 20,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: "#FF3366",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    disabledBtn: {
        opacity: 0.6,
        shadowOpacity: 0,
    },
    selectBtnGradient: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    currentBadge: {
        position: 'absolute',
        top: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9C4',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFE082',
    },
    currentBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFA000',
        marginLeft: 4,
    },
    footerActions: {
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        marginTop: 10,
        padding: 4,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    footerBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    footerBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#495057',
    },
    footerDivider: {
        height: 1,
        backgroundColor: '#E9ECEF',
        marginHorizontal: 20,
    },
    termsText: {
        fontSize: 12,
        color: '#ADB5BD',
        textAlign: 'center',
        marginTop: 35,
        paddingHorizontal: 40,
        lineHeight: 18,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    successContainer: {
        backgroundColor: '#FFF',
        borderRadius: 32,
        padding: 30,
        width: '100%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    successIconBadge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: -80, // Float up effect
        borderWidth: 6,
        borderColor: '#FFF',
    },
    successTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#1A1C1E',
        marginBottom: 10,
    },
    successSub: {
        fontSize: 15,
        color: '#6C727A',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 25,
    },
    receiptContainer: {
        backgroundColor: '#F8F9FA',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        marginBottom: 25,
    },
    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    receiptLabel: {
        fontSize: 13,
        color: '#9098A1',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    receiptValue: {
        fontSize: 15,
        color: '#1A1C1E',
        fontWeight: '800',
        flex: 1,
        textAlign: 'right',
        marginLeft: 20,
    },
    receiptDivider: {
        height: 1,
        backgroundColor: '#E9ECEF',
        marginVertical: 15,
    },
    closeBtn: {
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
    },
    closeBtnGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    closeBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },
    failureContainer: {
        backgroundColor: '#FFF',
        borderRadius: 32,
        padding: 30,
        width: '100%',
        alignItems: 'center',
    },
    failureIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFEBEE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    failureTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FF5252',
        marginBottom: 10,
    },
    failureSub: {
        fontSize: 15,
        color: '#6C727A',
        textAlign: 'center',
        marginBottom: 25,
    },
    retryBtnLarge: {
        backgroundColor: '#F8F9FA',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    retryBtnTextLarge: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1C1E',
    },
    purchaseLoader: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.9)',
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    purchaseLoaderText: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: '700',
        color: '#FF3366',
    },
});

export default PremiumPlansScreen;
