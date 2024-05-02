package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class JunkFoodTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(JunkFood.class);
        JunkFood junkFood1 = new JunkFood();
        junkFood1.setId(1L);
        JunkFood junkFood2 = new JunkFood();
        junkFood2.setId(junkFood1.getId());
        assertThat(junkFood1).isEqualTo(junkFood2);
        junkFood2.setId(2L);
        assertThat(junkFood1).isNotEqualTo(junkFood2);
        junkFood1.setId(null);
        assertThat(junkFood1).isNotEqualTo(junkFood2);
    }
}
