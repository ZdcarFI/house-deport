import React from "react";
import {useSidebarContext} from "../layouts/Layout-context";
import {AlignRight} from "@/components/icons/AlignRight";

export const BurguerButton = () => {
    const {setCollapsed} = useSidebarContext();

    return (
        <div
            onClick={setCollapsed}
        >
            <AlignRight
                size={25}
                color="#71717a"
            />
        </div>
    );
};
