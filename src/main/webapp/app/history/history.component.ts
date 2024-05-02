import { Component, OnInit } from '@angular/core';
import { AccountService } from '../core/auth/account.service';
import { HistoryService } from '../entities/history/service/history.service';
import { IHistory } from '../entities/history/history.model';
import dayjs from 'dayjs/esm';
import { Observable } from 'rxjs';
import { Account } from '../core/auth/account.model';
@Component({
  selector: 'jhi-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  histories: IHistory[] = [];

  constructor(
    private historyService: HistoryService,
    private accountService: AccountService // Inject AccountService
  ) {}

  fontSizeMultiplier: number = 1;
  account$?: Observable<Account | null>;
  currentUsername?: string;
  theme: 'light' | 'dark' = 'dark';

  ngOnInit(): void {
    this.loadScript('vendor/jquery/jquery.min.js')
      .then(() => this.loadScript('vendor/bootstrap/js/bootstrap.min.js'))
      .then(() => this.loadScript('assets/js/owl-carousel.js'))
      .then(() => this.loadScript('assets/js/tabs.js'))
      .then(() => this.loadScript('assets/js/popup.js'))
      .then(() => {
        console.log('All scripts loaded successfully');
        // Initialization or callback functions that depend on these scripts can go here
      })
      .catch(error => {
        console.error('Script loading error:', error);
      });
    this.loadHistory();

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

  private loadScript(scriptUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const body = document.body as HTMLDivElement;
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = false; // Important for sequential loading
      script.onload = () => resolve();
      script.onerror = error => reject(error);
      body.appendChild(script);
    });
  }

  loadHistory(): void {
    this.accountService.identity().subscribe(
      account => {
        if (account !== null) {
          const username = account.login; // Assuming the user ID is stored in 'id' property
          this.historyService.getHistoriesByUser(username).subscribe(
            res => {
              this.histories = res.body || [];
            },
            error => {
              console.error('Error fetching history:', error);
            }
          );
        } else {
          console.error('User account not found.');
        }
      },
      error => {
        console.error('Error fetching user account:', error);
      }
    );
  }

  formatDate(dateInput: string | dayjs.Dayjs | null | undefined): string {
    if (!dateInput) return 'N/A'; // Handling null or undefined case

    // Ensure dateInput is a dayjs object, or create one from the string
    const date = typeof dateInput === 'string' ? dayjs(dateInput) : dateInput;

    // Return formatted date
    return date.format('MMMM D, YYYY h:mm A'); // Adjust formatting as desired
  }
}
