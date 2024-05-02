package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class AlcoholTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Alcohol.class);
        Alcohol alcohol1 = new Alcohol();
        alcohol1.setId(1L);
        Alcohol alcohol2 = new Alcohol();
        alcohol2.setId(alcohol1.getId());
        assertThat(alcohol1).isEqualTo(alcohol2);
        alcohol2.setId(2L);
        assertThat(alcohol1).isNotEqualTo(alcohol2);
        alcohol1.setId(null);
        assertThat(alcohol1).isNotEqualTo(alcohol2);
    }
}
