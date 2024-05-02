package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class MembersTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Members.class);
        Members members1 = new Members();
        members1.setId(1L);
        Members members2 = new Members();
        members2.setId(members1.getId());
        assertThat(members1).isEqualTo(members2);
        members2.setId(2L);
        assertThat(members1).isNotEqualTo(members2);
        members1.setId(null);
        assertThat(members1).isNotEqualTo(members2);
    }
}
