package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.TabLabel;

/**
 * A EntriesPage.
 */
@Entity
@Table(name = "entries_page")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EntriesPage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "normal_entries")
    private String normalEntries;

    @Column(name = "date")
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_tab")
    private TabLabel currentTab;

    @ManyToOne
    @JsonIgnoreProperties(value = { "entriesPages", "promptsPages", "navigationPortal" }, allowSetters = true)
    private MoodJournalPage moodJournalPage;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EntriesPage id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNormalEntries() {
        return this.normalEntries;
    }

    public EntriesPage normalEntries(String normalEntries) {
        this.setNormalEntries(normalEntries);
        return this;
    }

    public void setNormalEntries(String normalEntries) {
        this.normalEntries = normalEntries;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public EntriesPage date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public TabLabel getCurrentTab() {
        return this.currentTab;
    }

    public EntriesPage currentTab(TabLabel currentTab) {
        this.setCurrentTab(currentTab);
        return this;
    }

    public void setCurrentTab(TabLabel currentTab) {
        this.currentTab = currentTab;
    }

    public MoodJournalPage getMoodJournalPage() {
        return this.moodJournalPage;
    }

    public void setMoodJournalPage(MoodJournalPage moodJournalPage) {
        this.moodJournalPage = moodJournalPage;
    }

    public EntriesPage moodJournalPage(MoodJournalPage moodJournalPage) {
        this.setMoodJournalPage(moodJournalPage);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EntriesPage)) {
            return false;
        }
        return id != null && id.equals(((EntriesPage) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EntriesPage{" +
            "id=" + getId() +
            ", normalEntries='" + getNormalEntries() + "'" +
            ", date='" + getDate() + "'" +
            ", currentTab='" + getCurrentTab() + "'" +
            "}";
    }
}
