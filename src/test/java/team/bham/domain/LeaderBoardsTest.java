package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class LeaderBoardsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LeaderBoards.class);
        LeaderBoards leaderBoards1 = new LeaderBoards();
        leaderBoards1.setId(1L);
        LeaderBoards leaderBoards2 = new LeaderBoards();
        leaderBoards2.setId(leaderBoards1.getId());
        assertThat(leaderBoards1).isEqualTo(leaderBoards2);
        leaderBoards2.setId(2L);
        assertThat(leaderBoards1).isNotEqualTo(leaderBoards2);
        leaderBoards1.setId(null);
        assertThat(leaderBoards1).isNotEqualTo(leaderBoards2);
    }
}
