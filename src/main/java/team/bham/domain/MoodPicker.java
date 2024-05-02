package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.Moods;

/**
 * A MoodPicker.
 */
@Entity
@Table(name = "mood_picker")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MoodPicker implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "mood_picker_id")
    private Long moodPickerID;

    @Enumerated(EnumType.STRING)
    @Column(name = "mood")
    private Moods mood;

    @JsonIgnoreProperties(
        value = { "challenges", "habit", "leaderBoards", "profileCustomization", "moodJournalPage", "moodPicker" },
        allowSetters = true
    )
    @OneToOne
    @JoinColumn(unique = true)
    private NavigationPortal navigationPortal;

    @JsonIgnoreProperties(value = { "moodPicker", "emotionPage", "moodJournalPage" }, allowSetters = true)
    @OneToOne(mappedBy = "moodPicker")
    private PromptsPage promptsPage;

    @JsonIgnoreProperties(value = { "moodPicker", "promptsPage" }, allowSetters = true)
    @OneToOne(mappedBy = "moodPicker")
    private EmotionPage emotionPage;

    @JsonIgnoreProperties(value = { "moodPicker", "userDB" }, allowSetters = true)
    @OneToOne(mappedBy = "moodPicker")
    private LandingPage landingPage;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public MoodPicker id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMoodPickerID() {
        return this.moodPickerID;
    }

    public MoodPicker moodPickerID(Long moodPickerID) {
        this.setMoodPickerID(moodPickerID);
        return this;
    }

    public void setMoodPickerID(Long moodPickerID) {
        this.moodPickerID = moodPickerID;
    }

    public Moods getMood() {
        return this.mood;
    }

    public MoodPicker mood(Moods mood) {
        this.setMood(mood);
        return this;
    }

    public void setMood(Moods mood) {
        this.mood = mood;
    }

    public NavigationPortal getNavigationPortal() {
        return this.navigationPortal;
    }

    public void setNavigationPortal(NavigationPortal navigationPortal) {
        this.navigationPortal = navigationPortal;
    }

    public MoodPicker navigationPortal(NavigationPortal navigationPortal) {
        this.setNavigationPortal(navigationPortal);
        return this;
    }

    public PromptsPage getPromptsPage() {
        return this.promptsPage;
    }

    public void setPromptsPage(PromptsPage promptsPage) {
        if (this.promptsPage != null) {
            this.promptsPage.setMoodPicker(null);
        }
        if (promptsPage != null) {
            promptsPage.setMoodPicker(this);
        }
        this.promptsPage = promptsPage;
    }

    public MoodPicker promptsPage(PromptsPage promptsPage) {
        this.setPromptsPage(promptsPage);
        return this;
    }

    public EmotionPage getEmotionPage() {
        return this.emotionPage;
    }

    public void setEmotionPage(EmotionPage emotionPage) {
        if (this.emotionPage != null) {
            this.emotionPage.setMoodPicker(null);
        }
        if (emotionPage != null) {
            emotionPage.setMoodPicker(this);
        }
        this.emotionPage = emotionPage;
    }

    public MoodPicker emotionPage(EmotionPage emotionPage) {
        this.setEmotionPage(emotionPage);
        return this;
    }

    public LandingPage getLandingPage() {
        return this.landingPage;
    }

    public void setLandingPage(LandingPage landingPage) {
        if (this.landingPage != null) {
            this.landingPage.setMoodPicker(null);
        }
        if (landingPage != null) {
            landingPage.setMoodPicker(this);
        }
        this.landingPage = landingPage;
    }

    public MoodPicker landingPage(LandingPage landingPage) {
        this.setLandingPage(landingPage);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MoodPicker)) {
            return false;
        }
        return id != null && id.equals(((MoodPicker) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MoodPicker{" +
            "id=" + getId() +
            ", moodPickerID=" + getMoodPickerID() +
            ", mood='" + getMood() + "'" +
            "}";
    }
}
