import { Component, HostListener, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, ignoreElements } from 'rxjs';

interface groups {
  id: number;
  groupID: number;
  userID: number;
  leader: boolean;
  grouping: number;
}

interface Group {
  id: number;
  iD: String;
  groupingName: String;
  groupingPoints: number;
  remainingTime: string;
  currentDate: Date;
}

interface LeaderboardEntry {
  groupID: number;
  groupName: string;
  groupPoints: number;
  remainingTime: string;
  currentDate: Date;
  login: string;
  imageUrl: string;
  currentPoints: number;
  previousPoints: number;
  totalPoints: number;
}

interface newGroup {
  groupName: string;
}

interface joinGroup {
  groupID: number | null;
}

declare global {
  interface Window {
    leaderboardFunctions: any;
  }
}

@Component({
  selector: 'jhi-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  leaderboardData: LeaderboardEntry[] = [];
  sortedByCurrentPoints: LeaderboardEntry[] = [];
  sortedByPreviousPoints: LeaderboardEntry[] = [];
  sortedByTotalPoints: LeaderboardEntry[] = [];

  options: groups[] = [];
  selectedGroupId: number = 0;
  addGroupId: number = 0;

  createGroup: newGroup = { groupName: '' };
  newGrouping: Group = {
    id: 0,
    iD: '',
    groupingName: '',
    groupingPoints: 0,
    remainingTime: '',
    currentDate: new Date(),
  };
  joinGroup: joinGroup = { groupID: null };

  showCreateGroup: boolean = true;
  showDeleteConfirmation: boolean = false;
  showLeaveConfirmation: boolean = false;
  confirmationType: 'leave' | 'delete' | null = null;

  isCurrentUserLeader: boolean = false;

  timeLeft: any;
  countdownDisplay: string = '';

  fontSizeMultiplier: number = 1;
  minFontSize: number = 0.5;
  maxFontSize: number = 2;
  account$?: Observable<Account | null>;
  currentUsername?: string;
  theme: 'light' | 'dark' = 'dark';

  constructor(private http: HttpClient, private router: Router, private accountService: AccountService) {}

  ngOnInit(): void {
    this.account$ = this.accountService.identity();
    this.adjustSliderValues();
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
      .then(() => this.checkForAddGroup())
      .then(() => this.getGroupsData())
      .then(() => this.addNewGroupWindow())
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

  adjustSliderValues() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 1200 && screenWidth >= 993) {
      this.minFontSize = 0.3;
      this.maxFontSize = 1.3;
      this.fontSizeMultiplier = 1.3;
    } else if (screenWidth <= 992 && screenWidth >= 769) {
      this.minFontSize = 0.3;
      this.maxFontSize = 1;
      this.fontSizeMultiplier = 1;
    } else if (screenWidth <= 768 && screenWidth >= 577) {
      this.minFontSize = 0.3;
      this.maxFontSize = 0.7;
      this.fontSizeMultiplier = 0.7;
    } else if (screenWidth <= 576 && screenWidth >= 451) {
      this.minFontSize = 0.3;
      this.maxFontSize = 0.7;
      this.fontSizeMultiplier = 0.7;
    } else if (screenWidth <= 450 && screenWidth >= 351) {
      this.minFontSize = 0.2;
      this.maxFontSize = 0.5;
      this.fontSizeMultiplier = 0.5;
    } else if (screenWidth <= 350) {
      this.minFontSize = 0.1;
      this.maxFontSize = 0.4;
      this.fontSizeMultiplier = 0.4;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.adjustSliderValues();
  }

  private async checkForAddGroup() {
    try {
      const response = await this.http.get<Group>(`/api/groupings/by-name/ADDGROUP`).toPromise();
      if (response) {
        this.selectedGroupId = response?.id || 0;
        this.addGroupId = response?.id || 0;
      }
    } catch (error) {
      console.error('Error fetching group "ADDGROUP":', error);
      this.showCreateGroup = true;
    }
  }

  getOrdinalIndicator(rank: number): string {
    const j = rank % 10,
      k = rank % 100;
    if (j == 1 && k != 11) return 'st';
    if (j == 2 && k != 12) return 'nd';
    if (j == 3 && k != 13) return 'rd';
    return 'th';
  }

  getMedalImage(rank: number): string {
    switch (rank) {
      case 1:
        return 'assets/images/Medals/GoldMedal.webp';
      case 2:
        return 'assets/images/Medals/SilverMedal.webp';
      case 3:
        return 'assets/images/Medals/BronzeMedal.webp';
      default:
        return '';
    }
  }

  getBadgeImage(points: number): string {
    if (points >= 0 && points < 10) {
      return 'assets/images/Badges/Plant1.webp';
    } else if (points >= 10 && points < 20) {
      return 'assets/images/Badges/Plant2.webp';
    } else if (points >= 20 && points < 30) {
      return 'assets/images/Badges/Plant3.webp';
    } else if (points >= 30 && points < 40) {
      return 'assets/images/Badges/Mountain1.webp';
    } else if (points >= 40 && points < 50) {
      return 'assets/images/Badges/Mountain2.webp';
    } else if (points >= 50 && points < 60) {
      return 'assets/images/Badges/Mountain3.webp';
    } else if (points >= 60 && points < 70) {
      return 'assets/images/Badges/Planet1.webp';
    } else if (points >= 70 && points < 80) {
      return 'assets/images/Badges/Planet2.webp';
    } else if (points >= 80 && points < 90) {
      return 'assets/images/Badges/Planet3.webp';
    } else if (points >= 90 && points < 100) {
      return 'assets/images/Badges/Galaxy1.webp';
    } else if (points >= 100 && points < 110) {
      return 'assets/images/Badges/Galaxy2.webp';
    } else if (points >= 110 && points < 120) {
      return 'assets/images/Badges/Galaxy3.webp';
    } else {
      return 'assets/images/Badges/Galaxy3.webp';
    }
  }

  calculateWidth(entry: LeaderboardEntry): string {
    const highestScore = Math.max(...this.sortedByCurrentPoints.map(e => e.currentPoints));
    return `${(entry.currentPoints / highestScore) * 100}%`;
  }
  calculatePreviousWidth(entry: LeaderboardEntry): string {
    const highestScore = Math.max(...this.sortedByPreviousPoints.map(e => e.previousPoints));
    return `${(entry.previousPoints / highestScore) * 100}%`;
  }
  calculateTotalWidth(entry: LeaderboardEntry): string {
    const highestScore = Math.max(...this.sortedByTotalPoints.map(e => e.totalPoints));
    return `${(entry.totalPoints / highestScore) * 100}%`;
  }

  sortLeaderboardData(): void {
    this.sortedByCurrentPoints = [...this.leaderboardData].sort((a, b) => b.currentPoints - a.currentPoints);
    this.sortedByPreviousPoints = [...this.leaderboardData].sort((a, b) => b.previousPoints - a.previousPoints);
    this.sortedByTotalPoints = [...this.leaderboardData].sort((a, b) => b.totalPoints - a.totalPoints);
  }

  private updateCurrentUserLeadershipStatus(gid: number): void {
    console.log(gid);
    const selectedGroup = this.options.find(group => group.groupID == gid);
    console.log(`Selected Group: ${selectedGroup}`);
    if (selectedGroup && selectedGroup.leader !== undefined) {
      console.log(`Is Leader: ${selectedGroup.leader}`);
      this.isCurrentUserLeader = selectedGroup.leader;
    } else {
      this.isCurrentUserLeader = true;
    }
  }

  calculateGroupPoints(): number {
    return this.leaderboardData.reduce((acc, curr) => acc + curr.currentPoints, 0);
  }

  private getGroupsData() {
    this.http.get<groups[]>('api/members/groups').subscribe({
      next: data => {
        this.options = data;
      },
      error: error => {
        console.error('Error fetching group data:', error);
      },
      complete: () => {
        console.log('Completed fetching group data');
      },
    });
  }

  onGroupChange(): void {
    console.log('Group Selected', this.selectedGroupId);
    this.confirmAction();
    this.updateCountdown();
    this.getGroupsData();
    this.updateCurrentUserLeadershipStatus(this.selectedGroupId);
    if (this.selectedGroupId == this.addGroupId) {
      this.showCreateGroup = true;
      this.addNewGroupWindow();
    } else {
      this.showCreateGroup = false;
      this.loadAndPopulateLeaderboard();
    }
  }

  private addNewGroupWindow() {
    this.http.get<LeaderboardEntry[]>(`/api/members/group/${this.addGroupId}/points`).subscribe({
      next: data => {
        this.leaderboardData = data;
        this.sortLeaderboardData();
      },
    });
  }

  private loadAndPopulateLeaderboard(): void {
    const groupId = this.selectedGroupId;

    this.http.get<LeaderboardEntry[]>(`/api/members/group/${groupId}/points`).subscribe({
      next: data => {
        this.leaderboardData = data;
        this.sortLeaderboardData();
      },
      error: error => {
        console.error('Error fetching leaderboard data:', error);
      },
      complete: () => {
        console.log('Completed fetching leaderboard data');
      },
    });
  }

  updateCountdown(): void {
    this.http.get<{ days: number; hours: number; minutes: number; seconds: number }>('/api/user-points/nextResetTime').subscribe(
      time => {
        this.timeLeft = time;
        let totalSeconds = this.timeLeft.days * 86400 + this.timeLeft.hours * 3600 + this.timeLeft.minutes * 60 + this.timeLeft.seconds;
        const intervalId = setInterval(() => {
          totalSeconds--;
          this.formatCountdown(totalSeconds);

          if (totalSeconds < 0) {
            clearInterval(intervalId);
          }
        }, 1000);
      },
      error => {
        console.error('Error fetching countdown:', error);
      }
    );
  }

  formatCountdown(totalSeconds: number): void {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    if (days > 0) {
      this.countdownDisplay = `${days} Day${days > 1 ? 's' : ''} left`;
    } else if (hours > 0) {
      this.countdownDisplay = `${hours} Hour${hours > 1 ? 's' : ''} left`;
    } else if (minutes > 0) {
      this.countdownDisplay = `${minutes} Minute${minutes > 1 ? 's' : ''} left`;
    } else {
      this.countdownDisplay = `${seconds} Second${seconds > 1 ? 's' : ''} left`;
    }
  }

  CreateGroup(groupData: any): Observable<Group> {
    return this.http.post<Group>('/api/groupings', groupData);
  }

  onCreate(): void {
    if (this.createGroup.groupName !== null && this.createGroup.groupName !== 'ADDGROUP') {
      console.log('Group Created:', this.createGroup);
      this.CreateGroup(this.createGroup).subscribe({
        next: (newGrouping: Group) => {
          console.log('Group created successfully:', newGrouping);

          var createDTO = { id: newGrouping.id, leader: true };

          this.http.post('/api/members', createDTO).subscribe(
            response => {
              console.log('Joined group successfully', response);
              this.getGroupsData();
            },
            error => {
              console.error('Error joining group', error);
            }
          );
        },
        error: error => {
          console.error('Error creating group:', error);
        },
      });
    }
  }

  onJoin(): void {
    if (this.joinGroup.groupID !== null && this.joinGroup.groupID != this.addGroupId) {
      console.log('Joining Group:', this.joinGroup);

      var joinDTO = { id: this.joinGroup.groupID, leader: false };

      this.http.post('/api/members', joinDTO).subscribe(
        response => {
          console.log('Joined group successfully', response);
          this.getGroupsData();
        },
        error => {
          console.error('Error joining group', error);
          alert('Please Login and make sure the group exists and you arent already a member.');
        }
      );
    }
  }

  onLeave(): void {
    console.log('Leaving Group:', this.leaderboardData[0].groupID);
    this.http.delete(`/api/members/${this.leaderboardData[0].groupID}`).subscribe(
      response => {
        console.log('Left Group Succesfully');
        this.selectedGroupId = this.addGroupId;
        this.getGroupsData();
        this.onGroupChange();
      },
      error => {
        console.error('Error Leaving Group ', error);
        alert('Error leaving Group');
      }
    );
  }

  onDelete(): void {
    console.log(`Deleting Group:`, this.leaderboardData[0].groupID);
    this.http.delete(`/api/groupings/${this.leaderboardData[0].groupID}`).subscribe(
      response => {
        console.log('Deleted Succesfully');
        this.selectedGroupId = this.addGroupId;
        this.getGroupsData();
        this.onGroupChange();
      },
      error => {
        console.error('Error Deleting Group ', error);
        alert('Error Deleting Group');
      }
    );
  }

  updatePoints(): void {
    console.log(`Testing Updating Points`);
    this.http.get(`/api/user-points/updatePoints`).subscribe(
      response => {
        console.log(`Update Points Test Sent`);
      },
      error => {
        console.log(`Error Updating Points`);
      }
    );
  }

  triggerConfirmation(type: 'leave' | 'delete') {
    if (type == 'leave') {
      this.showLeaveConfirmation = true;
      this.confirmationType = type;
    } else {
      this.showDeleteConfirmation = true;
      this.confirmationType = type;
    }
  }

  confirmAction() {
    this.showDeleteConfirmation = false;
    this.showLeaveConfirmation = false;
    this.confirmationType = null;
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
}
