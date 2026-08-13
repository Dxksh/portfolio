export const profile = {
  name: "Daksh Singhvi",
  role: "Software Engineer",
  summary:
    "CS graduate with 1+ years of professional experience shipping scalable systems across multiple companies — open to interesting Software Engineering opportunities.",
  about:
    "I'm a Computer Science graduate from the University of Liverpool with 1+ years of professional experience across multiple companies — from 10-million-record batch jobs on AWS to full-stack features used across the business. I'm currently a Web and Cloud Developer at the Liverpool Air Quality Research Centre, and always open to interesting Software Engineering opportunities.",
  headshot: "", // set to e.g. "/headshot.jpg" (place the file in public/) once supplied — renders without a photo until then
  moreAboutMe:
    "// PROVISIONAL — replace with your real longer narrative. A paragraph or two about your path into engineering, what draws you to building things, and what you care about outside code.",
  availability: "Open to opportunities",
  location: "Liverpool, UK",
  email: "dsinghvi07@gmail.com",
  github: "https://github.com/Dxksh",
  linkedin: "https://www.linkedin.com/in/daksh-singhvi",
  cvPath: "/cv/Daksh-Singhvi-CV.pdf",
} as const;

export const skillGroups = [
  {
    label: "Languages",
    items: ["C#", "Java", "Python", "JavaScript", "TypeScript", "Swift", "Dart", "SQL", "HTML/CSS", "C", "C++"],
  },
  {
    label: "Frameworks & Libraries",
    items: [".NET", "ASP.NET MVC", "Entity Framework", "React", "Next.js", "Flutter", "Firebase"],
  },
  {
    label: "Cloud & Databases",
    items: ["AWS Batch", "AWS Lambda", "S3", "MySQL", "Vercel"],
  },
  {
    label: "Tools & Practices",
    items: ["Git", "Docker", "Agile / Scrum / Kanban", "REST & Swagger APIs", "SOLID", "Claude Code", "GitHub Copilot", "Xcode", "Android Studio"],
  },
] as const;
