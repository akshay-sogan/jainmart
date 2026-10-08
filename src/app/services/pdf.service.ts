import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { MealType, Selection } from '../models/selection.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generatePdf(selection: Selection): void {
    const doc = new jsPDF();
    const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'high tea'];
    const clientName = selection.clientName || 'Client';

    // Generate filename based on client name
    const filename = `${clientName}-menu.pdf`;

    doc.text('Menu Selection', 20, 20);
    doc.text(`Client Name: ${clientName}`, 20, 30);

    let y = 45;

    // If multiple dates, show menu for each date
    if (selection.dates.length > 0) {
      selection.dates.forEach((date, dateIndex) => {
        const formattedDate = new Date(date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        const dateStr = new Date(date).toISOString().split('T')[0];
        const dateSelection = selection.dateSelections[dateStr];

        doc.text(`Date: ${formattedDate}`, 20, y);
        y += 10;

        if (dateSelection) {
          mealTypes.forEach((meal) => {
            const count = dateSelection.mealCounts[meal];
            const selectedItems = dateSelection.selectedItems[meal] || [];
            if (count > 0 || selectedItems.length > 0) {
              doc.text(`${meal.toUpperCase()}: ${count} people`, 25, y);
              y += 7;

              // Add selected items
              if (selectedItems.length > 0) {
                selectedItems.forEach((item) => {
                  doc.text(`• ${item}`, 30, y);
                  y += 6;
                });
                y += 2;
              }
            }
          });
        }

        // Add space between dates
        if (dateIndex < selection.dates.length - 1) {
          y += 8;
        }

        // Add new page if content exceeds page height
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
    }

    doc.save(filename);
  }
}