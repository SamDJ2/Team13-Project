import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HabitstrackingService } from '../entities/habitstracking/service/habitstracking.service';
import { AccountService } from '../core/auth/account.service';
import { IHabitstracking, NewHabitstracking } from '../entities/habitstracking/habitstracking.model';
import { Account } from 'app/core/auth/account.model';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@Component({
  selector: 'jhi-habits',
  templateUrl: './habits.component.html',
  styleUrls: ['./habits.component.scss'],
})
export class HabitsComponent implements OnInit {
  fontSizeMultiplier: number = 1;
  account$?: Observable<Account | null>;
  currentUsername?: string;
  theme: 'light' | 'dark' = 'dark';
  week: number = 1;
  addDay: string | undefined;
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  habits: { [key: string]: IHabitstracking[] } = {};
  username: string | undefined;
  addingHabit: { [key: string]: boolean } = {};
  newHabitName: { [key: string]: string } = {};
  predefinedHabits: string[] = ['Drink 2L of water', '4 hours of focus work', 'Gym', 'Eat healthy'];
  summary: string | undefined | null;
  date: string | undefined;
  weekNumbers = Array.from({ length: 52 }, (_, i) => i + 1);

  constructor(private router: Router, private weeklyService: HabitstrackingService, private accountService: AccountService) {}

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
    this.loadScriptsSequentially();
    this.initializeWeekData();
  }
  private loadScriptsSequentially(): void {
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
  }

  private initializeWeekData(): void {
    this.user();
    this.week = this.getCurrentWeekNumber();
    this.loadAllHabitsForWeek(this.week);
    this.daysOfWeek.forEach(day => {
      this.addingHabit[day] = false;
      this.newHabitName[day] = '';
    });
    this.loadSummary();
    this.getStartOfWeekMondayFirstAsString(this.week);
  }

  onWeekSelected(): void {
    this.loadAllHabits();
    this.loadSummary();
    this.loadAllHabitsForWeek(this.week);
  }

  getCurrentWeekNumber(): number {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.valueOf() - startOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
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

  getStartOfCurrentWeekMondayFirstAsString(): void {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dayOfWeek = now.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() - daysSinceMonday);
    const year = startOfCurrentWeek.getFullYear();
    const month = startOfCurrentWeek.getMonth() + 1;
    const day = startOfCurrentWeek.getDate();
    const monthPadded = month.toString().padStart(2, '0');
    const dayPadded = day.toString().padStart(2, '0');

    this.date = `${year}-${monthPadded}-${dayPadded}`;
  }

  getStartOfWeekMondayFirstAsString(weekNumber: number): void {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    // Adjust if the start of the year is not a Monday

    // Calculate the Monday of the given week number
    const daysToAdd = (weekNumber - 1) * 7;
    startOfYear.setDate(startOfYear.getDate() + daysToAdd);

    const year = startOfYear.getFullYear();
    const month = startOfYear.getMonth() + 1;
    const day = startOfYear.getDate();

    this.date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  user(): void {
    this.accountService.getAccount().subscribe({
      next: (account: any) => {
        this.username = account.login;
        console.log('Account fetched:', account);
      },
      error: (error: any) => {
        console.error('Error fetching account:', error);
      },
    });
  }

  loadAllHabits() {
    this.weeklyService.getAllHabitstrackings().subscribe(data => {
      // Initialize the habits object with keys for each day of the week
      this.daysOfWeek.forEach(day => {
        this.habits[day] = [];
      });

      // Organize habits by day of the week
      data.forEach(habit => {
        if (habit.dayOfHabit && this.habits[habit.dayOfHabit] && habit.weekOfHabit && habit.weekOfHabit === this.week) {
          this.habits[habit.dayOfHabit].push(habit);
        } else {
          console.log('no habits');
          console.log(this.week);
        }
      });
    });
  }

  loadAllHabitsForWeek(weekNumber: number): void {
    this.weeklyService.getHabitsByWeek(weekNumber).subscribe({
      next: (data: IHabitstracking[]) => {
        this.daysOfWeek.forEach(day => {
          this.habits[day] = data.filter(habit => habit.dayOfHabit === day);
        });
      },
      error: (error: any) => {
        console.error('Failed to load habits for week:', weekNumber, error);
      },
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

  // functionality code

  generateNewWeeklyHabitTracker() {
    const day = 'Monday'; // Hard-code Monday
    this.predefinedHabits.forEach(habitName => {
      const newHabit: NewHabitstracking = {
        id: null,
        nameOfHabit: habitName,
        dayOfHabit: day,
        weekOfHabit: this.week,
        completedHabit: false,
        usernameHabit: this.username,
        habitIDEN: null,
      };
      this.weeklyService.create(newHabit).subscribe({
        next: response => console.log('Habit created:', response),
        error: error => console.error('Error creating habit:', error),
      });
    });
    window.location.reload();
  }

  saveHabit(name: string, dayOfWeek: string, weekNumber: number): void {
    const iden = this.daysOfWeek.indexOf(dayOfWeek) + 1;
    const concatenatedString: string = iden.toString() + weekNumber.toString();
    const id: number = parseInt(concatenatedString, 10);
    const newHabit: NewHabitstracking = {
      habitIDEN: id,
      nameOfHabit: name,
      completedHabit: false,
      dayOfHabit: dayOfWeek,
      weekOfHabit: weekNumber,
      usernameHabit: this.username,
      id: null,
    };

    this.weeklyService.create(newHabit).subscribe({
      next: habit => {
        console.log('Saved successfully', habit);
      },
      error: () => {
        console.error('Error saving the habit');
      },
    });
    window.location.reload();
  }

  onHabitNameChange(newName: any, habitId: number): void {
    console.log(newName);
    if (this.addDay) {
      this.saveHabit(newName, this.addDay, this.week);
      console.log('saved');
      this.markNameAsFinalized(habitId);
    }
  }

  startAddingHabit(day: string): void {
    this.addingHabit[day] = true;
  }

  submitNewHabit(name: string, dayOfWeek: string): void {
    const weekNumber = this.week;
    this.saveHabit(name, dayOfWeek, weekNumber);
    this.addingHabit[dayOfWeek] = false;
    this.newHabitName[dayOfWeek] = '';
  }

  toggleHabitCompletion(habit: IHabitstracking): void {
    this.weeklyService.toggleCompletedHabit(habit).subscribe({
      next: response => {
        console.log('Habit completion toggled:', response.body);
      },
      error: error => {
        console.error('Error toggling habit completion', error);
      },
    });
  }

  markNameAsFinalized(habitId: number): void {
    const finalizedHabits = JSON.parse(localStorage.getItem('finalizedHabits') || '[]');
    if (!finalizedHabits.includes(habitId)) {
      finalizedHabits.push(habitId);
      localStorage.setItem('finalizedHabits', JSON.stringify(finalizedHabits));
    }
  }

  isNameFinalized(habitId: number): boolean {
    const finalizedHabits = JSON.parse(localStorage.getItem('finalizedHabits') || '[]');
    return finalizedHabits.includes(habitId);
  }

  removeHabit(day: string, habitId: number): void {
    this.habits[day] = this.habits[day].filter(habit => habit.id !== habitId);
    this.weeklyService.delete(habitId).subscribe({
      next: () => {
        console.log(`Habit with ID ${habitId} removed successfully.`);
      },
      error: error => {
        console.error('Error removing habit:', error);
      },
    });
  }

  saveSum(summary: string): void {
    // Retrieve all habit trackings
    this.weeklyService.getAllHabitstrackings().subscribe(data => {
      const currentWeekNumber = this.week;
      const currentWeekSummary = data.find(habit => habit.weekOfHabit === this.week && habit.summary);
      const id = currentWeekSummary?.id;

      // Check if an existing summary needs to be deleted
      if (id) {
        // Delete existing summary
        this.weeklyService.delete(id).subscribe({
          next: () => {
            // Only create a new summary after successful deletion
            this.createSummary(summary);
          },
          error: () => {
            console.error('Error deleting the habit');
          },
        });
      } else {
        // Directly create new summary if no deletion is needed
        this.createSummary(summary);
      }
    });

    window.location.reload();
  }

  // Helper function to create a new habit summary
  private createSummary(summary: string): void {
    const newHabit: NewHabitstracking = {
      habitIDEN: null,
      nameOfHabit: null,
      completedHabit: false,
      dayOfHabit: null,
      weekOfHabit: this.week,
      usernameHabit: this.username,
      summary: summary,
      id: null,
    };

    this.weeklyService.create(newHabit).subscribe({
      next: habit => {
        console.log('Saved successfully', habit);
        window.location.reload(); // Consider handling this differently for a better user experience
      },
      error: () => {
        console.error('Error saving the habit');
      },
    });
  }

  @ViewChild('summaryInput') summaryInput: ElementRef | undefined;

  loadSummary(): void {
    this.weeklyService.getAllHabitstrackings().subscribe(data => {
      const currentWeekNumber = this.week;
      const currentWeekSummary = data.find(habit => habit.weekOfHabit === currentWeekNumber && habit.summary != null);

      // Set the textarea value to the loaded summary or empty if no summary exists
      const summaryText = currentWeekSummary ? currentWeekSummary.summary : '';
      if (this.summaryInput && this.summaryInput.nativeElement) {
        this.summaryInput.nativeElement.value = summaryText;
      }
    });
  }
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  }
}
