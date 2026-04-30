export interface Project {
  id: string;
  title: string;
  description: string;
  details: string;
  metrics?: string[];
  link?: string;
  tech: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  grade: string;
  details: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  tasks: string[];
}

export const EDUCATION: Education[] = [
  {
    id: "edu-msc",
    degree: "Data Science",
    institution: "University of Mannheim",
    period: "Current",
    grade: "1.5",
    details: "Focus on Machine Learning and Deep Learning."
  },
  {
    id: "edu-bsc",
    degree: "Computer Science",
    institution: "Technische Hochschule Mannheim",
    period: "Completed",
    grade: "1.3",
    details: "Thesis (Grade 1.0): \"A comparative study of DQN vs. DDQN in a custom Pygame racing environment to mitigate Q-value overestimation bias.\""
  }
];

export const EXPERIENCE: Experience[] = [
  {
    id: "exp-sap",
    company: "SAP SE",
    role: "Working Student BTP Development",
    period: "04/2024 – Present",
    tasks: ["React/JS Frontend development", "Backend integration"]
  },
  {
    id: "exp-vector",
    company: "Vector Informatik",
    role: "Internship PREEvision Development",
    period: "09/2023 – 03/2024",
    tasks: ["Java Feature development for PREEvision (Full-time)"]
  },
  {
    id: "exp-viridium",
    company: "Viridium Holding AG",
    role: "Working Student IT Operations",
    period: "09/2021 – 08/2023",
    tasks: ["2nd Level Incident Management via Ticketing Systems"]
  }
];

export const PROJECTS: Project[] = [
  {
    id: "proj-klima",
    title: "Neckarstadt KliMA",
    description: "Interactive data visualization of urban heat islands.",
    details: "Awarded the Sustainability Prize by Mannheim’s Dept. of Economic Development. Focused on making complex climate data accessible to citizens.",
    tech: ["Data Viz", "Sustainability", "React"],
    metrics: ["Award Winning"]
  },
  {
    id: "proj-redteam",
    title: "LLM Red-Teaming",
    description: "Indirect Prompt Injection in AI HR systems.",
    details: "Preprint: \"Trojan Horses in Recruiting: A Red-Teaming Case Study.\" Researching vulnerabilities in LLM-based recruitment tools (arXiv:2602.18514).",
    tech: ["Security", "LLMs", "Research"],
    link: "https://arxiv.org/abs/2602.18514"
  },
  {
    id: "proj-bikereg",
    title: "BikeReg",
    description: "Predicting Urban Bicycle Flow in Mannheim.",
    details: "Time-series forecasting of bicycle traffic to assist urban planning and infrastructure development.",
    tech: ["Python", "Forecasting", "Urban Planning"]
  },
  {
    id: "proj-thesis",
    title: "Bachelor Thesis",
    description: "DQN vs. DDQN in a custom Pygame racing environment.",
    details: "Thesis (Grade 1.0): \"A comparative study of DQN vs. DDQN in a custom Pygame racing environment to mitigate Q-value overestimation bias.\" Analyzed the effects of double estimation on Q-learning performance.",
    tech: ["Python", "RL", "Simulation"]
  },
  {
    id: "proj-ctf",
    title: "CTF: Capybara Flag",
    description: "Reverse Engineering capture the flag challenge.",
    details: "A capture the flag challenge developed for the Reverse Engineering module @ TH Mannheim. Designed to test exploitation and binary analysis skills.",
    tech: ["Security", "Exploitation", "Reverse Engineering"]
  }
];
