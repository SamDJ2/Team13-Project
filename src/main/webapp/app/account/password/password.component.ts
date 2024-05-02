import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; // Make sure Router is imported
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { PasswordService } from './password.service';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'jhi-password',
  templateUrl: './password.component.html',
})
export class PasswordComponent implements OnInit {
  fontSizeMultiplier: number = 1;
  theme: 'light' | 'dark' = 'dark';
  currentUsername?: string;
  doNotMatch = false;
  error = false;
  success = false;
  account$?: Observable<Account | null>;
  passwordForm = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: Validators.required }),
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
  });

  constructor(private passwordService: PasswordService, private accountService: AccountService, private router: Router) {} // Inject Router

  ngOnInit(): void {
    this.account$ = this.accountService.identity();
    this.account$.subscribe(account => {
      if (account) {
        this.currentUsername = account.login;
        const storedFontSize = localStorage.getItem(this.getFontSizeKey());
        if (storedFontSize) {
          this.fontSizeMultiplier = parseFloat(storedFontSize);
        }
        const storedTheme = localStorage.getItem(this.getThemeKey());
        if (storedTheme) {
          this.theme = storedTheme as 'light' | 'dark';
        }
      }
    });
    this.loadScript('vendor/jquery/jquery.min.js')
      .then(() => this.loadScript('vendor/bootstrap/js/bootstrap.min.js'))
      .then(() => this.loadScript('assets/js/isotope.min.js'))
      .then(() => this.loadScript('assets/js/owl-carousel.js'))
      .then(() => this.loadScript('assets/js/tabs.js'))
      .then(() => this.loadScript('assets/js/popup.js'))
      .then(() => this.loadScript('assets/js/custom.js'))
      .then(() => {
        console.log('All scripts loaded successfully');
      })
      .catch(error => {
        console.error('Script loading error:', error);
      });
  }

  private loadScript(scriptUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const body = document.body as HTMLDivElement;
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = false;
      script.onload = () => resolve();
      script.onerror = error => reject(error);
      body.appendChild(script);
    });
  }

  getFontSizeKey(): string {
    // Ensure there's a default key if username is not yet available
    return `fontSizeMultiplier_${this.currentUsername || 'default'}`;
  }

  updateFontSize(): void {
    // Save font size to local storage with username-specific key
    localStorage.setItem(this.getFontSizeKey(), this.fontSizeMultiplier.toString());
  }

  getThemeKey(): string {
    return `theme_${this.currentUsername || 'default'}`;
  }

  toggleTheme(): void {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(this.getThemeKey(), this.theme);
  }

  changePassword(): void {
    this.error = false;
    this.success = false;
    this.doNotMatch = false;

    const { newPassword, confirmPassword, currentPassword } = this.passwordForm.getRawValue();
    if (newPassword !== confirmPassword) {
      this.doNotMatch = true;
    } else {
      this.passwordService.save(newPassword, currentPassword).subscribe({
        next: () => {
          this.success = true;
          // Set a timeout of 3000 milliseconds before redirecting
          setTimeout(() => {
            this.router.navigate(['/Profilepage']); // Use the correct route for your profile page
          }, 5000);
        },
        error: () => (this.error = true),
      });
    }
  }
}
