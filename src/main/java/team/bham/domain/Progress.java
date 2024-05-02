package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Progress.
 */
@Entity
@Table(name = "progress")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Progress implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "detox_progress")
    private Long detoxProgress;

    @Column(name = "detox_total")
    private Long detoxTotal;

    @Column(name = "challenges_info")
    private String challengesInfo;

    @Column(name = "leaderboard_info")
    private String leaderboardInfo;

    @JsonIgnoreProperties(
        value = { "progress", "junkFood", "screenTime", "alcohol", "smoking", "searches", "filtereds", "navigationPortal" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "progress")
    private Challenges challenges;

    @JsonIgnoreProperties(value = { "grouping", "progress", "userPoints", "navigationPortal" }, allowSetters = true)
    @OneToOne(mappedBy = "progress")
    private LeaderBoards leaderBoards;

    @JsonIgnoreProperties(value = { "landingPage", "progress" }, allowSetters = true)
    @OneToOne(mappedBy = "progress")
    private UserDB userDB;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Progress id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDetoxProgress() {
        return this.detoxProgress;
    }

    public Progress detoxProgress(Long detoxProgress) {
        this.setDetoxProgress(detoxProgress);
        return this;
    }

    public void setDetoxProgress(Long detoxProgress) {
        this.detoxProgress = detoxProgress;
    }

    public Long getDetoxTotal() {
        return this.detoxTotal;
    }

    public Progress detoxTotal(Long detoxTotal) {
        this.setDetoxTotal(detoxTotal);
        return this;
    }

    public void setDetoxTotal(Long detoxTotal) {
        this.detoxTotal = detoxTotal;
    }

    public String getChallengesInfo() {
        return this.challengesInfo;
    }

    public Progress challengesInfo(String challengesInfo) {
        this.setChallengesInfo(challengesInfo);
        return this;
    }

    public void setChallengesInfo(String challengesInfo) {
        this.challengesInfo = challengesInfo;
    }

    public String getLeaderboardInfo() {
        return this.leaderboardInfo;
    }

    public Progress leaderboardInfo(String leaderboardInfo) {
        this.setLeaderboardInfo(leaderboardInfo);
        return this;
    }

    public void setLeaderboardInfo(String leaderboardInfo) {
        this.leaderboardInfo = leaderboardInfo;
    }

    public Challenges getChallenges() {
        return this.challenges;
    }

    public void setChallenges(Challenges challenges) {
        if (this.challenges != null) {
            this.challenges.setProgress(null);
        }
        if (challenges != null) {
            challenges.setProgress(this);
        }
        this.challenges = challenges;
    }

    public Progress challenges(Challenges challenges) {
        this.setChallenges(challenges);
        return this;
    }

    public LeaderBoards getLeaderBoards() {
        return this.leaderBoards;
    }

    public void setLeaderBoards(LeaderBoards leaderBoards) {
        if (this.leaderBoards != null) {
            this.leaderBoards.setProgress(null);
        }
        if (leaderBoards != null) {
            leaderBoards.setProgress(this);
        }
        this.leaderBoards = leaderBoards;
    }

    public Progress leaderBoards(LeaderBoards leaderBoards) {
        this.setLeaderBoards(leaderBoards);
        return this;
    }

    public UserDB getUserDB() {
        return this.userDB;
    }

    public void setUserDB(UserDB userDB) {
        if (this.userDB != null) {
            this.userDB.setProgress(null);
        }
        if (userDB != null) {
            userDB.setProgress(this);
        }
        this.userDB = userDB;
    }

    public Progress userDB(UserDB userDB) {
        this.setUserDB(userDB);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Progress)) {
            return false;
        }
        return id != null && id.equals(((Progress) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Progress{" +
            "id=" + getId() +
            ", detoxProgress=" + getDetoxProgress() +
            ", detoxTotal=" + getDetoxTotal() +
            ", challengesInfo='" + getChallengesInfo() + "'" +
            ", leaderboardInfo='" + getLeaderboardInfo() + "'" +
            "}";
    }
}
