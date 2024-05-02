package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A NavigationPortal.
 */
@Entity
@Table(name = "navigation_portal")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class NavigationPortal implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "features")
    private String features;

    @Column(name = "selected_feature")
    private Boolean selectedFeature;

    @JsonIgnoreProperties(
        value = { "progress", "junkFood", "screenTime", "alcohol", "smoking", "searches", "filtereds", "navigationPortal" },
        allowSetters = true
    )
    @OneToOne
    @JoinColumn(unique = true)
    private Challenges challenges;

    @JsonIgnoreProperties(value = { "newWeeklyHabitTrackers", "navigationPortal" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Habit habit;

    @JsonIgnoreProperties(value = { "grouping", "progress", "userPoints", "navigationPortal" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private LeaderBoards leaderBoards;

    @JsonIgnoreProperties(value = { "joinedTeams", "setting", "achievement", "navigationPortal" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private ProfileCustomization profileCustomization;

    @JsonIgnoreProperties(value = { "entriesPages", "promptsPages", "navigationPortal" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private MoodJournalPage moodJournalPage;

    @JsonIgnoreProperties(value = { "navigationPortal", "promptsPage", "emotionPage", "landingPage" }, allowSetters = true)
    @OneToOne(mappedBy = "navigationPortal")
    private MoodPicker moodPicker;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public NavigationPortal id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFeatures() {
        return this.features;
    }

    public NavigationPortal features(String features) {
        this.setFeatures(features);
        return this;
    }

    public void setFeatures(String features) {
        this.features = features;
    }

    public Boolean getSelectedFeature() {
        return this.selectedFeature;
    }

    public NavigationPortal selectedFeature(Boolean selectedFeature) {
        this.setSelectedFeature(selectedFeature);
        return this;
    }

    public void setSelectedFeature(Boolean selectedFeature) {
        this.selectedFeature = selectedFeature;
    }

    public Challenges getChallenges() {
        return this.challenges;
    }

    public void setChallenges(Challenges challenges) {
        this.challenges = challenges;
    }

    public NavigationPortal challenges(Challenges challenges) {
        this.setChallenges(challenges);
        return this;
    }

    public Habit getHabit() {
        return this.habit;
    }

    public void setHabit(Habit habit) {
        this.habit = habit;
    }

    public NavigationPortal habit(Habit habit) {
        this.setHabit(habit);
        return this;
    }

    public LeaderBoards getLeaderBoards() {
        return this.leaderBoards;
    }

    public void setLeaderBoards(LeaderBoards leaderBoards) {
        this.leaderBoards = leaderBoards;
    }

    public NavigationPortal leaderBoards(LeaderBoards leaderBoards) {
        this.setLeaderBoards(leaderBoards);
        return this;
    }

    public ProfileCustomization getProfileCustomization() {
        return this.profileCustomization;
    }

    public void setProfileCustomization(ProfileCustomization profileCustomization) {
        this.profileCustomization = profileCustomization;
    }

    public NavigationPortal profileCustomization(ProfileCustomization profileCustomization) {
        this.setProfileCustomization(profileCustomization);
        return this;
    }

    public MoodJournalPage getMoodJournalPage() {
        return this.moodJournalPage;
    }

    public void setMoodJournalPage(MoodJournalPage moodJournalPage) {
        this.moodJournalPage = moodJournalPage;
    }

    public NavigationPortal moodJournalPage(MoodJournalPage moodJournalPage) {
        this.setMoodJournalPage(moodJournalPage);
        return this;
    }

    public MoodPicker getMoodPicker() {
        return this.moodPicker;
    }

    public void setMoodPicker(MoodPicker moodPicker) {
        if (this.moodPicker != null) {
            this.moodPicker.setNavigationPortal(null);
        }
        if (moodPicker != null) {
            moodPicker.setNavigationPortal(this);
        }
        this.moodPicker = moodPicker;
    }

    public NavigationPortal moodPicker(MoodPicker moodPicker) {
        this.setMoodPicker(moodPicker);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof NavigationPortal)) {
            return false;
        }
        return id != null && id.equals(((NavigationPortal) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "NavigationPortal{" +
            "id=" + getId() +
            ", features='" + getFeatures() + "'" +
            ", selectedFeature='" + getSelectedFeature() + "'" +
            "}";
    }
}
