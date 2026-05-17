import { useEffect, useState, useCallback } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import * as IAP from 'react-native-iap';

const skus = Platform.select({
    ios: ['premium'], // Replace with actual iOS SKUs if different
    android: ['premium'],
}) || [];

export const useIAP = () => {
    const [products, setProducts] = useState<IAP.ProductSubscription[]>([]);
    const [activeSubscriptions, setActiveSubscriptions] = useState<IAP.ActiveSubscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPurchase, setCurrentPurchase] = useState<IAP.Purchase | null>(null);
    const [lastError, setLastError] = useState<string | null>(null);

    const initIAP = useCallback(async () => {
        try {
            setIsLoading(true);
            await IAP.initConnection();

            // Fetch products and active subscriptions in parallel for efficiency
            const [productResult, activeResult] = await Promise.all([
                IAP.fetchProducts({ skus, type: 'subs' }),
                IAP.getActiveSubscriptions()
            ]);

            setProducts(productResult as IAP.ProductSubscription[]);
            setActiveSubscriptions(activeResult);
        } catch (err: any) {
            console.error('IAP Init Error:', err);
            setError(err.message || 'Failed to initialize payment system');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        initIAP();

        const handleAppStateChange = async (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active') {
                try {
                    console.log('App returned to foreground, refreshing active subscriptions...');
                    const activeResult = await IAP.getActiveSubscriptions();
                    setActiveSubscriptions(activeResult);
                } catch (err) {
                    console.warn('Failed to refresh active subscriptions on AppState change:', err);
                }
            }
        };

        const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

        const purchaseUpdateSubscription = IAP.purchaseUpdatedListener(async (purchase) => {
            console.log('purchaseUpdateSubscription', purchase);
            const receipt = purchase.transactionReceipt || purchase.purchaseToken;
            if (receipt) {
                try {
                    await IAP.finishTransaction({ purchase, isConsumable: false });
                    setCurrentPurchase(purchase);
                    setLastError(null);
                } catch (ackErr) {
                    console.warn('ackErr', ackErr);
                }
            }
        });

        const purchaseErrorSubscription = IAP.purchaseErrorListener((error) => {
            console.warn('purchaseErrorListener', error);
            if (error.code !== 'E_USER_CANCELLED') {
                setLastError(error.message || 'Payment failed');
            } else {
                setLastError('CANCELLED');
            }
        });

        return () => {
            appStateSubscription.remove();
            purchaseUpdateSubscription.remove();
            purchaseErrorSubscription.remove();
            IAP.endConnection();
        };
    }, [initIAP]);

    const requestSubscription = async (sku: string, offerToken?: string) => {
        try {
            setLastError(null);
            setCurrentPurchase(null);
            if (Platform.OS === 'android') {
                if (!offerToken) throw new Error('Offer token is required for Android');
                await IAP.requestPurchase({
                    request: {
                        android: {
                            skus: [sku],
                            subscriptionOffers: [{ sku, offerToken }],
                        }
                    },
                    type: 'subs'
                });
            } else {
                await IAP.requestPurchase({
                    request: {
                        ios: { sku }
                    },
                    type: 'subs'
                });
            }
        } catch (err: any) {
            console.warn('requestSubscription error', err);
            throw err;
        }
    };

    const clearPurchaseState = () => {
        setCurrentPurchase(null);
        setLastError(null);
    };

    return {
        products,
        activeSubscriptions,
        isLoading,
        error,
        currentPurchase,
        lastError,
        requestSubscription,
        clearPurchaseState,
        refresh: initIAP
    };
};
