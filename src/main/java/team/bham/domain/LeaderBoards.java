package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LeaderBoards.
 */
@Entity
@Table(name = "leader_boards")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LeaderBoards implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "standings")
    private String standings;

    @JsonIgnoreProperties(value = { "members", "badges", "leaderBoards" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Grouping grouping;

    @JsonIgnoreProperties(value = { "challenges", "leaderBoards", "userDB" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Progress progress;

    @OneToMany(mappedBy = "leaderBoards")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "leaderBoards" }, allowSetters = true)
    private Set<UserPoints> userPoints = new HashSet<>();

    @JsonIgnoreProperties(
        value = { "challenges", "habit", "leaderBoards", "profileCustomization", "moodJournalPage", "moodPicker" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "leaderBoards")
    private NavigationPortal navigationPortal;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LeaderBoards id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStandings() {
        return this.standings;
    }

    public LeaderBoards standings(String standings) {
        this.setStandings(standings);
        return this;
    }

    public void setStandings(String standings) {
        this.standings = standings;
    }

    public Grouping getGrouping() {
        return this.grouping;
    }

    public void setGrouping(Grouping grouping) {
        this.grouping = grouping;
    }

    public LeaderBoards grouping(Grouping grouping) {
        this.setGrouping(grouping);
        return this;
    }

    public Progress getProgress() {
        return this.progress;
    }

    public void setProgress(Progress progress) {
        this.progress = progress;
    }

    public LeaderBoards progress(Progress progress) {
        this.setProgress(progress);
        return this;
    }

    public Set<UserPoints> getUserPoints() {
        return this.userPoints;
    }

    public void setUserPoints(Set<UserPoints> userPoints) {
        if (this.userPoints != null) {
            this.userPoints.forEach(i -> i.setLeaderBoards(null));
        }
        if (userPoints != null) {
            userPoints.forEach(i -> i.setLeaderBoards(this));
        }
        this.userPoints = userPoints;
    }

    public LeaderBoards userPoints(Set<UserPoints> userPoints) {
        this.setUserPoints(userPoints);
        return this;
    }

    public LeaderBoards addUserPoints(UserPoints userPoints) {
        this.userPoints.add(userPoints);
        userPoints.setLeaderBoards(this);
        return this;
    }

    public LeaderBoards removeUserPoints(UserPoints userPoints) {
        this.userPoints.remove(userPoints);
        userPoints.setLeaderBoards(null);
        return this;
    }

    public NavigationPortal getNavigationPortal() {
        return this.navigationPortal;
    }

    public void setNavigationPortal(NavigationPortal navigationPortal) {
        if (this.navigationPortal != null) {
            this.navigationPortal.setLeaderBoards(null);
        }
        if (navigationPortal != null) {
            navigationPortal.setLeaderBoards(this);
        }
        this.navigationPortal = navigationPortal;
    }

    public LeaderBoards navigationPortal(NavigationPortal navigationPortal) {
        this.setNavigationPortal(navigationPortal);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LeaderBoards)) {
            return false;
        }
        return id != null && id.equals(((LeaderBoards) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LeaderBoards{" +
            "id=" + getId() +
            ", standings='" + getStandings() + "'" +
            "}";
    }
}
