package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.LeaderBoards;

/**
 * Spring Data JPA repository for the LeaderBoards entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeaderBoardsRepository extends JpaRepository<LeaderBoards, Long> {}
