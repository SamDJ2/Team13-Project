package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class MusicTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Music.class);
        Music music1 = new Music();
        music1.setId(1L);
        Music music2 = new Music();
        music2.setId(music1.getId());
        assertThat(music1).isEqualTo(music2);
        music2.setId(2L);
        assertThat(music1).isNotEqualTo(music2);
        music1.setId(null);
        assertThat(music1).isNotEqualTo(music2);
    }
}
