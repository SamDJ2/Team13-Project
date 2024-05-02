package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Search.
 */
@Entity
@Table(name = "search")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Search implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "search")
    private String search;

    @Column(name = "results")
    private String results;

    @ManyToMany(mappedBy = "searches")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "progress", "junkFood", "screenTime", "alcohol", "smoking", "searches", "filtereds", "navigationPortal" },
        allowSetters = true
    )
    private Set<Challenges> challenges = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Search id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSearch() {
        return this.search;
    }

    public Search search(String search) {
        this.setSearch(search);
        return this;
    }

    public void setSearch(String search) {
        this.search = search;
    }

    public String getResults() {
        return this.results;
    }

    public Search results(String results) {
        this.setResults(results);
        return this;
    }

    public void setResults(String results) {
        this.results = results;
    }

    public Set<Challenges> getChallenges() {
        return this.challenges;
    }

    public void setChallenges(Set<Challenges> challenges) {
        if (this.challenges != null) {
            this.challenges.forEach(i -> i.removeSearch(this));
        }
        if (challenges != null) {
            challenges.forEach(i -> i.addSearch(this));
        }
        this.challenges = challenges;
    }

    public Search challenges(Set<Challenges> challenges) {
        this.setChallenges(challenges);
        return this;
    }

    public Search addChallenges(Challenges challenges) {
        this.challenges.add(challenges);
        challenges.getSearches().add(this);
        return this;
    }

    public Search removeChallenges(Challenges challenges) {
        this.challenges.remove(challenges);
        challenges.getSearches().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Search)) {
            return false;
        }
        return id != null && id.equals(((Search) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Search{" +
            "id=" + getId() +
            ", search='" + getSearch() + "'" +
            ", results='" + getResults() + "'" +
            "}";
    }
}
