import { ChildProfile, Campaign, ImpactStory, AuditItem, BlogPost } from '../types';
import heroEducationImg from '../assets/images/hero_education_aid_1792141324122.jpg';
import childScholarImg from '../assets/images/child_scholar_portrait_1792141324614.jpg';
import foodReliefImg from '../assets/images/food_relief_pack_1792141324322.jpg';
import cleanWaterImg from '../assets/images/clean_water_pump_1792141325779.jpg';
import womenSewingImg from '../assets/images/women_vocational_sewing_1792141326227.jpg';

export const SITE_LOGO = './logo.png';
export const HERO_IMAGE = heroEducationImg;
export const CHILD_PORTRAIT_IMAGE = childScholarImg;
export const FOOD_RELIEF_IMAGE = foodReliefImg;
export const CLEAN_WATER_IMAGE = cleanWaterImg;
export const WOMEN_EMPOWERMENT_IMAGE = womenSewingImg;
export const VOLUNTEER_RELIEF_IMAGE = foodReliefImg;

export const FOUNDATION_INFO = {
  name: 'M R S Charity Foundation',
  shortName: 'M R S Foundation',
  logo: SITE_LOGO,
  parentOrg: 'A Future Project of M R S',
  motto: 'Poverty Ends With Us',
  secondaryMotto: 'Humanity United Against Poverty',
  mission: 'Delivering life-changing projects to support vulnerable communities: providing child support, food relief, clean water access, free education, vocational empowerment, and emergency disaster relief.',
  coreGoals: [
    {
      goal: 'Child Support & Education',
      detail: 'Sponsorship programs, free learning kits, and community learning hubs giving children a brighter tomorrow.',
      image: HERO_IMAGE,
    },
    {
      goal: 'Food Relief & Hunger Alleviation',
      detail: 'Distributing vital food packs and daily nutritious meals to families facing poverty.',
      image: FOOD_RELIEF_IMAGE,
    },
    {
      goal: 'Clean Water Access',
      detail: 'Installing deep water wells, hand pumps, and filtration plants to supply pure drinking water.',
      image: CLEAN_WATER_IMAGE,
    },
    {
      goal: 'Livelihood & Economic Empowerment',
      detail: 'Grants for sewing machines and vocational tools promoting sustainable household independence.',
      image: WOMEN_EMPOWERMENT_IMAGE,
    },
    {
      goal: 'Emergency Disaster Relief & Shelter',
      detail: 'Providing emergency food rations, winter thermal blankets, and shelter assistance to rebuild with dignity.',
      image: FOOD_RELIEF_IMAGE,
    },
    {
      goal: 'Humanity First & Life Restoring',
      detail: 'Serving the most vulnerable with compassion, united against poverty.',
      image: CHILD_PORTRAIT_IMAGE,
    }
  ]
};

export const IMPACT_METRICS = [
  { label: 'Children Educated Daily', value: '4,850+', detail: 'Community classroom centers' },
  { label: 'Youth Volunteers Active', value: '16,200+', detail: 'Grassroots action chapters' },
  { label: 'Families Assisted with Necessities', value: '85,000+', detail: 'Healthcare, food & shelter support' },
  { label: 'Clean Water & Hygiene Stations', value: '340+', detail: 'Pure safe drinking water access' },
];

export const CHILDREN_PROFILES: ChildProfile[] = [
  {
    id: 'ch-01',
    name: 'Student Scholar #101',
    age: 8,
    gender: 'Female',
    grade: 'Grade 3',
    district: 'Gaibandha Chapter',
    schoolName: 'M R S Community Learning Center',
    dream: 'Medical Doctor',
    story: 'Attends our free daily community learning center. With access to textbooks and regular midday nutrition, she aspires to serve her community in healthcare.',
    monthlyAmountBDT: 0,
    monthlyAmountUSD: 0,
    image: CHILD_PORTRAIT_IMAGE,
    urgent: true,
    hobbies: ['Drawing', 'Reading folk literature', 'Nature study'],
    favoriteSubject: 'General Science',
    joinedDate: 'Community Member',
  },
  {
    id: 'ch-02',
    name: 'Student Scholar #102',
    age: 9,
    gender: 'Male',
    grade: 'Grade 4',
    district: 'Bandarban Chapter',
    schoolName: 'M R S Hill Community Primary Center',
    dream: 'Computer Engineer',
    story: 'Learning digital skills and language literacy in our rural center. Free access to books and nutrition enables his daily school attendance without barrier.',
    monthlyAmountBDT: 0,
    monthlyAmountUSD: 0,
    image: HERO_IMAGE,
    urgent: false,
    hobbies: ['Football', 'Logic puzzles', 'Singing'],
    favoriteSubject: 'Computing & Science',
    joinedDate: 'Community Member',
  },
  {
    id: 'ch-03',
    name: 'Student Scholar #103',
    age: 7,
    gender: 'Female',
    grade: 'Grade 2',
    district: 'Sunamganj Chapter',
    schoolName: 'M R S Haor Learning Center',
    dream: 'School Teacher',
    story: 'Receives free schooling, stationery, and nutritional support in flood-prone wetlands, allowing her to stay in school consistently throughout the year.',
    monthlyAmountBDT: 0,
    monthlyAmountUSD: 0,
    image: CHILD_PORTRAIT_IMAGE,
    urgent: true,
    hobbies: ['Poetry', 'Handicrafts'],
    favoriteSubject: 'Literature & Language',
    joinedDate: 'Community Member',
  },
  {
    id: 'ch-04',
    name: 'Student Scholar #104',
    age: 10,
    gender: 'Male',
    grade: 'Grade 5',
    district: 'Kurigram Chapter',
    schoolName: 'M R S Rural Learning Center',
    dream: 'Civil Engineer',
    story: 'Enrolled in our comprehensive youth education program with full access to curriculum materials, clean water, and regular health checkups.',
    monthlyAmountBDT: 0,
    monthlyAmountUSD: 0,
    image: HERO_IMAGE,
    urgent: false,
    hobbies: ['Clay modeling', 'Cricket'],
    favoriteSubject: 'Mathematics',
    joinedDate: 'Community Member',
  },
  {
    id: 'ch-05',
    name: 'Student Scholar #105',
    age: 6,
    gender: 'Female',
    grade: 'Pre-Primary',
    district: 'Khulna Chapter',
    schoolName: 'M R S Coastal Children Center',
    dream: 'Environmental Scientist',
    story: 'Participates in early childhood education, foundational literacy, and daily nutritious meals in our coastal community learning hub.',
    monthlyAmountBDT: 0,
    monthlyAmountUSD: 0,
    image: CHILD_PORTRAIT_IMAGE,
    urgent: true,
    hobbies: ['Coloring', 'Rhymes', 'Gardening'],
    favoriteSubject: 'Art & Phonics',
    joinedDate: 'Community Member',
  },
  {
    id: 'ch-06',
    name: 'Student Scholar #106',
    age: 11,
    gender: 'Male',
    grade: 'Grade 6',
    district: 'Sylhet Chapter',
    schoolName: 'M R S Community Secondary Center',
    dream: 'Journalist & Writer',
    story: 'Talented student writer benefiting from our youth mentoring library and free academic support, ensuring smooth transition to higher secondary education.',
    monthlyAmountBDT: 0,
    monthlyAmountUSD: 0,
    image: HERO_IMAGE,
    urgent: false,
    hobbies: ['Debating', 'Story writing', 'Badminton'],
    favoriteSubject: 'Social Studies & History',
    joinedDate: 'Community Member',
  }
];

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-01',
    title: 'Free Child Education & School Classrooms',
    subtitle: 'Providing underprivileged children with free tuition, learning materials, and daily hot midday meals.',
    category: 'Education',
    targetAmountBDT: 100000,
    raisedAmountBDT: 85000,
    donorsCount: 412,
    image: HERO_IMAGE,
    summary: 'Offering free schooling to children living in poverty. Modeled after successful grassroots educational centers, every child receives books and nutrition.',
    impactMetrics: '14 Learning Hubs · 4,850+ Students'
  },
  {
    id: 'camp-02',
    title: 'Essential Necessities & Emergency Relief',
    subtitle: 'Distribution of seasonal winter clothing, water purification, and emergency food relief packages.',
    category: 'Disaster Relief',
    targetAmountBDT: 80000,
    raisedAmountBDT: 68000,
    donorsCount: 680,
    image: FOOD_RELIEF_IMAGE,
    summary: 'Rapid response distribution of food staples, blankets, and essential necessities directly to families suffering from extreme poverty and climate challenges.',
    impactMetrics: '18,000+ Family relief packages'
  },
  {
    id: 'camp-03',
    title: 'Vocational Skills & Dignified Livelihoods',
    subtitle: 'Free community tailoring, sewing machine grants, and micro-skills workshops for rural households.',
    category: 'Women Empowerment',
    targetAmountBDT: 70000,
    raisedAmountBDT: 59000,
    donorsCount: 295,
    image: WOMEN_EMPOWERMENT_IMAGE,
    summary: 'Equipping impoverished mothers and youth with income-generating craft skills and tools to achieve long-term economic independence.',
    impactMetrics: '650+ Individuals trained'
  },
  {
    id: 'camp-04',
    title: 'Clean Healthcare, Water Wells & Hygiene',
    subtitle: 'Deep community tube wells, clean water access, and mobile health camps.',
    category: 'Clean Water',
    targetAmountBDT: 50000,
    raisedAmountBDT: 42000,
    donorsCount: 188,
    image: CLEAN_WATER_IMAGE,
    summary: 'Ensuring safe drinking water and foundational health checkups for remote communities, reducing preventable waterborne diseases.',
    impactMetrics: '340+ Clean Water Wells'
  }
];

export const IMPACT_STORIES: ImpactStory[] = [
  {
    id: 'story-01',
    title: 'Transforming Lives Through Free Daily Education',
    personName: 'Community Graduate Scholar',
    role: 'Former M R S Student, Now University Scholar',
    location: 'Northeastern Regional Chapter',
    summary: 'Access to free daily classes and textbooks opened pathways to higher engineering studies.',
    fullQuote: 'Having access to free books, meals, and teachers who cared changed my entire perspective. Today I can study at the university level and mentor the younger students in our local community center.',
    achievement: 'Earned full scholarship for undergraduate studies',
    image: HERO_IMAGE,
    program: 'Education Pillar'
  },
  {
    id: 'story-02',
    title: 'Achieving Economic Self-Sufficiency Through Skills',
    personName: 'Vocational Workshop Artisan',
    role: 'Workshop Graduate & Independent Artisan',
    location: 'Northern Rural Hub',
    summary: 'Practical tailoring training transformed a vulnerable household into an economically sustainable home.',
    fullQuote: 'The tailoring training gave me dignity and dependable daily income. I am able to feed my family and support all my children in school without asking anyone for charity.',
    achievement: 'Operates independent tailoring workshop',
    image: WOMEN_EMPOWERMENT_IMAGE,
    program: 'Livelihood & Skills Hub'
  },
  {
    id: 'story-03',
    title: 'Rapid Mobilization for Emergency Relief',
    personName: 'Youth Volunteer Chapter Member',
    role: 'Grassroots Volunteer Team',
    location: 'Disaster Relief Chapter',
    summary: 'Young volunteers mobilizing food baskets and clean drinking water to flood-affected communities.',
    fullQuote: 'Humanity united against poverty means standing together when disaster strikes. Every relief package handed over brings genuine hope to families in need.',
    achievement: 'Delivered food and clean water to over 450 households',
    image: VOLUNTEER_RELIEF_IMAGE,
    program: 'Volunteer Relief Network'
  }
];

export const FINANCIAL_AUDIT: AuditItem[] = [
  {
    category: 'Direct Educational & Food Relief Support',
    percentage: 88.5,
    amountBDT: 'Sponsored via Ad Clicks',
    amountUSD: '100% Free to Donors',
    color: '#059669', // Emerald
    detail: 'Learning materials, student midday meals, relief packets, and community safe water installation.'
  },
  {
    category: 'Field Coordination & Relief Delivery',
    percentage: 7.5,
    amountBDT: 'Sponsored via Ad Clicks',
    amountUSD: '100% Free to Donors',
    color: '#2563EB', // Blue
    detail: 'Volunteer gear, distribution logistics across rural char areas, and community support.'
  },
  {
    category: 'Digital System & Ad Sponsor Operations',
    percentage: 4.0,
    amountBDT: 'Sponsored via Ad Clicks',
    amountUSD: '100% Free to Donors',
    color: '#D97706', // Amber
    detail: 'Hosting, ad network verification, and zero-cost donor portal maintenance.'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-01',
    title: 'Roadmap to Launch: Preparing Our Future Flagship Ground Project',
    slug: 'preparing-our-future-flagship-ground-project',
    thumbnail: HERO_IMAGE,
    excerpt: 'M R S Charity Foundation is currently in its active online fundraising phase. Learn how digital ad-supported contributions are laying the foundational resources for our upcoming physical learning centers and relief wings.',
    content: 'M R S Charity Foundation is pioneering an innovative, zero-cost digital humanitarian model. Currently operating as an online-based initiative, our platform enables compassionate individuals around the world to generate tangible financial support without paying a single cent out of pocket. Every ad click is backed by our verified corporate sponsor pool. These early resources are directly fueling the groundwork for the upcoming flagship ground project spearheaded by M R S, focusing on comprehensive child schooling, nutritional support, and emergency disaster response.',
    date: 'October 20, 2026',
    readTime: '4 min read',
    category: 'Future Project by M R S',
    author: 'Editorial Desk',
    tags: ['Future Project', 'Online Campaign', 'Education']
  },
  {
    id: 'post-02',
    title: 'Why Zero-Cost Ad Giving Powers Sustainable Humanitarian Action',
    slug: 'why-zero-cost-ad-giving-powers-sustainable-humanitarian-action',
    thumbnail: FOOD_RELIEF_IMAGE,
    excerpt: 'You do not need to spend personal funds to change a child\'s life. Discover how everyday internet users generate verified sponsor donations simply by visiting our free portal and viewing sponsored links.',
    content: 'Traditional charitable giving often faces financial friction: donors want to help, but personal budgets or complicated payment gateways create barriers. At M R S Charity Foundation, we eliminate all financial hurdles. Through our verified sponsor monetization infrastructure, commercial brand partners fund meals, medical aid, and study kits every time an online supporter clicks through our portal. This democratic philanthropy model ensures everyone can participate regardless of income.',
    date: 'October 16, 2026',
    readTime: '3 min read',
    category: 'Transparency & Giving',
    author: 'Field Communications',
    tags: ['Zero-Cost Philanthropy', 'Sponsor Giving', 'Community']
  },
  {
    id: 'post-03',
    title: 'Clean Drinking Water Mission: Deep Aquifer Solutions for Remote Regions',
    slug: 'clean-drinking-water-mission-deep-aquifer-solutions',
    thumbnail: CLEAN_WATER_IMAGE,
    excerpt: 'Safe drinking water is the bedrock of community health and children\'s school attendance. Here is how our upcoming ground initiatives will install deep-aquifer filtration systems across vulnerable riverbank districts.',
    content: 'Waterborne diseases remain one of the primary reasons children miss schooling in riverbank and coastal communities. Our planned water initiatives prioritize the installation of deep-aquifer tube wells reaching beyond arsenic and seasonal flood contaminants. Coupled with community water sanitation training, these solar and manual pumping stations will secure daily drinking water for thousands of families.',
    date: 'October 12, 2026',
    readTime: '5 min read',
    category: 'Clean Water Pillar',
    author: 'Infrastructure Planning',
    tags: ['Clean Water', 'Child Health', 'Ground Initiative']
  },
  {
    id: 'post-04',
    title: 'Empowering Rural Mothers with Tailoring Workshops & Micro-Skills',
    slug: 'empowering-rural-mothers-tailoring-micro-skills',
    thumbnail: WOMEN_EMPOWERMENT_IMAGE,
    excerpt: 'Breaking intergenerational poverty starts with sustainable household economic independence. Explore how our vocational curriculum equips mothers with sewing machines and market-ready craftsmanship.',
    content: 'When a mother achieves sustainable income, the entire household transforms: children attend school with complete uniforms, nutrition improves, and financial resilience is built against emergencies. Our upcoming vocational empowerment tracks will provide hands-on tailoring, textile finishing, and direct linkage to local artisan cooperatives, turning vulnerable families into self-reliant entrepreneurs.',
    date: 'October 08, 2026',
    readTime: '4 min read',
    category: 'Livelihood & Skills',
    author: 'Skills Development Team',
    tags: ['Women Empowerment', 'Vocational Skills', 'Self Sufficiency']
  }
];

