package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class EntriesFeatureTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EntriesFeature.class);
        EntriesFeature entriesFeature1 = new EntriesFeature();
        entriesFeature1.setId(1L);
        EntriesFeature entriesFeature2 = new EntriesFeature();
        entriesFeature2.setId(entriesFeature1.getId());
        assertThat(entriesFeature1).isEqualTo(entriesFeature2);
        entriesFeature2.setId(2L);
        assertThat(entriesFeature1).isNotEqualTo(entriesFeature2);
        entriesFeature1.setId(null);
        assertThat(entriesFeature1).isNotEqualTo(entriesFeature2);
    }
}
