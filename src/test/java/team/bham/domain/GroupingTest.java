package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class GroupingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Grouping.class);
        Grouping grouping1 = new Grouping();
        grouping1.setId(1L);
        Grouping grouping2 = new Grouping();
        grouping2.setId(grouping1.getId());
        assertThat(grouping1).isEqualTo(grouping2);
        grouping2.setId(2L);
        assertThat(grouping1).isNotEqualTo(grouping2);
        grouping1.setId(null);
        assertThat(grouping1).isNotEqualTo(grouping2);
    }
}
