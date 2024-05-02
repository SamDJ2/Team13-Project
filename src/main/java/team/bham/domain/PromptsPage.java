package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.TabLabel;

/**
 * A PromptsPage.
 */
@Entity
@Table(name = "prompts_page")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PromptsPage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "prompted_entries")
    private String promptedEntries;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "emotion_from_mood_picker")
    private String emotionFromMoodPicker;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_tab")
    private TabLabel currentTab;

    @JsonIgnoreProperties(value = { "navigationPortal", "promptsPage", "emotionPage", "landingPage" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private MoodPicker moodPicker;

    @JsonIgnoreProperties(value = { "moodPicker", "promptsPage" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private EmotionPage emotionPage;

    @ManyToOne
    @JsonIgnoreProperties(value = { "entriesPages", "promptsPages", "navigationPortal" }, allowSetters = true)
    private MoodJournalPage moodJournalPage;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PromptsPage id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPromptedEntries() {
        return this.promptedEntries;
    }

    public PromptsPage promptedEntries(String promptedEntries) {
        this.setPromptedEntries(promptedEntries);
        return this;
    }

    public void setPromptedEntries(String promptedEntries) {
        this.promptedEntries = promptedEntries;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public PromptsPage date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getEmotionFromMoodPicker() {
        return this.emotionFromMoodPicker;
    }

    public PromptsPage emotionFromMoodPicker(String emotionFromMoodPicker) {
        this.setEmotionFromMoodPicker(emotionFromMoodPicker);
        return this;
    }

    public void setEmotionFromMoodPicker(String emotionFromMoodPicker) {
        this.emotionFromMoodPicker = emotionFromMoodPicker;
    }

    public TabLabel getCurrentTab() {
        return this.currentTab;
    }

    public PromptsPage currentTab(TabLabel currentTab) {
        this.setCurrentTab(currentTab);
        return this;
    }

    public void setCurrentTab(TabLabel currentTab) {
        this.currentTab = currentTab;
    }

    public MoodPicker getMoodPicker() {
        return this.moodPicker;
    }

    public void setMoodPicker(MoodPicker moodPicker) {
        this.moodPicker = moodPicker;
    }

    public PromptsPage moodPicker(MoodPicker moodPicker) {
        this.setMoodPicker(moodPicker);
        return this;
    }

    public EmotionPage getEmotionPage() {
        return this.emotionPage;
    }

    public void setEmotionPage(EmotionPage emotionPage) {
        this.emotionPage = emotionPage;
    }

    public PromptsPage emotionPage(EmotionPage emotionPage) {
        this.setEmotionPage(emotionPage);
        return this;
    }

    public MoodJournalPage getMoodJournalPage() {
        return this.moodJournalPage;
    }

    public void setMoodJournalPage(MoodJournalPage moodJournalPage) {
        this.moodJournalPage = moodJournalPage;
    }

    public PromptsPage moodJournalPage(MoodJournalPage moodJournalPage) {
        this.setMoodJournalPage(moodJournalPage);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PromptsPage)) {
            return false;
        }
        return id != null && id.equals(((PromptsPage) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PromptsPage{" +
            "id=" + getId() +
            ", promptedEntries='" + getPromptedEntries() + "'" +
            ", date='" + getDate() + "'" +
            ", emotionFromMoodPicker='" + getEmotionFromMoodPicker() + "'" +
            ", currentTab='" + getCurrentTab() + "'" +
            "}";
    }
}
