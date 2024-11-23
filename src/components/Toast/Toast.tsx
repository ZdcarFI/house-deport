
import React from "react";
import {Button} from "@nextui-org/react";
import {Check} from "@/components/icons/Check";
import {Exclamation} from "@/components/icons/Exclamation";
import {Info} from "@/components/icons/Info";

export enum ToastType {
    SUCCESS = "success",
    ERROR = "danger",
    WARNING = "warning",
    INFO = "primary",
}


interface ToastProps {
    message: string;
    type: ToastType;
}

function returnIcon(type: ToastType) {
    switch (type) {
        case ToastType.SUCCESS:
            return <Check color="green" />;
        case ToastType.ERROR:
            return <Exclamation color="red" />;
        case ToastType.WARNING:
            return <Exclamation color="orange" />;
        case ToastType.INFO:
            return <Info color="blue" />;
    }
}

function getLabel(type: ToastType) {
    switch (type) {
        case ToastType.SUCCESS:
            return "Success:";
        case ToastType.ERROR:
            return "Error:";
        case ToastType.WARNING:
            return "Warning:";
        case ToastType.INFO:
            return "Info:";
    }
}

export default function Toast({ message , type}: ToastProps) {
    const textColor = {
        success: "text-success-800",
        danger: "text-danger-800",
        warning: "text-warning-800",
        primary: "text-primary-800",
    };

    const messageColor = {
        success: "text-success-500",
        danger: "text-danger-500",
        warning: "text-warning-500",
        primary: "text-primary-500",
    };

    return (
        <div className="w-4/5 max-w-full fixed top-4 right-4 transform z-50">
            <Button
                startContent={returnIcon(type)}
                className={`bg-${type}-100 w-full flex justify-start items-center`}
            >
                <span className={`${textColor[type]} font-bold`}>
                    {getLabel(type)}
                </span>
                <span className={`${messageColor[type]} ml-2`}>{message}</span>
            </Button>
        </div>
    );
}
