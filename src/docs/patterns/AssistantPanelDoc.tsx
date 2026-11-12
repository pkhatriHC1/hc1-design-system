import { useState } from "react";
import { AssistantPanel, type AssistantMessage } from "../../patterns";
import { Button } from "../../components/button";
import { DocPage, DocBlock, RuleList, Callout } from "../standards/_shared";
import { PropsTable, PropSectionEyebrow, type PropRow } from "./_props";

const SEED: AssistantMessage[] = [
  { id: "1", role: "assistant", time: "10:30 AM", content: "Hello! I'm IQ. I can help you analyze spending, negotiate with vendors and optimize your supply chain." },
  { id: "2", role: "user",      time: "10:31 AM", content: "I need to understand our chemistry reagent spending over the last quarter" },
  { id: "3", role: "assistant", time: "10:31 AM", content: "Total spend was $285,000 (+18% vs Q2). Top vendor: Roche Diagnostics at $167,890. I found 3 opportunities worth about $34,000 a year." },
];

export function AssistantPanelDoc() {
  return (
    <DocPage>
      <DocBlock
        eyebrow="Pattern · AssistantPanel"
        title="AssistantPanel — the shared IQ Assistant"
        lead="Every hc1 product opens the same IQ Assistant: a 640px drawer (the one drawer width) with an amber AI header, the conversation, and a composer pinned to the bottom. Your product supplies the messages and a send handler; the conversation logic stays in the product."
      />

      <DocBlock
        title="Live example"
        lead="Open the panel, send a message, and watch it scroll to the newest reply. In a product, the launcher is the amber IQ Assistant button in AppShell.TopBar."
      >
        <LiveDemo />
      </DocBlock>

      <DocBlock title="Props">
        <PropSectionEyebrow>AssistantPanel</PropSectionEyebrow>
        <PropsTable rows={PROPS} />
        <div style={{ marginTop: 32 }}>
          <PropSectionEyebrow>AssistantMessage</PropSectionEyebrow>
          <PropsTable rows={MESSAGE_PROPS} />
        </div>
      </DocBlock>

      <DocBlock title="Notes">
        <RuleList
          rules={[
            { tone: "must",   text: "Use AssistantPanel for the IQ Assistant in every product. Don't build a custom chat drawer or change its width." },
            { tone: "must",   text: "Build rich replies (tables, cards, KPIs) from DS components and pass them as `content`." },
            { tone: "should", text: "Set `thinking` while you wait for a reply, so people know IQ is working." },
            { tone: "note",   text: "The message list is an aria-live log and scrolls to the newest message, smoothly unless reduced motion is on." },
          ]}
        />
        <Callout tone="info" title="Launcher vs panel">
          The launcher button is amber because it is a main action. The panel header uses the AI colour token (also amber). Both are fixed by the design system.
        </Callout>
      </DocBlock>
    </DocPage>
  );
}

function LiveDemo() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>(SEED);
  const [thinking, setThinking] = useState(false);

  const send = (text: string) => {
    const id = String(Date.now());
    setMessages((m) => [...m, { id, role: "user", content: text, time: "Now" }]);
    setThinking(true);
    window.setTimeout(() => {
      setThinking(false);
      setMessages((m) => [
        ...m,
        { id: `${id}-r`, role: "assistant", content: "This is a demo reply. In a product, your handler calls the IQ service.", time: "Now" },
      ]);
    }, 1200);
  };

  return (
    <>
      <div>
        <Button variant="cta" onClick={() => setOpen(true)}>
          Open IQ Assistant
        </Button>
      </div>
      <AssistantPanel
        open={open}
        onOpenChange={setOpen}
        subtitle="Your AI lab supply expert"
        messages={messages}
        thinking={thinking}
        onSend={send}
        footnote="IQ can analyze data, negotiate with vendors, place orders, and more"
      />
    </>
  );
}

const PROPS: PropRow[] = [
  { name: "open",         type: "boolean",                 def: "—",                  desc: "Controlled open state." },
  { name: "onOpenChange", type: "(open: boolean) => void", def: "—",                  desc: "Called when the panel opens or closes." },
  { name: "messages",     type: "AssistantMessage[]",      def: "—",                  desc: "The conversation, oldest first." },
  { name: "onSend",       type: "(text: string) => void",  def: "—",                  desc: "Called with the composer text." },
  { name: "title",        type: "string",                  def: "'IQ Assistant'",     desc: "Header title." },
  { name: "subtitle",     type: "string",                  def: "—",                  desc: "One line under the title." },
  { name: "thinking",     type: "boolean",                 def: "false",              desc: "Shows a 'Thinking…' indicator after the last message." },
  { name: "placeholder",  type: "string",                  def: "'Ask IQ anything…'", desc: "Composer placeholder and accessible name." },
  { name: "footnote",     type: "ReactNode",               def: "—",                  desc: "Small line under the composer." },
  { name: "onExpand",     type: "() => void",              def: "—",                  desc: "Shows an expand button that hands off to a full-screen view." },
];

const MESSAGE_PROPS: PropRow[] = [
  { name: "id",      type: "string",                def: "—", desc: "Stable key." },
  { name: "role",    type: "'user' | 'assistant'",  def: "—", desc: "User: dark teal bubble on the right. Assistant: white bubble on the left with the AI mark." },
  { name: "content", type: "ReactNode",             def: "—", desc: "Text or rich content built from DS components." },
  { name: "time",    type: "string",                def: "—", desc: "Pre-formatted time, e.g. '10:31 AM'." },
];
