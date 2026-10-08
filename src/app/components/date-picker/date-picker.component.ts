import { Component } from '@angular/core';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent {
  clientName = '';
  phone = '';
  address = '';

  constructor(private selectionService: SelectionService) { }

  updateClientName(value: string): void {
    this.clientName = value;
    this.updateCustomerDetails();
  }

  updatePhone(value: string): void {
    this.phone = value;
    this.updateCustomerDetails();
  }

  updateAddress(value: string): void {
    this.address = value;
    this.updateCustomerDetails();
  }

  private updateCustomerDetails(): void {
    this.selectionService.setCustomerDetails({ name: this.clientName, phone: this.phone, address: this.address });
  }
}
