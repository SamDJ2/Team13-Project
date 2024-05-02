package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Filtered.
 */
@Entity
@Table(name = "filtered")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Filtered implements Serializable {

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

    @Column(name = "filtering")
    private Boolean filtering;

    @ManyToMany(mappedBy = "filtereds")
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

    public Filtered id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSearch() {
        return this.search;
    }

    public Filtered search(String search) {
        this.setSearch(search);
        return this;
    }

    public void setSearch(String search) {
        this.search = search;
    }

    public String getResults() {
        return this.results;
    }

    public Filtered results(String results) {
        this.setResults(results);
        return this;
    }

    public void setResults(String results) {
        this.results = results;
    }

    public Boolean getFiltering() {
        return this.filtering;
    }

    public Filtered filtering(Boolean filtering) {
        this.setFiltering(filtering);
        return this;
    }

    public void setFiltering(Boolean filtering) {
        this.filtering = filtering;
    }

    public Set<Challenges> getChallenges() {
        return this.challenges;
    }

    public void setChallenges(Set<Challenges> challenges) {
        if (this.challenges != null) {
            this.challenges.forEach(i -> i.removeFiltered(this));
        }
        if (challenges != null) {
            challenges.forEach(i -> i.addFiltered(this));
        }
        this.challenges = challenges;
    }

    public Filtered challenges(Set<Challenges> challenges) {
        this.setChallenges(challenges);
        return this;
    }

    public Filtered addChallenges(Challenges challenges) {
        this.challenges.add(challenges);
        challenges.getFiltereds().add(this);
        return this;
    }

    public Filtered removeChallenges(Challenges challenges) {
        this.challenges.remove(challenges);
        challenges.getFiltereds().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Filtered)) {
            return false;
        }
        return id != null && id.equals(((Filtered) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Filtered{" +
            "id=" + getId() +
            ", search='" + getSearch() + "'" +
            ", results='" + getResults() + "'" +
            ", filtering='" + getFiltering() + "'" +
            "}";
    }
}
