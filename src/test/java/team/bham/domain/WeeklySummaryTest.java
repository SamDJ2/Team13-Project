package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class WeeklySummaryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WeeklySummary.class);
        WeeklySummary weeklySummary1 = new WeeklySummary();
        weeklySummary1.setId(1L);
        WeeklySummary weeklySummary2 = new WeeklySummary();
        weeklySummary2.setId(weeklySummary1.getId());
        assertThat(weeklySummary1).isEqualTo(weeklySummary2);
        weeklySummary2.setId(2L);
        assertThat(weeklySummary1).isNotEqualTo(weeklySummary2);
        weeklySummary1.setId(null);
        assertThat(weeklySummary1).isNotEqualTo(weeklySummary2);
    }
}
