package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Duration;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A JunkFood.
 */
@Entity
@Table(name = "junk_food")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class JunkFood implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "levels")
    private String levels;

    @Column(name = "progress")
    private String progress;

    @Column(name = "timer")
    private Duration timer;

    @OneToMany(mappedBy = "junkFood")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "progress", "junkFood", "screenTime", "alcohol", "smoking", "searches", "filtereds", "navigationPortal" },
        allowSetters = true
    )
    private Set<Challenges> challenges = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public JunkFood id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLevels() {
        return this.levels;
    }

    public JunkFood levels(String levels) {
        this.setLevels(levels);
        return this;
    }

    public void setLevels(String levels) {
        this.levels = levels;
    }

    public String getProgress() {
        return this.progress;
    }

    public JunkFood progress(String progress) {
        this.setProgress(progress);
        return this;
    }

    public void setProgress(String progress) {
        this.progress = progress;
    }

    public Duration getTimer() {
        return this.timer;
    }

    public JunkFood timer(Duration timer) {
        this.setTimer(timer);
        return this;
    }

    public void setTimer(Duration timer) {
        this.timer = timer;
    }

    public Set<Challenges> getChallenges() {
        return this.challenges;
    }

    public void setChallenges(Set<Challenges> challenges) {
        if (this.challenges != null) {
            this.challenges.forEach(i -> i.setJunkFood(null));
        }
        if (challenges != null) {
            challenges.forEach(i -> i.setJunkFood(this));
        }
        this.challenges = challenges;
    }

    public JunkFood challenges(Set<Challenges> challenges) {
        this.setChallenges(challenges);
        return this;
    }

    public JunkFood addChallenges(Challenges challenges) {
        this.challenges.add(challenges);
        challenges.setJunkFood(this);
        return this;
    }

    public JunkFood removeChallenges(Challenges challenges) {
        this.challenges.remove(challenges);
        challenges.setJunkFood(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof JunkFood)) {
            return false;
        }
        return id != null && id.equals(((JunkFood) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "JunkFood{" +
            "id=" + getId() +
            ", levels='" + getLevels() + "'" +
            ", progress='" + getProgress() + "'" +
            ", timer='" + getTimer() + "'" +
            "}";
    }
}