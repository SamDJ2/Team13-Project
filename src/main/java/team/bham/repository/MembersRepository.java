package team.bham.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.Members;
import team.bham.service.dto.PointsDTO;

/**
 * Spring Data JPA repository for the Members entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MembersRepository extends JpaRepository<Members, Long> {
    @Query(
        "SELECT new team.bham.service.dto.PointsDTO(m.groupID, g.groupingName, g.groupingPoints, g.remainingTime, g.currentDate, u.login, u.imageUrl, up.currentPoints, up.previousPoints, up.totalPoints) " +
        "FROM Members m " +
        "JOIN User u ON m.userID = u.id " +
        "JOIN UserPoints up ON u.id = up.userID " +
        "JOIN Grouping g ON m.groupID = g.id " +
        "WHERE m.groupID = :groupId"
    )
    List<PointsDTO> findPointsByGroupID(@Param("groupId") Long groupId);

    List<Members> findByUserID(Long userID);

    boolean existsByUserIDAndGroupID(Long userID, Long groupID);

    Members findMemberByGroupIDAndUserID(Long groupID, Long userID);

    void deleteAllByGroupID(Long GroupID);
}
