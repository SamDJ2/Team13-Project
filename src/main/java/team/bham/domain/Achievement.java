package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.AchievementType;

/**
 * A Achievement.
 */
@Entity
@Table(name = "achievement")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Achievement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "achievement_id")
    private Long achievementID;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "date_earned")
    private LocalDate dateEarned;

    @Enumerated(EnumType.STRING)
    @Column(name = "achievement_type")
    private AchievementType achievementType;

    @JsonIgnoreProperties(value = { "joinedTeams", "setting", "achievement", "navigationPortal" }, allowSetters = true)
    @OneToOne(mappedBy = "achievement")
    private ProfileCustomization profileCustomization;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Achievement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAchievementID() {
        return this.achievementID;
    }

    public Achievement achievementID(Long achievementID) {
        this.setAchievementID(achievementID);
        return this;
    }

    public void setAchievementID(Long achievementID) {
        this.achievementID = achievementID;
    }

    public String getName() {
        return this.name;
    }

    public Achievement name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Achievement description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDateEarned() {
        return this.dateEarned;
    }

    public Achievement dateEarned(LocalDate dateEarned) {
        this.setDateEarned(dateEarned);
        return this;
    }

    public void setDateEarned(LocalDate dateEarned) {
        this.dateEarned = dateEarned;
    }

    public AchievementType getAchievementType() {
        return this.achievementType;
    }

    public Achievement achievementType(AchievementType achievementType) {
        this.setAchievementType(achievementType);
        return this;
    }

    public void setAchievementType(AchievementType achievementType) {
        this.achievementType = achievementType;
    }

    public ProfileCustomization getProfileCustomization() {
        return this.profileCustomization;
    }

    public void setProfileCustomization(ProfileCustomization profileCustomization) {
        if (this.profileCustomization != null) {
            this.profileCustomization.setAchievement(null);
        }
        if (profileCustomization != null) {
            profileCustomization.setAchievement(this);
        }
        this.profileCustomization = profileCustomization;
    }

    public Achievement profileCustomization(ProfileCustomization profileCustomization) {
        this.setProfileCustomization(profileCustomization);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Achievement)) {
            return false;
        }
        return id != null && id.equals(((Achievement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Achievement{" +
            "id=" + getId() +
            ", achievementID=" + getAchievementID() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", dateEarned='" + getDateEarned() + "'" +
            ", achievementType='" + getAchievementType() + "'" +
            "}";
    }
}
