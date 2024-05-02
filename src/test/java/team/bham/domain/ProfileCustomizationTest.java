package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ProfileCustomizationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProfileCustomization.class);
        ProfileCustomization profileCustomization1 = new ProfileCustomization();
        profileCustomization1.setId(1L);
        ProfileCustomization profileCustomization2 = new ProfileCustomization();
        profileCustomization2.setId(profileCustomization1.getId());
        assertThat(profileCustomization1).isEqualTo(profileCustomization2);
        profileCustomization2.setId(2L);
        assertThat(profileCustomization1).isNotEqualTo(profileCustomization2);
        profileCustomization1.setId(null);
        assertThat(profileCustomization1).isNotEqualTo(profileCustomization2);
    }
}
