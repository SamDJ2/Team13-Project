package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.MoodJournalPage;

/**
 * Spring Data JPA repository for the MoodJournalPage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MoodJournalPageRepository extends JpaRepository<MoodJournalPage, Long> {}
