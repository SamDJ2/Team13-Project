package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A WeeklySummary.
 */
@Entity
@Table(name = "weekly_summary")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class WeeklySummary implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "summary_id")
    private Long summaryID;

    @Column(name = "summary_text")
    private String summaryText;

    @JsonIgnoreProperties(value = { "weeklySummary", "habit" }, allowSetters = true)
    @OneToOne(mappedBy = "weeklySummary")
    private NewWeeklyHabitTracker newWeeklyHabitTracker;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public WeeklySummary id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSummaryID() {
        return this.summaryID;
    }

    public WeeklySummary summaryID(Long summaryID) {
        this.setSummaryID(summaryID);
        return this;
    }

    public void setSummaryID(Long summaryID) {
        this.summaryID = summaryID;
    }

    public String getSummaryText() {
        return this.summaryText;
    }

    public WeeklySummary summaryText(String summaryText) {
        this.setSummaryText(summaryText);
        return this;
    }

    public void setSummaryText(String summaryText) {
        this.summaryText = summaryText;
    }

    public NewWeeklyHabitTracker getNewWeeklyHabitTracker() {
        return this.newWeeklyHabitTracker;
    }

    public void setNewWeeklyHabitTracker(NewWeeklyHabitTracker newWeeklyHabitTracker) {
        if (this.newWeeklyHabitTracker != null) {
            this.newWeeklyHabitTracker.setWeeklySummary(null);
        }
        if (newWeeklyHabitTracker != null) {
            newWeeklyHabitTracker.setWeeklySummary(this);
        }
        this.newWeeklyHabitTracker = newWeeklyHabitTracker;
    }

    public WeeklySummary newWeeklyHabitTracker(NewWeeklyHabitTracker newWeeklyHabitTracker) {
        this.setNewWeeklyHabitTracker(newWeeklyHabitTracker);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof WeeklySummary)) {
            return false;
        }
        return id != null && id.equals(((WeeklySummary) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "WeeklySummary{" +
            "id=" + getId() +
            ", summaryID=" + getSummaryID() +
            ", summaryText='" + getSummaryText() + "'" +
            "}";
    }
}
