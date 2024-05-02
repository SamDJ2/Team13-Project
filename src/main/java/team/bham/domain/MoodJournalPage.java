package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.TabLabel;

/**
 * A MoodJournalPage.
 */
@Entity
@Table(name = "mood_journal_page")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MoodJournalPage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "all_entries")
    private String allEntries;

    @Column(name = "date")
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_tab")
    private TabLabel currentTab;

    @OneToMany(mappedBy = "moodJournalPage")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "moodJournalPage" }, allowSetters = true)
    private Set<EntriesPage> entriesPages = new HashSet<>();

    @OneToMany(mappedBy = "moodJournalPage")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "moodPicker", "emotionPage", "moodJournalPage" }, allowSetters = true)
    private Set<PromptsPage> promptsPages = new HashSet<>();

    @JsonIgnoreProperties(
        value = { "challenges", "habit", "leaderBoards", "profileCustomization", "moodJournalPage", "moodPicker" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "moodJournalPage")
    private NavigationPortal navigationPortal;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public MoodJournalPage id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAllEntries() {
        return this.allEntries;
    }

    public MoodJournalPage allEntries(String allEntries) {
        this.setAllEntries(allEntries);
        return this;
    }

    public void setAllEntries(String allEntries) {
        this.allEntries = allEntries;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public MoodJournalPage date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public TabLabel getCurrentTab() {
        return this.currentTab;
    }

    public MoodJournalPage currentTab(TabLabel currentTab) {
        this.setCurrentTab(currentTab);
        return this;
    }

    public void setCurrentTab(TabLabel currentTab) {
        this.currentTab = currentTab;
    }

    public Set<EntriesPage> getEntriesPages() {
        return this.entriesPages;
    }

    public void setEntriesPages(Set<EntriesPage> entriesPages) {
        if (this.entriesPages != null) {
            this.entriesPages.forEach(i -> i.setMoodJournalPage(null));
        }
        if (entriesPages != null) {
            entriesPages.forEach(i -> i.setMoodJournalPage(this));
        }
        this.entriesPages = entriesPages;
    }

    public MoodJournalPage entriesPages(Set<EntriesPage> entriesPages) {
        this.setEntriesPages(entriesPages);
        return this;
    }

    public MoodJournalPage addEntriesPage(EntriesPage entriesPage) {
        this.entriesPages.add(entriesPage);
        entriesPage.setMoodJournalPage(this);
        return this;
    }

    public MoodJournalPage removeEntriesPage(EntriesPage entriesPage) {
        this.entriesPages.remove(entriesPage);
        entriesPage.setMoodJournalPage(null);
        return this;
    }

    public Set<PromptsPage> getPromptsPages() {
        return this.promptsPages;
    }

    public void setPromptsPages(Set<PromptsPage> promptsPages) {
        if (this.promptsPages != null) {
            this.promptsPages.forEach(i -> i.setMoodJournalPage(null));
        }
        if (promptsPages != null) {
            promptsPages.forEach(i -> i.setMoodJournalPage(this));
        }
        this.promptsPages = promptsPages;
    }

    public MoodJournalPage promptsPages(Set<PromptsPage> promptsPages) {
        this.setPromptsPages(promptsPages);
        return this;
    }

    public MoodJournalPage addPromptsPage(PromptsPage promptsPage) {
        this.promptsPages.add(promptsPage);
        promptsPage.setMoodJournalPage(this);
        return this;
    }

    public MoodJournalPage removePromptsPage(PromptsPage promptsPage) {
        this.promptsPages.remove(promptsPage);
        promptsPage.setMoodJournalPage(null);
        return this;
    }

    public NavigationPortal getNavigationPortal() {
        return this.navigationPortal;
    }

    public void setNavigationPortal(NavigationPortal navigationPortal) {
        if (this.navigationPortal != null) {
            this.navigationPortal.setMoodJournalPage(null);
        }
        if (navigationPortal != null) {
            navigationPortal.setMoodJournalPage(this);
        }
        this.navigationPortal = navigationPortal;
    }

    public MoodJournalPage navigationPortal(NavigationPortal navigationPortal) {
        this.setNavigationPortal(navigationPortal);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MoodJournalPage)) {
            return false;
        }
        return id != null && id.equals(((MoodJournalPage) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MoodJournalPage{" +
            "id=" + getId() +
            ", allEntries='" + getAllEntries() + "'" +
            ", date='" + getDate() + "'" +
            ", currentTab='" + getCurrentTab() + "'" +
            "}";
    }
}
