export interface ExperienceEntry {
  id: string;
  kind: "work" | "education" | "leadership";
  organisation: string;
  role: string;
  location?: string;
  period: string;
  highlights: string[];
  logo?: string; // image path; falls back to a generated initial-letter badge when absent
}

export const experience: ExperienceEntry[] = [
  {
    id: "laqrc",
    kind: "work",
    organisation: "Liverpool Air Quality Research Centre",
    role: "Web and Cloud Developer",
    location: "Liverpool, UK",
    period: "Aug 2026 – Present",
    highlights: ["Just started — details to follow as the role develops."],
  },
  {
    id: "sentric",
    kind: "work",
    organisation: "Sentric Music",
    role: "Associate Software Engineer",
    location: "Liverpool, UK",
    period: "Sept 2024 – Sept 2025",
    highlights: [
      "Built scalable batch and bulk data jobs with C#, .NET, Entity Framework and AWS Batch/Lambda — validating and updating 10M+ artist records per run with optimised SQL (CTEs, indexes)",
      "Shipped full-stack features across Sentric's websites — search filters, reporting tools and new page rollouts — with C#, .NET, MySQL, JavaScript and HTML/CSS, following MVC and SOLID",
      "Owned end-to-end delivery in an Agile/Kanban team, including a nightly database health-check system and bulk import tooling used by 150+ internal users",
      "Integrated GitHub Copilot and Claude into daily workflows for code design and peer review, contributing to 100+ PRs",
    ],
  },
  {
    id: "al-futtaim",
    kind: "work",
    organisation: "Al Futtaim Group — Blue Rewards",
    role: "Technology and Data Intern",
    location: "Dubai, UAE",
    period: "July 2024 – Sept 2024",
    highlights: [
      "Built a cross-platform Flutter receipt-scanning app integrating GPT-4o and Google ML Kit to automate receipt data extraction for the Blue Rewards loyalty programme",
      "Migrated a customer analytics dashboard from Power BI to Microsoft Power Apps, scaling to serve 2M+ users with insights into behaviour, spending and engagement",
    ],
  },
  {
    id: "padelo-founder",
    kind: "leadership",
    organisation: "Padelo",
    role: "Founder",
    location: "Liverpool, UK",
    // PROVISIONAL period — best-known estimate from repo history; adjust if the actual founding date differs
    period: "Jul 2026 – Present",
    highlights: [
      "Founded and lead product direction for a cross-platform padel scoring and social app, aiming to scale it from an internal release into a full public product",
      "Own the end-to-end roadmap — score tracking, social groups, tournaments and statistics — using Claude Code agentic workflows for iterative delivery",
    ],
  },
  {
    id: "cricket-coach",
    kind: "leadership",
    organisation: "Sefton Park Cricket Club",
    role: "Cricket Coach & 1st XI Athlete",
    location: "Liverpool, UK",
    period: "June 2025 – Present",
    highlights: [
      "Coach a weekly squad of ~6 junior cricketers aged 11–15, planning and running technical training and match simulation sessions to develop batting, bowling and fielding skills",
      "Selected for the club's 1st XI in the Liverpool & District Cricket Competition 1st Division, balancing weekend fixtures with full-time studies and software engineering work",
    ],
  },
  {
    id: "head-boy",
    kind: "leadership",
    organisation: "Ambassador School",
    role: "Head Boy & Sports Captain",
    period: "Apr 2020 – Mar 2022",
    highlights: [
      "Led a team of over 30 senior and junior student council members, hosting welfare, educational and sports events and providing a platform for students to voice their ideas",
    ],
  },
  {
    id: "liverpool",
    kind: "education",
    organisation: "University of Liverpool",
    role: "BSc Computer Science with Software Development",
    location: "Liverpool, UK",
    period: "Sept 2022 – June 2026",
    highlights: [
      "First Class Honours, including a cohort-highest 99% in the Software Engineering module exam",
      "Vice-Chancellor International Attainment Scholarship awardee",
      "Coursework: Data Structures & Algorithms, Software Engineering, AI, Data Science, iOS Development, Big Data, Cloud Computing",
    ],
  },
];
