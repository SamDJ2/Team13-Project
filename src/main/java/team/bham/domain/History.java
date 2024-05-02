package team.bham.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A History.
 */
@Entity
@Table(name = "history")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class History implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "challenge_name")
    private String challengeName;

    @Column(name = "challenge_level")
    private String challengeLevel;

    @Column(name = "date_started")
    private Instant dateStarted;

    @Column(name = "username")
    private String username;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public History id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChallengeName() {
        return this.challengeName;
    }

    public History challengeName(String challengeName) {
        this.setChallengeName(challengeName);
        return this;
    }

    public void setChallengeName(String challengeName) {
        this.challengeName = challengeName;
    }

    public String getChallengeLevel() {
        return this.challengeLevel;
    }

    public History challengeLevel(String challengeLevel) {
        this.setChallengeLevel(challengeLevel);
        return this;
    }

    public void setChallengeLevel(String challengeLevel) {
        this.challengeLevel = challengeLevel;
    }

    public Instant getDateStarted() {
        return this.dateStarted;
    }

    public History dateStarted(Instant dateStarted) {
        this.setDateStarted(dateStarted);
        return this;
    }

    public void setDateStarted(Instant dateStarted) {
        this.dateStarted = dateStarted;
    }

    public String getUsername() {
        return this.username;
    }

    public History username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof History)) {
            return false;
        }
        return id != null && id.equals(((History) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "History{" +
            "id=" + getId() +
            ", challengeName='" + getChallengeName() + "'" +
            ", challengeLevel='" + getChallengeLevel() + "'" +
            ", dateStarted='" + getDateStarted() + "'" +
            ", username='" + getUsername() + "'" +
            "}";
    }
}
