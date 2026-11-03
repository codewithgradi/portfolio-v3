export const seedProjects = [
  {
    id: "project-calcom",
    title: "Cal.com",
    description:
      "A scheduling experience that makes complex availability feel effortless for individuals, teams, and developers embedding scheduling into their own products.",
    problem:
      "Coordinating meetings across calendars, time zones, buffers, and round-robin teams creates a surprising amount of edge-case complexity. Most scheduling tools either hide that complexity behind rigid workflows or expose it as a cluttered administration screen.",
    solution:
      "A modular scheduling domain separates availability rules from calendar providers and booking workflows. The interface progressively reveals advanced controls, while timezone-safe date handling, transactional booking, and webhook retries keep the underlying system dependable.",
    techStack: JSON.stringify(["Next.js", "TypeScript", "tRPC", "Prisma", "Redis"]),
    githubUrl: "https://github.com/calcom/cal.com",
    liveUrl: "https://cal.com/",
    imageUrl: "/images/project-cal.jpg",
    createdAt: "2026-02-18T09:00:00.000Z",
  },
  {
    id: "project-dub",
    title: "Dub",
    description:
      "A link-management platform that pairs branded short links with clear, real-time analytics and a developer-friendly API.",
    problem:
      "Marketing teams need to understand where traffic comes from without turning every campaign into a spreadsheet exercise. High-volume redirects also demand extremely low latency, while accurate reporting must account for bots, locations, devices, and duplicate events.",
    solution:
      "The request path is split from analytical processing: edge redirects resolve from a cached routing layer and emit events asynchronously. A columnar analytics store powers flexible queries, and a consistent filtering model keeps dashboard, exports, and API results aligned.",
    techStack: JSON.stringify(["React", "Next.js", "Tinybird", "Upstash", "Tailwind CSS"]),
    githubUrl: "https://github.com/dubinc/dub",
    liveUrl: "https://dub.co/",
    imageUrl: "/images/project-dub.jpg",
    createdAt: "2025-11-06T09:00:00.000Z",
  },
  {
    id: "project-formbricks",
    title: "Formbricks",
    description:
      "An experience-management toolkit for collecting targeted, privacy-conscious feedback inside the moments that matter.",
    problem:
      "Traditional surveys arrive too late and ask everyone the same questions. Product teams need contextual feedback tied to behavior, but adding another heavy script or shipping invasive tracking creates performance and trust problems.",
    solution:
      "A lightweight, isolated client runtime evaluates targeting rules locally and loads survey UI only when needed. The server models surveys, audiences, and responses independently, with explicit consent controls and webhooks for routing insights into existing workflows.",
    techStack: JSON.stringify(["TypeScript", "React", "Next.js", "SQLite", "Docker"]),
    githubUrl: "https://github.com/formbricks/formbricks",
    liveUrl: "https://formbricks.com/",
    imageUrl: "/images/project-formbricks.jpg",
    createdAt: "2025-06-21T09:00:00.000Z",
  },
  {
    id: "project-twenty",
    title: "Twenty",
    description:
      "A flexible CRM workspace built around adaptable data, focused workflows, and a calm interface that does not get in the way.",
    problem:
      "Growing teams often have to choose between a rigid off-the-shelf CRM and an expensive customization project. As fields, permissions, and pipelines multiply, both the data model and the interface can become difficult to reason about.",
    solution:
      "Metadata-driven objects and views let teams shape their workspace without duplicating application logic. Optimistic interactions keep daily work fast, background jobs handle imports and synchronization, and granular access rules preserve a consistent authorization boundary.",
    techStack: JSON.stringify(["React", "NestJS", "GraphQL", "SQLite", "Storybook"]),
    githubUrl: "https://github.com/twentyhq/twenty",
    liveUrl: "https://twenty.com/",
    imageUrl: "/images/project-twenty.jpg",
    createdAt: "2024-12-12T09:00:00.000Z",
  },
];

export const seedExperiences = [
  {
    id: "exp-northstar",
    company: "Northstar Systems",
    role: "Senior Software Engineer",
    startDate: "2023-04",
    endDate: "Present",
    description:
      "Lead a distributed product group building workflow infrastructure used by operations teams in 14 markets.\nRe-architected the event processing pipeline to remove ordering bugs and sustain 8× peak traffic without manual intervention.\nIntroduced typed API contracts, tracing, and service-level dashboards that reduced median incident diagnosis from 42 to 11 minutes.\nMentor five engineers through architecture reviews, pairing, and a fortnightly technical decision forum.",
    order: 1,
  },
  {
    id: "exp-sable",
    company: "Sable & Co. Digital",
    role: "Full-Stack Engineer",
    startDate: "2020-08",
    endDate: "2023-03",
    description:
      "Delivered customer portals, commerce integrations, and internal tools for fintech and professional-services clients.\nBuilt a reusable accessible component system that cut new product setup from three weeks to four days.\nMoved legacy background work to idempotent queues with retries and operational runbooks.\nPartnered directly with designers and stakeholders from discovery through launch and measured iteration.",
    order: 2,
  },
  {
    id: "exp-independent",
    company: "Independent Product Studio",
    role: "Product Engineer",
    startDate: "2018-01",
    endDate: "2020-07",
    description:
      "Designed and shipped twelve web products for early-stage founders across logistics, education, and hospitality.\nOwned discovery workshops, technical planning, implementation, deployment, and post-launch support.\nCreated a pragmatic starter architecture with authentication, billing, transactional email, and automated browser tests.\nMaintained a small set of open-source utilities for validation, PDF workflows, and background jobs.",
    order: 3,
  },
];

export const seedSkills = [
  ["TypeScript", "Programming Languages", "Expert"],
  ["JavaScript", "Programming Languages", "Expert"],
  ["C#", "Programming Languages", "Advanced"],
  ["Python", "Programming Languages", "Advanced"],
  ["SQL", "Programming Languages", "Expert"],
  ["Next.js", "Frameworks & Libraries", "Expert"],
  ["React", "Frameworks & Libraries", "Expert"],
  ["Node.js", "Frameworks & Libraries", "Expert"],
  ["NestJS", "Frameworks & Libraries", "Advanced"],
  [".NET", "Frameworks & Libraries", "Advanced"],
  ["Tailwind CSS", "Frameworks & Libraries", "Expert"],
  ["Drizzle ORM", "Frameworks & Libraries", "Advanced"],
  ["Domain-Driven Design", "Engineering & Architecture", "Advanced"],
  ["Event-Driven Systems", "Engineering & Architecture", "Expert"],
  ["REST & GraphQL APIs", "Engineering & Architecture", "Expert"],
  ["Microservices", "Engineering & Architecture", "Advanced"],
  ["Test-Driven Development", "Engineering & Architecture", "Advanced"],
  ["Accessible Design Systems", "Engineering & Architecture", "Expert"],
  ["AWS", "Data & Infrastructure", "Advanced"],
  ["Docker", "Data & Infrastructure", "Advanced"],
  ["Redis", "Data & Infrastructure", "Advanced"],
  ["CI/CD & Observability", "Data & Infrastructure", "Expert"],
].map(([name, category, proficiencyLevel], index) => ({
  id: `skill-${index + 1}`,
  name,
  category,
  proficiencyLevel,
}));

export const seedCertifications = [
  {
    id: "cert-aws",
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    dateIssued: "2024-09",
    credentialUrl: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
  },
  {
    id: "cert-azure",
    title: "Microsoft Azure Fundamentals · AZ-900",
    issuer: "Microsoft",
    dateIssued: "2023-05",
    credentialUrl: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
  },
  {
    id: "cert-scrum",
    title: "Professional Scrum Developer I",
    issuer: "Scrum.org",
    dateIssued: "2022-11",
    credentialUrl: "https://www.scrum.org/professional-scrum-developer-certification",
  },
  {
    id: "cert-mongo",
    title: "MongoDB Associate Developer",
    issuer: "MongoDB University",
    dateIssued: "2021-07",
    credentialUrl: "https://learn.mongodb.com/pages/mongodb-associate-developer-exam",
  },
];

export const seedAchievements = [
  {
    id: "achievement-top",
    title: "Top Engineering Achiever",
    description:
      "Recognized in Northstar’s 2025 engineering review for technical leadership, measurable reliability improvements, and sustained mentorship across two product teams.",
    date: "2025-12",
    imageUrl: "",
  },
  {
    id: "achievement-hackathon",
    title: "CivicTech Hackathon · Winner",
    description:
      "Led a four-person team to first place with an accessible service finder that matched residents to local support using eligibility rules and multilingual content.",
    date: "2024-06",
    imageUrl: "",
  },
  {
    id: "achievement-oss",
    title: "18 Open-Source Releases",
    description:
      "Published and maintained focused TypeScript and NuGet utilities for schema validation, background job scheduling, and deterministic document generation.",
    date: "2020 — Present",
    imageUrl: "",
  },
  {
    id: "achievement-speaking",
    title: "Engineering Speaker & Mentor",
    description:
      "Delivered practical sessions on resilient background jobs and inclusive frontend architecture; mentored 23 early-career developers through structured portfolio reviews.",
    date: "2022 — Present",
    imageUrl: "",
  },
];

export const seedEducation = [
  {
    id: "education-bsc",
    institution: "University of Lagos",
    degree: "BSc (Hons) Information Technology",
    startDate: "2014-09",
    endDate: "2018-06",
    description:
      "Graduated with upper-second-class honours. Focused on software engineering, database systems, computer networks, and human-computer interaction. Final-year project: an offline-first field data collection platform for distributed research teams.",
  },
  {
    id: "education-distributed",
    institution: "Continuing Professional Development",
    degree: "Distributed Systems & Cloud Architecture",
    startDate: "2021-01",
    endDate: "2023-12",
    description:
      "Completed advanced coursework in consensus, fault tolerance, cloud economics, and secure system design, applying each module to production architecture reviews and internal engineering workshops.",
  },
];
