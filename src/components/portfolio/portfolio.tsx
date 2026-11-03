"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  BadgeCheck,
  Download,
  Code2,
  BriefcaseBusiness,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { profile } from "@/lib/profile";
import type { PortfolioData } from "@/lib/types";
import { Navigation } from "./navigation";
import { CvModal } from "./cv-modal";
import { ChatWidget } from "./chat-widget";
import { LineReveal, Reveal } from "./reveal";
import { ProjectCard } from "./project-card";

const proficiencyScore: Record<string, number> = {
  Expert: 4,
  Advanced: 3,
  Proficient: 2,
  "Working knowledge": 1,
};

function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Africa/Johannesburg",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    update();
    const interval = window.setInterval(update, 30000);
    return () => window.clearInterval(interval);
  }, []);
  return <span>{time || "South Africa"} local time</span>;
}
export function Portfolio({
  data,
  isAdmin,
}: {
  data: PortfolioData;
  isAdmin: boolean;
}) {
  const [cvOpen, setCvOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState("All");
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "center center"],
  });
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(heroProgress, [0, 0.85], [1, 0.1]);
  const portraitY = useTransform(heroProgress, [0, 1], [0, 100]);
  const portraitScale = useTransform(heroProgress, [0, 1], [1, 1.14]);
  const portraitClip = useTransform(
    heroProgress,
    [0, 1],
    [
      "inset(0% 0% 0% 0% round 190px 190px 24px 24px)",
      "inset(10% 9% 0% 9% round 28px 28px 28px 28px)",
    ],
  );
  const aboutLeft = useTransform(aboutProgress, [0, 1], [-150, 0]);
  const aboutRight = useTransform(aboutProgress, [0, 1], [150, 0]);
  const cvUrl = `/cv.pdf?v=${encodeURIComponent(data.cvVersion)}`;

  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    data.projects.forEach((project) =>
      project.techStack.forEach((tech) =>
        counts.set(tech, (counts.get(tech) || 0) + 1),
      ),
    );
    return [
      "All",
      ...[...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name]) => name),
    ];
  }, [data.projects]);
  const visibleProjects =
    projectFilter === "All"
      ? data.projects
      : data.projects.filter((project) =>
          project.techStack.includes(projectFilter),
        );
  const skillGroups = useMemo(
    () =>
      data.skills.reduce<Record<string, typeof data.skills>>(
        (groups, skill) => {
          groups[skill.category] = [...(groups[skill.category] || []), skill];
          return groups;
        },
        {},
      ),
    [data.skills],
  );

  return (
    <div className="portfolio-shell">
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
      />
      <Navigation onOpenCv={() => setCvOpen(true)} />
      <main>
        <section className="hero" id="home" ref={heroRef}>
          <div className="hero-grid-bg" aria-hidden="true" />
          <div className="hero-ambient ambient-one" aria-hidden="true" />
          <div className="hero-ambient ambient-two" aria-hidden="true" />
          <div className="hero-layout page-gutter">
            <motion.div
              className="hero-copy"
              style={
                reduceMotion
                  ? undefined
                  : { y: heroTextY, opacity: heroOpacity }
              }
            >
              <motion.p
                className="hero-greeting"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span>Hey.</span> I’m {profile.firstName}
                <i>.</i>
              </motion.p>
              <h1 aria-label={profile.headline}>
                <LineReveal delay={0.15}>A SOFTWARE</LineReveal>
                <LineReveal delay={0.23}>
                  ENGINEER <em>&</em>
                </LineReveal>
                <LineReveal delay={0.31}>FULL-STACK</LineReveal>
                <LineReveal delay={0.39}>
                  BUILDER<span className="hero-period">.</span>
                </LineReveal>
              </h1>
              <motion.p
                className="hero-intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
              >
                {profile.intro}
              </motion.p>
              <motion.div
                className="hero-ctas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.82, duration: 0.7 }}
              >
                <a href="#contact" className="contact-pill">
                  Contact me <ArrowUpRight size={19} />
                </a>
                <button
                  onClick={() => setCvOpen(true)}
                  className="cv-text-button"
                >
                  <Download size={16} /> View my CV
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              className="hero-portrait-wrap"
              style={reduceMotion ? undefined : { y: portraitY }}
            >
              <motion.div
                className="hero-portrait"
                style={reduceMotion ? undefined : { clipPath: portraitClip }}
                initial={{ opacity: 0, scale: 0.88, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 1.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="portrait-orbit" aria-hidden="true" />
                <motion.img
                  src="/images/gradi-portrait.jpg"
                  alt="Gradi Puata's, software engineer"
                  fetchPriority="high"
                  style={reduceMotion ? undefined : { scale: portraitScale }}
                />
                <div className="portrait-caption">
                  <MapPin size={14} />
                  <span>
                    Durban, SA
                    <br />
                    <small>Working worldwide</small>
                  </span>
                </div>
              </motion.div>
              <motion.div
                className="portrait-note"
                initial={{ opacity: 0, rotate: -8, scale: 0.8 }}
                animate={{ opacity: 1, rotate: -5, scale: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <span>Ideas into</span>
                <strong>impact.</strong>
                <ArrowUpRight size={20} />
              </motion.div>
            </motion.div>

            <motion.aside
              className="hero-stats"
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75, duration: 0.8 }}
            >
              <p className="stats-heading">
                A few numbers
                <br />
                behind the work
              </p>
              {profile.stats.map((stat) => (
                <div className="hero-stat" key={stat.label}>
                  <strong>
                    {stat.value}
                    <sup>{stat.suffix}</sup>
                  </strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </motion.aside>
          </div>
          <motion.a
            href="#about"
            className="hero-scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span>Scroll to explore</span>
            <ArrowDown size={16} />
          </motion.a>
        </section>

        <section
          className="feature-grid page-gutter"
          aria-label="Engineering strengths"
        >
          {profile.features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal
                key={feature.title}
                delay={index * 0.07}
                className="feature-card"
              >
                <div className="feature-icon">
                  <Icon size={21} />
                </div>
                <span>0{index + 1}</span>
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
              </Reveal>
            );
          })}
        </section>

        <section className="tech-strip" aria-label="Technologies and tools">
          <div className="tech-strip-label">
            Tools I use to
            <br />
            move ideas forward
          </div>
          <div className="tech-marquee">
            <div className="tech-track">
              {[...profile.techStack, ...profile.techStack].map(
                (tech, index) => {
                  const Icon = tech.icon;
                  return (
                    <div
                      className="tech-badge"
                      key={`${tech.name}-${index}`}
                      aria-hidden={index >= profile.techStack.length}
                    >
                      <Icon size={21} />
                      <span>
                        {tech.name}
                        <small>{tech.detail}</small>
                      </span>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </section>

        <section
          className="about-section page-gutter"
          id="about"
          ref={aboutRef}
        >
          <div className="section-topline">
            <span>01 / About me</span>
            <span>Engineer · Collaborator · Problem solver</span>
          </div>
          <h2
            className="about-title"
            aria-label="Crafting scalable backends and intuitive experiences"
          >
            <motion.span style={reduceMotion ? undefined : { x: aboutLeft }}>
              CRAFTING SCALABLE
            </motion.span>
            <motion.span style={reduceMotion ? undefined : { x: aboutRight }}>
              BACKENDS <em>&</em> INTUITIVE
            </motion.span>
            <motion.span style={reduceMotion ? undefined : { x: aboutLeft }}>
              EXPERIENCES<span className="green-dot">.</span>
            </motion.span>
          </h2>
          <div className="about-content">
            <Reveal className="about-lead">
              <p>
                I build for the person using the product <em>and</em> the team
                maintaining it.
              </p>
              <div className="about-signature">
                Gradi Puata <span>Software engineer, 2026</span>
              </div>
            </Reveal>
            <Reveal className="about-narrative" delay={0.12}>
              {profile.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <button onClick={() => setCvOpen(true)}>
                More about my journey <ArrowUpRight size={18} />
              </button>
            </Reveal>
          </div>
          <div className="principles-grid">
            {profile.principles.map((principle, index) => (
              <Reveal
                key={principle.number}
                delay={index * 0.09}
                className="principle-card"
              >
                <span>{principle.number}</span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="projects-section" id="work">
          <div className="page-gutter">
            <div className="section-topline">
              <span>02 / Selected work</span>
              <span>{data.projects.length} case studies · 2024—2026</span>
            </div>
            <Reveal>
              <div className="portfolio-heading">
                <h2>
                  PORTFOLIO<span>.</span>
                </h2>
                <p>
                  A selection of systems shaped by real constraints, thoughtful
                  architecture, and an obsession with the details people feel.
                </p>
              </div>
            </Reveal>
            <div
              className="project-filters"
              aria-label="Filter projects by technology"
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={projectFilter === filter ? "active" : ""}
                  onClick={() => setProjectFilter(filter)}
                >
                  {filter}
                  <span>
                    {filter === "All"
                      ? data.projects.length
                      : data.projects.filter((project) =>
                          project.techStack.includes(filter),
                        ).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <motion.div layout className="project-list page-gutter">
            <AnimatePresence>
              {visibleProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={data.projects.indexOf(project)}
                />
              ))}
            </AnimatePresence>
            {!visibleProjects.length && (
              <div className="public-empty">
                No projects use this technology yet. Choose another filter.
              </div>
            )}
          </motion.div>
        </section>

        <section className="skills-section" id="expertise">
          <div className="page-gutter">
            <div className="section-topline light">
              <span>03 / Capabilities</span>
              <span>Depth where it matters</span>
            </div>
            <div className="skills-heading">
              <Reveal>
                <h2>
                  THE
                  <br />
                  <em>TOOLKIT.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p>
                  Broad enough to see the whole system. Focused enough to know
                  where the difficult decisions live.
                </p>
              </Reveal>
            </div>
            <div className="skills-grid">
              {Object.entries(skillGroups).map(
                ([category, categorySkills], groupIndex) => (
                  <Reveal
                    className="skill-group"
                    key={category}
                    delay={groupIndex * 0.06}
                  >
                    <div className="skill-group-head">
                      <span>0{groupIndex + 1}</span>
                      <h3>{category}</h3>
                      <small>{categorySkills.length}</small>
                    </div>
                    <div>
                      {categorySkills.map((skill) => (
                        <div className="skill-row" key={skill.id}>
                          <span>{skill.name}</span>
                          <div
                            className="skill-level"
                            aria-label={`${skill.proficiencyLevel} proficiency`}
                          >
                            {[1, 2, 3, 4].map((level) => (
                              <i
                                key={level}
                                className={
                                  level <=
                                  (proficiencyScore[skill.proficiencyLevel] ||
                                    1)
                                    ? "filled"
                                    : ""
                                }
                              />
                            ))}
                          </div>
                          <small>{skill.proficiencyLevel}</small>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="experience-section page-gutter" id="experience">
          <div className="section-topline">
            <span>04 / Work experience</span>
            <span>Eight years of building & learning</span>
          </div>
          <div className="experience-layout">
            <div className="experience-intro">
              <Reveal>
                <h2>
                  WORK THAT
                  <br />
                  MOVES
                  <br />
                  <em>FORWARD.</em>
                </h2>
                <p>
                  Teams, roles, and lessons that shaped how I engineer today.
                </p>
                <button onClick={() => setCvOpen(true)}>
                  Download full résumé <Download size={17} />
                </button>
              </Reveal>
            </div>
            <div className="timeline">
              {data.experiences.map((experience, index) => (
                <Reveal
                  key={experience.id}
                  className="timeline-item"
                  delay={index * 0.06}
                >
                  <div className="timeline-marker">
                    <span>0{index + 1}</span>
                    <i />
                  </div>
                  <div className="timeline-date">
                    {experience.startDate} — {experience.endDate}
                  </div>
                  <div className="timeline-content">
                    <p>{experience.company}</p>
                    <h3>{experience.role}</h3>
                    <ul>
                      {experience.description
                        .split("\n")
                        .filter(Boolean)
                        .map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          className="certifications-section page-gutter"
          id="certifications"
        >
          <div className="section-topline">
            <span>05 / Credentials</span>
            <span>Verified learning, applied in practice</span>
          </div>
          <div className="credentials-heading">
            <Reveal>
              <h2>
                CERTIFICATIONS
                <br />
                <em>& CREDIBILITY.</em>
              </h2>
            </Reveal>
            <p>
              Continued study is only useful when it improves the work. These
              programmes underpin my cloud, data, and delivery decisions.
            </p>
          </div>
          <div className="certification-grid">
            {data.certifications.map((certification, index) => (
              <Reveal
                key={certification.id}
                className="certification-card"
                delay={index * 0.06}
              >
                <div className="cert-top">
                  <BadgeCheck size={25} />
                  <span>0{index + 1}</span>
                </div>
                <p>{certification.issuer}</p>
                <h3>{certification.title}</h3>
                <div>
                  <span>Issued {certification.dateIssued}</span>
                  {certification.credentialUrl && (
                    <a
                      href={certification.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${certification.title} credential`}
                    >
                      <ArrowUpRight size={18} />
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="achievements-section" id="achievements">
          <div className="page-gutter">
            <div className="section-topline">
              <span>06 / Recognition</span>
              <span>Milestones beyond the roadmap</span>
            </div>
            <Reveal>
              <div className="achievements-heading">
                <h2>
                  PROUD
                  <br />
                  <em>MOMENTS.</em>
                </h2>
                <p>
                  Awards, community work, and the open-source contributions that
                  keep me curious.
                </p>
              </div>
            </Reveal>
            <div className="achievement-grid">
              {data.achievements.map((achievement, index) => (
                <Reveal
                  key={achievement.id}
                  className="achievement-card"
                  delay={index * 0.07}
                >
                  <div
                    className={`achievement-visual variant-${index % 4}`}
                    style={{ "--achievement-index": index } as CSSProperties}
                  >
                    {achievement.imageUrl ? (
                      <img
                        src={achievement.imageUrl}
                        alt={achievement.title}
                        loading="lazy"
                      />
                    ) : (
                      <>
                        <span className="achievement-number">0{index + 1}</span>
                        <div className="achievement-rings">
                          <i />
                          <i />
                          <i />
                        </div>
                        <Award size={28} />
                      </>
                    )}
                    <span className="achievement-date">{achievement.date}</span>
                  </div>
                  <div className="achievement-copy">
                    <h3>{achievement.title}</h3>
                    <p>{achievement.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="education-section page-gutter" id="education">
          <div className="section-topline">
            <span>07 / Education</span>
            <span>Foundations & continued study</span>
          </div>
          <div className="education-layout">
            <Reveal>
              <div className="education-title">
                <GraduationCap size={30} />
                <h2>
                  ALWAYS
                  <br />
                  <em>LEARNING.</em>
                </h2>
              </div>
            </Reveal>
            <div className="education-list">
              {data.education.map((item, index) => (
                <Reveal
                  key={item.id}
                  className="education-item"
                  delay={index * 0.08}
                >
                  <div className="education-index">0{index + 1}</div>
                  <div>
                    <p>{item.institution}</p>
                    <h3>{item.degree}</h3>
                    <span>
                      {item.startDate} — {item.endDate}
                    </span>
                    <p className="education-description">{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-grid" aria-hidden="true" />
          <div className="page-gutter contact-inner">
            <div className="section-topline light">
              <span>08 / Contact & connections</span>
              <span>
                <i className="available-dot" /> {profile.availability}
              </span>
            </div>
            <Reveal className="contact-heading">
              <p>Have a difficult problem or a useful idea?</p>
              <h2>
                LET’S BUILD
                <br />
                <em>WHAT MATTERS.</em>
              </h2>
              <a href={`mailto:${profile.email}`}>
                Start a conversation <ArrowUpRight />
              </a>
            </Reveal>
            <div className="connection-links">
              <a href={`mailto:${profile.email}`}>
                <span>
                  <Mail size={20} />
                  Email
                </span>
                <strong>{profile.email}</strong>
                <ArrowUpRight />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                <span>
                  <BriefcaseBusiness size={20} />
                  LinkedIn
                </span>
                <strong>Connect professionally</strong>
                <ArrowUpRight />
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer">
                <span>
                  <Code2 size={20} />
                  GitHub
                </span>
                <strong>Explore code & contributions</strong>
                <ArrowUpRight />
              </a>
              <a href={`tel:${profile.phoneHref}`}>
                <span>
                  <Phone size={20} />
                  Phone
                </span>
                <strong>{profile.phone}</strong>
                <ArrowUpRight />
              </a>
            </div>
            <footer className="site-footer">
              <a href="#home" className="site-logo light">
                GP<span>®</span>
              </a>
              <div>
                <span>© 2026 Gradi Puata</span>
                <span>
                  <MapPin size={13} /> Durban, SA · <LocalTime />
                </span>
              </div>
              <div>
                <a href="/admin">Admin</a>
                <a href="#home">
                  Back to top <ArrowUp size={15} />
                </a>
              </div>
            </footer>
          </div>
        </section>
      </main>
      <CvModal
        open={cvOpen}
        onClose={() => setCvOpen(false)}
        cvUrl={cvUrl}
        isAdmin={isAdmin}
      />
      <ChatWidget />
    </div>
  );
}
