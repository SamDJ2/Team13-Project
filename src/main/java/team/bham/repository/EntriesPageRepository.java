package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.EntriesPage;

/**
 * Spring Data JPA repository for the EntriesPage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EntriesPageRepository extends JpaRepository<EntriesPage, Long> {}
