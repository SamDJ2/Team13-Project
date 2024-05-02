package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class LandingPageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LandingPage.class);
        LandingPage landingPage1 = new LandingPage();
        landingPage1.setId(1L);
        LandingPage landingPage2 = new LandingPage();
        landingPage2.setId(landingPage1.getId());
        assertThat(landingPage1).isEqualTo(landingPage2);
        landingPage2.setId(2L);
        assertThat(landingPage1).isNotEqualTo(landingPage2);
        landingPage1.setId(null);
        assertThat(landingPage1).isNotEqualTo(landingPage2);
    }
}
