import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { NewMoodPickerService, PartialUpdateNewMoodPicker } from '../entities/new-mood-picker/service/new-mood-picker.service';
import { PointsService } from '../entities/points/service/points.service';
import { HabitstrackingService } from '../entities/habitstracking/service/habitstracking.service';
import { UserService } from '../entities/user/user.service';

import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { INewMoodPicker, NewNewMoodPicker } from '../entities/new-mood-picker/new-mood-picker.model';
import { IPoints } from '../entities/points/points.model';
import { IUserPoints } from '../entities/user-points/user-points.model';
import { IHabitstracking } from '../entities/habitstracking/habitstracking.model';
import { IUser, getUserIdentifier } from '../entities/user/user.model';

import { AccountService } from '../core/auth/account.service';
import { finalize } from 'rxjs/operators';
import { Account } from '../core/auth/account.model';

export type EntityResponseType = HttpResponse<INewMoodPicker>;
export type EntityArrayResponseType = HttpResponse<INewMoodPicker[]>;

@Component({
  selector: 'jhi-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private moodpickerService: NewMoodPickerService,
    private http: HttpClient,
    private accountService: AccountService,
    private pointsService: PointsService,
    private habittrackingService: HabitstrackingService,
    private userService: UserService
  ) {}

  loggedin?: string;

  currentView?: string;

  chosenMood: string | null | undefined;

  userName?: string | null = '';

  userID?: number;

  moodData?: INewMoodPicker[] | null;

  userMoodData?: INewMoodPicker | null;

  tempMoodPicker?: NewNewMoodPicker;

  pointsData?: IUserPoints[] | null;

  userPointsData?: IUserPoints | null;

  userCurrentPoints?: number | null | undefined;

  HTData?: IHabitstracking[] | null;

  userHTData?: IHabitstracking | null;

  userHabits: number[] = [0, 0];

  habitsfound?: string;

  week?: number;

  timeOfDay?: string = 'Welcome,';

  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  TIPSINDEX = [
    {
      Md: 'Content',
      tips: [
        'Try setting aside 10 minutes for meditation',
        "Make sure to stand up and walk around if you're sat for long periods of time",
        'Remember to stay hydrated!',
      ],
    },
    {
      Md: 'Motivated',
      tips: [
        'Try to step outside of your comfort zone and get into a new hobby',
        'Use your motivation to better yourself further, think of what else you could detox from in your lifestyle',
      ],
    },
    {
      Md: 'Optimistic',
      tips: [
        'Set yourself some goals for the future, so you can hold your future-self accountable',
        'Note down what makes you feel this way, no matter how small!',
      ],
    },
    {
      Md: 'Bored',
      tips: [
        'Meet up with friends or family, having someone to bounce energy off of can help',
        "Try something new, whether that'd be taking up a new hobby or exploring a new part of town",
      ],
    },
    {
      Md: 'Distracted',
      tips: [
        'Practice mindfulness techniques such as deep breathing and meditation',
        'Try to optimise the environment around you, to minimise the chances of your attention being pulled away from what your doing',
        'Take a more methodical approach to tasks and chores; doing things one by one will ensure each task gets your full attention',
      ],
    },
    {
      Md: 'Unmotivated',
      tips: [
        'Spend some time outdoors connecting with nature, even something like taking a stroll in the park can help inspire you',
        'Set small and achievable goals, and take pride in yourself when you completed them',
      ],
    },
    {
      Md: 'Irritable',
      tips: [
        'Take part in stress-relief activities, such as light exercise like yoga',
        'Try to identify what situations are triggers for you, and take steps to avoid them ',
        "Don't be too hard on yourself; understand that it's okay to feel irritable at times",
      ],
    },
    {
      Md: 'Anxious',
      tips: [
        "Try journaling about your mood, it can help you understand what's making you feel that way",
        'Call someone you know well and catch up, doing so can help shift your perspective on your own problems',
        'Meditating and focusing on deep breathing can help reduce feelings of tension and help you relax',
      ],
    },
    {
      Md: 'Tired',
      tips: [
        'Make sure to keep a regular sleep schedule',
        'Try setting an alarm to remind you to go to bed',
        'Ensure to eat a variety of foods, lack of nutrients can cause fatigue',
      ],
    },
  ];

  MOODINDEX = [
    { Em: 'Happy', Md: ['Content', 'Motivated', 'Optimistic'] },
    { Em: 'Neutral', Md: ['Bored', 'Distracted', 'Unmotivated'] },
    { Em: 'Sad', Md: ['Irritable', 'Anxious', 'Tired'] },
  ];

  //a11y setup

  fontSizeMultiplier: number = 1;
  account$?: Observable<Account | null>;
  currentUsername?: string;
  theme: 'light' | 'dark' = 'dark';

  switchView(view: string, mood: string | null | undefined = 'None'): void {
    this.currentView = view;
    if (this.chosenMood != mood) {
      this.chosenMood = mood;

      if (this.userMoodData) {
        let tempMood: PartialUpdateNewMoodPicker = {
          id: this.userMoodData.id,
          mood: mood,
        };

        this.moodpickerService.partialUpdate(tempMood).subscribe(newMood => {
          console.log('Updated newMoodPicker successfully:', newMood.body);
        });

        this.userMoodData.mood = mood;
      }
    }
  }

  ngOnInit(): void {
    this.loadScript('vendor/jquery/jquery.min.js')
      .then(() => this.loadScript('vendor/bootstrap/js/bootstrap.min.js'))
      .then(() => this.loadScript('assets/js/isotope.min.js'))
      .then(() => this.loadScript('assets/js/owl-carousel.js'))
      .then(() => this.loadScript('assets/js/tabs.js'))
      .then(() => this.loadScript('assets/js/popup.js'))
      .then(() => this.loadScript('assets/js/custom.js'))
      .then(() => {
        console.log('All scripts loaded successfully');
        // Initialization or callback functions that depend on these scripts can go here
      })
      .catch(error => {
        console.error('Script loading error:', error);
      });

    this.timeOfDay = this.getCurrentTime();
    this.week = this.getCurrentWeekNumber();

    this.loadMoodandProgress();

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

  getCurrentWeekNumber(): number {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.valueOf() - startOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  }

  getCurrentTime(): string {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour >= 0 && currentHour <= 4) {
      return 'Welcome,';
    } else if (currentHour >= 5 && currentHour <= 11) {
      return 'Good morning,';
    } else if (currentHour >= 12 && currentHour <= 16) {
      return 'Good afternoon,';
    } else if (currentHour >= 17 && currentHour <= 23) {
      return 'Good evening,';
    } else {
      return 'Welcome,';
    }
  }

  getCurrentDay(): string {
    const now = new Date();
    return this.daysOfWeek[now.getDay()];
  }

  loadMoodandProgress(): void {
    this.accountService.identity().subscribe(account => {
      if (account !== null) {
        this.loggedin = 'true';
        this.userName = account.login;
        const username = account.login;
        console.log(username);

        //gets user ID of logged-in user
        this.userService.query().subscribe(users => {
          if (users.body) {
            let result = users.body.find(user => user.login === username);

            if (result) {
              this.userID = result.id;
            } else {
              this.userID = 0;
            }
          }
          console.log('Request ran:', users.body);

          console.log(this.userID);

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

          this.pointsService.query().subscribe(response => {
            this.pointsData = response.body;
            if (this.pointsData) {
              let result = this.pointsData.find(item => item.userID === this.userID);

              if (result) {
                this.userPointsData = result;

                this.userCurrentPoints = this.userPointsData.currentPoints;
              } else {
                //create new newMoodPicker

                this.userCurrentPoints = 0;
              }
            }
            console.log(this.pointsData);
            console.log(this.userPointsData);
            console.log(response.body);
          });

          this.habittrackingService.query().subscribe(response => {
            this.HTData = response.body;
            if (this.HTData) {
              let result = this.HTData.filter(
                item =>
                  item['usernameHabit'] === username && item['weekOfHabit'] === this.week && item['dayOfHabit'] === this.getCurrentDay()
              );

              console.log(result);

              if (result.length !== 0) {
                this.habitsfound = 'true';

                this.userHabits[1] = result.length;

                this.userHabits[0] = result.filter(item => item['completedHabit'] === true).length;
              } else {
                //create new newMoodPicker

                this.habitsfound = 'false';
              }
            }
            console.log(response.body);

            console.log(this.userHabits);
          });
        });
      } else {
        console.error('User account not found.');
      }
    });

    //if user is not logged in, defaults to start point of moodpicker
    if (!this.loggedin) {
      this.loggedin = 'false';
      this.currentView = 'None';
      this.chosenMood = 'None';
    }

    if (!this.habitsfound) {
      this.habitsfound = 'false';
    }
  }
  goToPromptsPage(): void {
    this.router.navigate(['/Prompts']);
  }

  capitalizeFirstLetter(input: string | null | undefined): string | null | undefined {
    if (!input) return input;
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }
}
