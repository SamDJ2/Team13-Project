package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.MoodPicker;

/**
 * Spring Data JPA repository for the MoodPicker entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MoodPickerRepository extends JpaRepository<MoodPicker, Long> {}
