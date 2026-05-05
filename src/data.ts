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
  courses?: { name: string; grade: string }[];
  association?: string;
}

export interface Experience {
  id: string;
  company: string;
  nodeLabel: string;
  role: string;
  shortRole: string;
  period: string;
  tasks: string[];
}

export interface Contact {
  id: "contact";
  name: string;
  role: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  image?: string;
  skills: string[];
}

export const CONTACT_INFO: Contact = {
  id: "contact",
  name: "Manuel Wirth",
  role: "M.Sc. Data Science Student",
  location: "Mannheim, Germany",
  email: "manuelwirth.mail@gmail.com",
  linkedin: "https://www.linkedin.com/in/manuel-wirth-3a2a29264/",
  github: "https://github.com/WanuelMirth",
  image: "/visual/contact-card.jpg",
  skills: ["Machine Learning", "Deep Learning", "Software Engineering", "AI Security", "Data Visualization"]
};

export const EDUCATION: Education[] = [
  {
    id: "edu-msc",
    degree: "Data Science",
    nodeLabel: "M.Sc.",
    institution: "University of Mannheim",
    period: "Current",
    grade: "1.5",
    details: "Focus on Machine Learning and Deep Learning.",
    courses: [
      { name: "Machine Learning", grade: "1.3" },
      { name: "Responsible AI", grade: "1.3" },
      { name: "Deep Learning", grade: "tbd" }
    ],
    association: "Member of STADS (Student Association for Data Science and Statistics) Mannheim"
  },
  {
    id: "edu-bsc",
    degree: "Computer Science",
    nodeLabel: "B.Sc.",
    institution: "TH Mannheim",
    period: "Completed",
    grade: "1.3",
    details: "Thesis: \"A comparative study of DQN vs. DDQN in a custom Pygame racing environment to mitigate Q-value overestimation bias.\"",
    courses: [
      { name: "Software-Project: SAP BTP Software for sovanta AG (Winning Team)", grade: "1.0" },
      { name: "Computer Vision", grade: "1.0" },
      { name: "Graph Theory", grade: "1.0" },
      { name: "Cross Platform Development", grade: "1.3" }
    ]
  }
];

export const EXPERIENCE: Experience[] = [
  {
    id: "exp-sap",
    company: "SAP SE",
    nodeLabel: "SAP",
    role: "Working Student BTP Development",
    shortRole: "Working Student",
    period: "04/2024 – Present",
    tasks: [
      "Collaborated with a team of 5 interns to build SAP Demo Environment 2.0, a platform used by 20,000+ SAP Employees and Partners to showcase SAP solution demos; developing the front end with TypeScript/React and a Node.js REST API layer to organize and serve backend data.",
      "Architected a localization Proof of Concept for the SAP Demo Environment 2.0 to automate multilingual support for the platform; developing a custom Node.js service and Redis cache to integrate SAP Translation Hub via a pipeline that linearizes nested JSON for bulk processing and restores the original data structure post-translation."
    ]
  },
  {
    id: "exp-vector",
    company: "Vector Informatik",
    nodeLabel: "Vector",
    role: "Internship PREEvision Development",
    shortRole: "Full-Time Internship",
    period: "09/2023 – 03/2024",
    tasks: ["Engineered a custom parameterized testing engine using Java annotations and JUnit5 extensions; developing logic to automate test execution across ranges of AUTOSAR versions, significantly reducing code redundancy while maintaining unique test contexts per iteration.",
    "Integrated into a Scrum-based development team to evolve PREEvision, a vehicle engineering tool with a codebase exceeding 3 million lines of code; executing rigorous peer reviews via Fisheye and Crucible to resolve identified software issues; and successfully deploying new testing features to the release branch following a multi-stage merge process and automated validation via Jenkins."
    ]
  },
  {
    id: "exp-viridium",
    company: "Viridium Holding AG",
    nodeLabel: "Viridium",
    role: "Working Student IT Operations",
    shortRole: "Working Student",
    period: "09/2021 – 08/2023",
    tasks: ["Optimized IT service continuity by resolving and dispatching 1st and 2nd level incidents through a centralized ticketing system, supporting the operational infrastructure of a financial group managing 4 million insurance contracts.",
      "Administered enterprise-wide Active Directory permissions and security groups to ensure granular access control and data security within a high-stakes environment."
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    id: "proj-klima",
    title: "Neckarstadt KliMA",
    nodeLabel: "GITHUB",
    description: "Data visualization of urban heat islands.",
    details: "An interactive data visualization project focusing on urban heat islands and the cooling effects of greenery. It was designed to make complex climate data accessible to citizens. \n\nGrundlagen der Datenvisualisierung @ TH Mannheim.",
    tech: ["Sustainability", "TypeScript", "Data Viz", "React"],
    metrics: ["Awarded the Sustainability Prize by Mannheim's Dept. of Economic Development"],
    link: "https://github.com/WanuelMirth/neckarstadt-klima",
    image: "/visual/neckarstadt-klima.png"
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
    image: "/visual/bikereg.png",
    report: "/visual/bikereg-report.pdf",
    slides: "/visual/bikereg-presentation.pdf"
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
    pdf: "/visual/paper.pdf",
    image: "/visual/trojan-horse.png"
  },
  {
    id: "proj-thesis",
    title: "Bachelor Thesis",
    nodeLabel: "GITHUB",
    description: "DQN vs. DDQN in a custom game.",
    details: "Title: A comparative study of DQN vs. DDQN in a custom Pygame racing environment to mitigate Q-value overestimation bias. \n\nAnalyzed the effects of double estimation on Q-learning performance and developed a custom simulation environment.",
    tech: ["Python", "RL", "Simulation", "Pygame"],
    metrics: ["Grade: 1.0"],
    link: "https://github.com/WanuelMirth/bachelor-thesis",
    image: "/visual/thesis.png",
    pdf: "/visual/thesis.pdf"
  },
  {
    id: "proj-ctf",
    title: "Capybara Themed Flag",
    nodeLabel: "GITHUB",
    description: "Capture the flag challenge.",
    details: "A capture the flag challenge. Designed to test exploitation and binary analysis skills through a capybara-themed series of challenges.\n\nReverse Engineering @ TH Mannheim",
    tech: ["C", "Security", "Exploitation", "Reverse Engineering"],
    metrics: ["Grade: 1.0"],
    link: "https://github.com/WanuelMirth/ctf",
    image: "/visual/get-rotated-idiot.gif"
  }
];