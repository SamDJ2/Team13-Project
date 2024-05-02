package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.UserDB;

/**
 * Spring Data JPA repository for the UserDB entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserDBRepository extends JpaRepository<UserDB, Long> {}
