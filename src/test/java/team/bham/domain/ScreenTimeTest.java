package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ScreenTimeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ScreenTime.class);
        ScreenTime screenTime1 = new ScreenTime();
        screenTime1.setId(1L);
        ScreenTime screenTime2 = new ScreenTime();
        screenTime2.setId(screenTime1.getId());
        assertThat(screenTime1).isEqualTo(screenTime2);
        screenTime2.setId(2L);
        assertThat(screenTime1).isNotEqualTo(screenTime2);
        screenTime1.setId(null);
        assertThat(screenTime1).isNotEqualTo(screenTime2);
    }
}
