import { Mail, MailOpen, Trash2 } from "lucide-react";
import { getMessages } from "@/lib/admin";
import { deleteMessage, toggleMessageRead } from "@/app/admin/actions";
import { PageTitle } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionForm } from "@/components/admin/ActionForm";
import { Stagger, StaggerItem } from "@/components/admin/motion-primitives";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await getMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <PageTitle
        sub={
          unread > 0
            ? `${unread} message${unread > 1 ? "s" : ""} non lu${unread > 1 ? "s" : ""}.`
            : "Messages reçus via le formulaire de contact."
        }
      >
        Messages
      </PageTitle>

      <Stagger className="grid gap-3">
        {messages.map((m) => (
          <StaggerItem key={m.id}>
            <Card
              className={
                m.read
                  ? "transition-colors"
                  : "border-primary/40 transition-colors"
              }
            >
              <CardContent className="p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {!m.read && <span className="size-2 rounded-full bg-primary" />}
                    <strong className="text-foreground">{m.name}</strong>
                    <a
                      href={`mailto:${m.email}`}
                      className="text-sm text-primary underline-offset-4 hover:underline"
                    >
                      {m.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.project_type && (
                      <Badge variant="secondary">{m.project_type}</Badge>
                    )}
                    <span className="font-mono text-xs text-muted-foreground">
                      {new Date(m.created_at).toLocaleDateString("fr-BE")}
                    </span>
                  </div>
                </div>
                <p className="my-3.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                  {m.body}
                </p>
                <div className="flex gap-2">
                  <ActionForm
                    action={toggleMessageRead}
                    hidden={{ id: m.id, read: m.read ? "false" : "true" }}
                  >
                    <Button variant="outline" size="sm">
                      {m.read ? (
                        <>
                          <Mail className="size-3.5" /> Marquer non lu
                        </>
                      ) : (
                        <>
                          <MailOpen className="size-3.5" /> Marquer lu
                        </>
                      )}
                    </Button>
                  </ActionForm>
                  <ActionForm
                    action={deleteMessage}
                    hidden={{ id: m.id }}
                    confirm="Supprimer définitivement ce message ?"
                    confirmLabel="Supprimer"
                  >
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="size-3.5" /> Supprimer
                    </Button>
                  </ActionForm>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
        {messages.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Aucun message pour l&apos;instant.
            </CardContent>
          </Card>
        )}
      </Stagger>
    </div>
  );
}
