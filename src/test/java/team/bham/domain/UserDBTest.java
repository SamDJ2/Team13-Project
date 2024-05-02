package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class UserDBTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserDB.class);
        UserDB userDB1 = new UserDB();
        userDB1.setId(1L);
        UserDB userDB2 = new UserDB();
        userDB2.setId(userDB1.getId());
        assertThat(userDB1).isEqualTo(userDB2);
        userDB2.setId(2L);
        assertThat(userDB1).isNotEqualTo(userDB2);
        userDB1.setId(null);
        assertThat(userDB1).isNotEqualTo(userDB2);
    }
}
