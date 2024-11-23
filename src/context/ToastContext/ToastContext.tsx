"use client"
import { createContext, useState, ReactNode } from "react";
import Toast, {ToastType} from "@/components/Toast/Toast";

type ToastContextType = {
    showToast: (message: string, type: ToastType) => void;
    hideToast: () => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [type, setType] = useState<ToastType>(ToastType.SUCCESS);

    const showToast = (message: string, type: ToastType) => {
        setToastMessage(message);
        setType(type);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const hideToast = () => setToastMessage(null);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            {toastMessage && (
                <Toast message={toastMessage} type={type}/>
            )}
        </ToastContext.Provider>
    );
}
