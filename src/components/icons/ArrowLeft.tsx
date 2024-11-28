import React from "react";

interface Props {
    color?: string;
    size?: number;
    className?: string;
}

export const ArrowLeft = ({color = "currentColor", size = 24, className = ""}: Props) => (
    <svg className={className === "" ? `w-${size / 4} h-${size / 4} text-gray-800 dark:text-white hover:` : className}
         aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
         width={size}
         height={size}
         fill="none" viewBox="0 0 24 24">
        <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
    </svg>
);