package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Music;

/**
 * Spring Data JPA repository for the Music entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MusicRepository extends JpaRepository<Music, Long> {}
