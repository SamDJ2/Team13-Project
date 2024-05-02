package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class VideoGamesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VideoGames.class);
        VideoGames videoGames1 = new VideoGames();
        videoGames1.setId(1L);
        VideoGames videoGames2 = new VideoGames();
        videoGames2.setId(videoGames1.getId());
        assertThat(videoGames1).isEqualTo(videoGames2);
        videoGames2.setId(2L);
        assertThat(videoGames1).isNotEqualTo(videoGames2);
        videoGames1.setId(null);
        assertThat(videoGames1).isNotEqualTo(videoGames2);
    }
}
