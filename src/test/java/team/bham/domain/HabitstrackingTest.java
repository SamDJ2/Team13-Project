package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class HabitstrackingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Habitstracking.class);
        Habitstracking habitstracking1 = new Habitstracking();
        habitstracking1.setId(1L);
        Habitstracking habitstracking2 = new Habitstracking();
        habitstracking2.setId(habitstracking1.getId());
        assertThat(habitstracking1).isEqualTo(habitstracking2);
        habitstracking2.setId(2L);
        assertThat(habitstracking1).isNotEqualTo(habitstracking2);
        habitstracking1.setId(null);
        assertThat(habitstracking1).isNotEqualTo(habitstracking2);
    }
}
