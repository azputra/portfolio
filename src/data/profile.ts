/** First career: Immobi Solusi Prima, March 2020 */
export const CAREER_START = { year: 2020, month: 2 }

export function getYearsOfExperience(now = new Date()) {
  let years = now.getFullYear() - CAREER_START.year
  if (now.getMonth() < CAREER_START.month) years -= 1
  return Math.max(0, years)
}

export function getYearsExperienceLabel(now = new Date()) {
  return `${getYearsOfExperience(now)}+`
}

const yearsLabel = getYearsExperienceLabel()

export const profile = {
  name: 'Ahmad Zuliansyah Putra',
  role: 'Senior Full Stack Engineer',
  roleDetail: 'Technical Lead · React.js · Node.js · TypeScript',
  tagline:
    'Enterprise SaaS, mission-critical systems & scalable full-stack products for distributed global teams.',
  email: 'ahmadzp102@gmail.com',
  phone: '+62 813 8206 2349',
  bio: `Senior Full Stack Engineer with 5+ years of experience delivering SaaS products, enterprise applications, and mission-critical systems across healthcare, education, logistics, industrial, mining, and public sectors.

I specialize in React.js, Next.js, Node.js, and TypeScript — from system architecture and API design through production deployment. I have led cross-functional teams, recovered delayed projects, and delivered scalable software for clients across Australia, the United States, Vietnam, and Indonesia.`,
  location: 'Indonesia · Remote',
  focus: 'Healthcare · Mining · Public Sector · Enterprise SaaS',
  availability: 'Open to Senior / Staff Engineer & Technical Lead roles · Remote APAC',
  socials: [
    { label: 'LinkedIn', url: 'https://linkedin.com/in/azputra' },
    { label: 'GitHub', url: 'https://github.com/azputra' },
    { label: 'Medium', url: 'https://medium.com/@azputra' },
    { label: 'YouTube', url: 'https://www.youtube.com/@azputra3658' },
    { label: 'Cursor', url: 'https://cursor.com/referral?code=Y19PCLX43QLI' },
  ],
  languages: [
    { name: 'Indonesian', level: 'Native' },
    { name: 'English', level: 'Professional' },
  ],
  education: [
    {
      school: 'Universitas Indraprasta PGRI',
      degree: 'Bachelor of Engineering',
      field: 'Computer Engineering & Telecommunications',
    },
    {
      school: 'Hacktiv8 Indonesia',
      degree: 'Full Stack JavaScript Immersive Program',
      field: 'Certificate',
    },
  ],
  skills: [
    'React.js',
    'TypeScript',
    'JavaScript',
    'Next.js',
    'Node.js',
    'Express.js',
    'Vite',
    'React Router',
    'Redux Toolkit',
    'TanStack Query',
    'React Hook Form',
    'Tailwind CSS',
    'SCSS',
    'Ant Design',
    'Radix UI',
    'GSAP',
    'Lenis',
    'Three.js',
    'React Three Fiber',
    'Konva',
    'Recharts',
    'Highcharts',
    'Electron',
    'PWA',
    'Sequelize',
    'Socket.io',
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'JWT',
    'Zod',
    'Swagger',
    'REST APIs',
    'Axios',
    'Stripe',
    'Google Maps API',
    'AWS SDK',
    'Nodemailer',
    'Docker',
    'Webpack',
    'Git',
    'HTML5',
    'CSS3',
  ],
  stats: [
    { value: yearsLabel, label: 'Years experience' },
    { value: '4', label: 'Countries served' },
    { value: '30', label: 'Days — project recovery' },
    { value: '100%', label: 'Remote-ready' },
  ],
  highlights: [
    'Led a 5-person cross-functional team to recover and deliver a stalled government monitoring platform within 30 business days',
    'Built healthcare compliance platforms supporting hospital operational monitoring and waste management workflows',
    'Designed drag-and-drop content engines enabling non-technical users to create interactive educational experiences',
    'Delivered facial recognition-based workforce management and attendance systems for enterprise clients',
    'Developed no-code website builder and warehouse management modules for a U.S.-based SaaS platform',
  ],
  services: [
    {
      title: 'SaaS & Enterprise Applications',
      desc: 'Scalable dashboards, CMS platforms, warehouse systems, and production-grade web applications for mission-critical operations.',
    },
    {
      title: 'Technical Leadership',
      desc: 'Cross-functional team leadership, project recovery, architecture decisions, scope estimation, and delivery planning.',
    },
    {
      title: 'Full Stack Engineering',
      desc: 'End-to-end features — React.js / Next.js frontends, Node.js APIs, PostgreSQL / MongoDB, and third-party integrations.',
    },
    {
      title: 'System Architecture',
      desc: 'API design, performance optimization, reusable component systems, and remote team collaboration across APAC.',
    },
  ],
  experience: [
    {
      period: 'May 2025 — Present',
      role: 'Senior Frontend Engineer',
      company: 'Functional Logix Pty Ltd',
      location: 'Remote · Australia',
      summary:
        'Enterprise-grade software for the mining industry using React.js and TypeScript — scalable frontend architecture, reusable component systems, and production-ready delivery with distributed teams.',
    },
    {
      period: 'Oct 2024 — Present',
      role: 'Full Stack Engineer',
      company: 'Kandara Digital Kreatif',
      location: 'Remote · Indonesia',
      summary:
        'Enterprise applications with large-scale operational workflows — end-to-end React.js and Node.js features, technical planning, solution design, and production improvements.',
    },
    {
      period: 'Jan 2023 — Present',
      role: 'Independent Technical Consultant',
      company: 'Global Remote Clients',
      location: 'Remote · International',
      summary:
        'Lead software projects across healthcare, education, enterprise, and public-sector domains — requirements through deployment, post-launch support, and distributed stakeholder coordination.',
    },
    {
      period: 'Oct 2023 — Jan 2026',
      role: 'Full Stack Engineer',
      company: 'Confidential U.S. Client',
      location: 'Remote · United States',
      summary:
        'No-code website builder with drag-and-drop page creation, warehouse management modules, reusable frontend architecture, backend services, and third-party integrations for a U.S. SaaS platform.',
    },
    {
      period: 'Sep 2023 — Feb 2024',
      role: 'Frontend Engineer',
      company: 'Wise Accelerate',
      location: 'Remote · Vietnam',
      summary:
        'Digital recruitment platform — reusable UI components, responsive experiences, REST API integration, and frontend performance optimization with a distributed remote team.',
    },
    {
      period: 'Mar 2020 — Jul 2023',
      role: 'Full Stack Engineer',
      company: 'Immobi Solusi Prima',
      location: 'Jakarta, Indonesia',
      summary:
        'Enterprise web applications from concept to production — RESTful APIs, Highcharts dashboards, Google Maps integrations, CMS systems, and Agile/Scrum delivery.',
    },
  ],
}
