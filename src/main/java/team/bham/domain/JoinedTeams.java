package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A JoinedTeams.
 */
@Entity
@Table(name = "joined_teams")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class JoinedTeams implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "team_id")
    private Integer teamID;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "member_since")
    private LocalDate memberSince;

    @JsonIgnoreProperties(value = { "joinedTeams", "setting", "achievement", "navigationPortal" }, allowSetters = true)
    @OneToOne(mappedBy = "joinedTeams")
    private ProfileCustomization profileCustomization;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public JoinedTeams id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTeamID() {
        return this.teamID;
    }

    public JoinedTeams teamID(Integer teamID) {
        this.setTeamID(teamID);
        return this;
    }

    public void setTeamID(Integer teamID) {
        this.teamID = teamID;
    }

    public String getName() {
        return this.name;
    }

    public JoinedTeams name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public JoinedTeams description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getMemberSince() {
        return this.memberSince;
    }

    public JoinedTeams memberSince(LocalDate memberSince) {
        this.setMemberSince(memberSince);
        return this;
    }

    public void setMemberSince(LocalDate memberSince) {
        this.memberSince = memberSince;
    }

    public ProfileCustomization getProfileCustomization() {
        return this.profileCustomization;
    }

    public void setProfileCustomization(ProfileCustomization profileCustomization) {
        if (this.profileCustomization != null) {
            this.profileCustomization.setJoinedTeams(null);
        }
        if (profileCustomization != null) {
            profileCustomization.setJoinedTeams(this);
        }
        this.profileCustomization = profileCustomization;
    }

    public JoinedTeams profileCustomization(ProfileCustomization profileCustomization) {
        this.setProfileCustomization(profileCustomization);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof JoinedTeams)) {
            return false;
        }
        return id != null && id.equals(((JoinedTeams) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "JoinedTeams{" +
            "id=" + getId() +
            ", teamID=" + getTeamID() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", memberSince='" + getMemberSince() + "'" +
            "}";
    }
}
