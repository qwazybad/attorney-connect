export type Badge = "Best Value" | "Top Rated" | "Fastest Response" | "Most Reviewed" | "Recommended";

export interface Attorney {
  id: string;
  name: string;
  firm: string;
  avatar: string;
  practiceAreas: string[];
  states: string[];
  city?: string;
  state?: string;
  rating: number;
  reviewCount: number;
  feePercent: number;
  avgFeePercent: number;
  responseTimeHours: number;
  recentResult?: string;
  recentResultAmount?: string;
  casesWon: number;
  totalCases: number;
  yearsExperience: number;
  barNumber?: string;
  badges: Badge[];
  bio: string;
  successRate: number;
  imagePosition?: string;
  imageZoomOut?: boolean;
  billingType: "contingency" | "hourly" | "flat";
  hourlyRate?: number;
  avgHourlyRate?: number;
  flatFee?: number;
  phone?: string;
  website?: string;
}

export interface LegalIssue {
  value: string;
  label: string;
  avgFee: number;
}

export const LEGAL_ISSUES: LegalIssue[] = [
  { value: "personal-injury", label: "Personal Injury", avgFee: 33 },
  { value: "car-accident", label: "Car Accident", avgFee: 33 },
  { value: "medical-malpractice", label: "Medical Malpractice", avgFee: 40 },
  { value: "slip-and-fall", label: "Slip & Fall", avgFee: 33 },
  { value: "wrongful-death", label: "Wrongful Death", avgFee: 35 },
  { value: "workers-comp", label: "Workers' Compensation", avgFee: 20 },
  { value: "employment", label: "Employment Discrimination", avgFee: 33 },
  { value: "sexual-harassment", label: "Sexual Harassment", avgFee: 33 },
  { value: "product-liability", label: "Product Liability", avgFee: 33 },
  { value: "nursing-home", label: "Nursing Home Abuse", avgFee: 35 },
  { value: "mass-tort", label: "Mass Tort / Class Action", avgFee: 30 },
  { value: "social-security", label: "Social Security Disability", avgFee: 25 },
  { value: "immigration", label: "Immigration", avgFee: 0 },
  { value: "criminal", label: "Criminal Defense", avgFee: 0 },
  { value: "family-law", label: "Family Law / Divorce", avgFee: 0 },
  { value: "bankruptcy", label: "Bankruptcy", avgFee: 0 },
  { value: "real-estate", label: "Real Estate", avgFee: 0 },
  { value: "business", label: "Business / Corporate", avgFee: 0 },
];

export const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
];

export const TIMELINES = [
  "As soon as possible",
  "Within a week",
  "Within a month",
  "No rush, just researching",
];

export const ATTORNEYS: Attorney[] = [
  {
    id: "4",
    name: "David Park",
    firm: "Park Injury Law",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
    practiceAreas: ["Car Accident", "Slip & Fall", "Personal Injury"],
    states: ["Florida"],
    city: "Miami",
    state: "FL",
    rating: 4.7,
    reviewCount: 167,
    feePercent: 27,
    avgFeePercent: 34,
    responseTimeHours: 3,
    recentResult: "Truck accident settlement",
    recentResultAmount: "$950K",
    casesWon: 312,
    totalCases: 348,
    yearsExperience: 12,
    barNumber: "FL-882341",
    badges: ["Best Value"],
    bio: "Aggressive Florida injury attorney with a track record of taking on big insurance companies and winning.",
    successRate: 90,
    billingType: "contingency",
  },
  {
    id: "15",
    name: "Ryan Ladd Thompson",
    firm: "1800 Lion Law",
    avatar: "/Ryan Ladd Thompson.webp",
    imagePosition: "center 10%",
    practiceAreas: ["Personal Injury", "Car Accident", "Wrongful Death", "Trucking Accidents", "Motorcycle Accidents", "Product Liability"],
    states: ["Texas", "Arizona", "California", "Illinois", "Oklahoma", "Kentucky", "Pennsylvania"],
    city: "Dallas",
    state: "TX",
    rating: 4.9,
    reviewCount: 153,
    feePercent: 35,
    avgFeePercent: 40,
    responseTimeHours: 2,
    recentResult: "#1 Settlement in Collin County (2023)",
    recentResultAmount: "$5.2M",
    casesWon: 412,
    totalCases: 443,
    yearsExperience: 21,
    barNumber: "TX-24032918",
    badges: ["Top Rated", "Recommended"],
    bio: "Former corporate defense attorney who now fights for injury victims. Super Lawyer 2015–2025, Top 100 Trial Lawyers, and top motor vehicle verdict winner in Texas. Licensed in 7 states.",
    successRate: 93,
    billingType: "contingency",
  },
  {
    id: "14",
    name: "Nicholas David Boca",
    firm: "Cantor Law Group",
    avatar: "/Nicholas David Boca.jpg",
    practiceAreas: ["Family Law", "Child Custody", "Divorce", "Child Support", "Adoption", "Guardianship"],
    states: ["Arizona"],
    city: "Phoenix",
    state: "AZ",
    rating: 4.9,
    reviewCount: 66,
    feePercent: 0,
    avgFeePercent: 0,
    hourlyRate: 350,
    avgHourlyRate: 400,
    responseTimeHours: 2,
    recentResult: "High-net-worth dissolution",
    recentResultAmount: undefined,
    casesWon: 389,
    totalCases: 412,
    yearsExperience: 12,
    barNumber: "AZ-032847",
    badges: ["Top Rated", "Recommended"],
    bio: "Board-Certified Family Law Specialist and former Assistant Attorney General for the Department of Child Safety. Best Lawyers in America 2021–2025, AV Preeminent rated, and Super Lawyers Rising Star. Handles high-net-worth, complex, and high-profile cases.",
    successRate: 94,
    billingType: "hourly",
  },
  {
    id: "13",
    name: "Tanveer A. Shah",
    firm: "Shah Law Firm",
    avatar: "/Tanveer A Shah.webp",
    imagePosition: "center 15%",
    practiceAreas: ["Personal Injury", "Car Accident", "Wrongful Death", "Medical Malpractice", "Trucking Accidents", "Motorcycle Accidents", "Product Liability"],
    states: ["Arizona", "Indiana"],
    city: "Scottsdale",
    state: "AZ",
    rating: 4.9,
    reviewCount: 71,
    feePercent: 33,
    avgFeePercent: 34,
    responseTimeHours: 2,
    recentResult: "Largest jury verdict in Arizona (2020)",
    recentResultAmount: "$10M+",
    casesWon: 298,
    totalCases: 321,
    yearsExperience: 12,
    barNumber: "AZ-031847",
    badges: ["Top Rated", "Recommended"],
    bio: "Trial-first personal injury attorney behind one of the largest jury verdicts in Arizona history (2020). I treat every case as my most important — because to my client, it is. Southwest Rising Star 2015–2020, Top 100 Injury Attorney.",
    successRate: 93,
    billingType: "contingency",
  },
  {
    id: "12",
    name: "Mark P Breyer",
    firm: "The Husband & Wife Law Team",
    avatar: "/Mark P Breyer.jpg",
    imagePosition: "center 15%",
    practiceAreas: ["Personal Injury", "Car Accident", "Wrongful Death", "Trucking Accidents", "Motorcycle Accidents", "Medical Malpractice", "Nursing Home Abuse"],
    states: ["Arizona", "Nevada", "New Mexico"],
    city: "Phoenix",
    state: "AZ",
    rating: 4.9,
    reviewCount: 78,
    feePercent: 33,
    avgFeePercent: 34,
    responseTimeHours: 2,
    recentResult: "Trucking accident settlement",
    recentResultAmount: "$3.5M",
    casesWon: 421,
    totalCases: 455,
    yearsExperience: 29,
    barNumber: "AZ-119921",
    badges: ["Top Rated", "Recommended"],
    bio: "Certified specialist in Injury and Wrongful Death Law — a distinction held by less than 2% of Arizona attorneys. Super Lawyer every year since 2012, Million Dollar Advocates Forum member, and co-founder of The Husband & Wife Law Team alongside Alexis Breyer.",
    successRate: 93,
    billingType: "contingency",
  },
  {
    id: "11",
    name: "Alexis Saphire Breyer",
    firm: "Breyer Law Offices",
    avatar: "/alexis_updated.jpg",
    practiceAreas: ["Personal Injury", "Car Accident", "Wrongful Death", "Motorcycle Accidents", "Trucking Accidents", "Slip & Fall"],
    states: ["Arizona", "New Mexico"],
    city: "Phoenix",
    state: "AZ",
    rating: 4.9,
    reviewCount: 97,
    feePercent: 33,
    avgFeePercent: 34,
    responseTimeHours: 2,
    recentResult: "Wrongful death settlement",
    recentResultAmount: "$2.8M",
    casesWon: 312,
    totalCases: 338,
    yearsExperience: 29,
    barNumber: "AZ-119847",
    badges: ["Top Rated", "Recommended"],
    bio: "Co-founder of The Husband and Wife Law Team with 29 years exclusively handling injury and wrongful death cases. We treat every client as an individual, not a case number. Certified specialist in injury and wrongful death law — a distinction held by only 1% of Arizona attorneys.",
    successRate: 92,
    billingType: "contingency",
  },
  {
    id: "10",
    name: "Clark Hansen Fielding",
    firm: "Fielding Law",
    avatar: "/clark-fielding.jpg",
    imagePosition: "center 15%",
    practiceAreas: ["Personal Injury", "Car Accident", "Wrongful Death", "Trucking Accidents", "Motorcycle Accidents", "Slip & Fall", "Product Liability"],
    states: ["California", "Arizona"],
    city: "Irvine",
    state: "CA",
    rating: 4.9,
    reviewCount: 314,
    feePercent: 30,
    avgFeePercent: 34,
    responseTimeHours: 2,
    recentResult: "Premises liability verdict",
    recentResultAmount: "$3.2M",
    casesWon: 389,
    totalCases: 418,
    yearsExperience: 18,
    barNumber: "CA-238471",
    badges: ["Top Rated", "Recommended"],
    bio: "Former Commercial Construction Project Manager and Forensic Accountant turned trial attorney. I bring meticulous attention to detail and relentless advocacy to every personal injury case. Top 50 Orange County Super Lawyer, Million Dollar Advocates Forum member.",
    successRate: 93,
    billingType: "contingency",
  },
  {
    id: "9",
    name: "Brandon Lebovitz",
    firm: "Lebovitz Law Group",
    avatar: "/NEW Brandon Lebovitz.jpeg",
    practiceAreas: ["Personal Injury", "Car Accident", "Slip & Fall"],
    states: ["Arizona"],
    city: "Phoenix",
    state: "AZ",
    rating: 4.9,
    reviewCount: 179,
    feePercent: 25,
    avgFeePercent: 34,
    responseTimeHours: 0.5,
    recentResult: "Pedestrian accident settlement",
    recentResultAmount: "$1.6M",
    casesWon: 241,
    totalCases: 261,
    yearsExperience: 12,
    barNumber: "AZ-6123847",
    badges: ["Top Rated", "Fastest Response", "Recommended"],
    bio: "Phoenix personal injury attorney with 12 years of experience fighting for accident victims across Arizona. Arizona Summit Law School graduate committed to maximizing every client's recovery.",
    successRate: 92,
    billingType: "contingency",
    imagePosition: "center 5%",
  },
  {
    id: "8",
    name: "Carlos Mendoza",
    firm: "Mendoza Injury Attorneys",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    practiceAreas: ["Personal Injury", "Car Accident", "Slip & Fall"],
    states: ["Arizona", "New Mexico"],
    city: "Phoenix",
    state: "AZ",
    rating: 4.7,
    reviewCount: 156,
    feePercent: 28,
    avgFeePercent: 34,
    responseTimeHours: 2,
    recentResult: "Premises liability verdict",
    recentResultAmount: "$675K",
    casesWon: 198,
    totalCases: 221,
    yearsExperience: 16,
    barNumber: "AZ-7284930",
    badges: ["Recommended"],
    bio: "Bilingual attorney serving Arizona's injury victims. I fight for every dollar you deserve, no matter how big the opponent.",
    successRate: 90,
    billingType: "contingency",
  },
];

export const PLATFORM_STATS = {
  verifiedFirms: 2847,
  avgResponseTime: "18 min",
  avgRating: 4.8,
  totalCasesMatched: 48293,
};

export function getSavingsPercent(feePercent: number, avgFeePercent: number): number {
  return avgFeePercent - feePercent;
}

export function getHourlySavingsPercent(hourlyRate: number, avgHourlyRate: number): number {
  return Math.round(((avgHourlyRate - hourlyRate) / avgHourlyRate) * 100);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function getResponseLabel(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours === 1) return "1 hr";
  return `${hours} hrs`;
}
