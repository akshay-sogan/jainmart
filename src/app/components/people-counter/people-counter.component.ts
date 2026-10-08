import { Component } from '@angular/core';

@Component({
  selector: 'app-people-counter',
  templateUrl: './people-counter.component.html',
  styleUrls: ['./people-counter.component.scss']
})
export class PeopleCounterComponent {
  count: number = 1;

  get peopleCount(): number {
    return this.count;
  }

  set peopleCount(value: number) {
    this.count = value;
  }

  increment(): void {
    this.count++;
  }

  decrement(): void {
    if (this.count > 1) {
      this.count--;
    }
  }
}