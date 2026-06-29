import { useCallback, useEffect, useState } from "react";
import type { SelectionPolicy } from "./SelectionPolicy";
import type { CheckboxVariant } from "../cells/CheckboxCell";

export function usePreexistingSelectionPolicy<T, K extends keyof T> (
        field: K, existingSet: Set<T[K]>
    ): SelectionPolicy<T> & {
        addedIds:   Set<T[K]>,
        removedIds: Set<T[K]>
    } {

    const [addedIds,   setAddedIds]   = useState<Set<T[K]>>(new Set());
    const [removedIds, setRemovedIds] = useState<Set<T[K]>>(new Set());

    const selected = useCallback((data: T): CheckboxVariant => {
        const id = data[field];

        if (existingSet.has(id)) {
            return removedIds.has(id) ? "removed" : "on";
        }
        return addedIds.has(id) ? 'added' : 'off';
    }, [existingSet, addedIds, removedIds, field]);
    
    const onClick = useCallback((data: T) => {
        const id = data[field];

        function toggleId (prevSet: Set<T[K]>) {
            const nextSet = new Set(prevSet);
            if (nextSet.has(id)) {
                nextSet.delete(id);
            } else {
                nextSet.add(id);
            }
            return nextSet;
        }
        
        if (existingSet.has(id)) {
            setRemovedIds(toggleId);
        } else {
            setAddedIds(toggleId);
        }
    }, [field, existingSet]);

    const clearSelection = useCallback(() => {
        console.log("CLEAR SELECTION ?")
        setAddedIds(new Set());
        setRemovedIds(new Set());
    }, []);

    useEffect(clearSelection, [existingSet]);

    return {
        addedIds: addedIds,
        removedIds: removedIds,
        clear: clearSelection,
        selected: selected,
        onClick: onClick
    }
}
