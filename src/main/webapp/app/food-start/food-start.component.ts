import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs/esm';
import { HistoryService } from '../entities/history/service/history.service';
import { AccountService } from '../core/auth/account.service';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { PointsService } from '../entities/points/service/points.service';
import { Account } from '../core/auth/account.model';

@Component({
  selector: 'jhi-food-start',
  templateUrl: './food-start.component.html',
  styleUrls: ['./food-start.component.scss'],
})
export class FoodStartComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private historyService: HistoryService,
    private pointsService: PointsService
  ) {}

  currentState: string | undefined;
  timers: { [timerId: string]: string } = {};
  challengeCompleted: { [timerId: string]: boolean } = {};
  timerIntervals: { [timerId: string]: any } = {};
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
      .then(() => this.loadScript('assets/js/custom.js'))
      .then(() => {
        console.log('All scripts loaded successfully');
        // Initialization or callback functions that depend on these scripts can go here
      })
      .catch(error => {
        console.error('Script loading error:', error);
      });

    this.route.params.subscribe(params => {
      // You might set a default state if 'state' param is not provided
      this.currentState = params['state']; // Could be undefined if not provided

      if (!this.currentState) {
        // Handle the case when currentState is undefined,
        // for example, by setting a default value or redirecting
        this.currentState = 'defaultState'; // Set a default state or implement other logic
      }
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

    // Timer code
    this.checkTimers();
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

  //timer code

  // Start a timer with a given id and duration in hours
  startTimer(timerId: string, durationInHours: number): void {
    const endTime = new Date().getTime() + durationInHours * 60 * 60 * 1000;
    localStorage.setItem(timerId, endTime.toString());
    this.challengeCompleted[timerId] = false; // Reset the completion status
    this.updateTimeLeft(timerId);
  }

  stopTimer(timerId: string): void {
    clearInterval(this.timerIntervals[timerId]);
    localStorage.removeItem(timerId);
    this.timers[timerId] = '';
    this.challengeCompleted[timerId] = false;
    delete this.timerIntervals[timerId]; // Clean up the interval reference
  }

  startChallenge(challengeName: string, challengeLevel: string) {
    this.accountService
      .identity()
      .pipe(
        tap(user => {
          if (user !== null) {
            const startDate = dayjs(); // Capture the current date and time
            this.historyService
              .createHistoryForChallenge(challengeName, challengeLevel, startDate)
              .pipe(
                tap(() => {
                  // History created successfully
                  console.log('History created successfully');
                  // Optionally, you can navigate to a different route or perform other actions upon successful creation of history
                }),
                catchError(error => {
                  // Handle error
                  console.error('Error creating history:', error);
                  return throwError(error); // Re-throw error for further handling if needed
                })
              )
              .subscribe();
          } else {
            // User is not logged in, handle the case accordingly
            console.log('User is not logged in.');
            // You might want to display a message to the user or redirect them to the login page
          }
        }),
        catchError(error => {
          // Handle error fetching user identity
          console.error('Error fetching user identity:', error);
          return throwError(error); // Re-throw error for further handling if needed
        })
      )
      .subscribe();
  }

  // This method combines starting the timer and the challenge
  startTimerAndChallenge(timerId: string, Duration: number, challengeName: string, challengeLevel: string) {
    this.startTimer(timerId, Duration); // Assuming this starts the timer
    this.startChallenge(challengeName, challengeLevel); // Initiates the challenge
  }

  // Method to stop the timer, could be extended to include challenge stopping logic
  stopTimerAndChallenge(timerId: string, challengeName: string, challengeLevel: string) {
    this.stopTimer(timerId); // Stop the timer
    this.startChallenge(challengeName, challengeLevel);
  }

  timerRunning(timerId: string): boolean {
    return !!localStorage.getItem(timerId);
  }

  updateTimeLeft(timerId: string): void {
    if (this.timerIntervals[timerId]) {
      clearInterval(this.timerIntervals[timerId]);
    }

    const updateTime = () => {
      const endTime = parseInt(localStorage.getItem(timerId) || '0');
      const currentTime = new Date().getTime();
      const timeLeft = endTime - currentTime;
      if (timeLeft <= 0) {
        clearInterval(this.timerIntervals[timerId]);
        localStorage.removeItem(timerId);
        this.timers[timerId] = '';
        this.challengeCompleted[timerId] = true;
      } else {
        this.timers[timerId] = this.formatTimeLeft(timeLeft);
      }
    };

    updateTime(); // Update immediately, then start interval
    this.timerIntervals[timerId] = setInterval(updateTime, 1000);
  }

  checkTimers(): void {
    // Dynamically check your timers here based on application needs
    const timerIds = ['F1', 'F2', 'F3', 'F4'];
    timerIds.forEach(timerId => {
      if (this.timerRunning(timerId)) {
        this.updateTimeLeft(timerId);
      } else {
        // If the timer is not found in localStorage, it might have been stopped or never started
        this.challengeCompleted[timerId] = !localStorage.getItem(timerId);
      }
    });
  }

  private formatTimeLeft(timeLeft: number): string {
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  sendPoints(points: number): void {
    this.pointsService.addPoints(points).subscribe({
      next: () => console.log('Points updated successfully'),
      error: error => console.error('Failed to update points:', error),
    });
  }

  deductPoints(pointsToDeduct: number): void {
    this.pointsService.deductPoints(pointsToDeduct).subscribe({
      next: () => console.log(`Deducted ${pointsToDeduct} points successfully.`),
      error: error => console.error('Failed to deduct points:', error),
    });
  }
}
