/**
 * Document Model
 * Represents different types of documents in the system
 */
export interface DocumentTemplate {
  id: string;
  name: string;
  category: DocumentCategory;
  description: string;
  fileUrl: string;
  fileName: string;
  uploadedDate: Date;
  version: string;
  fileSize: number; // in bytes
}

export interface EmployeeDocument {
  id: string;
  documentName: string;
  category: DocumentCategory;
  employeeId: string;
  employeeName: string;
  status: DocumentStatus;
  submittedDate?: Date;
  dueDate?: Date;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  notes?: string;
  reviewedBy?: string;
  reviewedDate?: Date;
}

export interface ClientDocument {
  id: string;
  documentName: string;
  clientName: string;
  documentType: ClientDocumentType;
  description: string;
  fileUrl: string;
  fileName: string;
  uploadedDate: Date;
  fileSize: number;
  uploadedBy: string;
  relatedEmployees?: string[]; // Employee IDs
}

export interface InactiveEmployeeDocument {
  id: string;
  documentName: string;
  employeeId: string;
  employeeName: string;
  category: DocumentCategory;
  fileUrl: string;
  fileName: string;
  uploadedDate: Date;
  fileSize: number;
  separationDate: Date;
}

export enum DocumentCategory {
  OfferLetter = 'Offer Letter',
  Insurance = 'Insurance',
  AppraisalLetter = 'Appraisal Letter',
  InternLetter = 'Intern Letter',
  Contract = 'Contract',
  ConfidentialAgreement = 'Confidential Agreement',
  Banking = 'Banking',
  IdentityProof = 'Identity Proof',
  EducationDocuments = 'Education Documents',
  Other = 'Other'
}

export enum DocumentStatus {
  Submitted = 'Submitted',
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  UnderReview = 'Under Review'
}

export enum ClientDocumentType {
  Contract = 'Contract',
  NDA = 'NDA',
  Agreement = 'Agreement',
  LegalForm = 'Legal Form',
  Correspondence = 'Correspondence',
  Other = 'Other'
}

export interface DocumentFilter {
  searchTerm?: string;
  category?: DocumentCategory;
  status?: DocumentStatus;
  employeeId?: string;
}

export interface DocumentUploadRequest {
  documentName: string;
  category: DocumentCategory;
  file: File;
  employeeId?: string;
  notes?: string;
}

export interface DocumentListResponse {
  data: EmployeeDocument[] | DocumentTemplate[] | ClientDocument[] | InactiveEmployeeDocument[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
