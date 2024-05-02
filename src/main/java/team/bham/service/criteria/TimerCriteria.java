package team.bham.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import org.springdoc.api.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link team.bham.domain.Timer} entity. This class is used
 * in {@link team.bham.web.rest.TimerResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /timers?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TimerCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private LocalDateFilter startTime;

    private BooleanFilter isActive;

    private LongFilter timingsId;

    private Boolean distinct;

    public TimerCriteria() {}

    public TimerCriteria(TimerCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.startTime = other.startTime == null ? null : other.startTime.copy();
        this.isActive = other.isActive == null ? null : other.isActive.copy();
        this.timingsId = other.timingsId == null ? null : other.timingsId.copy();
        this.distinct = other.distinct;
    }

    @Override
    public TimerCriteria copy() {
        return new TimerCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public LongFilter id() {
        if (id == null) {
            id = new LongFilter();
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public LocalDateFilter getStartTime() {
        return startTime;
    }

    public LocalDateFilter startTime() {
        if (startTime == null) {
            startTime = new LocalDateFilter();
        }
        return startTime;
    }

    public void setStartTime(LocalDateFilter startTime) {
        this.startTime = startTime;
    }

    public BooleanFilter getIsActive() {
        return isActive;
    }

    public BooleanFilter isActive() {
        if (isActive == null) {
            isActive = new BooleanFilter();
        }
        return isActive;
    }

    public void setIsActive(BooleanFilter isActive) {
        this.isActive = isActive;
    }

    public LongFilter getTimingsId() {
        return timingsId;
    }

    public LongFilter timingsId() {
        if (timingsId == null) {
            timingsId = new LongFilter();
        }
        return timingsId;
    }

    public void setTimingsId(LongFilter timingsId) {
        this.timingsId = timingsId;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final TimerCriteria that = (TimerCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(startTime, that.startTime) &&
            Objects.equals(isActive, that.isActive) &&
            Objects.equals(timingsId, that.timingsId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, startTime, isActive, timingsId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TimerCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (startTime != null ? "startTime=" + startTime + ", " : "") +
            (isActive != null ? "isActive=" + isActive + ", " : "") +
            (timingsId != null ? "timingsId=" + timingsId + ", " : "") +
            (distinct != null ? "distinct=" + distinct + ", " : "") +
            "}";
    }
}
