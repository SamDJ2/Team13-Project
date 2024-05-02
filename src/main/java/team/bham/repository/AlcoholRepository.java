package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Alcohol;

/**
 * Spring Data JPA repository for the Alcohol entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AlcoholRepository extends JpaRepository<Alcohol, Long> {}
