import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HabitsComponent } from './habits/habits.component';
import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AlcoholStartComponent } from './alcohol-start/alcohol-start.component';
import { HistoryComponent } from './history/history.component';
import { FoodStartComponent } from './food-start/food-start.component';
import { GamesStartComponent } from './games-start/games-start.component';
import { MusicStartComponent } from './music-start/music-start.component';
import { SmokingStartComponent } from './smoking-start/smoking-start.component';
import { SocialStartComponent } from './social-start/social-start.component';
import { VideoStartComponent } from './video-start/video-start.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MoodJournalPageComponent } from './mood-journal-page/mood-journal-page.component';
import { EntriesComponent } from './entries/entries.component';
import { PromptsComponent } from './prompts/prompts.component';
import { EmotionsComponent } from './emotions/emotions.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfilepageComponent } from './profilepage/profilepage.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { SupportComponent } from './support/support.component';
import { TeamComponent } from './team/team.component';
import { AboutComponent } from './about/about.component';
import { SignoutComponent } from './signout/signout.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetFinishComponent } from './account/password-reset/finish/password-reset-finish.component';
import { AllChallengesComponent } from './all-challenges/all-challenges.component';
import { CoffeeLevelsComponent } from './coffee-levels/coffee-levels.component';
import { MusicLevelsComponent } from './music-levels/music-levels.component';
import { VideoLevelsComponent } from './video-levels/video-levels.component';
import { SociaLevelsComponent } from './socia-levels/socia-levels.component';
import { SmokingLevelsComponent } from './smoking-levels/smoking-levels.component';
import { FoodLevelsComponent } from './food-levels/food-levels.component';
import { AlcoholLevelsComponent } from './alcohol-levels/alcohol-levels.component';
import { GamesLevelsComponent } from './games-levels/games-levels.component';
import { CoffeeStartComponent } from './coffee-start/coffee-start.component';
import { ChallengesIndexComponent } from './challenges-index/challenges-index.component';

const routes: Routes = [
  {
    path: 'Dashboard',
    component: DashboardComponent,
  },
  {
    path: 'Challenges',
    component: ChallengesIndexComponent,
  },
  {
    path: 'All-Challenges',
    component: AllChallengesComponent,
  },
  {
    path: 'Coffee',
    component: CoffeeLevelsComponent,
  },
  {
    path: 'Music',
    component: MusicLevelsComponent,
  },
  {
    path: 'Video',
    component: VideoLevelsComponent,
  },
  {
    path: 'Social',
    component: SociaLevelsComponent,
  },
  {
    path: 'Smoking',
    component: SmokingLevelsComponent,
  },
  {
    path: 'JunkFood',
    component: FoodLevelsComponent,
  },
  {
    path: 'Alcohol',
    component: AlcoholLevelsComponent,
  },
  {
    path: 'VideoGames',
    component: GamesLevelsComponent,
  },
  {
    path: 'Coffee-Start/:state',
    component: CoffeeStartComponent,
  },
  {
    path: 'Alcohol-Start/:state',
    component: AlcoholStartComponent,
  },
  {
    path: 'History',
    component: HistoryComponent,
  },
  {
    path: 'Food-Start/:state',
    component: FoodStartComponent,
  },
  {
    path: 'Games-Start/:state',
    component: GamesStartComponent,
  },
  {
    path: 'Music-Start/:state',
    component: MusicStartComponent,
  },
  {
    path: 'Smoking-Start/:state',
    component: SmokingStartComponent,
  },
  {
    path: 'Social-Start/:state',
    component: SocialStartComponent,
  },
  {
    path: 'Videos-Start/:state',
    component: VideoStartComponent,
  },
  {
    path: 'Leaderboard',
    component: LeaderboardComponent,
  },
  {
    path: 'MoodJournalPage',
    component: MoodJournalPageComponent,
  },
  {
    path: 'Entries',
    component: EntriesComponent,
  },
  {
    path: 'Prompts',
    component: PromptsComponent,
  },
  {
    path: 'Emotions',
    component: EmotionsComponent,
  },
  {
    path: 'About',
    component: AboutComponent,
  },
  {
    path: 'Team',
    component: TeamComponent,
  },
  {
    path: 'Password',
    component: PasswordResetFinishComponent,
  },
  {
    path: 'Login',
    component: LoginComponent,
  },
  {
    path: 'Profilepage',
    component: ProfilepageComponent,
  },
  {
    path: 'Signout',
    component: SignoutComponent,
  },
  {
    path: 'Feedback',
    component: FeedbackComponent,
  },
  {
    path: 'Support',
    component: SupportComponent,
  },
  {
    path: 'Habits',
    component: HabitsComponent,
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: 'Password',
          data: { pageTitle: 'PUREFY | Password' },
          component: PasswordResetFinishComponent,
        },
        {
          path: 'Login',
          data: { pageTitle: 'PUREFY | Login' },
          component: LoginComponent,
        },
        {
          path: 'Team',
          data: { pageTitle: 'PUREFY | Team' },
          component: TeamComponent,
        },
        {
          path: 'Challenges-Index',
          data: { pageTitle: 'PUREFY | Challenges' },
          component: ChallengesIndexComponent,
        },
        {
          path: 'Profilepage',
          data: { pageTitle: 'PUREFY | Profile' },
          component: ProfilepageComponent,
        },

        {
          path: 'Feedback',
          data: { pageTitle: 'PUREFY | Feedback' },
          component: FeedbackComponent,
        },
        {
          path: 'Support',
          data: { pageTitle: 'PUREFY | Support' },
          component: SupportComponent,
        },
        {
          path: 'About',
          data: { pageTitle: 'PUREFY | About' },
          component: AboutComponent,
        },
        {
          path: 'Signout',
          data: { pageTitle: 'PUREFY | Sign-Out' },
          component: SignoutComponent,
        },
        {
          path: 'Habits',
          data: { pageTitle: 'PUREFY | Habit Tracker' },
          component: HabitsComponent,
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        {
          path: 'Alcohol-Start/:state',
          data: { pageTitle: 'PUREFY | Alcohol' },
          component: AlcoholStartComponent,
        },
        {
          path: 'History',
          data: { pageTitle: 'PUREFY | History' },
          component: HistoryComponent,
        },
        {
          path: 'Food-Start/:state',
          data: { pageTitle: 'PUREFY | Junk Food' },
          component: FoodStartComponent,
        },
        {
          path: 'Games-Start/:state',
          data: { pageTitle: 'PUREFY | Video Games' },
          component: GamesStartComponent,
        },
        {
          path: 'Music-Start/:state',
          data: { pageTitle: 'PUREFY | Music' },
          component: MusicStartComponent,
        },
        {
          path: 'Smoking-Start/:state',
          data: { pageTitle: 'PUREFY | Smoking' },
          component: SmokingStartComponent,
        },
        {
          path: 'Social-Start/:state',
          data: { pageTitle: 'PUREFY | Social Media' },
          component: SocialStartComponent,
        },
        {
          path: 'Videos-Start/:state',
          data: { pageTitle: 'PUREFY | Videos' },
          component: VideoStartComponent,
        },
        {
          path: 'Leaderboard',
          data: { pageTitle: 'PUREFY | Leaderboards' },
          component: LeaderboardComponent,
        },
        {
          path: 'MoodJournalPage',
          data: { pageTitle: 'PUREFY | Mood Journal' },
          component: MoodJournalPageComponent,
        },
        {
          path: 'Entries',
          data: { pageTitle: 'PUREFY | Entries' },
          component: EntriesComponent,
        },
        {
          path: 'Prompts',
          data: { pageTitle: 'PUREFY | Prompts' },
          component: PromptsComponent,
        },
        {
          path: 'Emotions',
          data: { pageTitle: 'PUREFY | Emotions' },
          component: EmotionsComponent,
        },
        {
          path: 'Dashboard',
          data: { pageTitle: 'PUREFY' },
          component: DashboardComponent,
        },
        {
          path: 'All-Challenges',
          data: { pageTitle: 'PUREFY | Challenges' },
          component: AllChallengesComponent,
        },
        {
          path: 'Coffee',
          data: { pageTitle: 'PUREFY | Coffee' },
          component: CoffeeLevelsComponent,
        },
        {
          path: 'Music',
          data: { pageTitle: 'PUREFY | Music' },
          component: MusicLevelsComponent,
        },
        {
          path: 'Video',
          data: { pageTitle: 'PUREFY | Video' },
          component: VideoLevelsComponent,
        },
        {
          path: 'Social',
          data: { pageTitle: 'PUREFY | Social Media' },
          component: SociaLevelsComponent,
        },
        {
          path: 'Smoking',
          data: { pageTitle: 'PUREFY | Smoking' },
          component: SmokingLevelsComponent,
        },
        {
          path: 'JunkFood',
          data: { pageTitle: 'PUREFY | Junk Food' },
          component: FoodLevelsComponent,
        },
        {
          path: 'Alcohol',
          data: { pageTitle: 'PUREFY | Alcohol' },
          component: AlcoholLevelsComponent,
        },
        {
          path: 'VideoGames',
          data: { pageTitle: 'PUREFY | Video Games' },
          component: GamesLevelsComponent,
        },
        {
          path: 'Coffee-Start/:state',
          data: { pageTitle: 'PUREFY | Coffee' },
          component: CoffeeStartComponent,
        },
        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
