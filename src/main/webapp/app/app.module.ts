import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import locale from '@angular/common/locales/en';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgxWebstorageModule } from 'ngx-webstorage';
import dayjs from 'dayjs/esm';
import { NgbDateAdapter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import './config/dayjs';
import { SharedModule } from 'app/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { NgbDateDayjsAdapter } from './config/datepicker-adapter';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import { httpInterceptorProviders } from './core/interceptor';
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ErrorComponent } from './layouts/error/error.component';
import { AlcoholStartComponent } from './alcohol-start/alcohol-start.component';
import { FoodStartComponent } from './food-start/food-start.component';
import { GamesStartComponent } from './games-start/games-start.component';
import { MusicStartComponent } from './music-start/music-start.component';
import { SmokingStartComponent } from './smoking-start/smoking-start.component';
import { SocialStartComponent } from './social-start/social-start.component';
import { VideoStartComponent } from './video-start/video-start.component';
import { HistoryComponent } from './history/history.component';
import { MoodJournalPageComponent } from './mood-journal-page/mood-journal-page.component';
import { EntriesComponent } from './entries/entries.component';
import { PromptsComponent } from './prompts/prompts.component';
import { EmotionsComponent } from './emotions/emotions.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ProfilepageComponent } from './profilepage/profilepage.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { SupportComponent } from './support/support.component';
import { SignoutComponent } from './signout/signout.component';
import { TeamComponent } from './team/team.component';
import { AboutComponent } from './about/about.component';
import { FormsModule } from '@angular/forms';
import { CoffeeStartComponent } from './coffee-start/coffee-start.component';
import { AllChallengesComponent } from './all-challenges/all-challenges.component';
import { ChallengesIndexComponent } from './challenges-index/challenges-index.component';
import { AlcoholLevelsComponent } from './alcohol-levels/alcohol-levels.component';
import { CoffeeLevelsComponent } from './coffee-levels/coffee-levels.component';
import { MusicLevelsComponent } from './music-levels/music-levels.component';
import { SmokingLevelsComponent } from './smoking-levels/smoking-levels.component';
import { SociaLevelsComponent } from './socia-levels/socia-levels.component';
import { GamesLevelsComponent } from './games-levels/games-levels.component';
import { VideoLevelsComponent } from './video-levels/video-levels.component';
import { FoodLevelsComponent } from './food-levels/food-levels.component';
import { HabitsComponent } from './habits/habits.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    HomeModule,

    // jhipster-needle-angular-add-module JHipster will add new module here
    AppRoutingModule,
    // Set this to true to enable service worker (PWA)
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    HttpClientModule,
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-', caseSensitive: true }),
    FormsModule,
    CommonModule,
  ],
  providers: [
    Title,
    { provide: LOCALE_ID, useValue: 'en' },
    { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },
    httpInterceptorProviders,
  ],
  declarations: [
    MainComponent,
    NavbarComponent,
    ErrorComponent,
    PageRibbonComponent,
    FooterComponent,
    CoffeeStartComponent,
    AllChallengesComponent,
    ChallengesIndexComponent,
    AlcoholLevelsComponent,
    CoffeeLevelsComponent,
    MusicLevelsComponent,
    SmokingLevelsComponent,
    SociaLevelsComponent,
    GamesLevelsComponent,
    VideoLevelsComponent,
    FoodLevelsComponent,
    AlcoholStartComponent,
    FoodStartComponent,
    GamesStartComponent,
    MusicStartComponent,
    SmokingStartComponent,
    SocialStartComponent,
    VideoStartComponent,
    HistoryComponent,
    MoodJournalPageComponent,
    EntriesComponent,
    PromptsComponent,
    EmotionsComponent,
    LeaderboardComponent,
    ProfilepageComponent,
    FeedbackComponent,
    SupportComponent,
    SignoutComponent,
    TeamComponent,
    AboutComponent,
    HabitsComponent,
    DashboardComponent,
  ],
  bootstrap: [MainComponent],
})
export class AppModule {
  constructor(applicationConfigService: ApplicationConfigService, iconLibrary: FaIconLibrary, dpConfig: NgbDatepickerConfig) {
    applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    registerLocaleData(locale);
    iconLibrary.addIcons(...fontAwesomeIcons);
    dpConfig.minDate = { year: dayjs().subtract(100, 'year').year(), month: 1, day: 1 };
  }
}
