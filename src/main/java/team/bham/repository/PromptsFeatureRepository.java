package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.PromptsFeature;

/**
 * Spring Data JPA repository for the PromptsFeature entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PromptsFeatureRepository extends JpaRepository<PromptsFeature, Long> {}
