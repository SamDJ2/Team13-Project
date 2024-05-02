package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class EmotionPageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EmotionPage.class);
        EmotionPage emotionPage1 = new EmotionPage();
        emotionPage1.setId(1L);
        EmotionPage emotionPage2 = new EmotionPage();
        emotionPage2.setId(emotionPage1.getId());
        assertThat(emotionPage1).isEqualTo(emotionPage2);
        emotionPage2.setId(2L);
        assertThat(emotionPage1).isNotEqualTo(emotionPage2);
        emotionPage1.setId(null);
        assertThat(emotionPage1).isNotEqualTo(emotionPage2);
    }
}
