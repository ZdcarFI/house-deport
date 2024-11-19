import React from "react";

interface Props {
    color?: string;
    size?: number | string;
}

export const CirclePlus = ({ color = "currentColor", size = 24 }: Props) => (
    <svg
        className="text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 24 24"
    >
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
    </svg>
);
