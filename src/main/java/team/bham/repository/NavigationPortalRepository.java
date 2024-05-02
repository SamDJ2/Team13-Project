package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.NavigationPortal;

/**
 * Spring Data JPA repository for the NavigationPortal entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NavigationPortalRepository extends JpaRepository<NavigationPortal, Long> {}
