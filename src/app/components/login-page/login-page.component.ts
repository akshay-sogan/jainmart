import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  @Output() loggedIn = new EventEmitter<string>();

  userId = '';
  password = '';
  message = '';

  login(): void {
    const userId = this.userId.trim();

    if (!userId || !this.password.trim()) {
      this.message = 'Enter your user ID and password to continue.';
      return;
    }

    this.loggedIn.emit(userId);
  }
}
