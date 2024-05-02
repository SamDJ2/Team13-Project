package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class NewMoodPickerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(NewMoodPicker.class);
        NewMoodPicker newMoodPicker1 = new NewMoodPicker();
        newMoodPicker1.setId(1L);
        NewMoodPicker newMoodPicker2 = new NewMoodPicker();
        newMoodPicker2.setId(newMoodPicker1.getId());
        assertThat(newMoodPicker1).isEqualTo(newMoodPicker2);
        newMoodPicker2.setId(2L);
        assertThat(newMoodPicker1).isNotEqualTo(newMoodPicker2);
        newMoodPicker1.setId(null);
        assertThat(newMoodPicker1).isNotEqualTo(newMoodPicker2);
    }
}
