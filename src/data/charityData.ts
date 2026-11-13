import { ChildProfile, Campaign, ImpactStory, AuditItem, BlogPost } from '../types';
import heroEducationImg from '../assets/images/hero_education_aid_1792141324122.jpg';
import heroReadingImg from '../assets/images/hero_charity_education_1792133164119.jpg';
import childScholarImg from '../assets/images/child_scholar_portrait_1792141324614.jpg';
import sponsorGirlImg from '../assets/images/sponsor_child_portrait_1792133164620.jpg';
import foodReliefImg from '../assets/images/food_relief_pack_1792141324322.jpg';
import cleanWaterImg from '../assets/images/clean_water_pump_1792141325779.jpg';
import womenSewingImg from '../assets/images/women_vocational_sewing_1792141326227.jpg';
import womenNariShaktiImg from '../assets/images/vocational_women_empowerment_1792133164922.jpg';
import volunteerReliefImg from '../assets/images/volunteer_relief_action_1792133166628.jpg';

export const SITE_LOGO = './logo.png';
export const HERO_IMAGE = heroEducationImg;
export const CHILD_PORTRAIT_IMAGE = childScholarImg;
export const FOOD_RELIEF_IMAGE = foodReliefImg;
export const CLEAN_WATER_IMAGE = cleanWaterImg;
export const WOMEN_EMPOWERMENT_IMAGE = womenSewingImg;
export const VOLUNTEER_RELIEF_IMAGE = volunteerReliefImg;

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
      image: VOLUNTEER_RELIEF_IMAGE,
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
    name: 'Sarah N.',
    age: 9,
    gender: 'Female',
    grade: 'Primary 3',
    district: 'Donamba Chapter, Uganda',
    schoolName: 'Donamba Primary School',
    dream: 'Medical Doctor',
    story: 'Photographed holding her Primary 3 English Exercises workbook in the school yard. Free access to textbooks, uniform support, and daily meals keeps her thriving in class.',
    monthlyAmountBDT: 0,
    monthlyAmountUSD: 0,
    image: childScholarImg,
    urgent: true,
    hobbies: ['English Exercises', 'Drawing', 'Nature study'],
    favoriteSubject: 'English & Science',
    joinedDate: 'Community Member',
  },
  {
    id: 'ch-02',
    name: 'Samuel K.',
    age: 10,
    gender: 'Male',
    grade: 'Primary 4',
    district: 'Donamba Chapter, Uganda',
    schoolName: 'Village Mars Community Classroom',
    dream: 'Computer Engineer',
    story: 'Reading "My Community" and "Stories of Hope" with classmates inside our tin-roofed village classroom. Sponsor clicks provide illustrated storybooks and midday meals.',
    monthlyAmountBDT: 0,
    monthlyAmountUSD: 0,
    image: heroEducationImg,
    urgent: false,
    hobbies: ['Storybooks', 'Group Reading', 'Football'],
    favoriteSubject: 'Reading & Science',
    joinedDate: 'Community Member',
  },
  {
    id: 'ch-03',
    name: 'Ananya D.',
    age: 8,
    gender: 'Female',
    grade: 'Grade 3',
    district: 'Sarvodaya Chapter, South Asia',
    schoolName: 'Sarvodaya Primary School',
    dream: 'School Teacher',
    story: 'Smiling with her handwritten notebook along the palm-lined path outside Sarvodaya Primary School, supported by free uniforms, stationery, and daily study aid.',
    monthlyAmountBDT: 0,
    monthlyAmountUSD: 0,
    image: sponsorGirlImg,
    urgent: true,
    hobbies: ['Handwriting', 'Poetry', 'Gardening'],
    favoriteSubject: 'Literature & Math',
    joinedDate: 'Community Member',
  },
  {
    id: 'ch-04',
    name: 'Kavindu R.',
    age: 9,
    gender: 'Male',
    grade: 'Grade 4',
    district: 'Reading Time Chapter',
    schoolName: 'Sarvodaya Reading Time Hall',
    dream: 'Civil Engineer',
    story: 'Sharing storybooks including "Akuru Katha" and "Nodutu Lokaya" during daily Reading Time with classmates in full school uniform.',
    monthlyAmountBDT: 0,
    monthlyAmountUSD: 0,
    image: heroReadingImg,
    urgent: false,
    hobbies: ['Story Reading', 'Cricket', 'Sketching'],
    favoriteSubject: 'Mathematics & Reading',
    joinedDate: 'Community Member',
  },
  {
    id: 'ch-05',
    name: 'Grace A.',
    age: 7,
    gender: 'Female',
    grade: 'Primary 2',
    district: 'Donamba Chapter, Uganda',
    schoolName: 'Village Mars Safe Water Hub',
    dream: 'Public Health Nurse',
    story: 'Clean drinking water from the Village Mars Safe Water Project hand pump in Donamba keeps children healthy, hydrated, and able to attend morning school every day.',
    monthlyAmountBDT: 0,
    monthlyAmountUSD: 0,
    image: cleanWaterImg,
    urgent: true,
    hobbies: ['Rhymes', 'Drawing', 'Swimming'],
    favoriteSubject: 'Health & Art',
    joinedDate: 'Community Member',
  },
  {
    id: 'ch-06',
    name: 'Tariq H.',
    age: 11,
    gender: 'Male',
    grade: 'Grade 5',
    district: 'Bangladesh Relief Chapter',
    schoolName: 'Bangladesh Community Aid Center',
    dream: 'Journalist & Writer',
    story: 'Supported by our Bangladesh Emergency Aid & Clean Water relief distribution volunteers, keeping families resilient and students enrolled throughout flood seasons.',
    monthlyAmountBDT: 0,
    monthlyAmountUSD: 0,
    image: volunteerReliefImg,
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
    summary: 'Offering free schooling to children in community classrooms like Donamba & Sarvodaya. Every scholar receives illustrated storybooks, stationery, and nutrition.',
    impactMetrics: '14 Learning Hubs · 4,850+ Students'
  },
  {
    id: 'camp-02',
    title: 'Essential Necessities & Emergency Relief',
    subtitle: 'Distribution of grains, maize, rice flour, nutrition packs, and emergency water relief boxes.',
    category: 'Disaster Relief',
    targetAmountBDT: 80000,
    raisedAmountBDT: 68000,
    donorsCount: 680,
    image: FOOD_RELIEF_IMAGE,
    summary: 'Rapid response distribution of maize, rice flour, nutrition packs, and essential necessities directly to rural families in Uganda and Bangladesh.',
    impactMetrics: '18,000+ Family relief packages'
  },
  {
    id: 'camp-03',
    title: 'Rural Women’s Tailoring & Livelihoods',
    subtitle: 'Free vocational livelihood workshops, sewing machine grants, and garment craft training.',
    category: 'Women Empowerment',
    targetAmountBDT: 70000,
    raisedAmountBDT: 59000,
    donorsCount: 295,
    image: WOMEN_EMPOWERMENT_IMAGE,
    summary: 'Equipping mothers and rural women in our Tailoring Program with Singer and Usha sewing machines to build dependable daily income.',
    impactMetrics: '650+ Artisans trained'
  },
  {
    id: 'camp-04',
    title: 'Village Mars Safe Water Project — Donamba',
    subtitle: 'Deep community water pumps, clean water access, and child hygiene stations.',
    category: 'Clean Water',
    targetAmountBDT: 50000,
    raisedAmountBDT: 42000,
    donorsCount: 188,
    image: CLEAN_WATER_IMAGE,
    summary: 'Installing deep-aquifer hand pumps such as the Safe Water Project at Village Mars in Donamba, Uganda, eliminating waterborne illness.',
    impactMetrics: '340+ Clean Water Wells'
  }
];

export const IMPACT_STORIES: ImpactStory[] = [
  {
    id: 'story-01',
    title: 'Transforming Lives Through Free Daily Education',
    personName: 'Sarah N. & Village Scholars',
    role: 'Primary 3 Classroom Scholar, Community Learning Hub',
    location: 'Donamba Chapter, Uganda',
    summary: 'Access to free English exercise notebooks, storybooks, and community teachers opened pathways to bright futures.',
    fullQuote: 'Having my own English exercise book, storybooks like Stories of Hope, and caring community teachers changed my life. Every child in our classroom looks forward to learning each morning.',
    achievement: 'Full classroom attendance & top Primary 3 reader',
    image: heroEducationImg,
    program: 'Education Pillar · Uganda'
  },
  {
    id: 'story-02',
    title: 'Achieving Economic Self-Sufficiency Through Skills',
    personName: 'Nari Shakti Tailoring Artisans',
    role: 'Rural Women’s Tailoring & Workshop Graduates',
    location: 'Sarvodaya Vocational Chapter, South Asia',
    summary: 'Hands-on sewing machine training at our Community Workshop transformed vulnerable households into independent earners.',
    fullQuote: 'The Rural Women’s Tailoring Program gave us dignity and dependable daily income. We craft garments together at the workshop and fund our children’s schooling without barrier.',
    achievement: 'Operate independent village tailoring cooperative',
    image: womenNariShaktiImg,
    program: 'Nari Shakti Livelihood Hub'
  },
  {
    id: 'story-03',
    title: 'Rapid Mobilization for Bangladesh Emergency Relief',
    personName: 'Bangladesh Youth Relief Team',
    role: 'Grassroots Volunteer Aid Chapter',
    location: 'Bangladesh Relief Distribution Chapter',
    summary: 'Youth volunteers mobilizing emergency aid boxes and clean drinking water containers to rural Bangladesh villages.',
    fullQuote: 'Humanity united against poverty means standing together on the ground when families need food and clean water. Every Emergency Aid Clean Water box restores immediate hope.',
    achievement: 'Delivered emergency clean water & aid to 450+ families',
    image: volunteerReliefImg,
    program: 'Bangladesh Relief Network'
  }
];

export const FINANCIAL_AUDIT: AuditItem[] = [
  {
    category: 'Direct Educational & Food Relief Support',
    percentage: 88.5,
    amountBDT: 'Sponsored via Ad Clicks',
    amountUSD: '100% Free to Donors',
    color: '#059669',
    detail: 'Learning materials, student midday meals, relief packets, and community safe water installation.'
  },
  {
    category: 'Field Coordination & Relief Delivery',
    percentage: 7.5,
    amountBDT: 'Sponsored via Ad Clicks',
    amountUSD: '100% Free to Donors',
    color: '#2563EB',
    detail: 'Volunteer gear, distribution logistics across rural chapters in Uganda, Bangladesh & South Asia.'
  },
  {
    category: 'Digital System & Ad Sponsor Operations',
    percentage: 4.0,
    amountBDT: 'Sponsored via Ad Clicks',
    amountUSD: '100% Free to Donors',
    color: '#D97706',
    detail: 'Hosting, ad network verification, and zero-cost donor portal maintenance.'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-01',
    title: 'Roadmap to Launch: Preparing Our Future Flagship Ground Project',
    slug: 'preparing-our-future-flagship-ground-project',
    thumbnail: HERO_IMAGE,
    excerpt: 'M R S Charity Foundation is currently in its active online fundraising phase. Learn how digital ad-supported contributions supply storybooks and desks for community classrooms like Donamba & Sarvodaya.',
    content: 'M R S Charity Foundation is pioneering an innovative, zero-cost digital humanitarian model. Currently operating as an online-based initiative, our platform enables compassionate individuals around the world to generate tangible financial support without paying a single cent out of pocket. Every ad click is backed by our verified corporate sponsor pool, laying the groundwork for our upcoming flagship ground project by M R S across rural classrooms, water wells, and emergency relief.',
    date: 'October 20, 2026',
    readTime: '4 min read',
    category: 'Future Project by M R S',
    author: 'Editorial Desk',
    tags: ['Future Project', 'Online Campaign', 'Education']
  },
  {
    id: 'post-02',
    title: 'Zero-Cost Aid in Action: Grains, Maize & Emergency Nutrition Packs',
    slug: 'why-zero-cost-ad-giving-powers-sustainable-humanitarian-action',
    thumbnail: FOOD_RELIEF_IMAGE,
    excerpt: 'You do not need to spend personal funds to feed families. See how everyday web clicks power Emergency Relief Food distributions of grains, maize, rice flour, and nutrition packs.',
    content: 'Traditional charitable giving often faces financial friction: donors want to help, but personal budgets create barriers. At M R S Charity Foundation, commercial sponsor partners fund Emergency Relief Food packs, maize grains, rice flour, and emergency clean water kits every time an online supporter clicks through our portal—ensuring everyone can participate regardless of income.',
    date: 'October 16, 2026',
    readTime: '3 min read',
    category: 'Donamba & Bangladesh Relief',
    author: 'Field Communications',
    tags: ['Zero-Cost Philanthropy', 'Food Aid', 'Community']
  },
  {
    id: 'post-03',
    title: 'Safe Water Project at Village Mars, Donamba (Uganda): Clean Drinking Water',
    slug: 'clean-drinking-water-mission-deep-aquifer-solutions',
    thumbnail: CLEAN_WATER_IMAGE,
    excerpt: 'Safe drinking water is the bedrock of children’s health and school attendance. Discover how deep community hand pumps at Village Mars in Donamba, Uganda protect young scholars.',
    content: 'Waterborne diseases remain one of the leading causes of missed school days across rural regions. Deep-aquifer hand pumps such as the Safe Water Project at Village Mars in Donamba, Uganda bring fresh, clean water directly to children and families, securing daily drinking water and healthier futures.',
    date: 'October 12, 2026',
    readTime: '5 min read',
    category: 'Donamba Safe Water Hub',
    author: 'Infrastructure Planning',
    tags: ['Clean Water', 'Donamba Uganda', 'Ground Initiative']
  },
  {
    id: 'post-04',
    title: 'Rural Women’s Tailoring Program: Vocational Skills & Independence',
    slug: 'empowering-rural-mothers-tailoring-micro-skills',
    thumbnail: WOMEN_EMPOWERMENT_IMAGE,
    excerpt: 'Breaking intergenerational poverty starts with household economic independence. Explore how our Rural Women’s Tailoring Program equips mothers with sewing machines and skills.',
    content: 'When a mother achieves dependable income at our Vocational Livelihood Empowerment Workshop, the entire household transforms: children attend school in uniform, nutrition improves, and families thrive independently. Our upcoming tailoring tracks provide sewing machines and craft training to help households succeed.',
    date: 'October 08, 2026',
    readTime: '4 min read',
    category: 'Vocational Tailoring Hub',
    author: 'Skills Development Team',
    tags: ['Women Empowerment', 'Tailoring Workshop', 'Self Sufficiency']
  }
];
