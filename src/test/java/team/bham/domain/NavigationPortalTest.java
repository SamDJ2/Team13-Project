package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class NavigationPortalTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(NavigationPortal.class);
        NavigationPortal navigationPortal1 = new NavigationPortal();
        navigationPortal1.setId(1L);
        NavigationPortal navigationPortal2 = new NavigationPortal();
        navigationPortal2.setId(navigationPortal1.getId());
        assertThat(navigationPortal1).isEqualTo(navigationPortal2);
        navigationPortal2.setId(2L);
        assertThat(navigationPortal1).isNotEqualTo(navigationPortal2);
        navigationPortal1.setId(null);
        assertThat(navigationPortal1).isNotEqualTo(navigationPortal2);
    }
}
