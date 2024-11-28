import React from "react";

interface Props {
    color?: string;
    size?: number;
    className?: string;
}

export const AlignRight = ({color = "currentColor", size = 24, className = ""}: Props) => (
    <svg className={className === "" ? `w-${size / 4} h-${size / 4} text-gray-800 dark:text-white hover:` : className}
         aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
         width={size}
         height={size} fill="none" viewBox="0 0 24 24">
        <path stroke={color} strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10"/>
    </svg>
);