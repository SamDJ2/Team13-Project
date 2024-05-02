package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Filtered;

/**
 * Spring Data JPA repository for the Filtered entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FilteredRepository extends JpaRepository<Filtered, Long> {}
