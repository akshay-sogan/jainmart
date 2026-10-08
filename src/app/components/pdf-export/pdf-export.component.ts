import { Component } from '@angular/core';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'app-pdf-export',
  templateUrl: './pdf-export.component.html',
  styleUrls: ['./pdf-export.component.scss']
})
export class PdfExportComponent {
  constructor(
    public selectionService: SelectionService
  ) { }

  checkoutOnWhatsApp(): void {
    const cart = this.selectionService.getCart();
    const customer = this.selectionService.getCustomerDetails();

    if (cart.length === 0) {
      return;
    }

    const orderLines = cart.map((cartItem) =>
      `${cartItem.item.name} x ${cartItem.quantity} (${cartItem.item.unit}) - ₹${cartItem.item.price * cartItem.quantity}`
    );
    const message = [
      'Hello Madhuram, I would like to place this order:',
      '',
      ...orderLines,
      '',
      `Total: ₹${this.selectionService.getCartTotal()}`,
      '',
      `Name: ${customer.name || 'Not provided'}`,
      `WhatsApp: ${customer.phone || 'Not provided'}`,
      `Address: ${customer.address || 'Not provided'}`
    ].join('\n');

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  }
}