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
    @Output() productCreated = new EventEmitter<GlossaryItem>();

    productName = '';
    category = '';
    price: number | null = null;
    unit = '1 kg';
    description = '';
    message = '';
    saving = false;

    readonly units = ['1 kg', '500 g', '500 ml', '6 pack', '100 g', '1 piece'];

    constructor(private productCatalog: ProductCatalogService) { }

    addProduct(): void {
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
        this.message = 'Saving product...';
        this.productCatalog.createProduct(product).subscribe({
            next: (createdProduct) => {
                this.saving = false;
                this.productCreated.emit(createdProduct);
                this.productName = '';
                this.price = null;
                this.description = '';
                this.message = `${name} added to the catalog.`;
            },
            error: (error: HttpErrorResponse) => {
                this.saving = false;
                this.message = error.status
                    ? 'Product could not be saved. Please check the details and try again.'
                    : 'Catalog API is unavailable. Start the backend and try again.';
            }
        });
    }
}
