import type { Table } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function VisibleColumnsMenu<T> (props: { table: Table<T> }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node) && menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const buttonRef = useRef<HTMLButtonElement>(null)
    const [menuPos, setMenuPos] = useState({ bottom: 0, left: 0 })

    const handleOpen = () => {
        const rect = buttonRef.current?.getBoundingClientRect()
        if (rect) {
            setMenuPos({
                bottom:  window.innerHeight - rect.top + window.scrollY,
                left:    rect.left,
            })
        }
    }

    return (
        <div ref={ref} className="relative">
        <button
        ref={buttonRef}
            onClick={() => {
                handleOpen();
                setOpen((v) => !v)
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-700 transition-colors"
        >
            Columns
            <span className="text-[9px] text-gray-400">{open ? "▲" : "▼"}</span>
        </button>
        {open && createPortal(
            <div
                ref={menuRef}
                style={{ position: "fixed", bottom: menuPos.bottom, left: menuPos.left }}>
            <div className="bottom-full mb-1 bg-white border border-gray-200 rounded shadow-md py-1 min-w-[150px] z-50">
            {props.table.getAllColumns()
                .filter(col => col.getCanHide())
                .map((col) => (
                <label
                    key={col.id}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                    <input
                    type="checkbox"
                    checked={col.getIsVisible()}
                    onChange={col.getToggleVisibilityHandler()}
                    className="w-3 h-3 accent-blue-600"
                    />
                    {col.columnDef.header as string}
                </label>
                ))}
            </div>
            </div>,
            document.body
        )}
        </div>
    );
};
