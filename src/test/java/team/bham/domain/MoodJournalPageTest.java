package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class MoodJournalPageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MoodJournalPage.class);
        MoodJournalPage moodJournalPage1 = new MoodJournalPage();
        moodJournalPage1.setId(1L);
        MoodJournalPage moodJournalPage2 = new MoodJournalPage();
        moodJournalPage2.setId(moodJournalPage1.getId());
        assertThat(moodJournalPage1).isEqualTo(moodJournalPage2);
        moodJournalPage2.setId(2L);
        assertThat(moodJournalPage1).isNotEqualTo(moodJournalPage2);
        moodJournalPage1.setId(null);
        assertThat(moodJournalPage1).isNotEqualTo(moodJournalPage2);
    }
}
