package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class EntriesPageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EntriesPage.class);
        EntriesPage entriesPage1 = new EntriesPage();
        entriesPage1.setId(1L);
        EntriesPage entriesPage2 = new EntriesPage();
        entriesPage2.setId(entriesPage1.getId());
        assertThat(entriesPage1).isEqualTo(entriesPage2);
        entriesPage2.setId(2L);
        assertThat(entriesPage1).isNotEqualTo(entriesPage2);
        entriesPage1.setId(null);
        assertThat(entriesPage1).isNotEqualTo(entriesPage2);
    }
}
