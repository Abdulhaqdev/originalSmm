"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  API_DOC_SECTIONS,
  API_V2_URL,
  PHP_EXAMPLE,
  type ApiDocSectionId,
} from "@/lib/api-docs-data";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import {
  BookOpen,
  Check,
  Code2,
  Copy,
  KeyRound,
  ListOrdered,
  Server,
  Wallet,
} from "lucide-react";

const SECTION_ICONS: Record<ApiDocSectionId, typeof Server> = {
  services: Server,
  addOrder: ListOrdered,
  orderStatus: BookOpen,
  multipleOrdersStatus: BookOpen,
  balance: Wallet,
};

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("api");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success(t("copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  return (
    <div className="relative group">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8 gap-1.5"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? t("copied") : t("copy")}
          </Button>
        </div>
      )}
      <pre className="overflow-x-auto rounded-xl bg-gray-950 text-gray-100 p-4 text-sm leading-relaxed border border-gray-800">
        <code>{code}</code>
      </pre>
      {!label && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          className="absolute top-3 right-3 h-8 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? t("copied") : t("copy")}
        </Button>
      )}
    </div>
  );
}

export default function ApiDocumentation() {
  const t = useTranslations("api");
  const { user, isAuthenticated } = useAuth();
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const copyApiKey = async () => {
    if (!user?.api_key) return;
    try {
      await navigator.clipboard.writeText(user.api_key);
      setApiKeyCopied(true);
      toast.success(t("copied"));
      setTimeout(() => setApiKeyCopied(false), 2000);
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12 bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              {t("hero.badge")}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {t("hero.description")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 max-w-6xl mx-auto">
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-2 rounded-2xl border bg-card p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-2 mb-3">
                  {t("nav.title")}
                </p>
                {API_DOC_SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {t(section.titleKey)}
                  </a>
                ))}
                <a
                  href="#php-example"
                  className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {t("phpExample.title")}
                </a>
              </div>
            </aside>

            <div className="space-y-8">
              <Card className="border-primary/20 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Code2 className="h-5 w-5 text-primary" />
                    {t("overview.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">{t("overview.field")}</TableHead>
                        <TableHead>{t("overview.value")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">{t("overview.httpMethod")}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-600 hover:bg-emerald-600">POST</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t("overview.apiUrl")}</TableCell>
                        <TableCell>
                          <code className="rounded-md bg-muted px-2 py-1 text-sm break-all">
                            {API_V2_URL}
                          </code>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t("overview.responseFormat")}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">JSON</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    {t("overview.note")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-amber-200/60 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <KeyRound className="h-5 w-5 text-amber-600" />
                    {t("apiKey.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{t("apiKey.description")}</p>
                  {isAuthenticated && user?.api_key ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <code className="flex-1 rounded-xl border bg-background px-4 py-3 text-sm break-all">
                        {user.api_key}
                      </code>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={copyApiKey}
                        className="shrink-0 gap-2"
                      >
                        {apiKeyCopied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {apiKeyCopied ? t("copied") : t("copy")}
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed bg-background/80 p-4 text-sm text-muted-foreground">
                      {t("apiKey.loginPrompt")}{" "}
                      <Link href="/login" className="text-primary font-medium hover:underline">
                        {t("apiKey.loginLink")}
                      </Link>
                      {" · "}
                      <Link href="/dashboard" className="text-primary font-medium hover:underline">
                        {t("apiKey.dashboardLink")}
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {API_DOC_SECTIONS.map((section) => {
                const Icon = SECTION_ICONS[section.id];
                const requestExample = `POST ${API_V2_URL}
Content-Type: application/x-www-form-urlencoded

key=YOUR_API_KEY&action=${section.action}${section.id === "addOrder" ? "&service=SERVICE_ID&link=https://example.com&quantity=1000" : ""}${section.id === "orderStatus" ? "&order=ORDER_ID" : ""}${section.id === "multipleOrdersStatus" ? "&orders=1,10,100" : ""}`;

                return (
                  <Card key={section.id} id={section.id} className="scroll-mt-24 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Icon className="h-5 w-5 text-primary" />
                        {t(section.titleKey)}
                      </CardTitle>
                      {section.descriptionKey && (
                        <p className="text-sm text-muted-foreground">
                          {t(section.descriptionKey)}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-sm font-semibold mb-3">{t("table.parameters")}</h3>
                        <div className="rounded-xl border overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[160px]">{t("table.parameter")}</TableHead>
                                <TableHead>{t("table.description")}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {section.parameters.map((param) => (
                                <TableRow key={param.name}>
                                  <TableCell>
                                    <code className="rounded bg-muted px-2 py-0.5 text-sm">
                                      {param.name}
                                      {param.optional ? ` (${t("table.optional")})` : ""}
                                    </code>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {t(param.descriptionKey)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <CodeBlock
                        label={t("exampleRequest")}
                        code={requestExample}
                      />

                      <CodeBlock
                        label={t("exampleResponse")}
                        code={section.exampleResponse}
                      />
                    </CardContent>
                  </Card>
                );
              })}

              <Card id="php-example" className="scroll-mt-24 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Code2 className="h-5 w-5 text-primary" />
                    {t("phpExample.title")}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{t("phpExample.description")}</p>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={PHP_EXAMPLE} label={t("phpExample.title")} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
