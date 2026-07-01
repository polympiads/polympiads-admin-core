import type { CheckboxVariant } from "../cells/CheckboxCell";

export type SelectionPolicy<T> = {
    selected: (data: T) => CheckboxVariant,
    onClick:  (data: T) => void,

    clear: () => void,

    label: string
};
