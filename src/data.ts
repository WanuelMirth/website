export interface Project {
  id: string;
  title: string;
  displayTitle?: string; // Title shown next to the node in overview
  nodeLabel: string;
  description: string;
  details: string;
  metrics?: string[];
  link?: string;
  tech: string[];
  image?: string;
  images?: string[];
  pdf?: string;
  report?: string;
  slides?: string;
}

export interface Education {
  id: string;
  degree: string;
  nodeLabel: string;
  institution: string;
  period: string;
  grade: string;
  details: string;
}

export interface Experience {
  id: string;
  company: string;
  nodeLabel: string;
  role: string;
  period: string;
  tasks: string[];
}

export const EDUCATION: Education[] = [
  {
    id: "edu-msc",
    degree: "Data Science",
    nodeLabel: "M.Sc.",
    institution: "University of Mannheim",
    period: "Current",
    grade: "1.5",
    details: "Focus on Machine Learning and Deep Learning."
  },
  {
    id: "edu-bsc",
    degree: "Computer Science",
    nodeLabel: "B.Sc.",
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
    nodeLabel: "SAP",
    role: "Working Student BTP Development",
    period: "04/2024 – Present",
    tasks: ["React/JS Frontend development", "Backend integration"]
  },
  {
    id: "exp-vector",
    company: "Vector Informatik",
    nodeLabel: "Vector",
    role: "Internship PREEvision Development",
    period: "09/2023 – 03/2024",
    tasks: ["Java Feature development for PREEvision (Full-time)"]
  },
  {
    id: "exp-viridium",
    company: "Viridium Holding AG",
    nodeLabel: "Viridium",
    role: "Working Student IT Operations",
    period: "09/2021 – 08/2023",
    tasks: ["2nd Level Incident Management via Ticketing Systems"]
  }
];

export const PROJECTS: Project[] = [
  {
    id: "proj-klima",
    title: "Neckarstadt KliMA",
    nodeLabel: "GITHUB",
    description: "Interactive data visualization of urban heat islands.",
    details: "An interactive data visualization project focusing on urban heat islands and the cooling effects of greenery. It was designed to make complex climate data accessible to citizens. \n\nGrundlagen der Datenvisualisierung @ TH Mannheim.",
    tech: ["Sustainability", "TypeScript", "Data Viz", "React"],
    metrics: ["Awarded the Sustainability Prize by Mannheim's Dept. of Economic Development"],
    link: "https://github.com/WanuelMirth/neckarstadt-klima",
    image: "/src/visual/key-visual.png"
  },
  {
    id: "proj-redteam",
    title: "Trojan Horses in Recruiting: A Red-Teaming Case Study on Indirect Prompt Injection in Standard vs. Reasoning Models",
    displayTitle: "Trojan Horses in Recruiting",
    nodeLabel: "PAPER",
    description: "arXiv paper on Indirect Prompt Injection.",
    details: "This research investigates the security implications of Indirect Prompt Injection (IPI) within automated HR pipelines. By comparing standard instruction-tuned models with reasoning-enhanced models (Qwen 3 30B), the study uncovers a critical trade-off: while Reasoning Models are more effective at rationalizing adversarial commands through 'unfaithful reasoning,' they exhibit a unique failure mode termed 'Meta-Cognitive Leakage'.\n\nKey Discovery: Meta-Cognitive Leakage occurs when the intense cognitive load of processing complex, illogical adversarial instructions causes the model's internal instruction logic to 'bleed' into the final output (e.g., explicitly stating that a weakness was 'reframed as' a strength). This makes high-capability models paradoxically more detectable by humans in complex attack scenarios compared to standard models which resort to brittle hallucinations.",
    tech: ["AI Security", "Failure Mode", "Red-Teaming", "LLMs", "Reasoning Models"],
    metrics: ["New Failure Mode Identified", "Preprint available on arXiv"],
    link: "https://arxiv.org/abs/2602.18514",
    pdf: "/src/visual/2602.18514v1.pdf",
    image: "/src/visual/trojan-horse.png"
  },
  {
    id: "proj-bikereg",
    title: "BikeReg",
    nodeLabel: "GITHUB",
    description: "Predicting Urban Bicycle Flow in Mannheim.",
    details: "Evaluation of point forecasting models for 1-hour bicycle traffic on Mannheim's Kurpfalzbrücke. Comparison of baseline methods with gradient boosting (CatBoost) using Rolling-Origin cross-validation to respect temporal causality.\n\nFindings: CatBoost achieved a MAE of 24.22 (R²=0.96), reducing error by ~53% compared to a naive baseline. Project focus was on feature engineering with local weather and calendar data.\n\nData Mining @ Uni Mannheim. Team project.",
    tech: ["Sustainability", "Python", "CatBoost", "Forecasting", "Rolling-Origin CV"],
    metrics: ["MAE: 24.22", "R²: 0.96", "Error reduction: 53%"],
    link: "https://github.com/WanuelMirth/bike-reg-mannheim",
    image: "/src/visual/bikereg.png",
    report: "/src/visual/Projektreport_BikeReg.pdf",
    slides: "/src/visual/Abschlusspräsentation_BikeReg.pdf"
  },
  {
    id: "proj-thesis",
    title: "Bachelor Thesis",
    nodeLabel: "GITHUB",
    description: "DQN vs. DDQN in a custom Pygame racing environment.",
    details: "Title: A comparative study of DQN vs. DDQN in a custom Pygame racing environment to mitigate Q-value overestimation bias. \n\nAnalyzed the effects of double estimation on Q-learning performance and developed a custom simulation environment.",
    tech: ["Python", "RL", "Simulation", "Pygame"],
    metrics: ["Grade: 1.0"],
    link: "https://github.com/WanuelMirth/bachelor-thesis",
    image: "/src/visual/thesis.png",
    pdf: "/src/visual/thesis_manuel_wirth.pdf"
  },
  {
    id: "proj-ctf",
    title: "CTF: Capybara Themed Flag",
    nodeLabel: "GITHUB",
    description: "Reverse Engineering capture the flag challenge.",
    details: "A capture the flag challenge. Designed to test exploitation and binary analysis skills through a capybara-themed series of challenges.\n\nReverse Engineering @ TH Mannheim",
    tech: ["C", "Security", "Exploitation", "Reverse Engineering"],
    metrics: ["Grade: 1.0"],
    link: "https://github.com/WanuelMirth/ctf",
    image: "/src/visual/get-rotated-idiot.gif"
  }
];