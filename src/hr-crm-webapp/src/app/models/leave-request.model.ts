export enum LeaveRequestStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

export enum LeaveType {
  Annual = 'Annual Leave',
  Sick = 'Sick Leave',
  Unpaid = 'Unpaid Leave',
  Maternity = 'Maternity Leave',
  Paternity = 'Paternity Leave',
  Other = 'Other'
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  submittedDate: Date;
  status: LeaveRequestStatus;
  reason: string;
  approver?: string;
  reviewedDate?: Date;
  comments?: string;
}

export interface LeaveRequestFilter {
  searchTerm?: string;
  status?: LeaveRequestStatus;
  leaveType?: LeaveType;
}

export interface LeaveRequestSummary {
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface LeaveRequestListResponse {
  data: LeaveRequest[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
