package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.PromptsPage;

/**
 * Spring Data JPA repository for the PromptsPage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PromptsPageRepository extends JpaRepository<PromptsPage, Long> {}
