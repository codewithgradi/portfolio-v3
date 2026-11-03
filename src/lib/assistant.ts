import "server-only";
import { getPortfolioData } from "@/lib/data";
import { profile } from "@/lib/profile";

export type AssistantLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type AssistantAnswer = {
  message: string;
  links: AssistantLink[];
  suggestions: string[];
};

const stopWords = new Set([
  "about", "and", "are", "can", "could", "daniel", "does", "for", "has", "have",
  "him", "his", "how", "the", "what", "when", "where", "which", "with", "you", "your",
]);

function terms(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#. ]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 2 && !stopWords.has(term));
}

function score(queryTerms: string[], haystack: string) {
  const text = haystack.toLowerCase();
  return queryTerms.reduce((total, term) => {
    const matches = text.split(term).length - 1;
    return total + Math.min(matches, 3);
  }, 0);
}

function includesAny(query: string, words: string[]) {
  return words.some((word) => query.includes(word));
}

export function answerQuestion(input: string): AssistantAnswer {
  const data = getPortfolioData();
  const query = input.trim().toLowerCase();
  const queryTerms = terms(query);
  const cvLink = `/cv.pdf?v=${encodeURIComponent(data.cvVersion)}`;

  if (includesAny(query, ["download cv", "download resume", "see cv", "see resume", "curriculum vitae"])) {
    return {
      message: "You can open Gradi’s current CV as a PDF. It is the same file managed from the admin dashboard, so the link always serves the latest upload.",
      links: [{ label: "Open current CV", href: cvLink }],
      suggestions: ["What is his recent experience?", "Show me the projects"],
    };
  }

  if (includesAny(query, ["contact", "email", "phone", "linkedin", "hire", "available", "availability"])) {
    return {
      message: `${profile.availability}. Gradi is based in ${profile.location}. The quickest route is email; LinkedIn and GitHub are also linked below.`,
      links: [
        { label: profile.email, href: `mailto:${profile.email}` },
        { label: "LinkedIn", href: profile.linkedin, external: true },
        { label: "GitHub", href: profile.github, external: true },
      ],
      suggestions: ["What is his recent experience?", "Which technologies does he use?"],
    };
  }

  if (includesAny(query, ["education", "degree", "university", "study", "studied", "academic"])) {
    return {
      message: data.education
        .map((item) => `${item.degree} at ${item.institution} (${item.startDate}–${item.endDate}). ${item.description}`)
        .join("\n\n"),
      links: [],
      suggestions: ["What certifications does he hold?", "Tell me about his experience"],
    };
  }

  if (includesAny(query, ["certification", "certified", "credential", "aws certified"])) {
    return {
      message: `Gradi's current credentials include:\n${data.certifications.map((item) => `• ${item.title} — ${item.issuer}, ${item.dateIssued}`).join("\n")}`,
      links: data.certifications[0]?.credentialUrl
        ? [{ label: "View latest credential", href: data.certifications[0].credentialUrl, external: true }]
        : [],
      suggestions: ["What are his achievements?", "Tell me about his cloud skills"],
    };
  }

  if (includesAny(query, ["achievement", "award", "hackathon", "recognition", "winner"])) {
    return {
      message: data.achievements.map((item) => `• ${item.title} (${item.date}): ${item.description}`).join("\n\n"),
      links: [],
      suggestions: ["Tell me about his open-source work", "What is his recent experience?"],
    };
  }

  if (includesAny(query, ["experience", "worked", "work history", "company", "role", "career", "job"])) {
    const latest = data.experiences[0];
    return {
      message: latest
        ? `${latest.role} at ${latest.company} is Gradi's current role (${latest.startDate}–${latest.endDate}). ${latest.description.split("\n")[0]}\n\nPreviously: ${data.experiences.slice(1).map((item) => `${item.role} at ${item.company} (${item.startDate}–${item.endDate})`).join("; ")}.`
        : "No work experience has been published yet.",
      links: [],
      suggestions: ["What did he do at Northstar?", "Show me his technical skills"],
    };
  }

  if (includesAny(query, ["skill", "technology", "technologies", "tech stack", "framework", "language", "frontend", "backend", "cloud", "architecture"])) {
    const matchingCategory = data.skills.find((skill) =>
      queryTerms.some((term) => skill.category.toLowerCase().includes(term)),
    )?.category;
    const relevant = matchingCategory
      ? data.skills.filter((skill) => skill.category === matchingCategory)
      : data.skills;
    const grouped = relevant.reduce<Record<string, string[]>>((groups, skill) => {
      groups[skill.category] = [...(groups[skill.category] || []), skill.name];
      return groups;
    }, {});
    return {
      message: Object.entries(grouped)
        .map(([category, names]) => `${category}: ${names.join(", ")}.`)
        .join("\n\n"),
      links: [],
      suggestions: ["How does he use TypeScript?", "Show me a backend project"],
    };
  }

  const rankedProjects = data.projects
    .map((project) => ({
      project,
      score: score(queryTerms, [project.title, project.description, project.problem, project.solution, project.techStack.join(" ")].join(" ")),
    }))
    .sort((a, b) => b.score - a.score);
  const bestProject = rankedProjects[0];

  if (bestProject && bestProject.score >= 2 && !includesAny(query, ["all projects", "show projects", "what projects"])) {
    const { project } = bestProject;
    return {
      message: `${project.title}: ${project.description}\n\nThe problem: ${project.problem}\n\nThe approach: ${project.solution}\n\nStack: ${project.techStack.join(", ")}.`,
      links: [
        ...(project.liveUrl ? [{ label: `Open ${project.title}`, href: project.liveUrl, external: true }] : []),
        ...(project.githubUrl ? [{ label: "View codebase", href: project.githubUrl, external: true }] : []),
      ],
      suggestions: ["Show me all projects", "Which technologies does he use?"],
    };
  }

  if (includesAny(query, ["project", "built", "build", "portfolio", "case study", "work"])) {
    return {
      message: `There are ${data.projects.length} published case studies:\n${data.projects.map((project, index) => `${index + 1}. ${project.title} — ${project.description}`).join("\n")}\n\nAsk for one by name for the problem, architecture, and stack.`,
      links: [],
      suggestions: data.projects.slice(0, 3).map((project) => `Tell me about ${project.title}`),
    };
  }

  if (includesAny(query, ["who", "background", "about you", "about him", "hello", "hi", "hey"])) {
    return {
      message: `${profile.about[0]}\n\n${profile.intro}`,
      links: [],
      suggestions: ["Show me the projects", "What is his recent experience?", "How can I contact Daniel?"],
    };
  }

  const candidates = [
    ...data.projects.map((item) => ({ title: item.title, text: `${item.title} ${item.description} ${item.problem} ${item.solution} ${item.techStack.join(" ")}`, kind: "project" })),
    ...data.experiences.map((item) => ({ title: `${item.role} at ${item.company}`, text: `${item.company} ${item.role} ${item.description}`, kind: "experience" })),
    ...data.skills.map((item) => ({ title: item.name, text: `${item.name} ${item.category} ${item.proficiencyLevel}`, kind: "skill" })),
  ].map((item) => ({ ...item, rank: score(queryTerms, item.text) })).sort((a, b) => b.rank - a.rank);

  if (candidates[0]?.rank > 0) {
    const match = candidates[0];
    if (match.kind === "project") {
      return answerQuestion(`Tell me about ${match.title}`);
    }
    return {
      message: `The closest published match is ${match.title}. You can ask me for Gradi's ${match.kind === "skill" ? "skills by category" : "work history"} for more context.`,
      links: [],
      suggestions: ["Show me the projects", "Summarize Daniel’s background"],
    };
  }

  return {
    message: "I couldn’t find a close match in the published portfolio. I only answer from Daniel’s live CV content, projects, experience, skills, credentials, and education — try one of those areas.",
    links: [],
    suggestions: ["Summarize Daniel’s background", "Show me the projects", "How can I contact Daniel?"],
  };
}
