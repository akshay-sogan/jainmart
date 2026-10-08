import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { GlossaryItem } from '../../models/selection.model';
import { NewProduct, ProductCatalogService } from '../../services/product-catalog.service';

@Component({
    selector: 'app-product-manager',
    templateUrl: './product-manager.component.html',
    styleUrls: ['./product-manager.component.scss']
})
export class ProductManagerComponent {
    @Input() categories: string[] = [];
    @Input() products: GlossaryItem[] = [];
    @Output() productCreated = new EventEmitter<GlossaryItem>();
    @Output() productUpdated = new EventEmitter<GlossaryItem>();
    @Output() productDeleted = new EventEmitter<string>();

    productName = '';
    category = '';
    price: number | null = null;
    unit = '1 kg';
    description = '';
    message = '';
    saving = false;
    editingProductId: string | null = null;

    readonly units = ['1 kg', '500 g', '500 ml', '6 pack', '100 g', '1 piece'];

    constructor(private productCatalog: ProductCatalogService) { }

    saveProduct(): void {
        const name = this.productName.trim();
        const category = this.category.trim();
        const description = this.description.trim() || `Fresh ${name.toLowerCase()} for your everyday kitchen.`;

        if (!name || !category || this.price === null || this.price < 1) {
            this.message = 'Enter a product name, category, and a price greater than Rs. 0.';
            return;
        }

        const product: NewProduct = {
            name,
            category,
            description,
            price: Math.round(this.price),
            unit: this.unit
        };

        this.saving = true;
        this.message = this.editingProductId ? 'Updating product...' : 'Saving product...';
        const request = this.editingProductId
            ? this.productCatalog.updateProduct(this.editingProductId, product)
            : this.productCatalog.createProduct(product);
        request.subscribe({
            next: (savedProduct) => {
                this.saving = false;
                if (this.editingProductId) {
                    this.productUpdated.emit(savedProduct);
                    this.message = `${name} updated.`;
                } else {
                    this.productCreated.emit(savedProduct);
                    this.message = `${name} added to the catalog.`;
                }
                this.resetForm();
            },
            error: (error: HttpErrorResponse) => {
                this.saving = false;
                this.message = error.status
                    ? 'Product could not be saved. Check your access and the product details, then try again.'
                    : 'Catalog API is unavailable. Start the backend and try again.';
            }
        });
    }

    editProduct(product: GlossaryItem): void {
        this.editingProductId = product.id;
        this.productName = product.name;
        this.category = product.category;
        this.price = product.price;
        this.unit = product.unit;
        this.description = product.description;
        this.message = '';
    }

    cancelEdit(): void {
        this.resetForm();
        this.message = '';
    }

    deleteProduct(product: GlossaryItem): void {
        if (this.saving || !window.confirm(`Delete "${product.name}" from the catalog?`)) {
            return;
        }

        this.saving = true;
        this.message = `Deleting ${product.name}...`;
        this.productCatalog.deleteProduct(product.id).subscribe({
            next: () => {
                this.saving = false;
                this.productDeleted.emit(product.id);
                if (this.editingProductId === product.id) {
                    this.resetForm();
                }
                this.message = `${product.name} deleted from the catalog.`;
            },
            error: (error: HttpErrorResponse) => {
                this.saving = false;
                this.message = error.status === 404
                    ? 'This product no longer exists. Refresh the catalog and try again.'
                    : error.status
                        ? 'Product could not be deleted. Check your admin access and try again.'
                        : 'Catalog API is unavailable. Start the backend and try again.';
            }
        });
    }

    private resetForm(): void {
        this.editingProductId = null;
        this.productName = '';
        this.category = '';
        this.price = null;
        this.unit = this.units[0];
        this.description = '';
    }
}
