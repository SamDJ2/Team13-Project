import { Component, OnInit, Renderer2, Output, EventEmitter, Input } from '@angular/core';
import { PromptsFeatureService } from '../entities/prompts-feature/service/prompts-feature.service';
import { PromptsFeature, NewPromptsFeature } from '../entities/prompts-feature/prompts-feature.model';
import { default as dayjs } from 'dayjs';
import { Router, RouterLinkWithHref } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { NewMoodPickerService, PartialUpdateNewMoodPicker } from '../entities/new-mood-picker/service/new-mood-picker.service';

import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { INewMoodPicker, NewNewMoodPicker } from '../entities/new-mood-picker/new-mood-picker.model';

import { AccountService } from '../core/auth/account.service';
import { finalize } from 'rxjs/operators';

import { Account } from 'app/core/auth/account.model';

export type EntityResponseType = HttpResponse<INewMoodPicker>;
export type EntityArrayResponseType = HttpResponse<INewMoodPicker[]>;

@Component({
  selector: 'jhi-prompts',
  templateUrl: './prompts.component.html',
  styleUrls: ['./prompts.component.scss'],
})
export class PromptsComponent implements OnInit {
  account$?: Observable<Account | null>;
  currentUsername?: string;
  theme: 'light' | 'dark' = 'dark';
  fontSizeMultiplier: number = 1;
  promptFeature: PromptsFeature = {
    id: 0,
    title: null,
    prompt: null,
    content: null,
    date: null,
  };
  prompts: PromptsFeature[] = [];
  filteredPromptedEntries: PromptsFeature[] = [];
  searchTerm: string = '';

  formatDate(date: string | dayjs.Dayjs | null | undefined): string | null {
    if (!date) return null;
    const formattedDate = dayjs(date).isValid() ? dayjs(date) : dayjs();
    return formattedDate.toDate().toISOString();
  }

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private promptsFeatureService: PromptsFeatureService,
    private moodpickerService: NewMoodPickerService,
    private http: HttpClient,
    private accountService: AccountService
  ) {}

  loggedin?: string;
  currentView?: string;
  chosenMood: string | null | undefined;
  firstName?: string | null = '';
  moodData?: INewMoodPicker[] | null;
  userMoodData?: INewMoodPicker | null;
  tempMoodPicker?: NewNewMoodPicker;

  ngOnInit(): void {
    this.loadScript('vendor/jquery/jquery.min.js')
      .then(() => this.loadMood())
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
    this.loadPromptedEntries();
    this.filteredPromptedEntries = this.prompts;
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

  loadPromptedEntries(): void {
    this.promptsFeatureService.getAll().subscribe((data: PromptsFeature[]) => {
      this.prompts = data.sort((a, b) => {
        const dateA = dayjs(a.date);
        const dateB = dayjs(b.date);
        return dateB.valueOf() - dateA.valueOf(); // Sort in descending order
      });
      this.filteredPromptedEntries = this.prompts;
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

  deletePromptedEntry(id: number): void {
    if (confirm('Are you sure you want to delete this prompt?')) {
      this.promptsFeatureService.delete(id).subscribe(
        () => {
          this.prompts = this.prompts.filter(prompt => prompt.id !== id);
          this.filteredPromptedEntries = this.filteredPromptedEntries.filter(prompt => prompt.id !== id);
          console.log('Prompt deleted successfully');
        },
        error => {
          console.error('Error deleting prompt:', error);
        }
      );
    }
  }

  filterPromptedEntries(): void {
    this.filteredPromptedEntries = this.prompts
      .filter(
        prompt =>
          prompt.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          prompt.content?.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = dayjs(a.date);
        const dateB = dayjs(b.date);
        return dateB.valueOf() - dateA.valueOf(); // Sort in descending order
      });
  }

  // Method to open the prompt popup
  openPromptPopup(): void {
    const popup = document.getElementById('addPromptPopup');
    if (popup) {
      this.renderer.setStyle(popup, 'display', 'block');
    }
  }

  // Method to close the prompt popup
  closePromptPopup(): void {
    const popup = document.getElementById('addPromptPopup');
    if (popup) {
      this.renderer.setStyle(popup, 'display', 'none');
    }
  }

  loadMood(): void {
    this.accountService.identity().subscribe(account => {
      if (account !== null) {
        this.loggedin = 'true';
        this.firstName = account.firstName;
        const username = account.login; // Assuming the user ID is stored in 'id' property
        console.log(username);
        this.moodpickerService.query().subscribe(response => {
          this.moodData = response.body;
          if (this.moodData) {
            let result = this.moodData.find(item => item.username === username);

            if (result) {
              if (result.mood == 'None') {
                this.currentView = 'None';
                this.chosenMood = 'None';
              } else {
                this.currentView = 'MoodChosen';
                this.chosenMood = result.mood;
              }

              this.userMoodData = result;
            } else {
              //create new newMoodPicker

              this.tempMoodPicker = {
                id: null,
                username: username,
                mood: 'None',
              };

              console.log('User mood not found, creating new newMoodPicker...');

              this.moodpickerService.create(this.tempMoodPicker).subscribe(newMood => {
                this.userMoodData = newMood.body;

                console.log('Created new newMoodPicker successfully:', this.userMoodData);
              });

              this.currentView = 'None';
              this.chosenMood = 'None';
            }

            console.log(this.moodData[0].username);
            console.log(this.moodData[0].mood);
          }
          console.log(response.body);
        });
      } else {
        console.error('User account not found.');
      }
    });
  }
}
