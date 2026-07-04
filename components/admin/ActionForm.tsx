"use client";

import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * <form> lié à une Server Action, avec champs cachés. Si `confirm` est fourni,
 * un AlertDialog shadcn remplace le window.confirm natif.
 */
export function ActionForm({
  action,
  hidden = {},
  confirm,
  confirmLabel = "Confirmer",
  children,
  className,
  style,
}: {
  action: (formData: FormData) => void | Promise<void>;
  hidden?: Record<string, string>;
  confirm?: string;
  confirmLabel?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const HiddenInputs = (
    <>
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
    </>
  );

  if (!confirm) {
    return (
      <form
        action={action}
        className={className}
        style={{ display: "inline", ...style }}
      >
        {HiddenInputs}
        {children}
      </form>
    );
  }

  return (
    <span className={className} style={{ display: "inline", ...style }}>
      <form ref={formRef} action={action} className="hidden">
        {HiddenInputs}
      </form>
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l&apos;action</AlertDialogTitle>
            <AlertDialogDescription>{confirm}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => formRef.current?.requestSubmit()}
            >
              {confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </span>
  );
}
