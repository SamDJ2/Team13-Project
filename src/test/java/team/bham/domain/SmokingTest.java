package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class SmokingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Smoking.class);
        Smoking smoking1 = new Smoking();
        smoking1.setId(1L);
        Smoking smoking2 = new Smoking();
        smoking2.setId(smoking1.getId());
        assertThat(smoking1).isEqualTo(smoking2);
        smoking2.setId(2L);
        assertThat(smoking1).isNotEqualTo(smoking2);
        smoking1.setId(null);
        assertThat(smoking1).isNotEqualTo(smoking2);
    }
}
