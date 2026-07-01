import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, ChevronDown } from "lucide-react";
import { CheckOr, IfChecks, type AuthCheck } from "../../lib/permissions";

export type ActionProps = { label: string, checks ?: AuthCheck[] } & (
  | { action: () => void }
  | { link: LinkProps }
);

export type ActionPanelProps = {
  create ?: ActionProps;
  edit   ?: ActionProps;
  delete ?: ActionProps;
  extra  ?: ActionProps[];
};

function isLinkAction(action: ActionProps): action is ActionProps & { link: LinkProps } {
  return "link" in action;
}

type Variant = "primary" | "default" | "danger";

const variantClasses: Record<Variant, string> = {
  primary: "bg-gray-50 text-slate-700 border-slate-300 hover:bg-slate-100",
  default: "bg-white text-slate-700 border-slate-300 hover:bg-slate-50",
  danger:  "bg-white text-red-600 border-red-200 hover:bg-red-50",
};

const baseButtonClass =
  "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400";

function ActionButton({ action, variant, icon }: { action: ActionProps; variant: Variant; icon: ReactNode }) {
  const className = `${baseButtonClass} ${variantClasses[variant]}`;

  if (isLinkAction(action)) {
    return (
      <IfChecks checks={action.checks ?? []}>
        <Link {...action.link} className={className}>
            {icon}
            {action.label}
        </Link>
      </IfChecks>
    );
  }

  return (
    <IfChecks checks={action.checks ?? []}>
        <button type="button" onClick={action.action} className={className}>
            {icon}
            {action.label}
        </button>
    </IfChecks>
  );
}

function ExtraActionsMenu({ actions }: { actions: ActionProps[] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const hasAction = CheckOr( actions.map(action => action.checks) );

  return (
    <IfChecks checks={hasAction}>
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`${baseButtonClass} ${variantClasses.default}`}
      >
        Actions
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-1 min-w-[11rem] rounded-md border border-slate-200 bg-white py-1 shadow-lg"
        >
          {actions.map((extraAction, index) => {
            const itemClass = "block w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50";

            if (isLinkAction(extraAction)) {
              return (
                <IfChecks checks={extraAction.checks ?? []}>
                  <Link
                    key={index}
                    {...extraAction.link}
                    role="menuitem"
                    className={itemClass}
                    onClick={() => setOpen(false)}
                  >
                    {extraAction.label}
                  </Link>
                </IfChecks>
              );
            }

            return (
              <IfChecks checks={extraAction.checks ?? []}>
                <button
                  key={index}
                  type="button"
                  role="menuitem"
                  className={itemClass}
                  onClick={() => {
                    setOpen(false);
                    extraAction.action();
                  }}
                >
                  {extraAction.label}
                </button>
              </IfChecks>
            );
          })}
        </div>
      )}
    </div>
    </IfChecks>
  );
}

export function ActionPanel({ create, edit, delete: deleteAction, extra }: ActionPanelProps) {
  const hasAnyAction = Boolean(create || edit || deleteAction || (extra && extra.length > 0));
  if (!hasAnyAction) return null;

  return (
    <div className="flex items-center gap-2">
      {create && <ActionButton action={create} variant="primary" icon={<Plus className="h-4 w-4" />} />}
      {edit && <ActionButton action={edit} variant="default" icon={<Pencil className="h-4 w-4" />} />}
      {deleteAction && (
        <ActionButton action={deleteAction} variant="danger" icon={<Trash2 className="h-4 w-4" />} />
      )}
      {extra && extra.length > 0 && <ExtraActionsMenu actions={extra} />}
    </div>
  );
}