import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from "docx";
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

  const userName = process.env.USER_NAME ?? "Your Name";
  const userContact = process.env.USER_CONTACT ?? "email · phone · city · website";
  const userCity = process.env.USER_CITY ?? "Trondheim";
  const outputDir = process.env.USER_OUTPUT_DIR ?? "Documents/Søknader";

  const doc = new Document({
    sections: [{
      children: [
        // Header - name
        new Paragraph({
          children: [new TextRun({ text: userName, bold: true, size: 24 })],
        }),
        // Contact info in dark gray
        new Paragraph({
          children: [new TextRun({
            text: userContact,
            color: "595959",
            size: 20,
          })],
        }),
        new Paragraph({ text: "" }),
        // Date
        new Paragraph({
          children: [new TextRun({ text: `${userCity}, ${day}. ${month} ${year}` })],
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
        new Paragraph({ children: [new TextRun({ text: userName, bold: true })] }),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(
    process.env.HOME!,
    outputDir,
    `Soknad_${companyName.replace(/\s+/g, "_")}.docx`
  );

  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  fs.writeFileSync(outputPath, buffer);
  return `Application letter saved to: ${outputPath}`;
}

export async function generateAnalysis(
  companyName: string,
  jobTitle: string,
  pros: string[],
  cons: string[],
  whyApply: string
): Promise<string> {
  const outputDir = process.env.USER_OUTPUT_DIR ?? "Documents/Søknader";

  const bulletItems = (items: string[]) =>
    items.map(
      (item) =>
        new Paragraph({
          children: [new TextRun({ text: `• ${item}` })],
          spacing: { after: 80 },
        })
    );

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: `${companyName} — ${jobTitle}`, bold: true, size: 28 })],
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [new TextRun({ text: "Pros", bold: true, size: 24, color: "2E7D32" })],
            spacing: { after: 120 },
          }),
          ...bulletItems(pros),
          new Paragraph({ text: "" }),

          new Paragraph({
            children: [new TextRun({ text: "Cons", bold: true, size: 24, color: "C62828" })],
            spacing: { after: 120 },
          }),
          ...bulletItems(cons),
          new Paragraph({ text: "" }),

          new Paragraph({
            children: [new TextRun({ text: "Por qué aplicar", bold: true, size: 24, color: "1565C0" })],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [new TextRun({ text: whyApply })],
            alignment: AlignmentType.JUSTIFIED,
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(
    process.env.HOME!,
    outputDir,
    `Analyse_${companyName.replace(/\s+/g, "_")}.docx`
  );

  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  fs.writeFileSync(outputPath, buffer);
  return `Analysis saved to: ${outputPath}`;
}
