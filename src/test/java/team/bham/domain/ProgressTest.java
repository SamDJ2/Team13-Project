package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ProgressTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Progress.class);
        Progress progress1 = new Progress();
        progress1.setId(1L);
        Progress progress2 = new Progress();
        progress2.setId(progress1.getId());
        assertThat(progress1).isEqualTo(progress2);
        progress2.setId(2L);
        assertThat(progress1).isNotEqualTo(progress2);
        progress1.setId(null);
        assertThat(progress1).isNotEqualTo(progress2);
    }
}
