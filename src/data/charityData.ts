import { ChildProfile, Campaign, ImpactStory, AuditItem, BlogPost } from '../types';
import { SITE_CONFIG } from '../../site.config';

export const SITE_LOGO = SITE_CONFIG.organization.logoPath;
export const HERO_IMAGE = SITE_CONFIG.images.hero;
export const HEALTHCARE_IMAGE = SITE_CONFIG.images.healthcare;
export const CHILD_PORTRAIT_IMAGE = SITE_CONFIG.images.scholarOne;
export const FOOD_RELIEF_IMAGE = SITE_CONFIG.images.essentialRelief;
export const CLEAN_WATER_IMAGE = SITE_CONFIG.images.cleanWater;
export const WOMEN_EMPOWERMENT_IMAGE = SITE_CONFIG.images.livelihood;
export const VOLUNTEER_RELIEF_IMAGE = SITE_CONFIG.images.volunteers;
export const ABOUT_IMAGE = SITE_CONFIG.images.about;

export const FOUNDATION_INFO = {
  name: SITE_CONFIG.organization.name,
  shortName: SITE_CONFIG.organization.shortName,
  logo: SITE_CONFIG.organization.logoPath,
  parentOrg: SITE_CONFIG.organization.projectOf,
  motto: SITE_CONFIG.organization.tagline,
  secondaryMotto: SITE_CONFIG.organization.secondaryTagline,
  mission: SITE_CONFIG.organization.heroMission,
  coreGoals: [
    {
      goal: 'Education & Learning Access',
      detail: 'Classroom notebooks, storybooks, and tuition assistance helping children remain in school consistently.',
      image: SITE_CONFIG.images.education,
    },
    {
      goal: 'Primary Healthcare Outreach',
      detail: 'Preventive community health checkups, basic medications, and maternal hygiene guidance.',
      image: SITE_CONFIG.images.healthcare,
    },
    {
      goal: 'Essential Food & Relief',
      detail: 'Balanced household staples including grain, rice flour, and hygiene kits during seasonal hardship.',
      image: SITE_CONFIG.images.essentialRelief,
    },
    {
      goal: 'Clean Drinking Water',
      detail: 'Community hand pumps and filtration stations protecting daily student attendance and public health.',
      image: SITE_CONFIG.images.cleanWater,
    },
    {
      goal: 'Vocational Livelihood Skills',
      detail: 'Practical garment tailoring workshops and tool access empowering independent family earnings.',
      image: SITE_CONFIG.images.livelihood,
    },
    {
      goal: 'Community Disaster Response',
      detail: 'Volunteer coordination to deliver emergency clean water containers and food packs when storms strike.',
      image: SITE_CONFIG.images.volunteers,
    },
  ],
};

export const IMPACT_METRICS = SITE_CONFIG.impactSection.metrics.map((m) => ({
  label: m.label,
  value: m.value,
  detail: m.unitOrContext,
}));

export const FINANCIAL_AUDIT: AuditItem[] = SITE_CONFIG.transparency.allocations.map((a) => ({
  category: a.label,
  percentage: a.percentage,
  amountBDT: 'Phase 1 Online Fund Collection',
  amountUSD: 'Zero donor payment required',
  color: a.color,
  detail: a.description,
}));

export const CAMPAIGNS: Campaign[] = SITE_CONFIG.programs.map((prog, index) => ({
  id: prog.id,
  title: prog.title,
  subtitle: prog.scopeNote,
  category:
    prog.pillar === 'Healthcare'
      ? 'Healthcare'
      : prog.pillar === 'Education'
        ? 'Education'
        : 'Disaster Relief',
  targetAmountBDT: 100,
  raisedAmountBDT: 50 + index * 5,
  donorsCount: 0,
  image: prog.image,
  summary: prog.summary,
  impactMetrics: prog.scopeNote,
}));

// General illustrative community focus tracks (no fabricated personal names or claims)
export const CHILDREN_PROFILES: ChildProfile[] = [
  {
    id: 'track-edu',
    name: 'Primary Classroom Support Track',
    age: 9,
    gender: 'Female',
    grade: 'Primary Grades 1–5',
    district: 'Community Education Initiative',
    schoolName: 'Rural Partner Classrooms',
    dream: 'Foundational Literacy & Numeracy',
    story: 'Supports shared illustrated storybooks, exercise workbooks, pencils, and classroom tuition relief for rural students.',
    monthlyAmountBDT: 0,
    monthlyAmountUSD: 0,
    image: SITE_CONFIG.images.scholarOne,
    urgent: false,
    hobbies: ['Storybooks', 'Exercise Workbooks', 'Classroom Supplies'],
    favoriteSubject: 'Primary Literacy',
    joinedDate: 'Program Track',
  },
  {
    id: 'track-health',
    name: 'Child Preventive Health & Water Track',
    age: 8,
    gender: 'Male',
    grade: 'Early Childhood & Primary',
    district: 'Community Healthcare Initiative',
    schoolName: 'Mobile Outreach Camps',
    dream: 'Healthy Childhood Attendance',
    story: 'Directs sponsor reserves toward clean drinking water stations and periodic preventive medical checkups.',
    monthlyAmountBDT: 0,
    monthlyAmountUSD: 0,
    image: SITE_CONFIG.images.healthcare,
    urgent: false,
    hobbies: ['Clean Water', 'Pediatric Screening', 'Hygiene Kits'],
    favoriteSubject: 'Community Health',
    joinedDate: 'Program Track',
  },
  {
    id: 'track-relief',
    name: 'Family Essential Relief Track',
    age: 10,
    gender: 'Female',
    grade: 'Household Welfare Support',
    district: 'Essential Necessities Initiative',
    schoolName: 'Community Relief Distribution',
    dream: 'Household Stability & Nutrition',
    story: 'Supports staple grain, rice flour, and nutrition packages so children remain in school rather than entering child labor.',
    monthlyAmountBDT: 0,
    monthlyAmountUSD: 0,
    image: SITE_CONFIG.images.essentialRelief,
    urgent: false,
    hobbies: ['Staple Food Packs', 'Nutrition Security', 'Emergency Kits'],
    favoriteSubject: 'Household Resilience',
    joinedDate: 'Program Track',
  },
];

export const IMPACT_STORIES: ImpactStory[] = [];
export const BLOG_POSTS: BlogPost[] = [];
