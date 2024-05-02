package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class PromptsFeatureTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PromptsFeature.class);
        PromptsFeature promptsFeature1 = new PromptsFeature();
        promptsFeature1.setId(1L);
        PromptsFeature promptsFeature2 = new PromptsFeature();
        promptsFeature2.setId(promptsFeature1.getId());
        assertThat(promptsFeature1).isEqualTo(promptsFeature2);
        promptsFeature2.setId(2L);
        assertThat(promptsFeature1).isNotEqualTo(promptsFeature2);
        promptsFeature1.setId(null);
        assertThat(promptsFeature1).isNotEqualTo(promptsFeature2);
    }
}
