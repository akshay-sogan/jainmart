import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { GlossaryItem } from '../../models/selection.model';
import { Shopkeeper, ShopkeeperAdminService } from '../../services/shopkeeper-admin.service';

@Component({
  selector: 'app-shopkeeper-manager',
  templateUrl: './shopkeeper-manager.component.html',
  styleUrls: ['./shopkeeper-manager.component.scss']
})
export class ShopkeeperManagerComponent implements OnInit {
  shopkeepers: Shopkeeper[] = [];
  loading = true;
  savingId = '';
  message = '';
  selectedShopkeeper: Shopkeeper | null = null;
  shopkeeperProducts: GlossaryItem[] = [];
  productsLoading = false;
  productsMessage = '';

  constructor(private shopkeeperAdmin: ShopkeeperAdminService) { }

  ngOnInit(): void {
    this.loadShopkeepers();
  }

  loadShopkeepers(): void {
    this.loading = true;
    this.message = '';
    this.shopkeeperAdmin.getShopkeepers().subscribe({
      next: (shopkeepers) => {
        this.shopkeepers = shopkeepers;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.message = error.status
          ? 'Shopkeepers could not be loaded. Check your admin access and try again.'
          : 'The catalog API is unavailable. Start the backend and try again.';
      }
    });
  }

  setEnabled(shopkeeper: Shopkeeper): void {
    this.savingId = shopkeeper.id;
    this.message = '';
    this.shopkeeperAdmin.setEnabled(shopkeeper.id, !shopkeeper.enabled).subscribe({
      next: (updatedShopkeeper) => {
        this.shopkeepers = this.shopkeepers.map((current) =>
          current.id === updatedShopkeeper.id ? updatedShopkeeper : current
        );
        if (this.selectedShopkeeper?.id === updatedShopkeeper.id) {
          this.selectedShopkeeper = updatedShopkeeper;
        }
        this.savingId = '';
      },
      error: (error: HttpErrorResponse) => {
        this.savingId = '';
        this.message = error.status
          ? 'Shopkeeper status could not be changed. Check your admin access and try again.'
          : 'The catalog API is unavailable. Start the backend and try again.';
      }
    });
  }

  showProducts(shopkeeper: Shopkeeper): void {
    if (this.selectedShopkeeper?.id === shopkeeper.id) {
      this.selectedShopkeeper = null;
      this.shopkeeperProducts = [];
      this.productsMessage = '';
      return;
    }

    this.selectedShopkeeper = shopkeeper;
    this.shopkeeperProducts = [];
    this.productsLoading = true;
    this.productsMessage = '';
    this.shopkeeperAdmin.getProducts(shopkeeper.id).subscribe({
      next: (products) => {
        if (this.selectedShopkeeper?.id !== shopkeeper.id) {
          return;
        }
        this.shopkeeperProducts = products;
        this.productsLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        if (this.selectedShopkeeper?.id !== shopkeeper.id) {
          return;
        }
        this.productsLoading = false;
        this.productsMessage = error.status
          ? 'Products for this shopkeeper could not be loaded. Check your admin access and try again.'
          : 'The catalog API is unavailable. Start the backend and try again.';
      }
    });
  }
}
