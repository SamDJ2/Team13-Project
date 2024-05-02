package team.bham.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import team.bham.domain.Challenges;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ChallengesRepositoryWithBagRelationshipsImpl implements ChallengesRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Challenges> fetchBagRelationships(Optional<Challenges> challenges) {
        return challenges.map(this::fetchSearches).map(this::fetchFiltereds);
    }

    @Override
    public Page<Challenges> fetchBagRelationships(Page<Challenges> challenges) {
        return new PageImpl<>(fetchBagRelationships(challenges.getContent()), challenges.getPageable(), challenges.getTotalElements());
    }

    @Override
    public List<Challenges> fetchBagRelationships(List<Challenges> challenges) {
        return Optional.of(challenges).map(this::fetchSearches).map(this::fetchFiltereds).orElse(Collections.emptyList());
    }

    Challenges fetchSearches(Challenges result) {
        return entityManager
            .createQuery(
                "select challenges from Challenges challenges left join fetch challenges.searches where challenges is :challenges",
                Challenges.class
            )
            .setParameter("challenges", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Challenges> fetchSearches(List<Challenges> challenges) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, challenges.size()).forEach(index -> order.put(challenges.get(index).getId(), index));
        List<Challenges> result = entityManager
            .createQuery(
                "select distinct challenges from Challenges challenges left join fetch challenges.searches where challenges in :challenges",
                Challenges.class
            )
            .setParameter("challenges", challenges)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    Challenges fetchFiltereds(Challenges result) {
        return entityManager
            .createQuery(
                "select challenges from Challenges challenges left join fetch challenges.filtereds where challenges is :challenges",
                Challenges.class
            )
            .setParameter("challenges", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Challenges> fetchFiltereds(List<Challenges> challenges) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, challenges.size()).forEach(index -> order.put(challenges.get(index).getId(), index));
        List<Challenges> result = entityManager
            .createQuery(
                "select distinct challenges from Challenges challenges left join fetch challenges.filtereds where challenges in :challenges",
                Challenges.class
            )
            .setParameter("challenges", challenges)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
