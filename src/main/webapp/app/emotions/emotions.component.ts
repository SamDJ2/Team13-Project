import { Component, OnInit, Renderer2, RendererFactory2, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PromptsFeatureService } from '../entities/prompts-feature/service/prompts-feature.service';
import { PromptsFeature, NewPromptsFeature } from '../entities/prompts-feature/prompts-feature.model';
import { default as dayjs } from 'dayjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NewMoodPickerService, PartialUpdateNewMoodPicker } from '../entities/new-mood-picker/service/new-mood-picker.service';

import { Observable } from 'rxjs';
import { INewMoodPicker, NewNewMoodPicker } from '../entities/new-mood-picker/new-mood-picker.model';

import { AccountService } from '../core/auth/account.service';
import { finalize } from 'rxjs/operators';
import { Account } from '../core/auth/account.model';

export type EntityResponseType = HttpResponse<INewMoodPicker>;
export type EntityArrayResponseType = HttpResponse<INewMoodPicker[]>;

@Component({
  selector: 'jhi-emotions',
  templateUrl: './emotions.component.html',
  styleUrls: ['./emotions.component.scss'],
})
export class EmotionsComponent implements OnInit, AfterViewInit {
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
  allPrompts: PromptsFeature[] = [];
  filteredPromptedEntries: PromptsFeature[] = [];
  searchTerm: string = '';
  private renderer: Renderer2;

  handle(event: any, i: any) {
    this.updateSelectedPrompt(i);
  }

  // Array of prompts
  promptOptions: { prompt: string }[] = [];

  constructor(
    private router: Router,
    private rendererFactory: RendererFactory2,
    private promptsFeatureService: PromptsFeatureService,
    private moodpickerService: NewMoodPickerService,
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
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
    this.filteredPromptedEntries = this.allPrompts;
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

  ngAfterViewInit() {
    (window as any).emotionsComponent = this;
  }

  loadPromptedEntries(): void {
    this.promptsFeatureService.getAll().subscribe((data: PromptsFeature[]) => {
      this.allPrompts = data.sort((a: PromptsFeature, b: PromptsFeature) => {
        const dateA = dayjs(a.date);
        const dateB = dayjs(b.date);
        return dateB.valueOf() - dateA.valueOf(); // Sort in descending order
      });
      this.filteredPromptedEntries = this.allPrompts;
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

  savePromptedEntry(): void {
    const { id, ...submissionPrompt } = this.promptFeature;
    this.promptsFeatureService.create(submissionPrompt as NewPromptsFeature).subscribe({
      next: (res: HttpResponse<PromptsFeature>) => {
        console.log('Prompted entry saved:', res.body);
        if (res.body) {
          this.allPrompts.push(res.body);
          this.filteredPromptedEntries = this.allPrompts;
          this.resetForm(); // Reset the form
          this.router.navigate(['/Prompts']); // Redirect to prompts page
        }
      },
      error: err => console.error('Error saving prompted entry:', err),
      complete: () => {
        alert('Prompted entry submitted successfully! You will now be redirected to the Prompts page to view your entry.');
        this.router.navigate(['/Prompts']); // Redirect to prompts page
      },
    });
  }

  setPrompt(promptIndex: number): void {
    this.promptFeature.prompt = this.promptOptions[promptIndex].prompt;
  }

  resetForm(): void {
    this.promptFeature = {
      id: this.promptFeature.id,
      title: null,
      prompt: null,
      content: null,
      date: null,
    };
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
                this.updatePromptOptions(this.chosenMood);
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
  updateSelectedPrompt(promptIndex: number): void {
    this.setPrompt(promptIndex);
  }

  updatePromptOptions(mood: string | null | undefined): void {
    if (mood != undefined) {
      this.promptOptions = this.getPromptsForMood(mood);
    }
  }
  getPromptsForMood(mood: string | null): { prompt: string }[] {
    switch (mood) {
      case 'Content':
        return [
          { prompt: 'What specific moments or actions make you feel truly content and at peace?' },
          { prompt: 'How do you maintain a sense of contentment during challenging times or setbacks?' },
          { prompt: 'Reflect on a time when you felt unexpectedly content. What led to that feeling?' },
          { prompt: 'In what ways has cultivating contentment positively impacted your relationships and daily life?' },
          { prompt: 'How do you differentiate between genuine contentment and temporary distractions or superficial happiness?' },
          { prompt: 'Explore the connection between gratitude and contentment in your life. How do they influence each other?' },
        ];
      case 'Motivated':
        return [
          { prompt: 'What specific goals or dreams ignite a fire within you to stay motivated?' },
          { prompt: 'How do you handle setbacks or challenges when pursuing your aspirations?' },
          { prompt: 'Reflect on a time when your motivation wavered – what did you learn from it?' },
          { prompt: 'Explore the role of self-discipline in sustaining long-term motivation.' },
          { prompt: 'How do you celebrate small victories along your journey to stay inspired?' },
          { prompt: 'In what ways has your sense of purpose evolved as you continue to pursue your passions?' },
        ];
      case 'Optimistic':
        return [
          { prompt: 'Reflect on a time when your optimism helped you overcome a challenging situation.' },
          { prompt: 'How do you maintain a positive outlook during times of uncertainty or adversity?' },
          { prompt: 'What strategies do you use to cultivate optimism in your daily life?' },
          { prompt: 'How does being optimistic influence your relationships with others?' },
          { prompt: 'Explore the connection between gratitude and optimism in your life.' },
          { prompt: 'How has embracing a hopeful mindset transformed your perspective on setbacks and failures?' },
        ];
      case 'Bored':
        return [
          { prompt: 'What activities or tasks do you typically find boring? Explore the underlying reasons.' },
          { prompt: 'How does boredom affect your mood and motivation? Reflect on its impact.' },
          { prompt: 'Identify three coping strategies you use when feeling bored. Evaluate their effectiveness.' },
          { prompt: 'Have you discovered any hidden passions or interests during periods of boredom?' },
          { prompt: 'Reflect on the positive aspects of being bored. How can it foster personal growth?' },
          { prompt: 'How can you transform moments of boredom into opportunities for creativity or self-reflection?' },
        ];
      case 'Distracted':
        return [
          { prompt: 'What triggers your distractions and how do they make you feel emotionally?' },
          { prompt: 'Reflect on a recent experience when distractions hindered your productivity. What lessons can you learn from it?' },
          { prompt: 'How do you usually cope with distractions? Are these methods effective in refocusing your attention?' },
          { prompt: 'What internal or external factors contribute to your tendency to get easily distracted?' },
          { prompt: 'Have distractions ever led you to unexpected positive outcomes or opportunities? Reflect on this.' },
          { prompt: 'In what ways can you cultivate mindfulness to overcome distractions and enhance your focus?' },
        ];
      case 'Unmotivated':
        return [
          { prompt: 'What specific thoughts or situations trigger your feelings of being unmotivated?' },
          { prompt: 'How does being unmotivated impact your daily life and relationships with others?' },
          { prompt: 'Are there any patterns or habits contributing to your lack of motivation?' },
          { prompt: 'Reflect on a time when you successfully overcame a period of being unmotivated. What strategies did you use?' },
          { prompt: 'What internal beliefs or fears might be holding you back from feeling motivated?' },
          { prompt: 'How can you reframe your perspective on being unmotivated as an opportunity for growth?' },
        ];
      case 'Irritable':
        return [
          { prompt: 'What triggers my irritability, and how can I proactively address those triggers?' },
          { prompt: 'How do I express my irritability, and how does it affect my relationships?' },
          { prompt: 'What coping mechanisms do I rely on when feeling irritable, and do they help or hinder?' },
          { prompt: 'Can I identify any patterns in my irritability, and what can I learn from these patterns?' },
          { prompt: 'How does my irritability impact my mental and physical well-being, and how can I improve it?' },
          { prompt: 'In what ways can I transform my irritability into patience, understanding, or personal growth?' },
        ];
      case 'Anxious':
        return [
          { prompt: 'What triggers your anxiety, and how can you recognize these triggers in the future?' },
          { prompt: 'Reflect on a recent anxious moment. What physical sensations did you experience?' },
          { prompt: 'How do you typically cope with anxiety? Are these methods healthy and effective?' },
          { prompt: 'What role does self-compassion play in managing your anxiety? How can you cultivate more of it?' },
          { prompt: 'Explore a time when you turned anxiety into motivation or growth. What did you learn?' },
          { prompt: 'How might reframing anxious thoughts into positive affirmations shift your mindset?' },
        ];
      case 'Tired':
        return [
          { prompt: 'What situations or responsibilities drain your energy the most? How can you address them?' },
          { prompt: 'Reflect on a time when feeling tired taught you something important about yourself or your priorities.' },
          { prompt: 'How do you typically cope with exhaustion? Are there healthier strategies you can explore?' },
          { prompt: 'In what ways does being tired affect your relationships with others? How can you communicate your needs better?' },
          { prompt: "What activities or habits rejuvenate you when you're feeling worn out? How can you incorporate them more regularly?" },
          { prompt: 'How do you tackle overwhelming tiredness? Are these strategies effective long-term?' },
        ];
      case null:
      case undefined:
        return [];
      default:
        return [];
    }
  }
}
