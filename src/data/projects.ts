export type Project = {
  id: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  year: string
  link?: string
  github?: string
}

export const projects: Project[] = [
  {
    id: 'vessel-monitoring',
    title: 'Government Vessel Monitoring',
    subtitle: 'Mission-critical maritime operations',
    description:
      'Recovered a previously stalled government monitoring platform and led a 5-member cross-functional team to successful production delivery within 30 business days — operational dashboards, real-time reporting, and monitoring workflows.',
    tags: ['React.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Enterprise'],
    year: '2024',
  },
  {
    id: 'hospital-waste',
    title: 'Hospital Waste Management',
    subtitle: 'Healthcare compliance platform',
    description:
      'Healthcare compliance platform supporting operational monitoring and waste management workflows for hospital environments — reporting and analytics for regulatory compliance and operational decision-making.',
    tags: ['React.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Healthcare'],
    year: '2024',
  },
  {
    id: 'no-code-builder',
    title: 'No-Code Website Builder',
    subtitle: 'U.S. SaaS platform',
    description:
      'Drag-and-drop website building for a U.S.-based SaaS platform — reusable component architecture and dynamic layout rendering enabling non-technical users to create websites without coding.',
    tags: ['React.js', 'Node.js', 'TypeScript', 'SaaS', 'CMS'],
    year: '2025',
  },
  {
    id: 'edwardsog',
    title: 'Edwardsog Learning Platform',
    subtitle: 'Dyslexia-focused education',
    description:
      'Designed and developed a drag-and-drop activity engine for a dyslexia-focused educational platform — enabling educators and parents to create interactive learning experiences independently.',
    tags: ['React.js', 'JavaScript', 'Education', 'No-Code'],
    year: '2022',
    link: 'https://playground.edwardsog.com',
  },
  {
    id: 'face-attendance',
    title: 'Face Recognition Attendance',
    subtitle: 'Enterprise workforce management',
    description:
      'Enterprise attendance and workforce management powered by facial recognition — authentication, attendance tracking, and access control workflows for enterprise clients.',
    tags: ['React.js', 'Node.js', 'TypeScript', 'Enterprise'],
    year: '2023',
  },
  {
    id: 'portfolio-3d',
    title: 'Interactive 3D Portfolio',
    subtitle: 'This website',
    description:
      'Immersive portfolio experience with Three.js — scroll-driven 3D workspace, neon tech stack panel, and React + TypeScript frontend with GSAP scroll animations.',
    tags: ['React', 'Three.js', 'TypeScript', 'GSAP', 'WebGL'],
    year: '2026',
    github: 'https://github.com/azputra/portfolio',
  },
]
