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
