import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Candidate,
  CandidateListResponse,
  CandidateFilter,
  CandidateStatus,
  ExperienceLevel,
  JobPosting,
  JobPostingListResponse,
  JobPostingFilter,
  JobPostingStatus,
  Interview,
  InterviewListResponse,
  InterviewFilter,
  InterviewType,
  InterviewStatus,
  PipelineData,
  RecruitmentMetrics,
  Application
} from '../models/recruitment.model';

@Injectable()
export class RecruitmentService {
  private candidates: Candidate[] = this.generateMockCandidates();
  private jobPostings: JobPosting[] = this.generateMockJobPostings();
  private interviews: Interview[] = this.generateMockInterviews();
  private applications: Application[] = this.generateMockApplications();

  private candidateId = 101;
  private jobPostingId = 1001;
  private interviewId = 5001;

  constructor() {}

  private generateMockCandidates(): Candidate[] {
    const candidates: Candidate[] = [];
    const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Amanda', 'Christopher', 'Jennifer'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const positions = ['Senior Developer', 'UI/UX Designer', 'Product Manager', 'DevOps Engineer', 'Data Scientist'];
    const sources = ['LinkedIn', 'Indeed', 'Referral', 'Company Website', 'Recruiter'];
    const skills = [['Python', 'Django', 'PostgreSQL'], ['React', 'Angular', 'CSS'], ['Scrum', 'Agile', 'JIRA'],
      ['Kubernetes', 'Docker', 'AWS'], ['Machine Learning', 'TensorFlow', 'Python']];

    const statuses = Object.values(CandidateStatus);
    const experienceLevels = Object.values(ExperienceLevel);

    for (let i = 0; i < 25; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      candidates.push({
        id: (this.candidateId++).toString(),
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        phone: `+1-${Math.floor(Math.random() * 9000000) + 1000000}`,
        location: ['New York', 'San Francisco', 'London', 'Toronto', 'Berlin'][Math.floor(Math.random() * 5)],
        currentCompany: ['Tech Corp', 'Innovation Labs', 'Digital Solutions', 'Cloud Systems'][Math.floor(Math.random() * 4)],
        currentPosition: positions[Math.floor(Math.random() * positions.length)],
        experience: Math.floor(Math.random() * 15) + 1,
        experienceLevel: experienceLevels[Math.floor(Math.random() * experienceLevels.length)] as ExperienceLevel,
        status: statuses[Math.floor(Math.random() * statuses.length)] as CandidateStatus,
        appliedPosition: positions[Math.floor(Math.random() * positions.length)],
        appliedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        resumeUrl: `https://example.com/resume-${i}.pdf`,
        portfolioUrl: Math.random() > 0.5 ? `https://portfolio-${i}.com` : undefined,
        linkedInUrl: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
        skills: skills[Math.floor(Math.random() * skills.length)],
        salaryExpectation: 80000 + Math.floor(Math.random() * 120000),
        noticePeriod: ['Immediate', '2 weeks', '1 month', '2 months'][Math.floor(Math.random() * 4)],
        source: sources[Math.floor(Math.random() * sources.length)],
        rating: Math.floor(Math.random() * 5) + 1,
        notes: Math.random() > 0.7 ? `Strong candidate with relevant experience.` : undefined
      });
    }
    return candidates;
  }

  private generateMockJobPostings(): JobPosting[] {
    const postings: JobPosting[] = [];
    const titles = ['Senior Developer', 'UI/UX Designer', 'Product Manager', 'DevOps Engineer', 'Data Scientist', 'Full Stack Developer', 'Mobile Developer'];
    const departments = ['Engineering', 'Design', 'Product', 'Operations', 'Analytics', 'Engineering'];
    const locations = ['New York', 'San Francisco', 'London', 'Toronto', 'Berlin', 'Remote'];

    for (let i = 0; i < 12; i++) {
      const status = [JobPostingStatus.ACTIVE, JobPostingStatus.DRAFT, JobPostingStatus.CLOSED][Math.floor(Math.random() * 3)];
      postings.push({
        id: (this.jobPostingId++).toString(),
        title: titles[Math.floor(Math.random() * titles.length)],
        department: departments[Math.floor(Math.random() * departments.length)],
        description: 'We are looking for an experienced professional to join our growing team.',
        requirements: ['5+ years experience', 'Strong communication skills', 'Team player', 'Problem solver'],
        responsibilities: ['Develop and maintain code', 'Collaborate with team', 'Code reviews', 'Documentation'],
        location: locations[Math.floor(Math.random() * locations.length)],
        jobType: ['Full-Time', 'Part-Time', 'Contract'][Math.floor(Math.random() * 3)] as any,
        salaryMin: 80000,
        salaryMax: 130000,
        experience: '5-10 years',
        experienceLevel: Object.values(ExperienceLevel)[Math.floor(Math.random() * 5)] as ExperienceLevel,
        status: status,
        postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        closingDate: status !== JobPostingStatus.CLOSED ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000) : new Date(Date.now() - 24 * 60 * 60 * 1000),
        totalPositions: Math.floor(Math.random() * 5) + 1,
        appliedCount: Math.floor(Math.random() * 30) + 5,
        hiredCount: Math.floor(Math.random() * 3),
        createdBy: 'admin',
        updatedDate: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000)
      });
    }
    return postings;
  }

  private generateMockInterviews(): Interview[] {
    const interviews: Interview[] = [];
    const interviewerNames = ['John Manager', 'Sarah HR', 'Michael Tech', 'Emily Director'];
    const types = Object.values(InterviewType);
    const statuses = Object.values(InterviewStatus);

    for (let i = 0; i < 20; i++) {
      const candidate = this.candidates[Math.floor(Math.random() * this.candidates.length)];
      interviews.push({
        id: (this.interviewId++).toString(),
        candidateId: candidate.id,
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        position: candidate.appliedPosition,
        interviewType: types[Math.floor(Math.random() * types.length)] as InterviewType,
        status: statuses[Math.floor(Math.random() * statuses.length)] as InterviewStatus,
        scheduledDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        duration: [30, 45, 60, 90][Math.floor(Math.random() * 4)],
        interviewerId: 'interviewer_' + Math.floor(Math.random() * 10),
        interviewerName: interviewerNames[Math.floor(Math.random() * interviewerNames.length)],
        location: Math.random() > 0.5 ? 'Office - Room 101' : undefined,
        meetingLink: Math.random() > 0.5 ? 'https://zoom.us/meeting/sample' : undefined,
        notes: Math.random() > 0.7 ? 'Good communication skills, technical knowledge verified' : undefined,
        rating: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : undefined,
        feedback: Math.random() > 0.5 ? 'Strong fit for the role' : undefined,
        resultStatus: ['Pass', 'Fail', 'Pending'][Math.floor(Math.random() * 3)] as any
      });
    }
    return interviews;
  }

  private generateMockApplications(): Application[] {
    const applications: Application[] = [];
    this.candidates.slice(0, 15).forEach((candidate, index) => {
      applications.push({
        id: `app_${index}`,
        candidateId: candidate.id,
        positionId: this.jobPostings[Math.floor(Math.random() * this.jobPostings.length)].id,
        appliedDate: candidate.appliedDate,
        status: candidate.status as CandidateStatus,
        rating: candidate.rating || 3,
        source: candidate.source
      });
    });
    return applications;
  }

  getCandidates(filter?: CandidateFilter, pageNumber: number = 1, pageSize: number = 10): Observable<CandidateListResponse> {
    let filtered = [...this.candidates];

    if (filter?.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.firstName.toLowerCase().includes(term) ||
        c.lastName.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.appliedPosition.toLowerCase().includes(term)
      );
    }

    if (filter?.status) {
      filtered = filtered.filter(c => c.status === filter.status);
    }

    if (filter?.experienceLevel) {
      filtered = filtered.filter(c => c.experienceLevel === filter.experienceLevel);
    }

    if (filter?.position) {
      filtered = filtered.filter(c => c.appliedPosition === filter.position);
    }

    if (filter?.source) {
      filtered = filtered.filter(c => c.source === filter.source);
    }

    if (filter?.minRating) {
      filtered = filtered.filter(c => (c.rating || 0) >= filter.minRating!);
    }

    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;

    return of({
      data: filtered.slice(start, end),
      totalCount: filtered.length,
      pageNumber,
      pageSize
    }).pipe(delay(300));
  }

  getCandidateById(id: string): Observable<Candidate | undefined> {
    return of(this.candidates.find(c => c.id === id)).pipe(delay(200));
  }

  createCandidate(candidate: Omit<Candidate, 'id'>): Observable<Candidate> {
    const newCandidate: Candidate = {
      ...candidate,
      id: (this.candidateId++).toString()
    };
    this.candidates.push(newCandidate);
    return of(newCandidate).pipe(delay(300));
  }

  updateCandidate(id: string, updates: Partial<Candidate>): Observable<Candidate | undefined> {
    const candidate = this.candidates.find(c => c.id === id);
    if (candidate) {
      Object.assign(candidate, updates);
      return of(candidate).pipe(delay(300));
    }
    return of(undefined).pipe(delay(300));
  }

  deleteCandidate(id: string): Observable<boolean> {
    const index = this.candidates.findIndex(c => c.id === id);
    if (index > -1) {
      this.candidates.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  getJobPostings(filter?: JobPostingFilter, pageNumber: number = 1, pageSize: number = 10): Observable<JobPostingListResponse> {
    let filtered = [...this.jobPostings];

    if (filter?.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(term) ||
        j.department.toLowerCase().includes(term) ||
        j.description.toLowerCase().includes(term)
      );
    }

    if (filter?.department) {
      filtered = filtered.filter(j => j.department === filter.department);
    }

    if (filter?.status) {
      filtered = filtered.filter(j => j.status === filter.status);
    }

    if (filter?.location) {
      filtered = filtered.filter(j => j.location === filter.location);
    }

    if (filter?.jobType) {
      filtered = filtered.filter(j => j.jobType === filter.jobType);
    }

    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;

    return of({
      data: filtered.slice(start, end),
      totalCount: filtered.length,
      pageNumber,
      pageSize
    }).pipe(delay(300));
  }

  getJobPostingById(id: string): Observable<JobPosting | undefined> {
    return of(this.jobPostings.find(j => j.id === id)).pipe(delay(200));
  }

  createJobPosting(posting: Omit<JobPosting, 'id' | 'appliedCount' | 'hiredCount' | 'updatedDate'>): Observable<JobPosting> {
    const newPosting: JobPosting = {
      ...posting,
      id: (this.jobPostingId++).toString(),
      appliedCount: 0,
      hiredCount: 0,
      updatedDate: new Date()
    };
    this.jobPostings.push(newPosting);
    return of(newPosting).pipe(delay(300));
  }

  updateJobPosting(id: string, updates: Partial<JobPosting>): Observable<JobPosting | undefined> {
    const posting = this.jobPostings.find(j => j.id === id);
    if (posting) {
      Object.assign(posting, updates, { updatedDate: new Date() });
      return of(posting).pipe(delay(300));
    }
    return of(undefined).pipe(delay(300));
  }

  deleteJobPosting(id: string): Observable<boolean> {
    const index = this.jobPostings.findIndex(j => j.id === id);
    if (index > -1) {
      this.jobPostings.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  getInterviews(filter?: InterviewFilter, pageNumber: number = 1, pageSize: number = 10): Observable<InterviewListResponse> {
    let filtered = [...this.interviews];

    if (filter?.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(i =>
        i.candidateName.toLowerCase().includes(term) ||
        i.position.toLowerCase().includes(term) ||
        i.interviewerName.toLowerCase().includes(term)
      );
    }

    if (filter?.status) {
      filtered = filtered.filter(i => i.status === filter.status);
    }

    if (filter?.interviewType) {
      filtered = filtered.filter(i => i.interviewType === filter.interviewType);
    }

    if (filter?.interviewerId) {
      filtered = filtered.filter(i => i.interviewerId === filter.interviewerId);
    }

    if (filter?.startDate && filter?.endDate) {
      filtered = filtered.filter(i =>
        i.scheduledDate >= filter.startDate! && i.scheduledDate <= filter.endDate!
      );
    }

    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;

    return of({
      data: filtered.slice(start, end),
      totalCount: filtered.length,
      pageNumber,
      pageSize
    }).pipe(delay(300));
  }

  getInterviewById(id: string): Observable<Interview | undefined> {
    return of(this.interviews.find(i => i.id === id)).pipe(delay(200));
  }

  createInterview(interview: Omit<Interview, 'id'>): Observable<Interview> {
    const newInterview: Interview = {
      ...interview,
      id: (this.interviewId++).toString()
    };
    this.interviews.push(newInterview);
    return of(newInterview).pipe(delay(300));
  }

  updateInterview(id: string, updates: Partial<Interview>): Observable<Interview | undefined> {
    const interview = this.interviews.find(i => i.id === id);
    if (interview) {
      Object.assign(interview, updates);
      return of(interview).pipe(delay(300));
    }
    return of(undefined).pipe(delay(300));
  }

  deleteInterview(id: string): Observable<boolean> {
    const index = this.interviews.findIndex(i => i.id === id);
    if (index > -1) {
      this.interviews.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  getPipelineData(): Observable<PipelineData> {
    const grouped: PipelineData = {
      new: [],
      screening: [],
      interviewed: [],
      shortlisted: [],
      offerExtended: [],
      hired: [],
      rejected: []
    };

    this.candidates.forEach(candidate => {
      switch (candidate.status) {
        case CandidateStatus.NEW:
          grouped.new.push(candidate);
          break;
        case CandidateStatus.SCREENING:
          grouped.screening.push(candidate);
          break;
        case CandidateStatus.INTERVIEWED:
          grouped.interviewed.push(candidate);
          break;
        case CandidateStatus.SHORTLISTED:
          grouped.shortlisted.push(candidate);
          break;
        case CandidateStatus.OFFER_EXTENDED:
          grouped.offerExtended.push(candidate);
          break;
        case CandidateStatus.HIRED:
          grouped.hired.push(candidate);
          break;
        case CandidateStatus.REJECTED:
          grouped.rejected.push(candidate);
          break;
      }
    });

    return of(grouped).pipe(delay(300));
  }

  getRecruitmentMetrics(): Observable<RecruitmentMetrics> {
    const metrics: RecruitmentMetrics = {
      totalCandidates: this.candidates.length,
      activePositions: this.jobPostings.filter(j => j.status === JobPostingStatus.ACTIVE).length,
      applicationsThisMonth: Math.floor(Math.random() * 50) + 10,
      hiredThisMonth: Math.floor(Math.random() * 8) + 1,
      averageTimeToHire: 25,
      conversionRate: 8.5
    };
    return of(metrics).pipe(delay(300));
  }

  getDepartments(): Observable<string[]> {
    const departments = [...new Set(this.jobPostings.map(j => j.department))];
    return of(departments).pipe(delay(200));
  }

  getPositions(): Observable<string[]> {
    const positions = [...new Set(this.candidates.map(c => c.appliedPosition))];
    return of(positions).pipe(delay(200));
  }

  getSources(): Observable<string[]> {
    const sources = [...new Set(this.candidates.map(c => c.source))];
    return of(sources).pipe(delay(200));
  }

  getInterviewTypes(): Observable<string[]> {
    return of(Object.values(InterviewType)).pipe(delay(200));
  }

  getLocations(): Observable<string[]> {
    const locations = [...new Set(this.jobPostings.map(j => j.location))];
    return of(locations).pipe(delay(200));
  }
}
