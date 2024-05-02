package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.NewWeeklyHabitTracker;

/**
 * Spring Data JPA repository for the NewWeeklyHabitTracker entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NewWeeklyHabitTrackerRepository extends JpaRepository<NewWeeklyHabitTracker, Long> {}
