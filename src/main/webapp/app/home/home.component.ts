import { Component, OnInit, OnDestroy, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  reason: string;
  flipped: boolean;
}

interface WorkItem {
  image: string;
  description: string;
}

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('teamSection', { static: true }) teamSection?: ElementRef;

  smokingimage = 'src/main/webapp/app/home/smoking.jpg';

  account: Account | null = null;
  private readonly destroy$ = new Subject<void>();
  sidebarOpen = false;
  selectedImage: string = '';
  selectedCaption: string = '';

  contact: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Ankita Dash',
      role: 'Profile Customization',
      description: "I'm the profile customization developer, encoding features that enable users to personalize their online presence.",
      reason: '                          Practical solution to help individuals improve their mental health.',
      flipped: false,
    },
    {
      id: 2,
      name: 'Adnaan Loonat',
      role: 'Mood Picker',
      description: "I'm aiming to create a tool that allows users to express and track their emotions in an interactive way.",
      reason: '                                          Create a space where individuals could find peace.',
      flipped: false,
    },
    {
      id: 3,
      name: 'Samuel Davies-Jelly',
      role: 'Groups',
      description:
        'Interested in collaboration, I am dedicated to creating the Groups feature for a better digital experience along with peers.',
      reason: '                                               To showcase the impact of reducing unnecessary stimuli.',
      flipped: false,
    },
    {
      id: 4,
      name: 'Asa Bizenjo',
      role: 'Challenges',
      description: "I thrive in challenging environments. So, I'm doing the Challenges feature, creating engaging tasks to motivate users.",
      reason: "                              It's a community platform where individuals can find motivation.",
      flipped: false,
    },
    {
      id: 5,
      name: 'Prince Alexander',
      role: 'Mood Journal',
      description: 'I am developing the Mood Journal feature which allows our users to track their emotional journey along the way.',
      reason: '                                  To combat the negative effects of digital overuse.',
      flipped: false,
    },
    {
      id: 6,
      name: 'Allen Joseph',
      role: 'Habit Tracker',
      description: 'I am developing the habit tracker feature, helping users cultivate positive routines and behaviours regularly.',
      reason: '                               To understand how modern habits can hijack our natural reward system.',
      flipped: false,
    },
  ];

  works: WorkItem[] = [
    { image: 'src/main/webapp/app/home/happ.jpg', description: 'Enhanced Mood' },
    { image: 'improved life2.jpg', description: 'Improved Lifestyle' },
    { image: 'productivity.jpg', description: 'Increased Productivity' },
    { image: 'worklife.jpg', description: 'Healthy Balance Between Work and Life' },
  ];

  constructor(private accountService: AccountService, private router: Router, private http: HttpClient, private renderer: Renderer2) {}

  redirectToLevels() {
    this.router.navigate(['/levels']); // Navigate to the 'levels' route
  }
  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  ngAfterViewInit(): void {
    this.initializeFlipCards();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeFadeIn(): void {
    if (!sessionStorage.getItem('hasAnimated')) {
      this.renderer.setStyle(document.body, 'opacity', '1');
      sessionStorage.setItem('hasAnimated', 'true');
    } else {
      this.renderer.setStyle(document.body, 'opacity', '1');
    }
  }

  initializeFlipCards(): void {
    // Check if 'teamSection' is available
    if (this.teamSection) {
      const flipCards = this.teamSection.nativeElement.querySelectorAll('.flip-card');

      // Iterate over each card
      flipCards.forEach((card: HTMLElement) => {
        // Adding a click event listener to each card
        this.renderer.listen(card, 'click', () => {
          const innerCard = card.querySelector('.flip-card-inner') as HTMLElement;

          // Safely toggle the 'flipped' class based on the current state
          const isFlipped = innerCard.classList.contains('flipped');
          if (isFlipped) {
            this.renderer.removeClass(innerCard, 'flipped');
          } else {
            this.renderer.addClass(innerCard, 'flipped');
          }
        });
      });
    }
  }

  toggleFlip(memberId: number): void {
    const member = this.teamMembers.find(m => m.id === memberId);
    if (member) {
      member.flipped = !member.flipped;
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  openModal(image: string, description: string): void {
    this.selectedImage = image;
    this.selectedCaption = description;
    document.getElementById('modal01')!.style.display = 'block';
  }

  closeModal(): void {
    document.getElementById('modal01')!.style.display = 'none';
  }

  onSubmit(): void {
    console.log('Form submitted:', this.contact);
    this.http.post('/api/feedbacks', this.contact).subscribe(
      response => {
        console.log('Feedback submitted successfully:', response);
        alert('Feedback submitted successfully!');
        this.contact = { name: '', email: '', subject: '', message: '' };
      },
      error => {
        console.error('Error submitting feedback:', error);
        alert('Error submitting feedback. Please try again later.');
      }
    );
  }
}
