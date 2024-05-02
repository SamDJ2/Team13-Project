import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { EntriesFeatureService } from '../entities/entries-feature/service/entries-feature.service';
import { EntriesFeature, NewEntriesFeature } from '../entities/entries-feature/entries-feature.model';
import { default as dayjs } from 'dayjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'jhi-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss'],
})
export class EntriesComponent implements OnInit {
  account$?: Observable<Account | null>;
  currentUsername?: string;
  theme: 'light' | 'dark' = 'dark';
  fontSizeMultiplier: number = 1;
  entryFeature: EntriesFeature = {
    id: 0,
    title: null,
    content: null,
    date: null,
  };
  entries: EntriesFeature[] = [];
  filteredEntries: EntriesFeature[] = [];
  searchTerm: string = '';

  formatDate(date: string | dayjs.Dayjs | null | undefined): string | null {
    if (!date) return null;
    const formattedDate = dayjs(date).isValid() ? dayjs(date) : dayjs();
    return formattedDate.toDate().toISOString();
  }

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private entriesFeatureService: EntriesFeatureService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loadScript('vendor/jquery/jquery.min.js')
      .then(() => this.loadScript('vendor/bootstrap/js/bootstrap.min.js'))
      .then(() => this.loadScript('assets/js/isotope.min.js'))
      .then(() => this.loadScript('assets/js/owl-carousel.js'))
      .then(() => this.loadScript('assets/js/tabs.js'))
      .then(() => this.loadScript('assets/js/popup.js'))
      .then(() => this.loadScript('assets/js/custom.js'))
      .then(() => this.loadScript('assets/js/MoodJournal.js'))
      .then(() => {
        console.log('All scripts loaded successfully');
      })
      .catch(error => {
        console.error('Script loading error:', error);
      });
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
    this.loadEntries();
    this.filteredEntries = this.entries;
  }

  getFontSizeKey(): string {
    return `fontSizeMultiplier_${this.currentUsername || 'default'}`;
  }

  updateFontSize(): void {
    localStorage.setItem(this.getFontSizeKey(), this.fontSizeMultiplier.toString());
  }

  getThemeKey(): string {
    return `theme_${this.currentUsername || 'default'}`;
  }

  toggleTheme(): void {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(this.getThemeKey(), this.theme);
  }
  loadEntries(): void {
    this.entriesFeatureService.getAll().subscribe((data: EntriesFeature[]) => {
      this.entries = data.sort((a, b) => {
        const dateA = dayjs(a.date);
        const dateB = dayjs(b.date);
        return dateB.valueOf() - dateA.valueOf(); // Sort in descending order
      });
      this.filteredEntries = this.entries;
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

  saveEntry(): void {
    const { id, ...submissionEntry } = this.entryFeature;
    this.entriesFeatureService.create(submissionEntry as NewEntriesFeature).subscribe({
      next: (res: HttpResponse<EntriesFeature>) => {
        console.log('Entry saved:', res.body);
        if (res.body) {
          this.entries.push(res.body);
          this.filteredEntries = this.entries;
          this.resetForm();
          this.closePopup();
        }
      },
      error: err => console.error('Error saving entry:', err),
      complete: () => {
        alert('Entry saved successfully!');
      },
    });
  }

  openPopup(): void {
    const popup = document.getElementById('addEntryPopup');
    if (popup) {
      this.renderer.setStyle(popup, 'display', 'block');
    }
  }

  closePopup(): void {
    const popup = document.getElementById('addEntryPopup');
    if (popup) {
      this.renderer.setStyle(popup, 'display', 'none');
    }
  }

  resetForm(): void {
    this.entryFeature = {
      id: 0,
      title: null,
      content: null,
      date: null,
    };
  }

  deleteEntry(id: number): void {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.entriesFeatureService.delete(id).subscribe(
        () => {
          this.entries = this.entries.filter(entry => entry.id !== id);
          this.filteredEntries = this.filteredEntries.filter(entry => entry.id !== id);
          console.log('Entry deleted successfully');
        },
        error => {
          console.error('Error deleting entry:', error);
        }
      );
    }
  }

  filterEntries(): void {
    this.filteredEntries = this.entries
      .filter(
        entry =>
          entry.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          entry.content?.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = dayjs(a.date);
        const dateB = dayjs(b.date);
        return dateB.valueOf() - dateA.valueOf(); // Sort in descending order
      });
  }
}
