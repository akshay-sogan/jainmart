import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlossaryItem } from './models/selection.model';
import { ProductCatalogService } from './services/product-catalog.service';
import { SelectionService } from './services/selection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'jain Mart';
  isLoggedIn = false;
  currentUser = '';
  searchTerm = '';
  activeCategory = 'All';
  cartOpen = false;
  checkoutOpen = false;
  orderPlaced = false;
  customerName = '';
  customerPhone = '';
  customerAddress = '';
  checkoutMessage = '';
  addedItemId = '';
  catalogMessage = '';
  readonly categories = ['All', 'Fresh produce', 'Dairy & eggs', 'Pantry', 'Snacks'];
  products: GlossaryItem[] = [];
  readonly productImages: { [id: string]: string } = {
    'farm-bananas': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=80', tomatoes: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=80', 'full-cream-milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=700&q=80', 'farm-eggs': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=700&q=80', 'basmati-rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80', 'toor-dal': 'https://images.unsplash.com/photo-1612708399807-7b1d0e1d3b10?auto=format&fit=crop&w=700&q=80', 'masala-chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=700&q=80', jaggery: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80'
  };

  constructor(
    public selectionService: SelectionService,
    private http: HttpClient,
    private productCatalog: ProductCatalogService
  ) { }

  ngOnInit(): void {
    this.productCatalog.getProducts().subscribe({
      next: (products) => this.products = products,
      error: () => {
        this.catalogMessage = 'Could not reach the catalog API. Showing the bundled catalog; product changes cannot be saved.';
        this.http.get<GlossaryItem[]>('assets/products.json').subscribe({
          next: (products) => this.products = products,
          error: () => this.catalogMessage = 'Products could not be loaded. Please refresh and try again.'
        });
      }
    });
  }

  login(userId: string): void {
    this.currentUser = userId; 
    this.isLoggedIn = true;
  }

  logout(): void {
    this.currentUser = '';
    this.isLoggedIn = false;
    this.cartOpen = false;
  }

  get isManagerUser(): boolean {
    return this.currentUser.toLowerCase() === 'chintu.sogani';
  }

  get filteredProducts(): GlossaryItem[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.products.filter((product) => (this.activeCategory === 'All' || product.category === this.activeCategory) && (!term || `${product.name} ${product.category}`.toLowerCase().includes(term)));
  }

  get cartItems() { return this.selectionService.getCart(); }

  addItem(product: GlossaryItem): void {
    this.selectionService.addToCart(product);
    this.addedItemId = product.id;
    window.setTimeout(() => this.addedItemId = '', 900);
  }

  updateQuantity(itemId: string, quantity: number): void { this.selectionService.updateQuantity(itemId, quantity); }

  openCheckout(): void {
    this.checkoutMessage = '';
    this.orderPlaced = false;
    this.checkoutOpen = true;
  }

  placeOrder(): void {
    if (!this.customerName.trim() || !this.customerPhone.trim() || !this.customerAddress.trim()) {
      this.checkoutMessage = 'Please enter your name, phone number, and delivery address.';
      return;
    }

    const customerName = this.customerName.trim();
    const customerPhone = this.customerPhone.trim();
    const customerAddress = this.customerAddress.trim();
    const orderItems = this.cartItems
      .map((cartItem) => `- ${cartItem.item.name} (${cartItem.item.unit}) x ${cartItem.quantity}: Rs. ${cartItem.item.price * cartItem.quantity}`)
      .join('\n');
    const orderMessage = [
      '*New jain Mart Order*',
      '',
      orderItems,
      '',
      `Total: Rs. ${this.selectionService.getCartTotal()}`,
      '',
      `Customer: ${customerName}`,
      `Phone: ${customerPhone}`,
      `Address: ${customerAddress}`
    ].join('\n');

    this.selectionService.setCustomerDetails({
      name: customerName,
      phone: customerPhone,
      address: customerAddress
    });
    window.open(`https://wa.me/919782272728?text=${encodeURIComponent(orderMessage)}`, '_blank', 'noopener,noreferrer');
    this.selectionService.clearCart();
    this.orderPlaced = true;
    this.checkoutMessage = '';
  }

  closeCheckout(): void {
    this.checkoutOpen = false;
    this.orderPlaced = false;
  }

  addProduct(product: GlossaryItem): void {
    this.products = [product, ...this.products];
    this.productImages[product.id] = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80';
    this.activeCategory = 'All';
  }
}