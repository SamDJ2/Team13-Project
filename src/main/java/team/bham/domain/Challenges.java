package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Challenges.
 */
@Entity
@Table(name = "challenges")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Challenges implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "select_challenge")
    private Boolean selectChallenge;

    @Column(name = "all_challenges")
    private String allChallenges;

    @JsonIgnoreProperties(value = { "challenges", "leaderBoards", "userDB" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Progress progress;

    @ManyToOne
    @JsonIgnoreProperties(value = { "challenges" }, allowSetters = true)
    private JunkFood junkFood;

    @ManyToOne
    @JsonIgnoreProperties(value = { "videoGames", "movies", "socialMedia", "music", "challenges" }, allowSetters = true)
    private ScreenTime screenTime;

    @ManyToOne
    @JsonIgnoreProperties(value = { "challenges" }, allowSetters = true)
    private Alcohol alcohol;

    @ManyToOne
    @JsonIgnoreProperties(value = { "challenges" }, allowSetters = true)
    private Smoking smoking;

    @ManyToMany
    @JoinTable(
        name = "rel_challenges__search",
        joinColumns = @JoinColumn(name = "challenges_id"),
        inverseJoinColumns = @JoinColumn(name = "search_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "challenges" }, allowSetters = true)
    private Set<Search> searches = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_challenges__filtered",
        joinColumns = @JoinColumn(name = "challenges_id"),
        inverseJoinColumns = @JoinColumn(name = "filtered_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "challenges" }, allowSetters = true)
    private Set<Filtered> filtereds = new HashSet<>();

    @JsonIgnoreProperties(
        value = { "challenges", "habit", "leaderBoards", "profileCustomization", "moodJournalPage", "moodPicker" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "challenges")
    private NavigationPortal navigationPortal;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Challenges id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getSelectChallenge() {
        return this.selectChallenge;
    }

    public Challenges selectChallenge(Boolean selectChallenge) {
        this.setSelectChallenge(selectChallenge);
        return this;
    }

    public void setSelectChallenge(Boolean selectChallenge) {
        this.selectChallenge = selectChallenge;
    }

    public String getAllChallenges() {
        return this.allChallenges;
    }

    public Challenges allChallenges(String allChallenges) {
        this.setAllChallenges(allChallenges);
        return this;
    }

    public void setAllChallenges(String allChallenges) {
        this.allChallenges = allChallenges;
    }

    public Progress getProgress() {
        return this.progress;
    }

    public void setProgress(Progress progress) {
        this.progress = progress;
    }

    public Challenges progress(Progress progress) {
        this.setProgress(progress);
        return this;
    }

    public JunkFood getJunkFood() {
        return this.junkFood;
    }

    public void setJunkFood(JunkFood junkFood) {
        this.junkFood = junkFood;
    }

    public Challenges junkFood(JunkFood junkFood) {
        this.setJunkFood(junkFood);
        return this;
    }

    public ScreenTime getScreenTime() {
        return this.screenTime;
    }

    public void setScreenTime(ScreenTime screenTime) {
        this.screenTime = screenTime;
    }

    public Challenges screenTime(ScreenTime screenTime) {
        this.setScreenTime(screenTime);
        return this;
    }

    public Alcohol getAlcohol() {
        return this.alcohol;
    }

    public void setAlcohol(Alcohol alcohol) {
        this.alcohol = alcohol;
    }

    public Challenges alcohol(Alcohol alcohol) {
        this.setAlcohol(alcohol);
        return this;
    }

    public Smoking getSmoking() {
        return this.smoking;
    }

    public void setSmoking(Smoking smoking) {
        this.smoking = smoking;
    }

    public Challenges smoking(Smoking smoking) {
        this.setSmoking(smoking);
        return this;
    }

    public Set<Search> getSearches() {
        return this.searches;
    }

    public void setSearches(Set<Search> searches) {
        this.searches = searches;
    }

    public Challenges searches(Set<Search> searches) {
        this.setSearches(searches);
        return this;
    }

    public Challenges addSearch(Search search) {
        this.searches.add(search);
        search.getChallenges().add(this);
        return this;
    }

    public Challenges removeSearch(Search search) {
        this.searches.remove(search);
        search.getChallenges().remove(this);
        return this;
    }

    public Set<Filtered> getFiltereds() {
        return this.filtereds;
    }

    public void setFiltereds(Set<Filtered> filtereds) {
        this.filtereds = filtereds;
    }

    public Challenges filtereds(Set<Filtered> filtereds) {
        this.setFiltereds(filtereds);
        return this;
    }

    public Challenges addFiltered(Filtered filtered) {
        this.filtereds.add(filtered);
        filtered.getChallenges().add(this);
        return this;
    }

    public Challenges removeFiltered(Filtered filtered) {
        this.filtereds.remove(filtered);
        filtered.getChallenges().remove(this);
        return this;
    }

    public NavigationPortal getNavigationPortal() {
        return this.navigationPortal;
    }

    public void setNavigationPortal(NavigationPortal navigationPortal) {
        if (this.navigationPortal != null) {
            this.navigationPortal.setChallenges(null);
        }
        if (navigationPortal != null) {
            navigationPortal.setChallenges(this);
        }
        this.navigationPortal = navigationPortal;
    }

    public Challenges navigationPortal(NavigationPortal navigationPortal) {
        this.setNavigationPortal(navigationPortal);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Challenges)) {
            return false;
        }
        return id != null && id.equals(((Challenges) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Challenges{" +
            "id=" + getId() +
            ", selectChallenge='" + getSelectChallenge() + "'" +
            ", allChallenges='" + getAllChallenges() + "'" +
            "}";
    }
}
