package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Duration;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Grouping.
 */
@Entity
@Table(name = "grouping")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Grouping implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "i_d")
    private String iD;

    @Column(name = "grouping_name")
    private String groupingName;

    @Column(name = "grouping_points")
    private Integer groupingPoints = 0;

    @Column(name = "remaining_time")
    private Duration remainingTime;

    @Column(name = "jhi_current_date")
    private LocalDate currentDate = LocalDate.now();

    @OneToMany(mappedBy = "grouping")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "grouping" }, allowSetters = true)
    private Set<Members> members = new HashSet<>();

    @OneToMany(mappedBy = "grouping")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "grouping" }, allowSetters = true)
    private Set<Badges> badges = new HashSet<>();

    @JsonIgnoreProperties(value = { "grouping", "progress", "userPoints", "navigationPortal" }, allowSetters = true)
    @OneToOne(mappedBy = "grouping")
    private LeaderBoards leaderBoards;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Grouping id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getiD() {
        return this.iD;
    }

    public Grouping iD(String iD) {
        this.setiD(iD);
        return this;
    }

    public void setiD(String iD) {
        this.iD = iD;
    }

    public String getGroupingName() {
        return this.groupingName;
    }

    public Grouping groupingName(String groupingName) {
        this.setGroupingName(groupingName);
        return this;
    }

    public void setGroupingName(String groupingName) {
        this.groupingName = groupingName;
    }

    public Integer getGroupingPoints() {
        return this.groupingPoints;
    }

    public Grouping groupingPoints(Integer groupingPoints) {
        this.setGroupingPoints(groupingPoints);
        return this;
    }

    public void setGroupingPoints(Integer groupingPoints) {
        this.groupingPoints = groupingPoints;
    }

    public Duration getRemainingTime() {
        return this.remainingTime;
    }

    public Grouping remainingTime(Duration remainingTime) {
        this.setRemainingTime(remainingTime);
        return this;
    }

    public void setRemainingTime(Duration remainingTime) {
        this.remainingTime = remainingTime;
    }

    public LocalDate getCurrentDate() {
        return this.currentDate;
    }

    public Grouping currentDate(LocalDate currentDate) {
        this.setCurrentDate(currentDate);
        return this;
    }

    public void setCurrentDate(LocalDate currentDate) {
        this.currentDate = currentDate;
    }

    public Set<Members> getMembers() {
        return this.members;
    }

    public void setMembers(Set<Members> members) {
        if (this.members != null) {
            this.members.forEach(i -> i.setGrouping(null));
        }
        if (members != null) {
            members.forEach(i -> i.setGrouping(this));
        }
        this.members = members;
    }

    public Grouping members(Set<Members> members) {
        this.setMembers(members);
        return this;
    }

    public Grouping addMembers(Members members) {
        this.members.add(members);
        members.setGrouping(this);
        return this;
    }

    public Grouping removeMembers(Members members) {
        this.members.remove(members);
        members.setGrouping(null);
        return this;
    }

    public Set<Badges> getBadges() {
        return this.badges;
    }

    public void setBadges(Set<Badges> badges) {
        if (this.badges != null) {
            this.badges.forEach(i -> i.setGrouping(null));
        }
        if (badges != null) {
            badges.forEach(i -> i.setGrouping(this));
        }
        this.badges = badges;
    }

    public Grouping badges(Set<Badges> badges) {
        this.setBadges(badges);
        return this;
    }

    public Grouping addBadges(Badges badges) {
        this.badges.add(badges);
        badges.setGrouping(this);
        return this;
    }

    public Grouping removeBadges(Badges badges) {
        this.badges.remove(badges);
        badges.setGrouping(null);
        return this;
    }

    public LeaderBoards getLeaderBoards() {
        return this.leaderBoards;
    }

    public void setLeaderBoards(LeaderBoards leaderBoards) {
        if (this.leaderBoards != null) {
            this.leaderBoards.setGrouping(null);
        }
        if (leaderBoards != null) {
            leaderBoards.setGrouping(this);
        }
        this.leaderBoards = leaderBoards;
    }

    public Grouping leaderBoards(LeaderBoards leaderBoards) {
        this.setLeaderBoards(leaderBoards);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Grouping)) {
            return false;
        }
        return id != null && id.equals(((Grouping) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Grouping{" +
            "id=" + getId() +
            ", iD='" + getiD() + "'" +
            ", groupingName='" + getGroupingName() + "'" +
            ", groupingPoints=" + getGroupingPoints() +
            ", remainingTime='" + getRemainingTime() + "'" +
            ", currentDate='" + getCurrentDate() + "'" +
            "}";
    }
}
