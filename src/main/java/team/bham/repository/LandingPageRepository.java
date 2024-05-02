package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.LandingPage;

/**
 * Spring Data JPA repository for the LandingPage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LandingPageRepository extends JpaRepository<LandingPage, Long> {}
