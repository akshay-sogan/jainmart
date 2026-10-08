import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { MealSelectorComponent } from './components/meal-selector/meal-selector.component';
import { PeopleCounterComponent } from './components/people-counter/people-counter.component';
import { PdfExportComponent } from './components/pdf-export/pdf-export.component';
import { ProductManagerComponent } from './components/product-manager/product-manager.component';
import { LoginPageComponent } from './components/login-page/login-page.component';

@NgModule({
    declarations: [
        AppComponent,
        DatePickerComponent,
        MealSelectorComponent,
        PeopleCounterComponent,
        PdfExportComponent,
        ProductManagerComponent,
        LoginPageComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }