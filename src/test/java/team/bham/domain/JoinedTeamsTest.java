package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class JoinedTeamsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(JoinedTeams.class);
        JoinedTeams joinedTeams1 = new JoinedTeams();
        joinedTeams1.setId(1L);
        JoinedTeams joinedTeams2 = new JoinedTeams();
        joinedTeams2.setId(joinedTeams1.getId());
        assertThat(joinedTeams1).isEqualTo(joinedTeams2);
        joinedTeams2.setId(2L);
        assertThat(joinedTeams1).isNotEqualTo(joinedTeams2);
        joinedTeams1.setId(null);
        assertThat(joinedTeams1).isNotEqualTo(joinedTeams2);
    }
}
