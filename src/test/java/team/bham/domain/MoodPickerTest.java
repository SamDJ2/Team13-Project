package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class MoodPickerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MoodPicker.class);
        MoodPicker moodPicker1 = new MoodPicker();
        moodPicker1.setId(1L);
        MoodPicker moodPicker2 = new MoodPicker();
        moodPicker2.setId(moodPicker1.getId());
        assertThat(moodPicker1).isEqualTo(moodPicker2);
        moodPicker2.setId(2L);
        assertThat(moodPicker1).isNotEqualTo(moodPicker2);
        moodPicker1.setId(null);
        assertThat(moodPicker1).isNotEqualTo(moodPicker2);
    }
}
