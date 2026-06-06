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
    'Delivering SaaS products, enterprise applications & mission-critical systems for global teams.',
  email: 'ahmadzp102@gmail.com',
  phone: '+62 813 8206 2349',
  bio: `Senior Full Stack Engineer with ${yearsLabel} years of experience delivering SaaS products, enterprise applications, and mission-critical systems across healthcare, education, logistics, industrial, and public sectors — since March ${CAREER_START.year}.

Experienced in leading cross-functional teams, recovering delayed projects, and delivering scalable software from planning through production. Strong in React.js, Node.js, TypeScript, API development, system architecture, and remote collaboration across Australia, the United States, Vietnam, and Indonesia.`,
  location: 'Indonesia · Remote',
  focus: 'SaaS · Enterprise · Technical Leadership',
  availability: 'Open for remote & international roles',
  socials: [
    { label: 'LinkedIn', url: 'https://linkedin.com/in/azputra' },
    { label: 'GitHub', url: 'https://github.com/azputra' },
    { label: 'Medium', url: 'https://medium.com/@azputra' },
    { label: 'YouTube', url: 'https://www.youtube.com/@azputra3658' },
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
      school: 'Hacktiv8',
      degree: 'Full Stack JavaScript Program',
      field: '',
    },
  ],
  skills: [
    'React',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'Express',
    'REST API',
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'HTML5',
    'CSS3',
    'Highcharts',
    'Google Maps',
    'Git',
    'Jira',
    'Agile',
    'SaaS',
    'CMS',
    'Three.js',
    'Cursor AI',
    'Claude',
  ],
  stats: [
    { value: yearsLabel, label: 'Years experience' },
    { value: '4', label: 'Countries served' },
    { value: '6+', label: 'Companies & clients' },
    { value: '100%', label: 'Remote-ready' },
  ],
  highlights: [
    'Led a 5-member team to recover and deliver a stalled monitoring platform within 30 business days',
    'Healthcare compliance platforms, hospital waste management & operational monitoring workflows',
    'Drag-and-drop no-code builder & dyslexia-focused educational activity engine (Edwardsog)',
    'Facial recognition attendance systems & enterprise apps across healthcare, logistics & public sector',
  ],
  services: [
    {
      title: 'SaaS & Enterprise Applications',
      desc: 'Scalable dashboards, CMS platforms, warehouse systems, and production-grade web applications.',
    },
    {
      title: 'Technical Leadership',
      desc: 'Cross-functional team leadership, project recovery, architecture decisions, and delivery planning.',
    },
    {
      title: 'Full Stack Engineering',
      desc: 'End-to-end features — React.js frontends, Node.js APIs, PostgreSQL/MySQL/MongoDB, and integrations.',
    },
    {
      title: 'System Architecture',
      desc: 'API design, performance optimization, reusable component systems, and remote team collaboration.',
    },
  ],
  experience: [
    {
      period: 'May 2025 — Present',
      role: 'Senior Frontend Engineer',
      company: 'Functional Logix Pty Ltd',
      location: 'Remote · Australia',
      summary:
        'Enterprise software for the mining industry with React.js and TypeScript — scalable frontend architecture and reusable component systems.',
    },
    {
      period: 'Oct 2024 — Present',
      role: 'Full Stack Engineer',
      company: 'Kandara Digital Kreatif',
      location: 'Remote · Indonesia',
      summary:
        'Enterprise applications with large-scale operational workflows — end-to-end React.js and Node.js features, technical planning, and production improvements.',
    },
    {
      period: '2023 — Present',
      role: 'Independent Technical Consultant',
      company: 'Global Remote Clients',
      location: 'Remote · International',
      summary:
        'Lead software projects across healthcare, education, enterprise, and public-sector domains — requirements through deployment and post-launch support.',
    },
    {
      period: 'Oct 2023 — Jan 2026',
      role: 'Full Stack Engineer',
      company: 'Confidential U.S. Client',
      location: 'Remote · United States',
      summary:
        'No-code website builder with drag-and-drop creation, warehouse management modules, reusable frontend architecture, and third-party integrations.',
    },
    {
      period: 'Sep 2023 — Feb 2024',
      role: 'Frontend Engineer',
      company: 'Wise Accelerate',
      location: 'Remote · Vietnam',
      summary:
        'Digital recruitment platform — responsive UI, reusable components, API integration, and frontend performance optimization.',
    },
    {
      period: 'Mar 2020 — Jul 2023',
      role: 'Full Stack Engineer',
      company: 'Immobi Solusi Prima',
      location: 'Jakarta, Indonesia',
      summary:
        'Enterprise web applications with React & Node.js — RESTful APIs, Highcharts dashboards, Google Maps, CMS systems, and Agile delivery.',
    },
  ],
}
