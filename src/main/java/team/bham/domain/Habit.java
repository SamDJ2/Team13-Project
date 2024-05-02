package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Habit.
 */
@Entity
@Table(name = "habit")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Habit implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "habit_id")
    private Long habitID;

    @Column(name = "habit_name")
    private String habitName;

    @OneToMany(mappedBy = "habit")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "weeklySummary", "habit" }, allowSetters = true)
    private Set<NewWeeklyHabitTracker> newWeeklyHabitTrackers = new HashSet<>();

    @JsonIgnoreProperties(
        value = { "challenges", "habit", "leaderBoards", "profileCustomization", "moodJournalPage", "moodPicker" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "habit")
    private NavigationPortal navigationPortal;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Habit id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHabitID() {
        return this.habitID;
    }

    public Habit habitID(Long habitID) {
        this.setHabitID(habitID);
        return this;
    }

    public void setHabitID(Long habitID) {
        this.habitID = habitID;
    }

    public String getHabitName() {
        return this.habitName;
    }

    public Habit habitName(String habitName) {
        this.setHabitName(habitName);
        return this;
    }

    public void setHabitName(String habitName) {
        this.habitName = habitName;
    }

    public Set<NewWeeklyHabitTracker> getNewWeeklyHabitTrackers() {
        return this.newWeeklyHabitTrackers;
    }

    public void setNewWeeklyHabitTrackers(Set<NewWeeklyHabitTracker> newWeeklyHabitTrackers) {
        if (this.newWeeklyHabitTrackers != null) {
            this.newWeeklyHabitTrackers.forEach(i -> i.setHabit(null));
        }
        if (newWeeklyHabitTrackers != null) {
            newWeeklyHabitTrackers.forEach(i -> i.setHabit(this));
        }
        this.newWeeklyHabitTrackers = newWeeklyHabitTrackers;
    }

    public Habit newWeeklyHabitTrackers(Set<NewWeeklyHabitTracker> newWeeklyHabitTrackers) {
        this.setNewWeeklyHabitTrackers(newWeeklyHabitTrackers);
        return this;
    }

    public Habit addNewWeeklyHabitTracker(NewWeeklyHabitTracker newWeeklyHabitTracker) {
        this.newWeeklyHabitTrackers.add(newWeeklyHabitTracker);
        newWeeklyHabitTracker.setHabit(this);
        return this;
    }

    public Habit removeNewWeeklyHabitTracker(NewWeeklyHabitTracker newWeeklyHabitTracker) {
        this.newWeeklyHabitTrackers.remove(newWeeklyHabitTracker);
        newWeeklyHabitTracker.setHabit(null);
        return this;
    }

    public NavigationPortal getNavigationPortal() {
        return this.navigationPortal;
    }

    public void setNavigationPortal(NavigationPortal navigationPortal) {
        if (this.navigationPortal != null) {
            this.navigationPortal.setHabit(null);
        }
        if (navigationPortal != null) {
            navigationPortal.setHabit(this);
        }
        this.navigationPortal = navigationPortal;
    }

    public Habit navigationPortal(NavigationPortal navigationPortal) {
        this.setNavigationPortal(navigationPortal);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Habit)) {
            return false;
        }
        return id != null && id.equals(((Habit) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Habit{" +
            "id=" + getId() +
            ", habitID=" + getHabitID() +
            ", habitName='" + getHabitName() + "'" +
            "}";
    }
}
