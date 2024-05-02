package team.bham.repository;

import java.util.*;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.UserPoints;

/**
 * Spring Data JPA repository for the UserPoints entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserPointsRepository extends JpaRepository<UserPoints, Long> {
    Optional<UserPoints> findByUserID(Long UserID);

    @Query("SELECT m.userID FROM Members m JOIN Grouping g ON m.groupID = g.id WHERE g.groupingName = :groupName")
    List<Long> findUserIdsByGroupName(@Param("groupName") String groupName);
}
