import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { AuthUser } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  @Output() loggedIn = new EventEmitter<AuthUser>();

  name = '';
  email = '';
  mobileNumber = '';
  password = '';
  accountRole: 'CUSTOMER' | 'SHOPKEEPER' = 'CUSTOMER';
  message = '';
  isSignUp = false;
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private selectionService: SelectionService
  ) { }

  submit(): void {
    this.message = '';
    this.isSubmitting = true;
    const signingUp = this.isSignUp;
    const request = signingUp
      ? this.authService.signUp(
        this.name.trim(),
        this.email.trim(),
        this.password,
        this.mobileNumber.trim(),
        this.accountRole
      )
      : this.authService.signIn(this.email.trim(), this.password);

    request.subscribe({
      next: (user) => {
        this.isSubmitting = false;
        if (signingUp) {
          window.localStorage.clear();
          this.selectionService.clearCart();
          this.selectionService.setCustomerDetails({ name: '', phone: '', address: '' });
          this.isSignUp = false;
          this.name = '';
          this.email = '';
          this.mobileNumber = '';
          this.password = '';
          this.accountRole = 'CUSTOMER';
          this.message = user.role === 'SHOPKEEPER'
            ? 'Your SHOPKEEPER account was created. Sign in after an admin activates it.'
            : 'Your CUSTOMER account was created. Please sign in.';
          return;
        }

        if (user.enabled) {
          this.loggedIn.emit(user);
        } else {
          this.message = user.role === 'SHOPKEEPER'
            ? 'Your SHOPKEEPER account is waiting for admin activation.'
            : 'Your account is not active. Please contact the administrator.';
        }
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
    this.accountRole = 'CUSTOMER';
    this.name = '';
    this.email = '';
    this.mobileNumber = '';
    this.password = '';
    this.message = '';
  }
}
