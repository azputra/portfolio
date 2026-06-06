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
    subtitle: 'Mission-critical operations platform',
    description:
      'Recovered a stalled project and led a 5-member cross-functional team to deliver a production-ready monitoring platform within 30 business days — operational dashboards, reporting, and monitoring workflows.',
    tags: ['React', 'Node.js', 'TypeScript', 'Highcharts', 'Enterprise'],
    year: '2024',
  },
  {
    id: 'hospital-waste',
    title: 'Hospital Waste Management',
    subtitle: 'Healthcare compliance platform',
    description:
      'Healthcare compliance platform supporting operational monitoring and waste management workflows, with reporting and analytics for regulatory compliance processes.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Healthcare', 'Dashboard'],
    year: '2024',
  },
  {
    id: 'no-code-builder',
    title: 'No-Code Website Builder',
    subtitle: 'U.S. SaaS platform',
    description:
      'Drag-and-drop website building for a U.S.-based SaaS platform — reusable component architecture and dynamic layout rendering for non-technical users.',
    tags: ['React', 'Node.js', 'TypeScript', 'SaaS', 'CMS'],
    year: '2025',
  },
  {
    id: 'edwardsog',
    title: 'Edwardsog Learning Platform',
    subtitle: 'Dyslexia-focused education',
    description:
      'Drag-and-drop activity engine for a dyslexia-focused educational platform — enabling educators and parents to create interactive learning experiences independently.',
    tags: ['React', 'Node.js', 'Education', 'No-Code'],
    year: '2022',
    link: 'https://playground.edwardsog.com',
  },
  {
    id: 'face-attendance',
    title: 'Face Recognition Attendance',
    subtitle: 'Workforce management system',
    description:
      'Enterprise attendance and workforce management powered by facial recognition — authentication, attendance tracking, and access control workflows.',
    tags: ['React', 'Node.js', 'Computer Vision', 'Enterprise'],
    year: '2023',
  },
  {
    id: 'portfolio-3d',
    title: 'Interactive 3D Portfolio',
    subtitle: 'This website',
    description:
      'Immersive portfolio experience with Three.js — scroll-driven 3D character, neon tech stack panel, and React + TypeScript frontend.',
    tags: ['React', 'Three.js', 'TypeScript', 'GSAP', 'WebGL'],
    year: '2026',
    github: 'https://github.com/azputra',
  },
]
