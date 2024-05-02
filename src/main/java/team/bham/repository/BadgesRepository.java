package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Badges;

/**
 * Spring Data JPA repository for the Badges entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BadgesRepository extends JpaRepository<Badges, Long> {}
