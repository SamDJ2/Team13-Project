package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class NewWeeklyHabitTrackerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(NewWeeklyHabitTracker.class);
        NewWeeklyHabitTracker newWeeklyHabitTracker1 = new NewWeeklyHabitTracker();
        newWeeklyHabitTracker1.setId(1L);
        NewWeeklyHabitTracker newWeeklyHabitTracker2 = new NewWeeklyHabitTracker();
        newWeeklyHabitTracker2.setId(newWeeklyHabitTracker1.getId());
        assertThat(newWeeklyHabitTracker1).isEqualTo(newWeeklyHabitTracker2);
        newWeeklyHabitTracker2.setId(2L);
        assertThat(newWeeklyHabitTracker1).isNotEqualTo(newWeeklyHabitTracker2);
        newWeeklyHabitTracker1.setId(null);
        assertThat(newWeeklyHabitTracker1).isNotEqualTo(newWeeklyHabitTracker2);
    }
}
