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
 * A VideoGames.
 */
@Entity
@Table(name = "video_games")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VideoGames implements Serializable {

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

    @OneToMany(mappedBy = "videoGames")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "videoGames", "movies", "socialMedia", "music", "challenges" }, allowSetters = true)
    private Set<ScreenTime> screenTimes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public VideoGames id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLevels() {
        return this.levels;
    }

    public VideoGames levels(String levels) {
        this.setLevels(levels);
        return this;
    }

    public void setLevels(String levels) {
        this.levels = levels;
    }

    public String getProgress() {
        return this.progress;
    }

    public VideoGames progress(String progress) {
        this.setProgress(progress);
        return this;
    }

    public void setProgress(String progress) {
        this.progress = progress;
    }

    public Duration getTimer() {
        return this.timer;
    }

    public VideoGames timer(Duration timer) {
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
            this.screenTimes.forEach(i -> i.setVideoGames(null));
        }
        if (screenTimes != null) {
            screenTimes.forEach(i -> i.setVideoGames(this));
        }
        this.screenTimes = screenTimes;
    }

    public VideoGames screenTimes(Set<ScreenTime> screenTimes) {
        this.setScreenTimes(screenTimes);
        return this;
    }

    public VideoGames addScreenTime(ScreenTime screenTime) {
        this.screenTimes.add(screenTime);
        screenTime.setVideoGames(this);
        return this;
    }

    public VideoGames removeScreenTime(ScreenTime screenTime) {
        this.screenTimes.remove(screenTime);
        screenTime.setVideoGames(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VideoGames)) {
            return false;
        }
        return id != null && id.equals(((VideoGames) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VideoGames{" +
            "id=" + getId() +
            ", levels='" + getLevels() + "'" +
            ", progress='" + getProgress() + "'" +
            ", timer='" + getTimer() + "'" +
            "}";
    }
}
