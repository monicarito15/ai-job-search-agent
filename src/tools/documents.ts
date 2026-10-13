import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import fs from "fs";
import path from "path";

export async function generateSoknad(
  companyName: string,
  content: string
): Promise<string> {
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString("nb-NO", { month: "long" });
  const year = today.getFullYear();

  const doc = new Document({
    sections: [{
      children: [
        // Header - name
        new Paragraph({
          children: [new TextRun({ text: "Carolina Cabrera Mera", bold: true, size: 24 })],
        }),
        // Contact info in dark gray
        new Paragraph({
          children: [new TextRun({
            text: "carolinamera1985@gmail.com  ·  90272813  ·  Trondheim  ·  carolinamera.com",
            color: "595959",
            size: 20,
          })],
        }),
        new Paragraph({ text: "" }),
        // Date
        new Paragraph({
          children: [new TextRun({ text: `Trondheim, ${day}. ${month} ${year}` })],
        }),
        new Paragraph({ text: "" }),
        // Recipient
        new Paragraph({
          children: [new TextRun({ text: `Til ${companyName}`, bold: true })],
        }),
        new Paragraph({ text: "" }),
        // Body paragraphs
        ...content.split("\n\n").map(
          (para) => new Paragraph({
            children: [new TextRun({ text: para })],
            alignment: AlignmentType.JUSTIFIED,
          })
        ),
        new Paragraph({ text: "" }),
        // Closing
        new Paragraph({ children: [new TextRun({ text: "Med vennlig hilsen" })] }),
        new Paragraph({ children: [new TextRun({ text: "Carolina Cabrera Mera", bold: true })] }),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(
    process.env.HOME!,
    "Documents/Cv og søknad/Trabajos søknad 2026/Agent-Søknads",
    `Soknad_${companyName.replace(/\s+/g, "_")}_Carolina.docx`
  );

  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  fs.writeFileSync(outputPath, buffer);
  return `Application letter saved to: ${outputPath}`;
}
