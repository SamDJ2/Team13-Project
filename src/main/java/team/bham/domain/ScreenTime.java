package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ScreenTime.
 */
@Entity
@Table(name = "screen_time")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ScreenTime implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "select_category")
    private Boolean selectCategory;

    @ManyToOne
    @JsonIgnoreProperties(value = { "screenTimes" }, allowSetters = true)
    private VideoGames videoGames;

    @ManyToOne
    @JsonIgnoreProperties(value = { "screenTimes" }, allowSetters = true)
    private Movies movies;

    @ManyToOne
    @JsonIgnoreProperties(value = { "screenTimes" }, allowSetters = true)
    private SocialMedia socialMedia;

    @ManyToOne
    @JsonIgnoreProperties(value = { "screenTimes" }, allowSetters = true)
    private Music music;

    @OneToMany(mappedBy = "screenTime")
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

    public ScreenTime id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getSelectCategory() {
        return this.selectCategory;
    }

    public ScreenTime selectCategory(Boolean selectCategory) {
        this.setSelectCategory(selectCategory);
        return this;
    }

    public void setSelectCategory(Boolean selectCategory) {
        this.selectCategory = selectCategory;
    }

    public VideoGames getVideoGames() {
        return this.videoGames;
    }

    public void setVideoGames(VideoGames videoGames) {
        this.videoGames = videoGames;
    }

    public ScreenTime videoGames(VideoGames videoGames) {
        this.setVideoGames(videoGames);
        return this;
    }

    public Movies getMovies() {
        return this.movies;
    }

    public void setMovies(Movies movies) {
        this.movies = movies;
    }

    public ScreenTime movies(Movies movies) {
        this.setMovies(movies);
        return this;
    }

    public SocialMedia getSocialMedia() {
        return this.socialMedia;
    }

    public void setSocialMedia(SocialMedia socialMedia) {
        this.socialMedia = socialMedia;
    }

    public ScreenTime socialMedia(SocialMedia socialMedia) {
        this.setSocialMedia(socialMedia);
        return this;
    }

    public Music getMusic() {
        return this.music;
    }

    public void setMusic(Music music) {
        this.music = music;
    }

    public ScreenTime music(Music music) {
        this.setMusic(music);
        return this;
    }

    public Set<Challenges> getChallenges() {
        return this.challenges;
    }

    public void setChallenges(Set<Challenges> challenges) {
        if (this.challenges != null) {
            this.challenges.forEach(i -> i.setScreenTime(null));
        }
        if (challenges != null) {
            challenges.forEach(i -> i.setScreenTime(this));
        }
        this.challenges = challenges;
    }

    public ScreenTime challenges(Set<Challenges> challenges) {
        this.setChallenges(challenges);
        return this;
    }

    public ScreenTime addChallenges(Challenges challenges) {
        this.challenges.add(challenges);
        challenges.setScreenTime(this);
        return this;
    }

    public ScreenTime removeChallenges(Challenges challenges) {
        this.challenges.remove(challenges);
        challenges.setScreenTime(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ScreenTime)) {
            return false;
        }
        return id != null && id.equals(((ScreenTime) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ScreenTime{" +
            "id=" + getId() +
            ", selectCategory='" + getSelectCategory() + "'" +
            "}";
    }
}
