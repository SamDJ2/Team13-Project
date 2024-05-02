package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ProfileCustomization;

/**
 * Spring Data JPA repository for the ProfileCustomization entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProfileCustomizationRepository extends JpaRepository<ProfileCustomization, Long> {}
