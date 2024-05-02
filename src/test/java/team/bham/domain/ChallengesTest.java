package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ChallengesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Challenges.class);
        Challenges challenges1 = new Challenges();
        challenges1.setId(1L);
        Challenges challenges2 = new Challenges();
        challenges2.setId(challenges1.getId());
        assertThat(challenges1).isEqualTo(challenges2);
        challenges2.setId(2L);
        assertThat(challenges1).isNotEqualTo(challenges2);
        challenges1.setId(null);
        assertThat(challenges1).isNotEqualTo(challenges2);
    }
}
