import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  LeaveRequest,
  LeaveRequestFilter,
  LeaveRequestListResponse,
  LeaveRequestSummary,
  LeaveRequestStatus,
  LeaveType
} from '../models/leave-request.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
  private mockLeaveRequests: LeaveRequest[] = [
    {
      id: 'lr-001',
      employeeId: '1001',
      employeeName: 'Amina Patel',
      leaveType: LeaveType.Annual,
      startDate: new Date('2024-05-08'),
      endDate: new Date('2024-05-12'),
      submittedDate: new Date('2024-04-20'),
      status: LeaveRequestStatus.Pending,
      reason: 'Family vacation and personal rest',
      comments: 'Needs approval before end of month.'
    },
    {
      id: 'lr-002',
      employeeId: '1004',
      employeeName: 'Marco Diaz',
      leaveType: LeaveType.Sick,
      startDate: new Date('2024-05-02'),
      endDate: new Date('2024-05-04'),
      submittedDate: new Date('2024-04-29'),
      status: LeaveRequestStatus.Approved,
      approver: 'HR Manager',
      reviewedDate: new Date('2024-04-30'),
      reason: 'Medical leave for minor surgery',
      comments: 'Approved with paid leave entitlement.'
    },
    {
      id: 'lr-003',
      employeeId: '1003',
      employeeName: 'Priya Sharma',
      leaveType: LeaveType.Unpaid,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-10'),
      submittedDate: new Date('2024-04-18'),
      status: LeaveRequestStatus.Rejected,
      approver: 'HR Manager',
      reviewedDate: new Date('2024-04-22'),
      reason: 'Extended personal leave request',
      comments: 'Rejected due to team coverage requirements.'
    },
    {
      id: 'lr-004',
      employeeId: '1009',
      employeeName: 'Leila Sanders',
      leaveType: LeaveType.Paternity,
      startDate: new Date('2024-05-15'),
      endDate: new Date('2024-05-29'),
      submittedDate: new Date('2024-04-21'),
      status: LeaveRequestStatus.Pending,
      reason: 'Paternity leave request after expected birth date',
      comments: 'Request for full entitlement period.'
    },
    {
      id: 'lr-005',
      employeeId: '1007',
      employeeName: 'Ethan Ross',
      leaveType: LeaveType.Maternity,
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-08-15'),
      submittedDate: new Date('2024-04-25'),
      status: LeaveRequestStatus.Pending,
      reason: 'Maternity leave planning for second trimester',
      comments: 'Need confirmation on return date after health review.'
    }
  ];

  constructor() { }

  getLeaveRequests(
    filter?: LeaveRequestFilter,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Observable<LeaveRequestListResponse> {
    let filteredRequests = [...this.mockLeaveRequests];

    if (filter) {
      if (filter.searchTerm) {
        const searchTerm = filter.searchTerm.toLowerCase();
        filteredRequests = filteredRequests.filter(request =>
          request.employeeName.toLowerCase().includes(searchTerm) ||
          request.reason.toLowerCase().includes(searchTerm) ||
          request.leaveType.toLowerCase().includes(searchTerm)
        );
      }

      if (filter.status) {
        filteredRequests = filteredRequests.filter(request => request.status === filter.status);
      }

      if (filter.leaveType) {
        filteredRequests = filteredRequests.filter(request => request.leaveType === filter.leaveType);
      }
    }

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredRequests.slice(startIndex, endIndex);

    return of({
      data: paginatedData,
      totalCount: filteredRequests.length,
      pageNumber,
      pageSize
    });
  }

  updateLeaveRequestStatus(
    requestId: string,
    status: LeaveRequestStatus,
    approver: string,
    comments?: string
  ): Observable<LeaveRequest | undefined> {
    const request = this.mockLeaveRequests.find(item => item.id === requestId);
    if (!request) {
      return of(undefined);
    }

    request.status = status;
    request.approver = approver;
    request.reviewedDate = new Date();

    if (comments) {
      request.comments = comments;
    }

    return of(request);
  }

  getLeaveRequestSummary(): Observable<LeaveRequestSummary> {
    const totalCount = this.mockLeaveRequests.length;
    const pendingCount = this.mockLeaveRequests.filter(request => request.status === LeaveRequestStatus.Pending).length;
    const approvedCount = this.mockLeaveRequests.filter(request => request.status === LeaveRequestStatus.Approved).length;
    const rejectedCount = this.mockLeaveRequests.filter(request => request.status === LeaveRequestStatus.Rejected).length;

    return of({
      totalCount,
      pendingCount,
      approvedCount,
      rejectedCount
    });
  }
}
