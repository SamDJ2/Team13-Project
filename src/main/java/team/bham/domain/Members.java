package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Members.
 */
@Entity
@Table(name = "members")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Members implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "group_id")
    private Long groupID;

    @Column(name = "user_id")
    private Long userID;

    @Column(name = "leader")
    private Boolean leader;

    @ManyToOne
    @JsonIgnoreProperties(value = { "members", "badges", "leaderBoards" }, allowSetters = true)
    private Grouping grouping;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Members id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGroupID() {
        return this.groupID;
    }

    public Members groupID(Long groupID) {
        this.setGroupID(groupID);
        return this;
    }

    public void setGroupID(Long groupID) {
        this.groupID = groupID;
    }

    public Long getUserID() {
        return this.userID;
    }

    public Members userID(Long userID) {
        this.setUserID(userID);
        return this;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public Boolean getLeader() {
        return this.leader;
    }

    public Members leader(Boolean leader) {
        this.setLeader(leader);
        return this;
    }

    public void setLeader(Boolean leader) {
        this.leader = leader;
    }

    public Grouping getGrouping() {
        return this.grouping;
    }

    public void setGrouping(Grouping grouping) {
        this.grouping = grouping;
    }

    public Members grouping(Grouping grouping) {
        this.setGrouping(grouping);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Members)) {
            return false;
        }
        return id != null && id.equals(((Members) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Members{" +
            "id=" + getId() +
            ", groupID=" + getGroupID() +
            ", userID=" + getUserID() +
            ", leader='" + getLeader() + "'" +
            "}";
    }
}
