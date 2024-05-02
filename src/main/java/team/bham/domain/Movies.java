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
 * A Movies.
 */
@Entity
@Table(name = "movies")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Movies implements Serializable {

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

    @OneToMany(mappedBy = "movies")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "videoGames", "movies", "socialMedia", "music", "challenges" }, allowSetters = true)
    private Set<ScreenTime> screenTimes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Movies id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLevels() {
        return this.levels;
    }

    public Movies levels(String levels) {
        this.setLevels(levels);
        return this;
    }

    public void setLevels(String levels) {
        this.levels = levels;
    }

    public String getProgress() {
        return this.progress;
    }

    public Movies progress(String progress) {
        this.setProgress(progress);
        return this;
    }

    public void setProgress(String progress) {
        this.progress = progress;
    }

    public Duration getTimer() {
        return this.timer;
    }

    public Movies timer(Duration timer) {
        this.setTimer(timer);
        return this;
    }

    public void setTimer(Duration timer) {
        this.timer = timer;
    }

    public Set<ScreenTime> getScreenTimes() {
        return this.screenTimes;
    }

    public void setScreenTimes(Set<ScreenTime> screenTimes) {
        if (this.screenTimes != null) {
            this.screenTimes.forEach(i -> i.setMovies(null));
        }
        if (screenTimes != null) {
            screenTimes.forEach(i -> i.setMovies(this));
        }
        this.screenTimes = screenTimes;
    }

    public Movies screenTimes(Set<ScreenTime> screenTimes) {
        this.setScreenTimes(screenTimes);
        return this;
    }

    public Movies addScreenTime(ScreenTime screenTime) {
        this.screenTimes.add(screenTime);
        screenTime.setMovies(this);
        return this;
    }

    public Movies removeScreenTime(ScreenTime screenTime) {
        this.screenTimes.remove(screenTime);
        screenTime.setMovies(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Movies)) {
            return false;
        }
        return id != null && id.equals(((Movies) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Movies{" +
            "id=" + getId() +
            ", levels='" + getLevels() + "'" +
            ", progress='" + getProgress() + "'" +
            ", timer='" + getTimer() + "'" +
            "}";
    }
}
