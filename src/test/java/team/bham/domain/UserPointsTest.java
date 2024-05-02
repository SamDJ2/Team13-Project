package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class UserPointsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserPoints.class);
        UserPoints userPoints1 = new UserPoints();
        userPoints1.setId(1L);
        UserPoints userPoints2 = new UserPoints();
        userPoints2.setId(userPoints1.getId());
        assertThat(userPoints1).isEqualTo(userPoints2);
        userPoints2.setId(2L);
        assertThat(userPoints1).isNotEqualTo(userPoints2);
        userPoints1.setId(null);
        assertThat(userPoints1).isNotEqualTo(userPoints2);
    }
}
