import { Component, OnInit, OnDestroy, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DocumentService } from '../../../services/document.service';
import { DocumentTemplate, EmployeeDocument, ClientDocument, InactiveEmployeeDocument, DocumentCategory, DocumentStatus } from '../../../models/document.model';
import { TabNavigation, TabItem } from '../../shared/ui/tab-navigation/tab-navigation';
import { ConfirmationModal } from '../../shared/ui/confirmation-modal/confirmation-modal';

/**
 * Employee Documents Component
 *
 * Manages document handling across multiple sections:
 * - Template Documents: HR access to standard templates (insurance, offer letters, etc.)
 * - Employee Documents: Manage active employee submissions with status tracking
 * - Client Documents: Handle legal documents with employee associations
 * - Inactive Employee Documents: Manage separated employee records
 *
 * Features:
 * - Tab-based navigation between document sections
 * - Search and filtering capabilities
 * - Document status management
 * - Confirmation modals for destructive actions
 * - Professional UI with responsive design
 */
@Component({
  selector: 'app-employee-documents',
  imports: [CommonModule, FormsModule, TabNavigation, ConfirmationModal],
  templateUrl: './employee-documents.html',
  styleUrl: './employee-documents.css'
})
export class EmployeeDocuments implements OnInit, OnDestroy {
  private documentService = new DocumentService();
  private destroy$ = new Subject<void>();

  // ============ SIGNAL STATE ============
  // Active section/tab
  activeSection = signal<string>('templates');

  // Template documents
  templateDocuments = signal<DocumentTemplate[]>([]);
  templateSearchText = signal<string>('');
  templateFilterCategory = signal<string>('all');

  // Employee documents
  employeeDocuments = signal<EmployeeDocument[]>([]);
  employeeSearchText = signal<string>('');
  employeeFilterStatus = signal<string>('all');
  employeeFilterCategory = signal<string>('all');

  // Client documents
  clientDocuments = signal<ClientDocument[]>([]);
  clientSearchText = signal<string>('');
  clientFilterDocType = signal<string>('all');

  // Inactive employee documents
  inactiveDocuments = signal<InactiveEmployeeDocument[]>([]);
  inactiveSearchText = signal<string>('');

  // Confirmation modal state
  showConfirmationModal = signal<boolean>(false);
  confirmationData = signal<{
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  } | null>(null);

  // Tab configuration
  tabs: TabItem[] = [
    {
      id: 'templates',
      label: 'Templates',
      badge: 0
    },
    {
      id: 'employee-docs',
      label: 'Employee Documents',
      badge: 0
    },
    {
      id: 'client-docs',
      label: 'Client Documents',
      badge: 0
    },
    {
      id: 'inactive-docs',
      label: 'Inactive Employees',
      badge: 0
    }
  ];

  ngOnInit(): void {
    this.loadAllDocuments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============ TAB MANAGEMENT ============
  /**
   * Handle tab change event
   */
  onSectionChange(sectionId: string): void {
    this.activeSection.set(sectionId);
  }

  // ============ DOCUMENT LOADING ============
  /**
   * Load all documents from service
   */
  private loadAllDocuments(): void {
    // Load template documents
    this.documentService.getTemplateDocuments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.templateDocuments.set(response.data as DocumentTemplate[]);
        this.updateTabBadges();
      });

    // Load employee documents
    this.documentService.getEmployeeDocuments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.employeeDocuments.set(response.data as EmployeeDocument[]);
        this.updateTabBadges();
      });

    // Load client documents
    this.documentService.getClientDocuments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.clientDocuments.set(response.data as ClientDocument[]);
        this.updateTabBadges();
      });

    // Load inactive employee documents
    this.documentService.getInactiveEmployeeDocuments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.inactiveDocuments.set(response.data as InactiveEmployeeDocument[]);
        this.updateTabBadges();
      });
  }

  /**
   * Update tab badges with document counts
   */
  private updateTabBadges(): void {
    this.tabs = this.tabs.map(tab => ({
      ...tab,
      badge: this.getTabDocumentCount(tab.id)
    }));
  }

  /**
   * Get document count for tab badge
   */
  private getTabDocumentCount(tabId: string): number {
    switch (tabId) {
      case 'templates':
        return this.templateDocuments().length;
      case 'employee-docs':
        return this.employeeDocuments().length;
      case 'client-docs':
        return this.clientDocuments().length;
      case 'inactive-docs':
        return this.inactiveDocuments().length;
      default:
        return 0;
    }
  }

  // ============ FILTERED LISTS ============
  /**
   * Get filtered template documents
   */
  getFilteredTemplates(): DocumentTemplate[] {
    return this.templateDocuments().filter(doc => {
      const searchMatch = doc.name.toLowerCase().includes(this.templateSearchText().toLowerCase());
      const categoryMatch = this.templateFilterCategory() === 'all' || doc.category === this.templateFilterCategory();
      return searchMatch && categoryMatch;
    });
  }

  /**
   * Get filtered employee documents
   */
  getFilteredEmployeeDocs(): EmployeeDocument[] {
    return this.employeeDocuments().filter(doc => {
      const searchMatch =
        doc.documentName.toLowerCase().includes(this.employeeSearchText().toLowerCase()) ||
        doc.employeeName.toLowerCase().includes(this.employeeSearchText().toLowerCase());
      const statusMatch = this.employeeFilterStatus() === 'all' || doc.status === this.employeeFilterStatus();
      const categoryMatch = this.employeeFilterCategory() === 'all' || doc.category === this.employeeFilterCategory();
      return searchMatch && statusMatch && categoryMatch;
    });
  }

  /**
   * Get filtered client documents
   */
  getFilteredClientDocs(): ClientDocument[] {
    return this.clientDocuments().filter(doc => {
      const searchMatch =
        doc.clientName.toLowerCase().includes(this.clientSearchText().toLowerCase()) ||
        doc.documentName.toLowerCase().includes(this.clientSearchText().toLowerCase());
      const docTypeMatch = this.clientFilterDocType() === 'all' || doc.documentType === this.clientFilterDocType();
      return searchMatch && docTypeMatch;
    });
  }

  /**
   * Get filtered inactive documents
   */
  getFilteredInactiveDocs(): InactiveEmployeeDocument[] {
    return this.inactiveDocuments().filter(doc => {
      const searchMatch =
        doc.documentName.toLowerCase().includes(this.inactiveSearchText().toLowerCase()) ||
        doc.employeeName.toLowerCase().includes(this.inactiveSearchText().toLowerCase());
      return searchMatch;
    });
  }

  // ============ EMPLOYEE DOCUMENT ACTIONS ============
  /**
   * View/Download document
   */
  viewDocument(doc: any, docType: 'template' | 'employee' | 'client' | 'inactive'): void {
    // TODO: Implement file download via HTTP service
    const docName = docType === 'template' ? doc.name : doc.documentName;
    console.log(`View document: ${docName}`, doc);
  }

  /**
   * Edit document metadata or reassign
   */
  editDocument(doc: EmployeeDocument): void {
    // TODO: Implement document edit via HTTP service
    // TODO: Open edit modal/form for document properties
    console.log('Edit document:', doc);
  }

  /**
   * Update employee document status (for approval workflow)
   */
  updateDocumentStatus(doc: EmployeeDocument, newStatus: DocumentStatus): void {
    // TODO: Implement status update via HTTP service
    this.documentService.updateDocumentStatus(doc.id, newStatus, 'Current User');

    // Reload employee documents
    this.documentService.getEmployeeDocuments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => this.employeeDocuments.set(response.data as EmployeeDocument[]));
  }

  /**
   * Delete employee document with confirmation
   */
  deleteEmployeeDocument(doc: EmployeeDocument): void {
    this.confirmationData.set({
      title: 'Delete Document',
      message: `Are you sure you want to permanently delete "${doc.documentName}" submitted by ${doc.employeeName}?`,
      confirmText: 'Delete',
      onConfirm: () => {
        // TODO: Implement delete via HTTP service
        this.documentService.deleteEmployeeDocument(doc.id);

        // Reload employee documents
        this.documentService.getEmployeeDocuments()
          .pipe(takeUntil(this.destroy$))
          .subscribe(response => this.employeeDocuments.set(response.data as EmployeeDocument[]));

        this.showConfirmationModal.set(false);
      }
    });
    this.showConfirmationModal.set(true);
  }

  /**
   * Delete client document with confirmation
   */
  deleteClientDocument(doc: ClientDocument): void {
    this.confirmationData.set({
      title: 'Delete Document',
      message: `Are you sure you want to permanently delete "${doc.documentName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      onConfirm: () => {
        // TODO: Implement delete via HTTP service
        this.documentService.deleteClientDocument(doc.id);

        // Reload client documents
        this.documentService.getClientDocuments()
          .pipe(takeUntil(this.destroy$))
          .subscribe(response => this.clientDocuments.set(response.data as ClientDocument[]));

        this.showConfirmationModal.set(false);
      }
    });
    this.showConfirmationModal.set(true);
  }

  /**
   * Delete inactive employee document with confirmation
   */
  deleteInactiveDocument(doc: InactiveEmployeeDocument): void {
    this.confirmationData.set({
      title: 'Delete Document',
      message: `Are you sure you want to permanently delete "${doc.documentName}" for ${doc.employeeName}?`,
      confirmText: 'Delete',
      onConfirm: () => {
        // TODO: Implement delete via HTTP service
        this.documentService.deleteInactiveDocument(doc.id);

        // Reload inactive documents
        this.documentService.getInactiveEmployeeDocuments()
          .pipe(takeUntil(this.destroy$))
          .subscribe(response => this.inactiveDocuments.set(response.data as InactiveEmployeeDocument[]));

        this.showConfirmationModal.set(false);
      }
    });
    this.showConfirmationModal.set(true);
  }
  // ============ DOCUMENT UPLOAD ============
  /**
   * Handle file upload for employee document
   */
  onEmployeeDocumentUpload(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      // TODO: Implement file upload via HTTP service
      console.log('Files selected for upload:', files);
      // Reset input
      event.target.value = '';
    }
  }

  /**
   * Handle file upload for client document
   */
  onClientDocumentUpload(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      // TODO: Implement file upload via HTTP service
      console.log('Files selected for upload:', files);
      // Reset input
      event.target.value = '';
    }
  }

  /**
   * Handle file upload for inactive employee document
   */
  onInactiveDocumentUpload(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      // TODO: Implement file upload via HTTP service
      console.log('Files selected for upload:', files);
      // Reset input
      event.target.value = '';
    }
  }

  // ============ MODAL HANDLERS ============
  /**
   * Handle confirmation modal cancel
   */
  onConfirmationCancel(): void {
    this.showConfirmationModal.set(false);
    this.confirmationData.set(null);
  }

  /**
   * Handle confirmation modal confirm
   */
  onConfirmationConfirm(): void {
    const data = this.confirmationData();
    if (data?.onConfirm) {
      data.onConfirm();
    }
  }

  // ============ UTILITY METHODS ============
  /**
   * Get status badge color
   */
  getStatusBadgeClass(status: DocumentStatus): string {
    switch (status) {
      case DocumentStatus.Submitted:
        return 'badge-info';
      case DocumentStatus.Pending:
        return 'badge-warning';
      case DocumentStatus.UnderReview:
        return 'badge-primary';
      case DocumentStatus.Approved:
        return 'badge-success';
      case DocumentStatus.Rejected:
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  /**
   * Get category list for filters
   */
  getDocumentCategories(): Array<{ value: string; label: string }> {
    return [
      { value: 'all', label: 'All Categories' },
      { value: 'Insurance', label: 'Insurance' },
      { value: 'Contract', label: 'Contract' },
      { value: 'Identification', label: 'Identification' },
      { value: 'EducationalCertificate', label: 'Educational Certificate' },
      { value: 'ProfessionalCertificate', label: 'Professional Certificate' },
      { value: 'BankingDetails', label: 'Banking Details' },
      { value: 'TaxDocuments', label: 'Tax Documents' },
      { value: 'ComplianceDocuments', label: 'Compliance Documents' },
      { value: 'Other', label: 'Other' }
    ];
  }

  /**
   * Get status list for filters
   */
  getDocumentStatuses(): Array<{ value: string; label: string }> {
    return [
      { value: 'all', label: 'All Status' },
      { value: DocumentStatus.Submitted, label: 'Submitted' },
      { value: DocumentStatus.Pending, label: 'Pending Review' },
      { value: DocumentStatus.UnderReview, label: 'Under Review' },
      { value: DocumentStatus.Approved, label: 'Approved' },
      { value: DocumentStatus.Rejected, label: 'Rejected' }
    ];
  }

  /**
   * Get client document types
   */
  getClientDocumentTypes(): Array<{ value: string; label: string }> {
    return [
      { value: 'all', label: 'All Types' },
      { value: 'NDA', label: 'NDA' },
      { value: 'ServiceAgreement', label: 'Service Agreement' },
      { value: 'EmploymentContract', label: 'Employment Contract' },
      { value: 'Confidentiality', label: 'Confidentiality Agreement' },
      { value: 'Amendment', label: 'Amendment' },
      { value: 'Other', label: 'Other Agreement' }
    ];
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    return this.documentService.formatFileSize(bytes);
  }

  /**
   * Format date for display
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
