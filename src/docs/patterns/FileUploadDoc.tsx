import { FileUpload } from "../../patterns";
import { DocPage, DocBlock, RuleList } from "../standards/_shared";
import { PropsTable, type PropRow } from "./_props";

export function FileUploadDoc() {
  return (
    <DocPage>
      <DocBlock
        eyebrow="Pattern · FileUpload"
        title="FileUpload — the standard drop zone"
        lead="The one way to ask for files in an hc1 product: a dashed drop zone that also opens the file picker on click or keyboard. It hands you a File[]; uploading, progress and validation stay in your product."
      />

      <DocBlock title="Multiple files" lead="Show the accepted types as chips and the size limit in the hint.">
        <FileUpload
          multiple
          accept={[".pdf", ".xlsx", ".csv", ".docx"]}
          typeLabels={["PDF", "Excel", "CSV", "Word"]}
          hint="Up to 100 MB per file · Multiple files supported"
          onFiles={() => {}}
        />
      </DocBlock>

      <DocBlock title="Custom wording and disabled" lead="Change the title and description to fit the task. Disable the zone while an upload runs.">
        <FileUpload
          title="Drop the signed contract here"
          description="or click to choose a PDF"
          accept={[".pdf"]}
          typeLabels={["PDF"]}
          disabled
          onFiles={() => {}}
        />
      </DocBlock>

      <DocBlock title="Props">
        <PropsTable rows={PROPS} />
      </DocBlock>

      <DocBlock title="Notes">
        <RuleList
          rules={[
            { tone: "must",   text: "Use FileUpload for every file input. Don't build a custom drop zone." },
            { tone: "should", text: "Make `typeLabels` match `accept`, so people see what they can upload before they try." },
            { tone: "note",   text: "The zone is a labelled file input, so it works with the keyboard and screen readers without extra wiring." },
          ]}
        />
      </DocBlock>
    </DocPage>
  );
}

const PROPS: PropRow[] = [
  { name: "onFiles",     type: "(files: File[]) => void", def: "—",                              desc: "Called with the dropped or chosen files." },
  { name: "accept",      type: "string[]",                def: "—",                              desc: "Accepted extensions or MIME types, e.g. ['.pdf', '.csv']." },
  { name: "typeLabels",  type: "string[]",                def: "—",                              desc: "Chips naming the accepted types." },
  { name: "hint",        type: "ReactNode",               def: "—",                              desc: "Small line under the chips: size limits, counts." },
  { name: "multiple",    type: "boolean",                 def: "false",                          desc: "Allow several files at once." },
  { name: "title",       type: "ReactNode",               def: "'Drag and drop files here'",     desc: "Main line." },
  { name: "description", type: "ReactNode",               def: "'or click to browse your computer'", desc: "Line under the title." },
  { name: "disabled",    type: "boolean",                 def: "false",                          desc: "Blocks drops and clicks." },
];
