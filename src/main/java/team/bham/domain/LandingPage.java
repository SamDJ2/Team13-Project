package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LandingPage.
 */
@Entity
@Table(name = "landing_page")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LandingPage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "get_started")
    private String getStarted;

    @Column(name = "about")
    private String about;

    @Column(name = "team")
    private String team;

    @Column(name = "contact")
    private String contact;

    @JsonIgnoreProperties(value = { "navigationPortal", "promptsPage", "emotionPage", "landingPage" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private MoodPicker moodPicker;

    @JsonIgnoreProperties(value = { "landingPage", "progress" }, allowSetters = true)
    @OneToOne(mappedBy = "landingPage")
    private UserDB userDB;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LandingPage id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGetStarted() {
        return this.getStarted;
    }

    public LandingPage getStarted(String getStarted) {
        this.setGetStarted(getStarted);
        return this;
    }

    public void setGetStarted(String getStarted) {
        this.getStarted = getStarted;
    }

    public String getAbout() {
        return this.about;
    }

    public LandingPage about(String about) {
        this.setAbout(about);
        return this;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public String getTeam() {
        return this.team;
    }

    public LandingPage team(String team) {
        this.setTeam(team);
        return this;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public String getContact() {
        return this.contact;
    }

    public LandingPage contact(String contact) {
        this.setContact(contact);
        return this;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public MoodPicker getMoodPicker() {
        return this.moodPicker;
    }

    public void setMoodPicker(MoodPicker moodPicker) {
        this.moodPicker = moodPicker;
    }

    public LandingPage moodPicker(MoodPicker moodPicker) {
        this.setMoodPicker(moodPicker);
        return this;
    }

    public UserDB getUserDB() {
        return this.userDB;
    }

    public void setUserDB(UserDB userDB) {
        if (this.userDB != null) {
            this.userDB.setLandingPage(null);
        }
        if (userDB != null) {
            userDB.setLandingPage(this);
        }
        this.userDB = userDB;
    }

    public LandingPage userDB(UserDB userDB) {
        this.setUserDB(userDB);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LandingPage)) {
            return false;
        }
        return id != null && id.equals(((LandingPage) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LandingPage{" +
            "id=" + getId() +
            ", getStarted='" + getGetStarted() + "'" +
            ", about='" + getAbout() + "'" +
            ", team='" + getTeam() + "'" +
            ", contact='" + getContact() + "'" +
            "}";
    }
}
