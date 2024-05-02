package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class BadgesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Badges.class);
        Badges badges1 = new Badges();
        badges1.setId(1L);
        Badges badges2 = new Badges();
        badges2.setId(badges1.getId());
        assertThat(badges1).isEqualTo(badges2);
        badges2.setId(2L);
        assertThat(badges1).isNotEqualTo(badges2);
        badges1.setId(null);
        assertThat(badges1).isNotEqualTo(badges2);
    }
}
