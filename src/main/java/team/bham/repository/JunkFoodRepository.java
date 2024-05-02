package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.JunkFood;

/**
 * Spring Data JPA repository for the JunkFood entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JunkFoodRepository extends JpaRepository<JunkFood, Long> {}
