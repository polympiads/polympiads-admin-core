import { useCallback, useState } from "react";
import type { SelectionPolicy } from "./SelectionPolicy";
import type { CheckboxVariant } from "../cells/CheckboxCell";

export function useSimpleSelectionPolicy<T, K extends keyof T> (field: K): SelectionPolicy<T> & {
        selectedIds: Set<T[K]>
    } {
    const [selectedIds, setSelectedIds] = useState<Set<T[K]>>(new Set());

    // Determines if a specific row item is checked
    const selected = useCallback((data: T): CheckboxVariant => {
        const id = data[field];
        return selectedIds.has(id) ? 'on' : 'off';
    }, [selectedIds, field]);

    const onClick = useCallback((data: T) => {
        const id = data[field];
        
        setSelectedIds((prevSet) => {
            const nextSet = new Set(prevSet);
            if (nextSet.has(id)) {
                nextSet.delete(id);
            } else {
                nextSet.add(id);
            }
            return nextSet;
        });
    }, [field]);

    const clearSelection = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    return {
        selected: selected,
        onClick: onClick,
        clear: clearSelection,
        selectedIds: selectedIds,
        label: selectedIds.size == 0 ? "" : `${selectedIds.size} selected`
    };
}
