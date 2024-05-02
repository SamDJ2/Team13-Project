package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class PromptsPageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PromptsPage.class);
        PromptsPage promptsPage1 = new PromptsPage();
        promptsPage1.setId(1L);
        PromptsPage promptsPage2 = new PromptsPage();
        promptsPage2.setId(promptsPage1.getId());
        assertThat(promptsPage1).isEqualTo(promptsPage2);
        promptsPage2.setId(2L);
        assertThat(promptsPage1).isNotEqualTo(promptsPage2);
        promptsPage1.setId(null);
        assertThat(promptsPage1).isNotEqualTo(promptsPage2);
    }
}
