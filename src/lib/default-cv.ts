import { existsSync, mkdirSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";

type PdfLine = {
  text: string;
  x?: number;
  y: number;
  size?: number;
  bold?: boolean;
  color?: string;
};

function escapePdfText(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "-")
    .replace(/([\\()])/g, "\\$1");
}

function pageStream(lines: PdfLine[]) {
  const commands = lines.map((line) => {
    const font = line.bold ? "/F2" : "/F1";
    const size = line.size || 10;
    const x = line.x || 48;
    const color = line.color || "0.12 0.14 0.13";
    return `BT ${color} rg ${font} ${size} Tf 1 0 0 1 ${x} ${line.y} Tm (${escapePdfText(line.text)}) Tj ET`;
  });
  return commands.join("\n");
}

function buildPdf(pageLines: PdfLine[][]) {
  const streams = pageLines.map(pageStream);
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${streams.map((_, index) => `${3 + index * 2} 0 R`).join(" ")}] /Count ${streams.length} >>`,
  ];
  const fontRegularId = 3 + streams.length * 2;
  const fontBoldId = fontRegularId + 1;

  streams.forEach((stream, index) => {
    const pageId = 3 + index * 2;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${pageId + 1} 0 R >>`,
      `<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`,
    );
  });
  objects.push(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  );

  let pdf = "%PDF-1.4\n%PORTFOLIO\n";
  const offsets = [0];
  objects.forEach((body, index) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, "latin1");
}

const pageOne: PdfLine[] = [
  { text: "DANIEL OKAFOR", y: 744, size: 27, bold: true },
  { text: "SOFTWARE ENGINEER & FULL-STACK BUILDER", y: 719, size: 10, bold: true, color: "0.02 0.45 0.30" },
  { text: "London, UK  |  hello@danielokafor.dev  |  +44 20 7946 0814", y: 698, size: 9 },
  { text: "PROFILE", y: 658, size: 11, bold: true },
  { text: "Product-minded engineer with eight years of experience building reliable platforms and clear", y: 638 },
  { text: "digital experiences. Strengths include event-driven backends, typed APIs, accessible design", y: 623 },
  { text: "systems, and translating ambiguous product requirements into maintainable software.", y: 608 },
  { text: "EXPERIENCE", y: 566, size: 11, bold: true },
  { text: "Senior Software Engineer - Northstar Systems", y: 542, size: 12, bold: true },
  { text: "April 2023 - Present  |  London / Remote", y: 526, size: 9, color: "0.02 0.45 0.30" },
  { text: "- Lead a distributed product group building workflow infrastructure used in 14 markets.", y: 505 },
  { text: "- Re-architected event processing to remove ordering bugs and sustain 8x peak traffic.", y: 489 },
  { text: "- Introduced typed contracts and tracing; cut median incident diagnosis from 42 to 11 minutes.", y: 473 },
  { text: "- Mentor five engineers through architecture reviews, pairing, and technical decision forums.", y: 457 },
  { text: "Full-Stack Engineer - Sable & Co. Digital", y: 421, size: 12, bold: true },
  { text: "August 2020 - March 2023  |  London", y: 405, size: 9, color: "0.02 0.45 0.30" },
  { text: "- Delivered portals, commerce integrations, and internal tools for fintech clients.", y: 384 },
  { text: "- Built an accessible component system that reduced new product setup to four days.", y: 368 },
  { text: "- Moved legacy background work to idempotent queues with retries and runbooks.", y: 352 },
  { text: "Product Engineer - Independent Product Studio", y: 316, size: 12, bold: true },
  { text: "January 2018 - July 2020  |  Remote", y: 300, size: 9, color: "0.02 0.45 0.30" },
  { text: "- Designed and shipped twelve web products for early-stage founders.", y: 279 },
  { text: "- Owned discovery, technical planning, implementation, deployment, and support.", y: 263 },
  { text: "- Published open-source utilities for validation, PDF workflows, and background jobs.", y: 247 },
  { text: "SELECTED IMPACT", y: 205, size: 11, bold: true },
  { text: "42 products shipped  |  18 open-source releases  |  99.95% platform uptime", y: 183, size: 10, bold: true },
  { text: "danielokafor.dev  |  CV current as of February 2026", y: 44, size: 8, color: "0.35 0.37 0.36" },
];

const pageTwo: PdfLine[] = [
  { text: "SELECTED PROJECTS", y: 744, size: 11, bold: true },
  { text: "Cal.com - Scheduling infrastructure", y: 718, size: 12, bold: true },
  { text: "Timezone-safe booking, modular availability rules, transactional workflows, and webhooks.", y: 700 },
  { text: "Next.js  |  TypeScript  |  tRPC  |  Prisma  |  Redis", y: 684, size: 9, color: "0.02 0.45 0.30" },
  { text: "Dub - Link management and analytics", y: 648, size: 12, bold: true },
  { text: "Low-latency edge redirects with asynchronous events and flexible analytical queries.", y: 630 },
  { text: "React  |  Next.js  |  Tinybird  |  Upstash  |  Tailwind CSS", y: 614, size: 9, color: "0.02 0.45 0.30" },
  { text: "Formbricks - Contextual experience management", y: 578, size: 12, bold: true },
  { text: "Lightweight client targeting, explicit consent controls, and insight-routing webhooks.", y: 560 },
  { text: "Twenty - Adaptable CRM workspace", y: 524, size: 12, bold: true },
  { text: "Metadata-driven objects, optimistic interactions, background imports, and granular access.", y: 506 },
  { text: "TECHNICAL SKILLS", y: 462, size: 11, bold: true },
  { text: "Languages", y: 438, bold: true },
  { text: "TypeScript, JavaScript, C#, Python, SQL", y: 422 },
  { text: "Frameworks", y: 394, bold: true },
  { text: "Next.js, React, Node.js, NestJS, .NET, Tailwind CSS, Drizzle ORM", y: 378 },
  { text: "Architecture & Infrastructure", y: 350, bold: true },
  { text: "Domain-driven design, event-driven systems, REST, GraphQL, testing, AWS, Docker, Redis", y: 334 },
  { text: "EDUCATION", y: 290, size: 11, bold: true },
  { text: "BSc (Hons) Information Technology - University of Lagos", y: 266, size: 11, bold: true },
  { text: "2014 - 2018  |  Upper-second-class honours", y: 249 },
  { text: "Final project: offline-first field data collection for distributed research teams.", y: 233 },
  { text: "CERTIFICATIONS & RECOGNITION", y: 189, size: 11, bold: true },
  { text: "AWS Certified Cloud Practitioner (2024)  |  Microsoft Azure Fundamentals (2023)", y: 165 },
  { text: "Professional Scrum Developer I (2022)  |  MongoDB Associate Developer (2021)", y: 149 },
  { text: "Top Engineering Achiever 2025  |  CivicTech Hackathon Winner 2024", y: 133 },
  { text: "References and project architecture walkthroughs available on request.", y: 92, size: 9 },
  { text: "DANIEL OKAFOR  |  Page 2 of 2", y: 44, size: 8, color: "0.35 0.37 0.36" },
];

export function ensureDefaultCv() {
  const publicDirectory = path.join(process.cwd(), "public");
  const destination = path.join(publicDirectory, "cv.pdf");
  if (existsSync(destination)) return;
  mkdirSync(publicDirectory, { recursive: true });
  const temporary = `${destination}.${process.pid}.${Date.now()}.tmp`;
  writeFileSync(temporary, buildPdf([pageOne, pageTwo]), { flag: "wx" });
  renameSync(temporary, destination);
}
