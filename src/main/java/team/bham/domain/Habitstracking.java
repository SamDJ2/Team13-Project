package team.bham.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Habitstracking.
 */
@Entity
@Table(name = "habitstracking")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Habitstracking implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name_of_habit")
    private String nameOfHabit;

    @Column(name = "day_of_habit")
    private String dayOfHabit;

    @Column(name = "week_of_habit")
    private Integer weekOfHabit;

    @Column(name = "completed_habit")
    private Boolean completedHabit;

    @Column(name = "username_habit")
    private String usernameHabit;

    @Column(name = "habit_iden")
    private Integer habitIDEN;

    @Column(name = "summary")
    private String summary;

    // Getters and setters
    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNameOfHabit() {
        return this.nameOfHabit;
    }

    public Habitstracking nameOfHabit(String nameOfHabit) {
        this.setNameOfHabit(nameOfHabit);
        return this;
    }

    public void setNameOfHabit(String nameOfHabit) {
        this.nameOfHabit = nameOfHabit;
    }

    public String getDayOfHabit() {
        return this.dayOfHabit;
    }

    public Habitstracking dayOfHabit(String dayOfHabit) {
        this.setDayOfHabit(dayOfHabit);
        return this;
    }

    public void setDayOfHabit(String dayOfHabit) {
        this.dayOfHabit = dayOfHabit;
    }

    public Integer getWeekOfHabit() {
        return this.weekOfHabit;
    }

    public Habitstracking weekOfHabit(Integer weekOfHabit) {
        this.setWeekOfHabit(weekOfHabit);
        return this;
    }

    public void setWeekOfHabit(Integer weekOfHabit) {
        this.weekOfHabit = weekOfHabit;
    }

    public Boolean getCompletedHabit() {
        return this.completedHabit;
    }

    public Habitstracking completedHabit(Boolean completedHabit) {
        this.setCompletedHabit(completedHabit);
        return this;
    }

    public void setCompletedHabit(Boolean completedHabit) {
        this.completedHabit = completedHabit;
    }

    public String getUsernameHabit() {
        return this.usernameHabit;
    }

    public Habitstracking usernameHabit(String usernameHabit) {
        this.setUsernameHabit(usernameHabit);
        return this;
    }

    public void setUsernameHabit(String usernameHabit) {
        this.usernameHabit = usernameHabit;
    }

    public Integer getHabitIDEN() {
        return this.habitIDEN;
    }

    public Habitstracking habitIDEN(Integer habitIDEN) {
        this.setHabitIDEN(habitIDEN);
        return this;
    }

    public void setHabitIDEN(Integer habitIDEN) {
        this.habitIDEN = habitIDEN;
    }

    public String getSummary() {
        return this.summary;
    }

    public Habitstracking summary(String summary) {
        this.setSummary(summary);
        return this;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Habitstracking)) {
            return false;
        }
        return id != null && id.equals(((Habitstracking) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Habitstracking{" +
            "id=" + getId() +
            ", nameOfHabit='" + getNameOfHabit() + "'" +
            ", dayOfHabit='" + getDayOfHabit() + "'" +
            ", weekOfHabit=" + getWeekOfHabit() +
            ", completedHabit='" + getCompletedHabit() + "'" +
            ", usernameHabit='" + getUsernameHabit() + "'" +
            ", habitIDEN=" + getHabitIDEN() +
            ", summary='" + getSummary() + "'" +
            "}";
    }
}
