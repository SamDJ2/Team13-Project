package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class AchievementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Achievement.class);
        Achievement achievement1 = new Achievement();
        achievement1.setId(1L);
        Achievement achievement2 = new Achievement();
        achievement2.setId(achievement1.getId());
        assertThat(achievement1).isEqualTo(achievement2);
        achievement2.setId(2L);
        assertThat(achievement1).isNotEqualTo(achievement2);
        achievement1.setId(null);
        assertThat(achievement1).isNotEqualTo(achievement2);
    }
}
