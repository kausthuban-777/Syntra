import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  DocumentTemplate,
  EmployeeDocument,
  ClientDocument,
  InactiveEmployeeDocument,
  DocumentCategory,
  DocumentStatus,
  ClientDocumentType,
  DocumentFilter,
  DocumentListResponse,
  DocumentUploadRequest
} from '../models/document.model';

/**
 * Document Service
 * Handles document management operations across all document types
 * Currently uses mock data, ready for database integration
 */
@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  // Mock Template Documents
  private mockTemplates: DocumentTemplate[] = [
    {
      id: 'template-1',
      name: 'Standard Offer Letter',
      category: DocumentCategory.OfferLetter,
      description: 'Standard offer letter template for full-time employees',
      fileUrl: '/assets/documents/offer-letter-template.pdf',
      fileName: 'offer-letter-template.pdf',
      uploadedDate: new Date('2024-01-15'),
      version: '2.1',
      fileSize: 245000
    },
    {
      id: 'template-2',
      name: 'Health Insurance Form',
      category: DocumentCategory.Insurance,
      description: 'Health insurance enrollment form',
      fileUrl: '/assets/documents/health-insurance-form.pdf',
      fileName: 'health-insurance-form.pdf',
      uploadedDate: new Date('2024-02-01'),
      version: '1.0',
      fileSize: 156000
    },
    {
      id: 'template-3',
      name: 'Annual Performance Appraisal',
      category: DocumentCategory.AppraisalLetter,
      description: 'Annual performance appraisal template',
      fileUrl: '/assets/documents/appraisal-template.pdf',
      fileName: 'appraisal-template.pdf',
      uploadedDate: new Date('2024-01-20'),
      version: '3.0',
      fileSize: 187000
    },
    {
      id: 'template-4',
      name: 'Internship Agreement',
      category: DocumentCategory.InternLetter,
      description: 'Internship letter and agreement template',
      fileUrl: '/assets/documents/internship-letter.pdf',
      fileName: 'internship-letter.pdf',
      uploadedDate: new Date('2024-03-01'),
      version: '1.5',
      fileSize: 134000
    },
    {
      id: 'template-5',
      name: 'Employment Contract',
      category: DocumentCategory.Contract,
      description: 'Standard employment contract',
      fileUrl: '/assets/documents/employment-contract.pdf',
      fileName: 'employment-contract.pdf',
      uploadedDate: new Date('2024-02-15'),
      version: '2.0',
      fileSize: 298000
    },
    {
      id: 'template-6',
      name: 'Non-Disclosure Agreement',
      category: DocumentCategory.ConfidentialAgreement,
      description: 'Standard NDA template',
      fileUrl: '/assets/documents/nda-template.pdf',
      fileName: 'nda-template.pdf',
      uploadedDate: new Date('2024-01-10'),
      version: '1.0',
      fileSize: 167000
    }
  ];

  // Mock Employee Documents
  private mockEmployeeDocuments: EmployeeDocument[] = [
    {
      id: 'emp-doc-1',
      documentName: 'Offer Letter',
      category: DocumentCategory.OfferLetter,
      employeeId: '1',
      employeeName: 'John Anderson',
      status: DocumentStatus.Submitted,
      submittedDate: new Date('2024-03-01'),
      fileUrl: '/assets/documents/john-offer.pdf',
      fileName: 'john-offer.pdf',
      fileSize: 245000,
      reviewedBy: 'Michael Brown',
      reviewedDate: new Date('2024-03-02')
    },
    {
      id: 'emp-doc-2',
      documentName: 'Health Insurance Form',
      category: DocumentCategory.Insurance,
      employeeId: '2',
      employeeName: 'Sarah Smith',
      status: DocumentStatus.Pending,
      dueDate: new Date('2024-04-15'),
      fileUrl: '',
      fileName: '',
      fileSize: 0,
      notes: 'Waiting for employee submission'
    },
    {
      id: 'emp-doc-3',
      documentName: 'Annual Performance Appraisal',
      category: DocumentCategory.AppraisalLetter,
      employeeId: '3',
      employeeName: 'Emily Johnson',
      status: DocumentStatus.UnderReview,
      submittedDate: new Date('2024-03-05'),
      fileUrl: '/assets/documents/emily-appraisal.pdf',
      fileName: 'emily-appraisal.pdf',
      fileSize: 187000,
      reviewedBy: 'Sarah Smith'
    },
    {
      id: 'emp-doc-4',
      documentName: 'Employment Contract',
      category: DocumentCategory.Contract,
      employeeId: '5',
      employeeName: 'Jessica Martinez',
      status: DocumentStatus.Approved,
      submittedDate: new Date('2024-02-20'),
      fileUrl: '/assets/documents/jessica-contract.pdf',
      fileName: 'jessica-contract.pdf',
      fileSize: 298000,
      reviewedBy: 'Michael Brown',
      reviewedDate: new Date('2024-02-21')
    },
    {
      id: 'emp-doc-5',
      documentName: 'NDA',
      category: DocumentCategory.ConfidentialAgreement,
      employeeId: '4',
      employeeName: 'David Chen',
      status: DocumentStatus.Rejected,
      submittedDate: new Date('2024-03-08'),
      fileUrl: '/assets/documents/david-nda.pdf',
      fileName: 'david-nda.pdf',
      fileSize: 167000,
      reviewedBy: 'Michael Brown',
      reviewedDate: new Date('2024-03-09'),
      notes: 'Please resubmit with corrections'
    }
  ];

  // Mock Client Documents
  private mockClientDocuments: ClientDocument[] = [
    {
      id: 'client-doc-1',
      documentName: 'Service Agreement - Acme Corp',
      clientName: 'Acme Corporation',
      documentType: ClientDocumentType.Agreement,
      description: 'Master service agreement with Acme Corp',
      fileUrl: '/assets/documents/acme-agreement.pdf',
      fileName: 'acme-agreement.pdf',
      uploadedDate: new Date('2024-02-01'),
      fileSize: 325000,
      uploadedBy: 'Michael Brown',
      relatedEmployees: ['1', '2', '5']
    },
    {
      id: 'client-doc-2',
      documentName: 'NDA - Tech Innovations Inc',
      clientName: 'Tech Innovations Inc',
      documentType: ClientDocumentType.NDA,
      description: 'Non-disclosure agreement',
      fileUrl: '/assets/documents/tech-nda.pdf',
      fileName: 'tech-nda.pdf',
      uploadedDate: new Date('2024-03-01'),
      fileSize: 198000,
      uploadedBy: 'Michael Brown',
      relatedEmployees: ['3', '4']
    },
    {
      id: 'client-doc-3',
      documentName: 'Contract Amendment - Global Solutions',
      clientName: 'Global Solutions Ltd',
      documentType: ClientDocumentType.Contract,
      description: 'Amendment to existing contract',
      fileUrl: '/assets/documents/global-amendment.pdf',
      fileName: 'global-amendment.pdf',
      uploadedDate: new Date('2024-03-10'),
      fileSize: 267000,
      uploadedBy: 'Sarah Smith',
      relatedEmployees: ['1', '3', '5']
    }
  ];

  // Mock Inactive Employee Documents
  private mockInactiveDocuments: InactiveEmployeeDocument[] = [
    {
      id: 'inactive-doc-1',
      documentName: 'Final Settlement Document',
      employeeId: 'inactive-001',
      employeeName: 'Thomas Wilson (Inactive)',
      category: DocumentCategory.Other,
      fileUrl: '/assets/documents/thomas-settlement.pdf',
      fileName: 'thomas-settlement.pdf',
      uploadedDate: new Date('2023-12-15'),
      fileSize: 234000,
      separationDate: new Date('2023-12-15')
    },
    {
      id: 'inactive-doc-2',
      documentName: 'Exit Interview Notes',
      employeeId: 'inactive-002',
      employeeName: 'Catherine Moore (Inactive)',
      category: DocumentCategory.Other,
      fileUrl: '/assets/documents/catherine-exit.pdf',
      fileName: 'catherine-exit.pdf',
      uploadedDate: new Date('2023-11-01'),
      fileSize: 145000,
      separationDate: new Date('2023-11-01')
    }
  ];

  constructor() { }

  // ============ TEMPLATE DOCUMENTS ============

  /**
   * Get all document templates
   */
  getTemplateDocuments(pageNumber: number = 1, pageSize: number = 10): Observable<DocumentListResponse> {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = this.mockTemplates.slice(startIndex, endIndex);

    return of({
      data: paginatedData,
      totalCount: this.mockTemplates.length,
      pageNumber,
      pageSize
    });
  }

  /**
   * Get unique document categories
   */
  getDocumentCategories(): Observable<DocumentCategory[]> {
    const categories = Array.from(new Set(
      [...this.mockEmployeeDocuments, ...this.mockTemplates]
        .map(doc => doc.category)
    ));
    return of(categories);
  }

  // ============ EMPLOYEE DOCUMENTS ============

  /**
   * Get employee documents with filtering
   */
  getEmployeeDocuments(
    filter?: DocumentFilter,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<DocumentListResponse> {
    let filteredDocs = [...this.mockEmployeeDocuments];

    if (filter) {
      if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase();
        filteredDocs = filteredDocs.filter(doc =>
          doc.documentName.toLowerCase().includes(term) ||
          doc.employeeName.toLowerCase().includes(term)
        );
      }

      if (filter.category) {
        filteredDocs = filteredDocs.filter(doc => doc.category === filter.category);
      }

      if (filter.status) {
        filteredDocs = filteredDocs.filter(doc => doc.status === filter.status);
      }

      if (filter.employeeId) {
        filteredDocs = filteredDocs.filter(doc => doc.employeeId === filter.employeeId);
      }
    }

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredDocs.slice(startIndex, endIndex);

    return of({
      data: paginatedData,
      totalCount: filteredDocs.length,
      pageNumber,
      pageSize
    });
  }

  /**
   * Upload employee document
   */
  uploadEmployeeDocument(request: DocumentUploadRequest): Observable<EmployeeDocument> {
    const newDoc: EmployeeDocument = {
      id: Math.random().toString(36).substr(2, 9),
      documentName: request.documentName,
      category: request.category,
      employeeId: request.employeeId || '',
      employeeName: 'Employee Name',
      status: DocumentStatus.Submitted,
      submittedDate: new Date(),
      fileUrl: `/assets/documents/${request.file.name}`,
      fileName: request.file.name,
      fileSize: request.file.size,
      notes: request.notes
    };

    this.mockEmployeeDocuments.push(newDoc);
    return of(newDoc);
  }

  /**
   * Update document status
   */
  updateDocumentStatus(
    documentId: string,
    status: DocumentStatus,
    reviewedBy: string
  ): Observable<EmployeeDocument | undefined> {
    const doc = this.mockEmployeeDocuments.find(d => d.id === documentId);
    if (doc) {
      doc.status = status;
      doc.reviewedBy = reviewedBy;
      doc.reviewedDate = new Date();
      return of(doc);
    }
    return of(undefined);
  }

  /**
   * Delete employee document
   */
  deleteEmployeeDocument(documentId: string): Observable<boolean> {
    const index = this.mockEmployeeDocuments.findIndex(d => d.id === documentId);
    if (index !== -1) {
      this.mockEmployeeDocuments.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  // ============ CLIENT DOCUMENTS ============

  /**
   * Get client documents
   */
  getClientDocuments(
    searchTerm?: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<DocumentListResponse> {
    let filteredDocs = [...this.mockClientDocuments];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredDocs = filteredDocs.filter(doc =>
        doc.documentName.toLowerCase().includes(term) ||
        doc.clientName.toLowerCase().includes(term)
      );
    }

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredDocs.slice(startIndex, endIndex);

    return of({
      data: paginatedData,
      totalCount: filteredDocs.length,
      pageNumber,
      pageSize
    });
  }

  /**
   * Upload client document
   */
  uploadClientDocument(
    documentName: string,
    clientName: string,
    documentType: ClientDocumentType,
    file: File,
    uploadedBy: string
  ): Observable<ClientDocument> {
    const newDoc: ClientDocument = {
      id: Math.random().toString(36).substr(2, 9),
      documentName,
      clientName,
      documentType,
      description: '',
      fileUrl: `/assets/documents/${file.name}`,
      fileName: file.name,
      uploadedDate: new Date(),
      fileSize: file.size,
      uploadedBy,
      relatedEmployees: []
    };

    this.mockClientDocuments.push(newDoc);
    return of(newDoc);
  }

  /**
   * Delete client document
   */
  deleteClientDocument(documentId: string): Observable<boolean> {
    const index = this.mockClientDocuments.findIndex(d => d.id === documentId);
    if (index !== -1) {
      this.mockClientDocuments.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  // ============ INACTIVE EMPLOYEE DOCUMENTS ============

  /**
   * Get inactive employee documents
   */
  getInactiveEmployeeDocuments(
    searchTerm?: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<DocumentListResponse> {
    let filteredDocs = [...this.mockInactiveDocuments];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredDocs = filteredDocs.filter(doc =>
        doc.documentName.toLowerCase().includes(term) ||
        doc.employeeName.toLowerCase().includes(term)
      );
    }

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredDocs.slice(startIndex, endIndex);

    return of({
      data: paginatedData,
      totalCount: filteredDocs.length,
      pageNumber,
      pageSize
    });
  }

  /**
   * Delete inactive employee document
   */
  deleteInactiveDocument(documentId: string): Observable<boolean> {
    const index = this.mockInactiveDocuments.findIndex(d => d.id === documentId);
    if (index !== -1) {
      this.mockInactiveDocuments.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
