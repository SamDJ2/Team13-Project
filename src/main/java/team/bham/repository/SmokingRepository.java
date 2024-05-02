package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Smoking;

/**
 * Spring Data JPA repository for the Smoking entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SmokingRepository extends JpaRepository<Smoking, Long> {}
