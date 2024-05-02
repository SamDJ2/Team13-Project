package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.EmotionPage;

/**
 * Spring Data JPA repository for the EmotionPage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmotionPageRepository extends JpaRepository<EmotionPage, Long> {}
