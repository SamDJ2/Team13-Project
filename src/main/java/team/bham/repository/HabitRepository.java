package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Habit;

/**
 * Spring Data JPA repository for the Habit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {}
