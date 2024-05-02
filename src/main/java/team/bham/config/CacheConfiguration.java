package team.bham.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, team.bham.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, team.bham.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, team.bham.domain.User.class.getName());
            createCache(cm, team.bham.domain.Authority.class.getName());
            createCache(cm, team.bham.domain.User.class.getName() + ".authorities");
            createCache(cm, team.bham.domain.Challenges.class.getName());
            createCache(cm, team.bham.domain.Challenges.class.getName() + ".searches");
            createCache(cm, team.bham.domain.Challenges.class.getName() + ".filtereds");
            createCache(cm, team.bham.domain.Search.class.getName());
            createCache(cm, team.bham.domain.Search.class.getName() + ".challenges");
            createCache(cm, team.bham.domain.Filtered.class.getName());
            createCache(cm, team.bham.domain.Filtered.class.getName() + ".challenges");
            createCache(cm, team.bham.domain.ScreenTime.class.getName());
            createCache(cm, team.bham.domain.ScreenTime.class.getName() + ".challenges");
            createCache(cm, team.bham.domain.JunkFood.class.getName());
            createCache(cm, team.bham.domain.JunkFood.class.getName() + ".challenges");
            createCache(cm, team.bham.domain.Smoking.class.getName());
            createCache(cm, team.bham.domain.Smoking.class.getName() + ".challenges");
            createCache(cm, team.bham.domain.Alcohol.class.getName());
            createCache(cm, team.bham.domain.Alcohol.class.getName() + ".challenges");
            createCache(cm, team.bham.domain.Music.class.getName());
            createCache(cm, team.bham.domain.Music.class.getName() + ".screenTimes");
            createCache(cm, team.bham.domain.VideoGames.class.getName());
            createCache(cm, team.bham.domain.VideoGames.class.getName() + ".screenTimes");
            createCache(cm, team.bham.domain.Movies.class.getName());
            createCache(cm, team.bham.domain.Movies.class.getName() + ".screenTimes");
            createCache(cm, team.bham.domain.SocialMedia.class.getName());
            createCache(cm, team.bham.domain.SocialMedia.class.getName() + ".screenTimes");
            createCache(cm, team.bham.domain.ProfileCustomization.class.getName());
            createCache(cm, team.bham.domain.Achievement.class.getName());
            createCache(cm, team.bham.domain.Setting.class.getName());
            createCache(cm, team.bham.domain.JoinedTeams.class.getName());
            createCache(cm, team.bham.domain.Habit.class.getName());
            createCache(cm, team.bham.domain.Habit.class.getName() + ".newWeeklyHabitTrackers");
            createCache(cm, team.bham.domain.NewWeeklyHabitTracker.class.getName());
            createCache(cm, team.bham.domain.WeeklySummary.class.getName());
            createCache(cm, team.bham.domain.LeaderBoards.class.getName());
            createCache(cm, team.bham.domain.LeaderBoards.class.getName() + ".userPoints");
            createCache(cm, team.bham.domain.UserPoints.class.getName());
            createCache(cm, team.bham.domain.Members.class.getName());
            createCache(cm, team.bham.domain.Grouping.class.getName());
            createCache(cm, team.bham.domain.Grouping.class.getName() + ".members");
            createCache(cm, team.bham.domain.Grouping.class.getName() + ".badges");
            createCache(cm, team.bham.domain.Badges.class.getName());
            createCache(cm, team.bham.domain.NavigationPortal.class.getName());
            createCache(cm, team.bham.domain.MoodJournalPage.class.getName());
            createCache(cm, team.bham.domain.MoodJournalPage.class.getName() + ".entriesPages");
            createCache(cm, team.bham.domain.MoodJournalPage.class.getName() + ".promptsPages");
            createCache(cm, team.bham.domain.EntriesPage.class.getName());
            createCache(cm, team.bham.domain.PromptsPage.class.getName());
            createCache(cm, team.bham.domain.EmotionPage.class.getName());
            createCache(cm, team.bham.domain.MoodPicker.class.getName());
            createCache(cm, team.bham.domain.LandingPage.class.getName());
            createCache(cm, team.bham.domain.UserDB.class.getName());
            createCache(cm, team.bham.domain.Feedback.class.getName());
            createCache(cm, team.bham.domain.Progress.class.getName());
            createCache(cm, team.bham.domain.History.class.getName());
            createCache(cm, team.bham.domain.EntriesFeature.class.getName());
            createCache(cm, team.bham.domain.PromptsFeature.class.getName());
            createCache(cm, team.bham.domain.Timer.class.getName());
            createCache(cm, team.bham.domain.Points.class.getName());
            createCache(cm, team.bham.domain.NewMoodPicker.class.getName());
            createCache(cm, team.bham.domain.Habitstracking.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
