import { useCallback, useEffect, useState } from "react";
import { FormRenderer, type FormLayout } from "./Layout";
import { useForm } from "@tanstack/react-form";

export type ManagedFormProps<T> = {
    mode: "create";
} | {
    mode: "edit";
    uuid:  T;
};

export type SimpleFormProps<T> = ({
    mode:  "create";
    query: undefined;
} | {
    mode: "edit";
    query: () => Promise<T>;
}) & {
    callback: (x: T) => Promise<void>;
    defaultValue: T;
    validator: any;
    formLayout: FormLayout<T>;
};

export function useSimpleFormProps<UUID, PartialData, FullData> (
        props: ManagedFormProps<UUID>,
        defaultValue: PartialData,

        formLayout: FormLayout<PartialData>,
        createValidator: any,
        editValidator: any,

        query: (uuid: UUID) => Promise<PartialData>,

        create : (data: PartialData) => Promise<FullData | undefined>,
        edit   : (data: PartialData, uuid: UUID) => Promise<FullData | undefined>,

        onSuccess: (data: FullData) => void
    ): SimpleFormProps<PartialData> {
    const uuid = props.mode === "edit" ? props.uuid : undefined;

    const callback = useCallback(async (data: PartialData) => {
        const result = props.mode === "edit" ? await edit(data, props.uuid) : await create(data);

        if (result) {
            onSuccess(result);
        }
    }, [create, edit, onSuccess, props.mode, uuid]);

    const queryCallback = useCallback(async () => {
        if (uuid === undefined) {
            return defaultValue;
        }

        return await query(uuid as UUID);
    }, [query, uuid]);
    
    if (props.mode === "edit") {
        return {
            mode: "edit",
            defaultValue: defaultValue,
            callback: callback,
            formLayout: formLayout,
            query: queryCallback,
            validator: editValidator
        };
    }
    
    return {
        mode: "create",
        defaultValue: defaultValue,
        callback: callback,
        formLayout: formLayout,
        query: undefined,
        validator: createValidator
    };
}

export function SimpleForm<T> (props: SimpleFormProps<T>) {
    const [loading,      setLoading]      = useState<boolean>(props.mode === "edit");
    const [defaultValue, setDefaultValue] = useState<T>(props.defaultValue);

    useEffect(() => {
        if (props.mode === "create") {
            return ;
        }

        let cancelled = false;

        (async () => {
            setLoading(true);
            const newDefaultValue = await props.query();
            setDefaultValue(newDefaultValue);

            if (cancelled) {
                return ;
            }

            setLoading(false);
        })();

        return () => { cancelled = true; }
    }, [props.mode, props.query]);

    const form = useForm({
        defaultValues: defaultValue,
        onSubmit: useCallback(async ({ value }: { value: T }) => {
            if (loading) {
                return ;
            }

            await props.callback(value);
        }, [ props.callback, loading ]),
        validators: {
            onChange: props.validator
        }
    })

    return <FormRenderer form={form} layout={props.formLayout} />
}
