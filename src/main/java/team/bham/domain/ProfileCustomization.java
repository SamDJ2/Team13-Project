package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ProfileCustomization.
 */
@Entity
@Table(name = "profile_customization")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProfileCustomization implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "preferences")
    private Boolean preferences;

    @Column(name = "privacy_settings")
    private Boolean privacySettings;

    @Column(name = "account_history")
    private String accountHistory;

    @Column(name = "bio_description")
    private String bioDescription;

    @JsonIgnoreProperties(value = { "profileCustomization" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private JoinedTeams joinedTeams;

    @JsonIgnoreProperties(value = { "profileCustomization" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Setting setting;

    @JsonIgnoreProperties(value = { "profileCustomization" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Achievement achievement;

    @JsonIgnoreProperties(
        value = { "challenges", "habit", "leaderBoards", "profileCustomization", "moodJournalPage", "moodPicker" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "profileCustomization")
    private NavigationPortal navigationPortal;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ProfileCustomization id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getPreferences() {
        return this.preferences;
    }

    public ProfileCustomization preferences(Boolean preferences) {
        this.setPreferences(preferences);
        return this;
    }

    public void setPreferences(Boolean preferences) {
        this.preferences = preferences;
    }

    public Boolean getPrivacySettings() {
        return this.privacySettings;
    }

    public ProfileCustomization privacySettings(Boolean privacySettings) {
        this.setPrivacySettings(privacySettings);
        return this;
    }

    public void setPrivacySettings(Boolean privacySettings) {
        this.privacySettings = privacySettings;
    }

    public String getAccountHistory() {
        return this.accountHistory;
    }

    public ProfileCustomization accountHistory(String accountHistory) {
        this.setAccountHistory(accountHistory);
        return this;
    }

    public void setAccountHistory(String accountHistory) {
        this.accountHistory = accountHistory;
    }

    public String getBioDescription() {
        return this.bioDescription;
    }

    public ProfileCustomization bioDescription(String bioDescription) {
        this.setBioDescription(bioDescription);
        return this;
    }

    public void setBioDescription(String bioDescription) {
        this.bioDescription = bioDescription;
    }

    public JoinedTeams getJoinedTeams() {
        return this.joinedTeams;
    }

    public void setJoinedTeams(JoinedTeams joinedTeams) {
        this.joinedTeams = joinedTeams;
    }

    public ProfileCustomization joinedTeams(JoinedTeams joinedTeams) {
        this.setJoinedTeams(joinedTeams);
        return this;
    }

    public Setting getSetting() {
        return this.setting;
    }

    public void setSetting(Setting setting) {
        this.setting = setting;
    }

    public ProfileCustomization setting(Setting setting) {
        this.setSetting(setting);
        return this;
    }

    public Achievement getAchievement() {
        return this.achievement;
    }

    public void setAchievement(Achievement achievement) {
        this.achievement = achievement;
    }

    public ProfileCustomization achievement(Achievement achievement) {
        this.setAchievement(achievement);
        return this;
    }

    public NavigationPortal getNavigationPortal() {
        return this.navigationPortal;
    }

    public void setNavigationPortal(NavigationPortal navigationPortal) {
        if (this.navigationPortal != null) {
            this.navigationPortal.setProfileCustomization(null);
        }
        if (navigationPortal != null) {
            navigationPortal.setProfileCustomization(this);
        }
        this.navigationPortal = navigationPortal;
    }

    public ProfileCustomization navigationPortal(NavigationPortal navigationPortal) {
        this.setNavigationPortal(navigationPortal);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProfileCustomization)) {
            return false;
        }
        return id != null && id.equals(((ProfileCustomization) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProfileCustomization{" +
            "id=" + getId() +
            ", preferences='" + getPreferences() + "'" +
            ", privacySettings='" + getPrivacySettings() + "'" +
            ", accountHistory='" + getAccountHistory() + "'" +
            ", bioDescription='" + getBioDescription() + "'" +
            "}";
    }
}
