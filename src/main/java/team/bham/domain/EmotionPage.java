package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.AIGeneratedPrompts;
import team.bham.domain.enumeration.TabLabel;

/**
 * A EmotionPage.
 */
@Entity
@Table(name = "emotion_page")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EmotionPage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "prompts")
    private AIGeneratedPrompts prompts;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "prompted_entry")
    private String promptedEntry;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_tab")
    private TabLabel currentTab;

    @JsonIgnoreProperties(value = { "navigationPortal", "promptsPage", "emotionPage", "landingPage" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private MoodPicker moodPicker;

    @JsonIgnoreProperties(value = { "moodPicker", "emotionPage", "moodJournalPage" }, allowSetters = true)
    @OneToOne(mappedBy = "emotionPage")
    private PromptsPage promptsPage;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EmotionPage id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AIGeneratedPrompts getPrompts() {
        return this.prompts;
    }

    public EmotionPage prompts(AIGeneratedPrompts prompts) {
        this.setPrompts(prompts);
        return this;
    }

    public void setPrompts(AIGeneratedPrompts prompts) {
        this.prompts = prompts;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public EmotionPage date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getPromptedEntry() {
        return this.promptedEntry;
    }

    public EmotionPage promptedEntry(String promptedEntry) {
        this.setPromptedEntry(promptedEntry);
        return this;
    }

    public void setPromptedEntry(String promptedEntry) {
        this.promptedEntry = promptedEntry;
    }

    public TabLabel getCurrentTab() {
        return this.currentTab;
    }

    public EmotionPage currentTab(TabLabel currentTab) {
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

    public EmotionPage moodPicker(MoodPicker moodPicker) {
        this.setMoodPicker(moodPicker);
        return this;
    }

    public PromptsPage getPromptsPage() {
        return this.promptsPage;
    }

    public void setPromptsPage(PromptsPage promptsPage) {
        if (this.promptsPage != null) {
            this.promptsPage.setEmotionPage(null);
        }
        if (promptsPage != null) {
            promptsPage.setEmotionPage(this);
        }
        this.promptsPage = promptsPage;
    }

    public EmotionPage promptsPage(PromptsPage promptsPage) {
        this.setPromptsPage(promptsPage);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EmotionPage)) {
            return false;
        }
        return id != null && id.equals(((EmotionPage) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EmotionPage{" +
            "id=" + getId() +
            ", prompts='" + getPrompts() + "'" +
            ", date='" + getDate() + "'" +
            ", promptedEntry='" + getPromptedEntry() + "'" +
            ", currentTab='" + getCurrentTab() + "'" +
            "}";
    }
}
