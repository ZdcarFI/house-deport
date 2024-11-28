import React from "react";

interface Props {
    color?: string;
    size?: number | string;
}

export const Exclamation = ({color="currentColor", size = 24}: Props) => (
    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
         width={size}
         height={size}
         fill={color} viewBox="0 0 24 24">
        <path fill-rule="evenodd"
              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0V8Zm-1 7a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z"
              clip-rule="evenodd"/>
    </svg>
);