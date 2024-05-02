package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.JoinedTeams;

/**
 * Spring Data JPA repository for the JoinedTeams entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JoinedTeamsRepository extends JpaRepository<JoinedTeams, Long> {}
