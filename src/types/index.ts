export type Currency = 'BDT' | 'USD' | 'EUR' | 'GBP';

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male';
  grade: string;
  district: string;
  schoolName: string;
  dream: string;
  story: string;
  monthlyAmountBDT: number;
  monthlyAmountUSD: number;
  image: string;
  urgent: boolean;
  hobbies: string[];
  favoriteSubject: string;
  joinedDate: string;
}

export interface Campaign {
  id: string;
  title: string;
  subtitle: string;
  category: 'Education' | 'Disaster Relief' | 'Healthcare' | 'Women Empowerment' | 'Clean Water';
  targetAmountBDT: number;
  raisedAmountBDT: number;
  donorsCount: number;
  image: string;
  summary: string;
  impactMetrics: string;
}

export interface ImpactStory {
  id: string;
  title: string;
  personName: string;
  role: string;
  location: string;
  summary: string;
  fullQuote: string;
  achievement: string;
  image: string;
  program: string;
}

export interface AuditItem {
  category: string;
  percentage: number;
  amountBDT: string;
  amountUSD: string;
  color: string;
  detail: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  tags: string[];
  sourceUrl?: string;
}

export interface VolunteerSubmission {
  fullName: string;
  email: string;
  phone: string;
  district: string;
  profession: string;
  interestArea: string;
  bloodGroup: string;
  availability: string;
}

export interface DonationReceipt {
  receiptNumber: string;
  date: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  currency: Currency;
  cause: string;
  frequency: 'one-time' | 'monthly';
  paymentMethod: string;
  transactionId: string;
  status: 'Completed' | 'Pending';
}
