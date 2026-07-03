import { getMessages } from "@/lib/admin";
import { deleteMessage, toggleMessageRead } from "@/app/admin/actions";
import { admin, Button, Card, PageTitle } from "@/components/admin/ui";
import { ActionForm } from "@/components/admin/ActionForm";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <div>
      <PageTitle sub="Messages reçus via le formulaire de contact.">
        Messages
      </PageTitle>

      <div style={{ display: "grid", gap: 12 }}>
        {messages.map((m) => (
          <Card
            key={m.id}
            style={{
              padding: 16,
              borderColor: m.read ? admin.border : admin.accent,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
              <div>
                <strong style={{ color: admin.ink }}>{m.name}</strong>{" "}
                <a href={`mailto:${m.email}`} style={{ color: admin.accent, fontSize: 13 }}>
                  {m.email}
                </a>
              </div>
              <span style={{ color: admin.ink2, fontSize: 12, fontFamily: admin.mono }}>
                {m.project_type ?? "—"} · {new Date(m.created_at).toLocaleDateString("fr-BE")}
              </span>
            </div>
            <p style={{ color: admin.ink, fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap", margin: "10px 0 14px" }}>
              {m.body}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <ActionForm action={toggleMessageRead} hidden={{ id: m.id, read: m.read ? "false" : "true" }}>
                <Button variant="ghost">
                  {m.read ? "Marquer non lu" : "Marquer lu"}
                </Button>
              </ActionForm>
              <ActionForm action={deleteMessage} hidden={{ id: m.id }} confirm="Supprimer ce message ?">
                <Button variant="danger">Supprimer</Button>
              </ActionForm>
            </div>
          </Card>
        ))}
        {messages.length === 0 && (
          <p style={{ color: admin.ink2 }}>Aucun message pour l’instant.</p>
        )}
      </div>
    </div>
  );
}
