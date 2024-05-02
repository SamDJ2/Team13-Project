package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Movies;

/**
 * Spring Data JPA repository for the Movies entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MoviesRepository extends JpaRepository<Movies, Long> {}
