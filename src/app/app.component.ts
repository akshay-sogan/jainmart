import { Component, OnInit } from '@angular/core';
import { AuthUser } from './models/auth.model';
import { AuthService } from './services/auth.service';
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
  isCheckingSession = true;
  currentUser = '';
  currentRole = '';
  sessionMessage = '';
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
  isLoadingProducts = true;
  products: GlossaryItem[] = [];

  constructor(
    public selectionService: SelectionService,
    private productCatalog: ProductCatalogService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser().subscribe({
      next: (user) => this.login(user),
      error: () => this.isCheckingSession = false
    });
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoadingProducts = true;
    this.catalogMessage = '';
    this.productCatalog.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoadingProducts = false;
      },
      error: () => {
        this.isLoadingProducts = false;
        this.catalogMessage = 'Products could not be loaded from the catalog API. Check the backend connection and try again.';
      }
    });
  }

  login(user: AuthUser): void {
    this.currentUser = user.name;
    this.currentRole = user.role;
    this.isLoggedIn = true;
    this.isCheckingSession = false;
  }

  logout(): void {
    this.authService.signOut().subscribe({
      next: () => this.clearSession(),
      error: () => this.sessionMessage = 'Could not sign out. Please check your connection and try again.'
    });
  }

  private clearSession(): void {
    this.sessionMessage = '';
    this.currentUser = '';
    this.currentRole = '';
    this.isLoggedIn = false;
    this.isCheckingSession = false;
    this.cartOpen = false;
  }

  get isAdminUser(): boolean {
    return this.currentRole === 'ADMIN';
  }

  get categories(): string[] {
    return ['All', ...Array.from(new Set(this.products.map((product) => product.category)))];
  }

  get productCategories(): string[] {
    return Array.from(new Set(this.products.map((product) => product.category)));
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
    this.activeCategory = 'All';
  }

  updateProduct(product: GlossaryItem): void {
    this.products = this.products.map((current) => current.id === product.id ? product : current);
  }

  removeProduct(productId: string): void {
    this.products = this.products.filter((product) => product.id !== productId);
  }
}