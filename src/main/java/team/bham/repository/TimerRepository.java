package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Timer;

/**
 * Spring Data JPA repository for the Timer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TimerRepository extends JpaRepository<Timer, Long>, JpaSpecificationExecutor<Timer> {}
