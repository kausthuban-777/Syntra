export enum AttendanceStatus {
  Present = 'Present',
  Absent = 'Absent',
  Late = 'Late',
  OnLeave = 'On Leave',
  HalfDay = 'Half Day'
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: Date;
  status: AttendanceStatus;
  checkInTime?: Date;
  checkOutTime?: Date;
  hoursWorked?: number;
  notes?: string;
  leaveRequestId?: string;
}

export interface AttendanceFilter {
  date?: Date;
  employeeId?: string;
  status?: AttendanceStatus;
}

export interface AttendanceSummary {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
  lateToday: number;
}

export interface AttendanceListResponse {
  data: AttendanceRecord[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
