package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.EntriesFeature;

/**
 * Spring Data JPA repository for the EntriesFeature entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EntriesFeatureRepository extends JpaRepository<EntriesFeature, Long> {}
