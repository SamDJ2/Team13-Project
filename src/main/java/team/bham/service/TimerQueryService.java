package team.bham.service;

import java.util.List;
import javax.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.*; // for static metamodels
import team.bham.domain.Timer;
import team.bham.repository.TimerRepository;
import team.bham.service.criteria.TimerCriteria;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link Timer} entities in the database.
 * The main input is a {@link TimerCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link Timer} or a {@link Page} of {@link Timer} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class TimerQueryService extends QueryService<Timer> {

    private final Logger log = LoggerFactory.getLogger(TimerQueryService.class);

    private final TimerRepository timerRepository;

    public TimerQueryService(TimerRepository timerRepository) {
        this.timerRepository = timerRepository;
    }

    /**
     * Return a {@link List} of {@link Timer} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<Timer> findByCriteria(TimerCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<Timer> specification = createSpecification(criteria);
        return timerRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link Timer} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<Timer> findByCriteria(TimerCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Timer> specification = createSpecification(criteria);
        return timerRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(TimerCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Timer> specification = createSpecification(criteria);
        return timerRepository.count(specification);
    }

    /**
     * Function to convert {@link TimerCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Timer> createSpecification(TimerCriteria criteria) {
        Specification<Timer> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Timer_.id));
            }
            if (criteria.getStartTime() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getStartTime(), Timer_.startTime));
            }
            if (criteria.getIsActive() != null) {
                specification = specification.and(buildSpecification(criteria.getIsActive(), Timer_.isActive));
            }
            if (criteria.getTimingsId() != null) {
                specification =
                    specification.and(
                        buildSpecification(criteria.getTimingsId(), root -> root.join(Timer_.timings, JoinType.LEFT).get(UserDB_.id))
                    );
            }
        }
        return specification;
    }
}
