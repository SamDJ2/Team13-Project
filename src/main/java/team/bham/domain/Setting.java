package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Setting.
 */
@Entity
@Table(name = "setting")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Setting implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "notifications_enabled")
    private Boolean notificationsEnabled;

    @Column(name = "account_deletion_requested")
    private Boolean accountDeletionRequested;

    @Column(name = "change_password")
    private Boolean changePassword;

    @JsonIgnoreProperties(value = { "joinedTeams", "setting", "achievement", "navigationPortal" }, allowSetters = true)
    @OneToOne(mappedBy = "setting")
    private ProfileCustomization profileCustomization;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Setting id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getNotificationsEnabled() {
        return this.notificationsEnabled;
    }

    public Setting notificationsEnabled(Boolean notificationsEnabled) {
        this.setNotificationsEnabled(notificationsEnabled);
        return this;
    }

    public void setNotificationsEnabled(Boolean notificationsEnabled) {
        this.notificationsEnabled = notificationsEnabled;
    }

    public Boolean getAccountDeletionRequested() {
        return this.accountDeletionRequested;
    }

    public Setting accountDeletionRequested(Boolean accountDeletionRequested) {
        this.setAccountDeletionRequested(accountDeletionRequested);
        return this;
    }

    public void setAccountDeletionRequested(Boolean accountDeletionRequested) {
        this.accountDeletionRequested = accountDeletionRequested;
    }

    public Boolean getChangePassword() {
        return this.changePassword;
    }

    public Setting changePassword(Boolean changePassword) {
        this.setChangePassword(changePassword);
        return this;
    }

    public void setChangePassword(Boolean changePassword) {
        this.changePassword = changePassword;
    }

    public ProfileCustomization getProfileCustomization() {
        return this.profileCustomization;
    }

    public void setProfileCustomization(ProfileCustomization profileCustomization) {
        if (this.profileCustomization != null) {
            this.profileCustomization.setSetting(null);
        }
        if (profileCustomization != null) {
            profileCustomization.setSetting(this);
        }
        this.profileCustomization = profileCustomization;
    }

    public Setting profileCustomization(ProfileCustomization profileCustomization) {
        this.setProfileCustomization(profileCustomization);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Setting)) {
            return false;
        }
        return id != null && id.equals(((Setting) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Setting{" +
            "id=" + getId() +
            ", notificationsEnabled='" + getNotificationsEnabled() + "'" +
            ", accountDeletionRequested='" + getAccountDeletionRequested() + "'" +
            ", changePassword='" + getChangePassword() + "'" +
            "}";
    }
}
