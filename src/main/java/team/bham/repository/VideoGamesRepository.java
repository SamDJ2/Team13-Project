package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.VideoGames;

/**
 * Spring Data JPA repository for the VideoGames entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VideoGamesRepository extends JpaRepository<VideoGames, Long> {}
