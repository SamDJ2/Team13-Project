package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A NewWeeklyHabitTracker.
 */
@Entity
@Table(name = "new_weekly_habit_tracker")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class NewWeeklyHabitTracker implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "record_id")
    private Long recordID;

    @Column(name = "habit_completion")
    private Boolean habitCompletion;

    @Column(name = "date")
    private LocalDate date;

    @JsonIgnoreProperties(value = { "newWeeklyHabitTracker" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private WeeklySummary weeklySummary;

    @ManyToOne
    @JsonIgnoreProperties(value = { "newWeeklyHabitTrackers", "navigationPortal" }, allowSetters = true)
    private Habit habit;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public NewWeeklyHabitTracker id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRecordID() {
        return this.recordID;
    }

    public NewWeeklyHabitTracker recordID(Long recordID) {
        this.setRecordID(recordID);
        return this;
    }

    public void setRecordID(Long recordID) {
        this.recordID = recordID;
    }

    public Boolean getHabitCompletion() {
        return this.habitCompletion;
    }

    public NewWeeklyHabitTracker habitCompletion(Boolean habitCompletion) {
        this.setHabitCompletion(habitCompletion);
        return this;
    }

    public void setHabitCompletion(Boolean habitCompletion) {
        this.habitCompletion = habitCompletion;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public NewWeeklyHabitTracker date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public WeeklySummary getWeeklySummary() {
        return this.weeklySummary;
    }

    public void setWeeklySummary(WeeklySummary weeklySummary) {
        this.weeklySummary = weeklySummary;
    }

    public NewWeeklyHabitTracker weeklySummary(WeeklySummary weeklySummary) {
        this.setWeeklySummary(weeklySummary);
        return this;
    }

    public Habit getHabit() {
        return this.habit;
    }

    public void setHabit(Habit habit) {
        this.habit = habit;
    }

    public NewWeeklyHabitTracker habit(Habit habit) {
        this.setHabit(habit);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof NewWeeklyHabitTracker)) {
            return false;
        }
        return id != null && id.equals(((NewWeeklyHabitTracker) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "NewWeeklyHabitTracker{" +
            "id=" + getId() +
            ", recordID=" + getRecordID() +
            ", habitCompletion='" + getHabitCompletion() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
