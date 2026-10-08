import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, CustomerDetails, GlossaryItem, MealCounts, MealType, Selection, SelectedItemsMap, DateSelection } from '../models/selection.model';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  private currentDateSubject = new BehaviorSubject<string | null>(null);
  public currentDate$ = this.currentDateSubject.asObservable();

  private selection: Selection = {
    clientName: '',
    dates: [],
    dateSelections: {},
    currentDate: null
  };

  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();
  private customerDetails: CustomerDetails = { name: '', phone: '', address: '' };

  setClientName(clientName: string): void {
    this.selection.clientName = clientName;
  }

  setDates(dates: Date[]): void {
    this.selection.dates = dates;
    const dateStrings = dates.map((d) => d.toISOString().split('T')[0]);

    // Remove selections for deleted dates
    Object.keys(this.selection.dateSelections).forEach((dateStr) => {
      if (!dateStrings.includes(dateStr)) {
        delete this.selection.dateSelections[dateStr];
      }
    });

    // If new date added, initialize it and set as current
    if (dateStrings.length > 0) {
      const lastDateStr = dateStrings[dateStrings.length - 1];
      if (!this.selection.dateSelections[lastDateStr]) {
        this.selection.dateSelections[lastDateStr] = {
          mealCounts: {
            breakfast: 0,
            lunch: 0,
            dinner: 0,
            'high tea': 0
          },
          selectedItems: {
            breakfast: [],
            lunch: [],
            dinner: [],
            'high tea': []
          }
        };
      }
      this.setCurrentDate(lastDateStr);
    }
  }

  setCurrentDate(dateStr: string): void {
    this.selection.currentDate = dateStr;
    this.currentDateSubject.next(dateStr);
  }

  getCurrentDate(): string | null {
    return this.selection.currentDate;
  }

  setMealCount(meal: MealType, count: number): void {
    if (!this.selection.currentDate) return;
    const dateSelection = this.selection.dateSelections[this.selection.currentDate];
    if (dateSelection) {
      dateSelection.mealCounts[meal] = count;
    }
  }

  setSelectedItems(meal: MealType, items: string[]): void {
    if (!this.selection.currentDate) return;
    const dateSelection = this.selection.dateSelections[this.selection.currentDate];
    if (dateSelection) {
      dateSelection.selectedItems[meal] = items;
    }
  }

  getSelectedItems(meal: MealType): string[] {
    if (!this.selection.currentDate) return [];
    const dateSelection = this.selection.dateSelections[this.selection.currentDate];
    return dateSelection ? dateSelection.selectedItems[meal] || [] : [];
  }

  getMealCount(meal: MealType): number {
    if (!this.selection.currentDate) return 0;
    const dateSelection = this.selection.dateSelections[this.selection.currentDate];
    return dateSelection ? dateSelection.mealCounts[meal] || 0 : 0;
  }

  getSelection(): Selection {
    return this.selection;
  }

  getSelectionData(): Selection {
    return this.selection;
  }

  addToCart(item: GlossaryItem): void {
    const cart = [...this.cartSubject.value];
    const existingItem = cart.find((cartItem) => cartItem.item.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ item, quantity: 1 });
    }

    this.cartSubject.next(cart);
  }

  updateQuantity(itemId: string, quantity: number): void {
    const safeQuantity = Math.max(0, Math.floor(quantity));
    const cart = this.cartSubject.value
      .map((cartItem) => cartItem.item.id === itemId ? { ...cartItem, quantity: safeQuantity } : cartItem)
      .filter((cartItem) => cartItem.quantity > 0);
    this.cartSubject.next(cart);
  }

  getCart(): CartItem[] {
    return this.cartSubject.value;
  }

  getCartCount(): number {
    return this.cartSubject.value.reduce((total, cartItem) => total + cartItem.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartSubject.value.reduce((total, cartItem) => total + (cartItem.item.price * cartItem.quantity), 0);
  }

  clearCart(): void {
    this.cartSubject.next([]);
  }

  setCustomerDetails(details: CustomerDetails): void {
    this.customerDetails = { ...details };
  }

  getCustomerDetails(): CustomerDetails {
    return { ...this.customerDetails };
  }
}