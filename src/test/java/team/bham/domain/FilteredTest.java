package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class FilteredTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Filtered.class);
        Filtered filtered1 = new Filtered();
        filtered1.setId(1L);
        Filtered filtered2 = new Filtered();
        filtered2.setId(filtered1.getId());
        assertThat(filtered1).isEqualTo(filtered2);
        filtered2.setId(2L);
        assertThat(filtered1).isNotEqualTo(filtered2);
        filtered1.setId(null);
        assertThat(filtered1).isNotEqualTo(filtered2);
    }
}
