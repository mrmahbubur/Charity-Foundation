/**
 * M R S Charity Foundation — Master Site Configuration
 * ---------------------------------------------------------------------------
 * Single source of truth for navigation routes, copy, pre-launch disclosures,
 * digital contact details, impact status metrics, planned programs,
 * transparency allocations (using Tailwind @theme CSS variables),
 * FAQs, and rotating sponsor links.
 *
 * ASSET PATH RULE:
 * Use ONLY relative paths (e.g. "./logo.png", "./images/hero-education.jpg")
 * so images load properly on both GitHub Pages (subpaths) and Render (root).
 */

export type NavTargetType = 'section' | 'page';
export type ConfigPageKey = 'home' | 'transparency' | 'donate' | 'privacy' | 'terms' | 'not-found';

export interface NavItemConfig {
  id: string;
  label: string;
  target: NavTargetType;
  sectionId?: string;
  page?: ConfigPageKey;
  activeOnPages?: ConfigPageKey[];
  highlight?: boolean;
}

export interface PageRouteMeta {
  id: ConfigPageKey;
  label: string;
  hash: string;
  paths: string[];
  titlePrefix: string;
}

export interface HowItWorksStepConfig {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface FundAllocationItem {
  id: string;
  label: string;
  percentage: number;
  color: string;
  description: string;
}

export interface ImpactMetricConfig {
  id: string;
  label: string;
  value: string;
  unitOrContext: string;
}

export interface ProgramItem {
  id: string;
  title: string;
  pillar: 'Healthcare' | 'Education' | 'Essential Necessities';
  image: string;
  alt: string;
  summary: string;
  scopeNote: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const SITE_CONFIG = {
  organization: {
    name: 'M R S Charity Foundation',
    shortName: 'M R S Foundation',
    projectOf: 'A Future Project of M R S',
    tagline: 'Poverty Ends With Us',
    secondaryTagline: 'Humanity United Against Poverty',
    heroHeadline: 'Poverty Ends With Us',
    heroMission:
      'A future humanitarian project of M R S currently collecting funds online for healthcare, education, and essential necessities through zero-cost sponsor giving.',
    heroFootnote:
      '100% free participation — powered by verified sponsor visits, never donor cash or cards.',
    logoPath: './logo.png',
    copyrightYear: '2026',
    phaseNotice:
      'Active Online Fund-Collection Phase — building community reserves online ahead of launching future physical ground programs.',
  },

  /**
   * PRIMARY HEADER NAVIGATION (Single source for Header & Mobile Drawer)
   */
  navigation: [
    { id: 'home', label: 'Home', target: 'section', sectionId: 'home' },
    { id: 'about', label: 'About Us', target: 'section', sectionId: 'about' },
    { id: 'our-work', label: 'Our Work', target: 'section', sectionId: 'our-work' },
    { id: 'impact', label: 'Impact', target: 'section', sectionId: 'impact' },
    {
      id: 'transparency',
      label: 'Transparency',
      target: 'section',
      sectionId: 'transparency',
      activeOnPages: ['transparency'],
    },
    { id: 'get-involved', label: 'Get Involved', target: 'section', sectionId: 'get-involved' },
    { id: 'contact', label: 'Contact', target: 'section', sectionId: 'contact' },
  ] as NavItemConfig[],

  /**
   * MOBILE DRAWER FEATURED PAGE SHORTCUT
   */
  mobileFeaturedAction: {
    id: 'transparency-report',
    label: 'View Transparency & Governance',
    target: 'page',
    page: 'transparency',
  } as NavItemConfig,

  /**
   * ADDITIONAL HOMEPAGE SECTION ANCHORS
   */
  sectionAnchors: ['how-it-works', 'faq'] as string[],

  /**
   * FOOTER QUICK LINKS (Single source for Footer navigation)
   */
  footerLinks: [
    { id: 'about', label: 'About Us', target: 'section', sectionId: 'about' },
    { id: 'our-work', label: 'Planned Programs', target: 'section', sectionId: 'our-work' },
    {
      id: 'transparency',
      label: 'Full Transparency Report',
      target: 'page',
      page: 'transparency',
      highlight: true,
    },
    { id: 'donate', label: 'How Free Giving Works', target: 'page', page: 'donate' },
    { id: 'faq', label: 'FAQ', target: 'section', sectionId: 'faq' },
    { id: 'contact', label: 'Contact', target: 'section', sectionId: 'contact' },
  ] as NavItemConfig[],

  /**
   * LEGAL NAVIGATION LINKS
   */
  legalLinks: [
    { id: 'privacy', label: 'Privacy Policy', target: 'page', page: 'privacy' },
    { id: 'terms', label: 'Terms of Use', target: 'page', page: 'terms' },
  ] as NavItemConfig[],

  /**
   * APPLICATION PAGE ROUTES & DOCUMENT TITLES
   */
  pageRoutes: {
    home: {
      id: 'home',
      label: 'Home',
      hash: '#home',
      paths: ['', 'index.html', 'home'],
      titlePrefix: 'Poverty Ends With Us',
    },
    transparency: {
      id: 'transparency',
      label: 'Transparency & Governance',
      hash: '#/transparency',
      paths: ['transparency'],
      titlePrefix: 'Transparency & Governance',
    },
    donate: {
      id: 'donate',
      label: 'How Free Giving Works',
      hash: '#/donate',
      paths: ['donate'],
      titlePrefix: 'How Free Giving Works',
    },
    privacy: {
      id: 'privacy',
      label: 'Privacy Policy',
      hash: '#/privacy-policy',
      paths: ['privacy-policy', 'privacy'],
      titlePrefix: 'Privacy Policy',
    },
    terms: {
      id: 'terms',
      label: 'Terms of Use',
      hash: '#/terms',
      paths: ['terms'],
      titlePrefix: 'Terms of Use',
    },
    'not-found': {
      id: 'not-found',
      label: 'Page Not Found',
      hash: '#/404',
      paths: ['404'],
      titlePrefix: 'Page Not Found',
    },
  } as Record<ConfigPageKey, PageRouteMeta>,

  /**
   * STATUS & REGISTRATION DISCLOSURE
   */
  registration: {
    registrationNumber: 'Pre-Registration (Online Collection Phase)',
    registeringAuthority: 'To be published upon formal field launch',
    registeredYear: 'Future Project · Mobilizing Online',
    entityStatus: 'Future Project of M R S · 100% Online Mobilization',
    note: 'M R S Charity Foundation is a future humanitarian project currently focused on collecting initial funds online. Keeping operations digital means zero physical office overhead right now; formal registration numbers and field locations will be posted here as ground operations launch.',
  },

  /**
   * CONTACT & DIGITAL PRESENCE
   */
  contact: {
    hasPhysicalAddress: false,
    addressLabel: 'Presence & Operations',
    address: '100% Online Operations — No physical office address at this stage',
    phone: 'Online correspondence only (no physical office helpline yet)',
    email: 'contact@mrscharity.org',
    operatingHours: 'Digital Giving Portal Active 24/7 Worldwide',
    inquiryTopics: [
      'General Inquiry',
      'Organizational Partnership',
      'Sponsor Collaboration',
      'Volunteer Coordination',
      'Transparency & Future Launch Question',
    ],
  },

  /**
   * SOCIAL LINKS
   * Add full https:// URLs when official pages go live. Empty URLs stay hidden.
   */
  socialLinks: [
    { id: 'facebook', label: 'Facebook', url: '' },
    { id: 'linkedin', label: 'LinkedIn', url: '' },
    { id: 'instagram', label: 'Instagram', url: '' },
    { id: 'youtube', label: 'YouTube', url: '' },
  ],

  /**
   * RELATIVE PHOTOGRAPHY PATHS ONLY (./images/...)
   */
  images: {
    hero: './images/hero-education.jpg',
    about: './images/education-reading.jpg',
    healthcare: './images/community-healthcare.jpg',
    education: './images/hero-education.jpg',
    essentialRelief: './images/essential-relief.jpg',
    cleanWater: './images/clean-water.jpg',
    livelihood: './images/vocational-livelihood.jpg',
    volunteers: './images/community-volunteers.jpg',
    scholarOne: './images/student-scholar-1.jpg',
    scholarTwo: './images/student-scholar-2.jpg',
  },

  /**
   * HOW IT WORKS (4-Step Giving Flow)
   */
  howItWorks: {
    eyebrow: 'How It Works',
    heading: 'How Zero-Cost Ad-Sponsored Giving Works',
    subheading:
      'A straightforward, transparent four-step cycle that converts everyday web visits into reserved humanitarian funding.',
    steps: [
      {
        id: 'click',
        number: '01',
        title: 'Click "Support Now"',
        description:
          'Choose any Support Now button across our portal. No account login, credit card, or personal payment is ever requested.',
      },
      {
        id: 'visit',
        number: '02',
        title: 'Visit Verified Sponsor Link',
        description:
          'A partner sponsor destination opens cleanly in a new browser tab. Rotating across verified partners keeps participation reliable.',
      },
      {
        id: 'sponsor',
        number: '03',
        title: 'Sponsor Covers the Cost',
        description:
          'Commercial sponsors compensate valid page visits. That revenue replaces direct cash donations from your own pocket.',
      },
      {
        id: 'allocate',
        number: '04',
        title: 'Allocated to Program Reserves',
        description:
          'Net proceeds are reserved toward rural learning supplies, basic health checkups, clean water, and essential relief.',
      },
    ] as HowItWorksStepConfig[],
  },

  /**
   * IMPACT & PRE-LAUNCH STATUS CARDS
   */
  impactSection: {
    disclaimer:
      'M R S Charity Foundation is currently in its online fund-collection phase ahead of future ground operations. Digital participation clicks below reflect real activity on this portal; audited field beneficiary reports will be added once physical programs open.',
    dailyClickGoalTarget: 500,
    metrics: [
      {
        id: 'project-phase',
        label: 'Current Project Stage',
        value: 'Phase 1',
        unitOrContext: 'Active online fund collection for future M R S launch',
      },
      {
        id: 'operations-footprint',
        label: 'Operations Footprint',
        value: '100% Online',
        unitOrContext: 'No physical office address or rent overhead yet',
      },
      {
        id: 'program-reserve-ratio',
        label: 'Target Program Allocation',
        value: '88% Direct Aid',
        unitOrContext: 'Planned reserve share for education, health & essentials',
      },
      {
        id: 'supporter-cost',
        label: 'Cost to Supporters',
        value: '$0 / Free',
        unitOrContext: 'Funded exclusively by voluntary sponsor link visits',
      },
    ] as ImpactMetricConfig[],
  },

  /**
   * FUND ALLOCATION & TRANSPARENCY (Uses @theme CSS variable tokens)
   */
  transparency: {
    allocationNote:
      'Planned allocation model for net sponsor proceeds collected during our active online fundraising phase toward M R S Charity Foundation’s upcoming community programs.',
    accountabilityStatement:
      'Because M R S Charity Foundation is a future project currently collecting funds online without a physical office, operating overhead stays minimal. We never request credit cards, bank transfers, or personal payments from visitors—all support comes strictly from voluntary visits to verified commercial sponsor partners.',
    allocations: [
      {
        id: 'direct-aid',
        label: 'Direct Program Reserve (Education, Healthcare & Relief Supplies)',
        percentage: 88,
        color: 'var(--color-primary)',
        description:
          'Earmarked for future classroom study kits, preventive medical outreach, safe water initiatives, and essential household relief.',
      },
      {
        id: 'field-logistics',
        label: 'Future Field Launch & Community Coordination',
        percentage: 8,
        color: 'var(--color-primary-muted)',
        description:
          'Reserved for initial local volunteer mobilization, supply transport, and setup when physical distribution begins.',
      },
      {
        id: 'stewardship',
        label: 'Digital Portal Hosting & Stewardship Reporting',
        percentage: 4,
        color: 'var(--color-accent)',
        description:
          'Core online infrastructure, sponsor link maintenance, and transparent reporting.',
      },
    ] as FundAllocationItem[],
  },

  /**
   * THREE CORE MISSION PILLARS
   */
  missionPillars: [
    {
      id: 'healthcare',
      title: 'Healthcare',
      description:
        'Preparing mobile primary checkups, basic preventive medicine kits, clean drinking water access, and hygiene awareness for underserved families.',
    },
    {
      id: 'education',
      title: 'Education',
      description:
        'Planning tuition relief, classroom notebooks, bilingual storybooks, and community reading rooms so financial hardship never interrupts learning.',
    },
    {
      id: 'essential-necessities',
      title: 'Essential Necessities',
      description:
        'Organizing future staple nutrition packs, clean water containers, and practical livelihood support to help vulnerable households maintain dignity.',
    },
  ],

  /**
   * OUR WORK / PLANNED PROGRAMS GRID
   */
  programs: [
    {
      id: 'prog-education',
      title: 'Rural Education & Study Kits',
      pillar: 'Education',
      image: './images/hero-education.jpg',
      alt: 'Children reading storybooks together at a rural wooden classroom table',
      summary:
        'Preparing community classroom supplies including exercise notebooks, readers, stationery, and tuition support for young learners.',
      scopeNote: 'Planned Focus: Primary Literacy',
    },
    {
      id: 'prog-healthcare',
      title: 'Primary Healthcare Outreach',
      pillar: 'Healthcare',
      image: './images/community-healthcare.jpg',
      alt: 'Healthcare workers conducting a daytime pediatric health checkup outdoors under a canopy',
      summary:
        'Mobilizing funds toward future preventive pediatric checkups, basic essential medicines, maternal nutrition guidance, and referral access.',
      scopeNote: 'Planned Focus: Preventive Care',
    },
    {
      id: 'prog-essentials',
      title: 'Food & Essential Relief Packs',
      pillar: 'Essential Necessities',
      image: './images/essential-relief.jpg',
      alt: 'Humanitarian relief volunteers distributing bags of grain, rice flour, and vegetables to community families',
      summary:
        'Assembling planned staple packs including grain, rice flour, legumes, and household hygiene essentials for families facing hardship.',
      scopeNote: 'Planned Focus: Food Security',
    },
    {
      id: 'prog-water',
      title: 'Safe Drinking Water Stations',
      pillar: 'Healthcare',
      image: './images/clean-water.jpg',
      alt: 'Children collecting clean water from a community village hand pump',
      summary:
        'Reserving sponsor proceeds for community deep-aquifer hand pumps and water filtration setups to protect daily community health.',
      scopeNote: 'Planned Focus: Safe Water',
    },
    {
      id: 'prog-livelihoods',
      title: 'Vocational Skills & Tailoring Support',
      pillar: 'Essential Necessities',
      image: './images/vocational-livelihood.jpg',
      alt: 'Women learning garment tailoring on sewing machines in a bright community workshop',
      summary:
        'Planning practical garment-making workshops and starter toolkits so household caregivers can earn steady, independent income.',
      scopeNote: 'Planned Focus: Self-Reliance',
    },
    {
      id: 'prog-emergency',
      title: 'Community Volunteer & Emergency Aid',
      pillar: 'Essential Necessities',
      image: './images/community-volunteers.jpg',
      alt: 'Community volunteers in vests handing an emergency clean water relief box to a local resident',
      summary:
        'Building a volunteer network prepared to deliver rapid clean water kits and essential nutrition rations when seasonal floods occur.',
      scopeNote: 'Planned Focus: Rapid Response',
    },
  ] as ProgramItem[],

  /**
   * GET INVOLVED VOLUNTEER FOCUS AREAS
   */
  getInvolved: {
    volunteerFocusAreas: [
      'Education & Reading Support',
      'Primary Healthcare Outreach',
      'Essential Food & Water Distribution',
      'Community Awareness & Digital Advocacy',
    ],
  },

  /**
   * FAQ ITEMS (7 Clear, Honest Questions)
   */
  faqs: [
    {
      id: 'faq-1',
      question: 'What stage is M R S Charity Foundation currently in?',
      answer:
        'M R S Charity Foundation is a future project of M R S currently operating 100% online in its initial fund-collection phase. Every visit helps build the core reserve required before opening physical community operations.',
    },
    {
      id: 'faq-2',
      question: 'Does the foundation have a physical office address right now?',
      answer:
        'No. Because we are currently in our online fund-collection phase ahead of our formal launch, the foundation has no physical office address yet. Operating digitally avoids office rent overhead so collected funds stay dedicated to future community programs.',
    },
    {
      id: 'faq-3',
      question: 'How does supporting M R S Charity Foundation work without spending money?',
      answer:
        'When you click any "Support Now" button on our website, a verified commercial sponsor page opens in a new browser tab. Commercial sponsors compensate publisher visits, and we accumulate those proceeds into our program reserves at zero cost to you.',
    },
    {
      id: 'faq-4',
      question: 'Is this completely free? Do I ever need a credit card or bank account?',
      answer:
        'Yes, it is 100% free. This portal never requests credit cards, debit cards, mobile wallet PINs, or cash transfers from general visitors. Participation requires only a single voluntary click.',
    },
    {
      id: 'faq-5',
      question: 'Can I click more than once to contribute additional support?',
      answer:
        'Yes. Our portal rotates sequentially across 10 verified sponsor destinations so each natural click opens a fresh partner page and builds additional reserves. Automated bots or click scripts are strictly prohibited.',
    },
    {
      id: 'faq-6',
      question: 'How will collected funds be used once operations launch?',
      answer:
        'Our planned allocation earmarks 88% toward direct healthcare, education, clean water, and essential relief programs, 8% for field launch and community coordination, and 4% for digital platform upkeep and reporting.',
    },
    {
      id: 'faq-7',
      question: 'How can partners or future volunteers stay connected?',
      answer:
        'You can register your interest through the Volunteer Network form in the Get Involved section or write to us directly through the Contact section below. We welcome collaboration ahead of our upcoming ground rollout.',
    },
  ] as FaqItem[],

  /**
   * VERIFIED SPONSOR LINK POOL
   * Preserved sequential uplcm.com sponsor destinations.
   */
  sponsorLinks: [
    'https://uplcm.com/4/12250130',
    'https://uplcm.com/4/12250135',
    'https://uplcm.com/4/12250137',
    'https://uplcm.com/4/10016819',
    'https://uplcm.com/4/12250134',
    'https://uplcm.com/4/12250132',
    'https://uplcm.com/4/12250138',
    'https://uplcm.com/4/12250129',
    'https://uplcm.com/4/12250133',
    'https://uplcm.com/4/12250136',
  ],
};
