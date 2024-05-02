package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.Grouping;
import team.bham.service.dto.GroupDTO;

/**
 * Spring Data JPA repository for the Grouping entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GroupingRepository extends JpaRepository<Grouping, Long> {
    boolean existsByGroupingName(String groupingName);

    Optional<Grouping> findOneByGroupingName(String groupingName);
}
