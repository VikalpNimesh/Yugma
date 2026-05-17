import React, { createContext, useContext } from 'react';
import { useIAP as useIAPHook } from '../hooks/useIAP';

const IapContext = createContext<ReturnType<typeof useIAPHook> | null>(null);

export const IapProvider = ({ children }: { children: React.ReactNode }) => {
    const iap = useIAPHook();
    return <IapContext.Provider value={iap}>{children}</IapContext.Provider>;
};

export const useGlobalIAP = () => {
    const context = useContext(IapContext);
    if (!context) throw new Error('useGlobalIAP must be used within IapProvider');
    return context;
};
