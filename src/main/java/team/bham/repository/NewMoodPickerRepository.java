package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.NewMoodPicker;

/**
 * Spring Data JPA repository for the NewMoodPicker entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NewMoodPickerRepository extends JpaRepository<NewMoodPicker, Long> {}
