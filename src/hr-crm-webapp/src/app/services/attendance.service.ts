import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  AttendanceRecord,
  AttendanceFilter,
  AttendanceListResponse,
  AttendanceSummary,
  AttendanceStatus
} from '../models/attendance.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private mockAttendanceRecords: AttendanceRecord[] = [
    {
      id: 'att-001',
      employeeId: '1001',
      employeeName: 'Amina Patel',
      date: new Date(),
      status: AttendanceStatus.Present,
      checkInTime: new Date(new Date().setHours(9, 0, 0)),
      checkOutTime: new Date(new Date().setHours(17, 30, 0)),
      hoursWorked: 8.5
    },
    {
      id: 'att-002',
      employeeId: '1004',
      employeeName: 'Marco Diaz',
      date: new Date(),
      status: AttendanceStatus.OnLeave,
      leaveRequestId: 'lr-002',
      notes: 'Approved annual leave'
    },
    {
      id: 'att-003',
      employeeId: '1003',
      employeeName: 'Priya Sharma',
      date: new Date(),
      status: AttendanceStatus.Late,
      checkInTime: new Date(new Date().setHours(10, 15, 0)),
      checkOutTime: new Date(new Date().setHours(18, 0, 0)),
      hoursWorked: 7.75,
      notes: 'Traffic delay'
    },
    {
      id: 'att-004',
      employeeId: '1009',
      employeeName: 'Leila Sanders',
      date: new Date(),
      status: AttendanceStatus.Present,
      checkInTime: new Date(new Date().setHours(8, 45, 0)),
      checkOutTime: new Date(new Date().setHours(17, 15, 0)),
      hoursWorked: 8.5
    },
    {
      id: 'att-005',
      employeeId: '1007',
      employeeName: 'Ethan Ross',
      date: new Date(),
      status: AttendanceStatus.Absent,
      notes: 'Sick leave'
    }
  ];

  constructor() {}

  getAttendanceRecords(
    filter?: AttendanceFilter,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Observable<AttendanceListResponse> {
    let filteredRecords = [...this.mockAttendanceRecords];

    if (filter) {
      if (filter.date) {
        const filterDate = new Date(filter.date).toDateString();
        filteredRecords = filteredRecords.filter(record =>
          new Date(record.date).toDateString() === filterDate
        );
      }

      if (filter.employeeId) {
        filteredRecords = filteredRecords.filter(record => record.employeeId === filter.employeeId);
      }

      if (filter.status) {
        filteredRecords = filteredRecords.filter(record => record.status === filter.status);
      }
    }

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredRecords.slice(startIndex, endIndex);

    return of({
      data: paginatedData,
      totalCount: filteredRecords.length,
      pageNumber,
      pageSize
    });
  }

  updateAttendanceStatus(
    recordId: string,
    status: AttendanceStatus,
    notes?: string
  ): Observable<AttendanceRecord | undefined> {
    const record = this.mockAttendanceRecords.find(item => item.id === recordId);
    if (!record) {
      return of(undefined);
    }

    record.status = status;
    if (notes) {
      record.notes = notes;
    }

    return of(record);
  }

  getAttendanceSummary(date?: Date): Observable<AttendanceSummary> {
    const targetDate = date || new Date();
    const todayRecords = this.mockAttendanceRecords.filter(record =>
      new Date(record.date).toDateString() === targetDate.toDateString()
    );

    const totalEmployees = 5;
    const presentToday = todayRecords.filter(r => r.status === AttendanceStatus.Present).length;
    const absentToday = todayRecords.filter(r => r.status === AttendanceStatus.Absent).length;
    const onLeaveToday = todayRecords.filter(r => r.status === AttendanceStatus.OnLeave).length;
    const lateToday = todayRecords.filter(r => r.status === AttendanceStatus.Late).length;

    return of({
      totalEmployees,
      presentToday,
      absentToday,
      onLeaveToday,
      lateToday
    });
  }

  markAttendanceFromLeave(leaveRequestId: string, employeeId: string, date: Date): Observable<boolean> {
    const existingRecord = this.mockAttendanceRecords.find(r =>
      r.employeeId === employeeId && new Date(r.date).toDateString() === date.toDateString()
    );

    if (existingRecord) {
      existingRecord.status = AttendanceStatus.OnLeave;
      existingRecord.leaveRequestId = leaveRequestId;
      return of(true);
    }

    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId,
      employeeName: 'Employee Name',
      date,
      status: AttendanceStatus.OnLeave,
      leaveRequestId
    };

    this.mockAttendanceRecords.push(newRecord);
    return of(true);
  }
}
