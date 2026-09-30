import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agente de código · Sandbox" },
      {
        name: "description",
        content:
          "Converse com o agente de código direto no app: ele lê e escreve os arquivos do projeto.",
      },
      { property: "og:title", content: "Agente de código · Sandbox" },
      {
        property: "og:description",
        content: "Chat do agente de código embutido no app, com acesso real aos arquivos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AgentePage,
});

type Status = "checking" | "online" | "offline";

function AgentePage() {
  const [status, setStatus] = useState<Status>("checking");
  const [reloadKey, setReloadKey] = useState(0);

  const check = useCallback(async () => {
    setStatus("checking");
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      setStatus(res.ok ? "online" : "offline");
    } catch {
      setStatus("offline");
    }
  }, []);

  useEffect(() => {
    void check();
  }, [check]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant={status === "online" ? "secondary" : "destructive"}>
              {status === "online"
                ? "Agente online"
                : status === "checking"
                  ? "Verificando agente…"
                  : "Agente desligado"}
            </Badge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Agente de <span className="text-primary">código</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Peça mudanças em português: o agente lê e escreve os arquivos deste projeto e mostra
              cada passo. Funciona aqui na pré-visualização.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                void check();
                setReloadKey((k) => k + 1);
              }}
            >
              Recarregar
            </Button>
            <Button asChild variant="secondary">
              <a href="/oc" target="_blank" rel="noreferrer">
                Abrir em nova aba
              </a>
            </Button>
          </div>
        </div>

        {status === "offline" ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>O agente não está respondendo</CardTitle>
              <CardDescription>
                Ele roda dentro deste ambiente de trabalho. Se o ambiente reiniciou, o agente
                precisa ser ligado de novo — me peça “ligar o agente” no chat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => void check()}>Tentar novamente</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
            <iframe
              key={reloadKey}
              src="/oc"
              title="Agente de código"
              className="h-[calc(100dvh-14rem)] min-h-[520px] w-full"
            />
          </div>
        )}
      </main>
    </div>
  );
}
