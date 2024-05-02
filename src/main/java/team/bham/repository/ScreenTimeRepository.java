package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ScreenTime;

/**
 * Spring Data JPA repository for the ScreenTime entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ScreenTimeRepository extends JpaRepository<ScreenTime, Long> {}
