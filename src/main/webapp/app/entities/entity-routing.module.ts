import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'challenges',
        data: { pageTitle: 'Challenges' },
        loadChildren: () => import('./challenges/challenges.module').then(m => m.ChallengesModule),
      },
      {
        path: 'search',
        data: { pageTitle: 'Searches' },
        loadChildren: () => import('./search/search.module').then(m => m.SearchModule),
      },
      {
        path: 'filtered',
        data: { pageTitle: 'Filtereds' },
        loadChildren: () => import('./filtered/filtered.module').then(m => m.FilteredModule),
      },
      {
        path: 'screen-time',
        data: { pageTitle: 'ScreenTimes' },
        loadChildren: () => import('./screen-time/screen-time.module').then(m => m.ScreenTimeModule),
      },
      {
        path: 'junk-food',
        data: { pageTitle: 'JunkFoods' },
        loadChildren: () => import('./junk-food/junk-food.module').then(m => m.JunkFoodModule),
      },
      {
        path: 'smoking',
        data: { pageTitle: 'Smokings' },
        loadChildren: () => import('./smoking/smoking.module').then(m => m.SmokingModule),
      },
      {
        path: 'alcohol',
        data: { pageTitle: 'Alcohol' },
        loadChildren: () => import('./alcohol/alcohol.module').then(m => m.AlcoholModule),
      },
      {
        path: 'music',
        data: { pageTitle: 'Music' },
        loadChildren: () => import('./music/music.module').then(m => m.MusicModule),
      },
      {
        path: 'video-games',
        data: { pageTitle: 'VideoGames' },
        loadChildren: () => import('./video-games/video-games.module').then(m => m.VideoGamesModule),
      },
      {
        path: 'movies',
        data: { pageTitle: 'Movies' },
        loadChildren: () => import('./movies/movies.module').then(m => m.MoviesModule),
      },
      {
        path: 'social-media',
        data: { pageTitle: 'SocialMedias' },
        loadChildren: () => import('./social-media/social-media.module').then(m => m.SocialMediaModule),
      },
      {
        path: 'profile-customization',
        data: { pageTitle: 'ProfileCustomizations' },
        loadChildren: () => import('./profile-customization/profile-customization.module').then(m => m.ProfileCustomizationModule),
      },
      {
        path: 'achievement',
        data: { pageTitle: 'Achievements' },
        loadChildren: () => import('./achievement/achievement.module').then(m => m.AchievementModule),
      },
      {
        path: 'setting',
        data: { pageTitle: 'Settings' },
        loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule),
      },
      {
        path: 'joined-teams',
        data: { pageTitle: 'JoinedTeams' },
        loadChildren: () => import('./joined-teams/joined-teams.module').then(m => m.JoinedTeamsModule),
      },
      {
        path: 'new-weekly-habit-tracker',
        data: { pageTitle: 'NewWeeklyHabitTrackers' },
        loadChildren: () => import('./new-weekly-habit-tracker/new-weekly-habit-tracker.module').then(m => m.NewWeeklyHabitTrackerModule),
      },
      {
        path: 'weekly-summary',
        data: { pageTitle: 'WeeklySummaries' },
        loadChildren: () => import('./weekly-summary/weekly-summary.module').then(m => m.WeeklySummaryModule),
      },
      {
        path: 'leader-boards',
        data: { pageTitle: 'LeaderBoards' },
        loadChildren: () => import('./leader-boards/leader-boards.module').then(m => m.LeaderBoardsModule),
      },
      {
        path: 'user-points',
        data: { pageTitle: 'UserPoints' },
        loadChildren: () => import('./user-points/user-points.module').then(m => m.UserPointsModule),
      },
      {
        path: 'members',
        data: { pageTitle: 'Members' },
        loadChildren: () => import('./members/members.module').then(m => m.MembersModule),
      },
      {
        path: 'grouping',
        data: { pageTitle: 'Groupings' },
        loadChildren: () => import('./grouping/grouping.module').then(m => m.GroupingModule),
      },
      {
        path: 'badges',
        data: { pageTitle: 'Badges' },
        loadChildren: () => import('./badges/badges.module').then(m => m.BadgesModule),
      },
      {
        path: 'navigation-portal',
        data: { pageTitle: 'NavigationPortals' },
        loadChildren: () => import('./navigation-portal/navigation-portal.module').then(m => m.NavigationPortalModule),
      },
      {
        path: 'mood-journal-page',
        data: { pageTitle: 'MoodJournalPages' },
        loadChildren: () => import('./mood-journal-page/mood-journal-page.module').then(m => m.MoodJournalPageModule),
      },
      {
        path: 'entries-page',
        data: { pageTitle: 'EntriesPages' },
        loadChildren: () => import('./entries-page/entries-page.module').then(m => m.EntriesPageModule),
      },
      {
        path: 'prompts-page',
        data: { pageTitle: 'PromptsPages' },
        loadChildren: () => import('./prompts-page/prompts-page.module').then(m => m.PromptsPageModule),
      },
      {
        path: 'emotion-page',
        data: { pageTitle: 'EmotionPages' },
        loadChildren: () => import('./emotion-page/emotion-page.module').then(m => m.EmotionPageModule),
      },
      {
        path: 'mood-picker',
        data: { pageTitle: 'MoodPickers' },
        loadChildren: () => import('./mood-picker/mood-picker.module').then(m => m.MoodPickerModule),
      },
      {
        path: 'landing-page',
        data: { pageTitle: 'LandingPages' },
        loadChildren: () => import('./landing-page/landing-page.module').then(m => m.LandingPageModule),
      },
      {
        path: 'user-db',
        data: { pageTitle: 'UserDBS' },
        loadChildren: () => import('./user-db/user-db.module').then(m => m.UserDBModule),
      },
      {
        path: 'feedback',
        data: { pageTitle: 'Feedbacks' },
        loadChildren: () => import('./feedback/feedback.module').then(m => m.FeedbackModule),
      },
      {
        path: 'progress',
        data: { pageTitle: 'Progresses' },
        loadChildren: () => import('./progress/progress.module').then(m => m.ProgressModule),
      },
      {
        path: 'history',
        data: { pageTitle: 'Histories' },
        loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
      },
      {
        path: 'entries-feature',
        data: { pageTitle: 'EntriesFeatures' },
        loadChildren: () => import('./entries-feature/entries-feature.module').then(m => m.EntriesFeatureModule),
      },
      {
        path: 'timer',
        data: { pageTitle: 'Timers' },
        loadChildren: () => import('./timer/timer.module').then(m => m.TimerModule),
      },
      {
        path: 'points',
        data: { pageTitle: 'Points' },
        loadChildren: () => import('./points/points.module').then(m => m.PointsModule),
      },
      {
        path: 'new-mood-picker',
        data: { pageTitle: 'NewMoodPickers' },
        loadChildren: () => import('./new-mood-picker/new-mood-picker.module').then(m => m.NewMoodPickerModule),
      },
      {
        path: 'habitstracking',
        data: { pageTitle: 'Habitstrackings' },
        loadChildren: () => import('./habitstracking/habitstracking.module').then(m => m.HabitstrackingModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
