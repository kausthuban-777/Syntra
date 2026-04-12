import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Generic Confirmation Modal Component
 *
 * A reusable modal for confirmation dialogs across the application.
 * Can be used for delete confirmations, destructive actions, or any confirmation needed.
 *
 * Usage:
 * <app-confirmation-modal
 *   [isOpen]="showConfirmModal()"
 *   [title]="confirmModalConfig.title"
 *   [message]="confirmModalConfig.message"
 *   [confirmText]="confirmModalConfig.confirmText"
 *   [cancelText]="confirmModalConfig.cancelText"
 *   [isDanger]="confirmModalConfig.isDanger"
 *   (onConfirm)="handleConfirm()"
 *   (onCancel)="handleCancel()"
 * ></app-confirmation-modal>
 */
@Component({
  selector: 'app-confirmation-modal',
  imports: [CommonModule],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.css'
})
export class ConfirmationModal {
  /**
   * Controls modal visibility
   */
  @Input() isOpen = false;

  /**
   * Modal title
   */
  @Input() title = 'Confirm Action';

  /**
   * Modal message/description
   */
  @Input() message = 'Are you sure you want to proceed?';

  /**
   * Confirm button text
   */
  @Input() confirmText = 'Confirm';

  /**
   * Cancel button text
   */
  @Input() cancelText = 'Cancel';

  /**
   * If true, confirm button will be styled as danger (red)
   * Useful for destructive actions like delete
   */
  @Input() isDanger = false;

  /**
   * Emits when user confirms the action
   */
  @Output() onConfirm = new EventEmitter<void>();

  /**
   * Emits when user cancels or closes the modal
   */
  @Output() onCancel = new EventEmitter<void>();

  /**
   * Handle confirm button click
   */
  confirm(): void {
    this.onConfirm.emit();
    this.close();
  }

  /**
   * Handle cancel button click or overlay click
   */
  cancel(): void {
    this.onCancel.emit();
    this.close();
  }

  /**
   * Close modal without emitting any event
   */
  private close(): void {
    // Parent component will update isOpen signal based on events
  }

  /**
   * Prevent closing when clicking inside modal content
   */
  onContentClick(event: Event): void {
    event.stopPropagation();
  }
}
