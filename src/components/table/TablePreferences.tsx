import { useState } from "react";

export interface TablesPreferences {
    visibility: { [key: string]: boolean };
    page_size:  number;
};

export function useTablePreferences (tableKind: string, defaultValue: TablesPreferences) {
    const storageTarget = `table-preferences-${tableKind}`;
    
    const stored = localStorage.getItem(storageTarget);
    const initialValue = stored === null ? defaultValue : JSON.parse(stored);
    
    const [preferences, setRawPreferences] = useState<TablesPreferences>(initialValue as TablesPreferences);

    return {
        preferences,
        setPreferences: (newPreferences: TablesPreferences) => {
            localStorage.setItem(storageTarget, JSON.stringify(newPreferences));
            
            setRawPreferences(newPreferences);
        }
    }
}
