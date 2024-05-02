package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.WeeklySummary;

/**
 * Spring Data JPA repository for the WeeklySummary entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WeeklySummaryRepository extends JpaRepository<WeeklySummary, Long> {}
