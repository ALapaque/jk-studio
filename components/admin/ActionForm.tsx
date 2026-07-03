"use client";

/** Petit <form> lié à une Server Action, avec champs cachés et confirmation
 *  optionnelle. Permet delete/move/toggle sans dupliquer de boilerplate. */
export function ActionForm({
  action,
  hidden = {},
  confirm,
  children,
  style,
}: {
  action: (formData: FormData) => void | Promise<void>;
  hidden?: Record<string, string>;
  confirm?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      style={{ display: "inline", ...style }}
    >
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      {children}
    </form>
  );
}
