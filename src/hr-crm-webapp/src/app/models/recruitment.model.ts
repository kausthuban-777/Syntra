export enum CandidateStatus {
  NEW = 'New',
  SCREENING = 'Screening',
  INTERVIEWED = 'Interviewed',
  SHORTLISTED = 'Shortlisted',
  OFFER_EXTENDED = 'Offer Extended',
  HIRED = 'Hired',
  REJECTED = 'Rejected',
  WITHDRAWN = 'Withdrawn'
}

export enum ExperienceLevel {
  ENTRY = 'Entry Level',
  MID = 'Mid Level',
  SENIOR = 'Senior',
  LEAD = 'Lead',
  EXECUTIVE = 'Executive'
}

export enum JobPostingStatus {
  DRAFT = 'Draft',
  ACTIVE = 'Active',
  CLOSED = 'Closed',
  ARCHIVED = 'Archived',
  ONHOLD = 'On Hold'
}

export enum InterviewType {
  PHONE_SCREENING = 'Phone Screening',
  TECHNICAL = 'Technical',
  HR = 'HR',
  MANAGER = 'Manager',
  FINAL = 'Final Round',
  ASSESSMENT = 'Assessment'
}

export enum InterviewStatus {
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  RESCHEDULED = 'Rescheduled',
  CANCELLED = 'Cancelled',
  FEEDBACK_PENDING = 'Feedback Pending'
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  currentCompany?: string;
  currentPosition?: string;
  experience: number;
  experienceLevel: ExperienceLevel;
  status: CandidateStatus;
  appliedPosition: string;
  appliedDate: Date;
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  skills: string[];
  salaryExpectation?: number;
  noticePeriod?: string;
  source: string;
  rating?: number;
  notes?: string;
}

export interface CandidateListResponse {
  data: Candidate[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface CandidateFilter {
  searchTerm?: string;
  status?: string;
  experienceLevel?: string;
  position?: string;
  source?: string;
  minRating?: number;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  jobType: 'Full-Time' | 'Part-Time' | 'Contract';
  salaryMin: number;
  salaryMax: number;
  experience: string;
  experienceLevel: ExperienceLevel;
  status: JobPostingStatus;
  postedDate: Date;
  closingDate?: Date;
  totalPositions: number;
  appliedCount: number;
  hiredCount: number;
  createdBy: string;
  updatedDate: Date;
}

export interface JobPostingListResponse {
  data: JobPosting[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface JobPostingFilter {
  searchTerm?: string;
  department?: string;
  status?: string;
  location?: string;
  jobType?: string;
}

export interface HiringPipelineStage {
  candidateId: string;
  candidateName: string;
  position: string;
  stage: CandidateStatus;
  moveDate: Date;
  rating: number;
}

export interface PipelineData {
  new: Candidate[];
  screening: Candidate[];
  interviewed: Candidate[];
  shortlisted: Candidate[];
  offerExtended: Candidate[];
  hired: Candidate[];
  rejected: Candidate[];
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  interviewType: InterviewType;
  status: InterviewStatus;
  scheduledDate: Date;
  duration: number;
  interviewerId: string;
  interviewerName: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  resultStatus?: 'Pass' | 'Fail' | 'Pending';
}

export interface InterviewListResponse {
  data: Interview[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface InterviewFilter {
  searchTerm?: string;
  status?: string;
  interviewType?: string;
  interviewerId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface RecruitmentMetrics {
  totalCandidates: number;
  activePositions: number;
  applicationsThisMonth: number;
  hiredThisMonth: number;
  averageTimeToHire: number;
  conversionRate: number;
}

export interface Application {
  id: string;
  candidateId: string;
  positionId: string;
  appliedDate: Date;
  status: CandidateStatus;
  rating: number;
  source: string;
}
