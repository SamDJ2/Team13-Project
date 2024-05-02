package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Badges.
 */
@Entity
@Table(name = "badges")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Badges implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "badge_no")
    private Integer badgeNo;

    @Column(name = "required_points")
    private Integer requiredPoints;

    @Lob
    @Column(name = "badge")
    private byte[] badge;

    @Column(name = "badge_content_type")
    private String badgeContentType;

    @ManyToOne
    @JsonIgnoreProperties(value = { "members", "badges", "leaderBoards" }, allowSetters = true)
    private Grouping grouping;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Badges id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getBadgeNo() {
        return this.badgeNo;
    }

    public Badges badgeNo(Integer badgeNo) {
        this.setBadgeNo(badgeNo);
        return this;
    }

    public void setBadgeNo(Integer badgeNo) {
        this.badgeNo = badgeNo;
    }

    public Integer getRequiredPoints() {
        return this.requiredPoints;
    }

    public Badges requiredPoints(Integer requiredPoints) {
        this.setRequiredPoints(requiredPoints);
        return this;
    }

    public void setRequiredPoints(Integer requiredPoints) {
        this.requiredPoints = requiredPoints;
    }

    public byte[] getBadge() {
        return this.badge;
    }

    public Badges badge(byte[] badge) {
        this.setBadge(badge);
        return this;
    }

    public void setBadge(byte[] badge) {
        this.badge = badge;
    }

    public String getBadgeContentType() {
        return this.badgeContentType;
    }

    public Badges badgeContentType(String badgeContentType) {
        this.badgeContentType = badgeContentType;
        return this;
    }

    public void setBadgeContentType(String badgeContentType) {
        this.badgeContentType = badgeContentType;
    }

    public Grouping getGrouping() {
        return this.grouping;
    }

    public void setGrouping(Grouping grouping) {
        this.grouping = grouping;
    }

    public Badges grouping(Grouping grouping) {
        this.setGrouping(grouping);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Badges)) {
            return false;
        }
        return id != null && id.equals(((Badges) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Badges{" +
            "id=" + getId() +
            ", badgeNo=" + getBadgeNo() +
            ", requiredPoints=" + getRequiredPoints() +
            ", badge='" + getBadge() + "'" +
            ", badgeContentType='" + getBadgeContentType() + "'" +
            "}";
    }
}
