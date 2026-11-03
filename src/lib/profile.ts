import {
  Braces,
  CloudCog,
  Component,
  DatabaseZap,
  Gauge,
  Layers3,
  MousePointer2,
  Workflow,
} from "lucide-react";

export const profile = {
  name: "Gradi Puata",
  firstName: "Gradi",
  initials: "GP",
  headline: "A SOFTWARE ENGINEER & FULL-STACK BUILDER",
  intro:
    "I turn complex product ideas into fast, resilient digital experiences — from the first system diagram to the last polished interaction.",
  location: "Durban, South Africa· Working worldwide",
  availability: "Available for select projects · Q3 2026",
  email: "gradipuata@gmail.com",
  phone: "+27 68 048 8872",
  phoneHref: "+442079460814",
  linkedin: "https://www.linkedin.com/in/gradi-puata/",
  github: "https://github.com/codewithgradi",
  about: [
    "I’m a product-minded engineer with experience building platforms where reliability and clarity matter. My work spans event-driven backends, thoughtful design systems, data-heavy dashboards, and the unglamorous infrastructure that keeps everything running.",
    "I’m most useful in the space between disciplines: translating a business constraint into an architecture decision, a user frustration into a simpler flow, and an ambitious roadmap into small, shippable increments. I care about observable systems, accessible interfaces, and code the next engineer can confidently change.",
  ],
  stats: [
    { value: "01", suffix: "+", label: "Years engineering" },
    { value: "5", suffix: "+", label: "Products shipped" },
    { value: "3", suffix: "+", label: "Open-source releases" },
    { value: "90.95", suffix: "%", label: "Platform uptime" },
  ],
  features: [
    {
      title: "Clean Architecture",
      description:
        "Explicit boundaries, useful tests, and systems designed to evolve without rewrites.",
      icon: Layers3,
    },
    {
      title: "Responsive & Modern UI",
      description:
        "Accessible, expressive interfaces that stay precise on every screen and input.",
      icon: Component,
    },
    {
      title: "Scalable Backends",
      description:
        "Typed APIs, durable data models, and observability built in from day one.",
      icon: DatabaseZap,
    },
    {
      title: "Seamless Prototyping",
      description:
        "Fast technical validation without sacrificing the path to production quality.",
      icon: MousePointer2,
    },
  ],
  techStack: [
    { name: "TypeScript", detail: "Language", icon: Braces },
    { name: "Next.js", detail: "Framework", icon: Component },
    { name: "Node.js", detail: "Runtime", icon: Workflow },
    { name: "PostGres", detail: "Database", icon: DatabaseZap },
    { name: "AWS", detail: "Infrastructure", icon: CloudCog },
    { name: ".Net", detail: "Framework", icon: Component },
    { name: "Docker", detail: "Delivery", icon: Layers3 },
    { name: "Playwright", detail: "Quality", icon: Gauge },
  ],
  principles: [
    {
      number: "01",
      title: "Understand the real constraint",
      text: "Before choosing tools, I map the user, the business risk, and the cost of being wrong.",
    },
    {
      number: "02",
      title: "Make the system legible",
      text: "Clear names, observable behavior, and small interfaces make speed sustainable.",
    },
    {
      number: "03",
      title: "Sweat the final five percent",
      text: "Performance, motion, empty states, and keyboard flows are part of the product — not polish.",
    },
  ],
} as const;
