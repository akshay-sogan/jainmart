import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { AuthUser } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  @Output() loggedIn = new EventEmitter<AuthUser>();

  name = '';
  email = '';
  password = '';
  message = '';
  isSignUp = false;
  isSubmitting = false;

  constructor(private authService: AuthService) { }

  submit(): void {
    this.message = '';
    this.isSubmitting = true;
    const request = this.isSignUp
      ? this.authService.signUp(this.name.trim(), this.email.trim(), this.password)
      : this.authService.signIn(this.email.trim(), this.password);

    request.subscribe({
      next: (user) => {
        this.isSubmitting = false;
        this.loggedIn.emit(user);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.message = error.status === 0
          ? 'Could not connect to the account API. Start the backend and try again.'
          : error.error && typeof error.error.message === 'string'
            ? error.error.message
            : 'Sign-in failed. Please try again.';
      }
    });
  }

  toggleMode(): void {
    this.isSignUp = !this.isSignUp;
    this.message = '';
  }
}
