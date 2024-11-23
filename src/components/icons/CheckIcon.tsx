import React from "react";

interface Props {
    color?: string;
    size?: number | string;
}

export const CheckIcon = ({color="currentColor", size = 24}: Props) => (
    <svg
         className="w-6 h-6 text-gray-800 dark:text-white"
         aria-hidden="true"
         xmlns="http://www.w3.org/2000/svg"
         width={size}
         height={size}
         fill="none"
         viewBox="0 0 24 24">
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 11.917 9.724 16.5 19 7.5"/>
    </svg>
);