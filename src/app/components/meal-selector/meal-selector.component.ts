import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlossaryItem } from '../../models/selection.model';
import { SelectionService } from '../../services/selection.service';

@Component({
    selector: 'app-meal-selector',
    templateUrl: './meal-selector.component.html',
    styleUrls: ['./meal-selector.component.scss']
})
export class MealSelectorComponent implements OnInit, OnDestroy {
    items: GlossaryItem[] = [
        { id: 'basmati-rice', name: 'Basmati Rice', category: 'Pantry', description: 'Long-grain rice with a fragrant, fluffy finish.', price: 120, unit: '1 kg' },
        { id: 'toor-dal', name: 'Toor Dal', category: 'Pantry', description: 'Everyday split pigeon peas for comforting dal.', price: 145, unit: '1 kg' },
        { id: 'turmeric', name: 'Turmeric Powder', category: 'Spices', description: 'Bright, earthy haldi for curries and tadka.', price: 68, unit: '200 g' },
        { id: 'chai', name: 'Masala Chai', category: 'Beverages', description: 'A warming blend of tea, cardamom and spice.', price: 95, unit: '250 g' },
        { id: 'jaggery', name: 'Organic Jaggery', category: 'Sweeteners', description: 'Rich, unrefined sweetness for desserts and chai.', price: 110, unit: '500 g' },
        { id: 'poha', name: 'Thick Poha', category: 'Breakfast', description: 'Light, nourishing flattened rice for breakfast bowls.', price: 72, unit: '500 g' }
    ];

    constructor(public selectionService: SelectionService) { }

    ngOnInit(): void { return; }

    ngOnDestroy(): void { return; }

    addItem(item: GlossaryItem): void {
        this.selectionService.addToCart(item);
    }
}
