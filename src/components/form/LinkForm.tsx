import { useCallback, useMemo, useState } from "react";
import type { SelectionPolicy } from "../table/select/SelectionPolicy";
import { usePreexistingSelectionPolicy } from "../table/select/usePreexistingSelectionPolicy";
import { Button } from "./Button";

export type LinkFormProps<T, K extends keyof T> = {
    table: (selectionPolicy: SelectionPolicy<T>) => React.ReactNode;
    send: (addedIds: Set<T[K]>, removedIds: Set<T[K]>) => Promise<boolean>;
    
    clearText ?: string;
    buttonText : string;

    field: K;
    initialSelection: Set<T[K]>;
};

export function useLinkFormProps<TEntity, TItem extends { id: number }, TPath> (
    entity: TEntity | null | undefined,
    setEntity: (entity: TEntity) => void,

    getItems: (entity: TEntity) => TItem[],
    updateFn: (args: { path: TPath; body: Record<string, number[]> }) => Promise<{ data?: TEntity }>,

    path: () => TPath,
    fieldNames: { add: string; remove: string }
) {
    const initialSelection = useMemo(
        () => new Set(entity ? getItems(entity).map(item => item.id) : []),
        [entity]
    );

    const send = useCallback(async (addedIds: Set<number>, removedIds: Set<number>) => {
        const data = await updateFn({
            path: path(),
            body: {
                [fieldNames.add]: [...addedIds],
                [fieldNames.remove]: [...removedIds],
            },
        });
        if (data.data) {
            setEntity(data.data);
            return true;
        }
        return false;
    }, [path, updateFn]);

    return {initialSelection, send};
}

export function LinkForm<T, K extends keyof T> (props: LinkFormProps<T, K>) {
    const selectionPolicy = usePreexistingSelectionPolicy<T, K>(props.field, props.initialSelection);
    
    const [updating, setUpdating] = useState<boolean>(false);
    const update = useCallback(async () => {
        setUpdating(true);

        const worked = await props.send(selectionPolicy.addedIds, selectionPolicy.removedIds);

        setUpdating(false);
        
        if (worked) {
            selectionPolicy.clear();
        }
    }, [props.send, selectionPolicy.addedIds, selectionPolicy.removedIds]);

    return <>
        {props.table(selectionPolicy)}

        <div className="flex items-center gap-4">
            <div className="flex-1"></div>
            <div><span className="text-xs text-gray-500">{selectionPolicy.label}</span></div>
            {selectionPolicy.label && <div
                    onClick={selectionPolicy.clear}
                    className="text-gray-600 hover:text-red-600 transition-colors duration-200 cursor-pointer select-none">
                <span className="text-xs">{props.clearText ||"Clear selection"}</span>
            </div>}
            <div className="w-50">
                <Button 
                    onClick={update}
                    loading={updating}
                    text={props.buttonText} variant={"primary"} />
            </div>
        </div>
    </>
}
