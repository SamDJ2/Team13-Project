package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Points.
 */
@Entity
@Table(name = "points")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Points implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "current_points")
    private Integer currentPoints;

    @Column(name = "previous_points")
    private Integer previousPoints;

    @Column(name = "total_points")
    private Integer totalPoints;

    @ManyToOne
    @JsonIgnoreProperties(value = { "grouping", "progress", "userPoints", "navigationPortal" }, allowSetters = true)
    private LeaderBoards leaderBoards;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Points id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return this.username;
    }

    public Points username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getCurrentPoints() {
        return this.currentPoints;
    }

    public Points currentPoints(Integer currentPoints) {
        this.setCurrentPoints(currentPoints);
        return this;
    }

    public void setCurrentPoints(Integer currentPoints) {
        this.currentPoints = currentPoints;
    }

    public Integer getPreviousPoints() {
        return this.previousPoints;
    }

    public Points previousPoints(Integer previousPoints) {
        this.setPreviousPoints(previousPoints);
        return this;
    }

    public void setPreviousPoints(Integer previousPoints) {
        this.previousPoints = previousPoints;
    }

    public Integer getTotalPoints() {
        return this.totalPoints;
    }

    public Points totalPoints(Integer totalPoints) {
        this.setTotalPoints(totalPoints);
        return this;
    }

    public void setTotalPoints(Integer totalPoints) {
        this.totalPoints = totalPoints;
    }

    public LeaderBoards getLeaderBoards() {
        return this.leaderBoards;
    }

    public void setLeaderBoards(LeaderBoards leaderBoards) {
        this.leaderBoards = leaderBoards;
    }

    public Points leaderBoards(LeaderBoards leaderBoards) {
        this.setLeaderBoards(leaderBoards);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Points)) {
            return false;
        }
        return id != null && id.equals(((Points) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Points{" +
            "id=" + getId() +
            ", username='" + getUsername() + "'" +
            ", currentPoints=" + getCurrentPoints() +
            ", previousPoints=" + getPreviousPoints() +
            ", totalPoints=" + getTotalPoints() +
            "}";
    }
}
