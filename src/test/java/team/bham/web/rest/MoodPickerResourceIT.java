package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.MoodPicker;
import team.bham.domain.enumeration.Moods;
import team.bham.repository.MoodPickerRepository;

/**
 * Integration tests for the {@link MoodPickerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MoodPickerResourceIT {

    private static final Long DEFAULT_MOOD_PICKER_ID = 1L;
    private static final Long UPDATED_MOOD_PICKER_ID = 2L;

    private static final Moods DEFAULT_MOOD = Moods.Mood1;
    private static final Moods UPDATED_MOOD = Moods.Mood2;

    private static final String ENTITY_API_URL = "/api/mood-pickers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MoodPickerRepository moodPickerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMoodPickerMockMvc;

    private MoodPicker moodPicker;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MoodPicker createEntity(EntityManager em) {
        MoodPicker moodPicker = new MoodPicker().moodPickerID(DEFAULT_MOOD_PICKER_ID).mood(DEFAULT_MOOD);
        return moodPicker;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MoodPicker createUpdatedEntity(EntityManager em) {
        MoodPicker moodPicker = new MoodPicker().moodPickerID(UPDATED_MOOD_PICKER_ID).mood(UPDATED_MOOD);
        return moodPicker;
    }

    @BeforeEach
    public void initTest() {
        moodPicker = createEntity(em);
    }

    @Test
    @Transactional
    void createMoodPicker() throws Exception {
        int databaseSizeBeforeCreate = moodPickerRepository.findAll().size();
        // Create the MoodPicker
        restMoodPickerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(moodPicker)))
            .andExpect(status().isCreated());

        // Validate the MoodPicker in the database
        List<MoodPicker> moodPickerList = moodPickerRepository.findAll();
        assertThat(moodPickerList).hasSize(databaseSizeBeforeCreate + 1);
        MoodPicker testMoodPicker = moodPickerList.get(moodPickerList.size() - 1);
        assertThat(testMoodPicker.getMoodPickerID()).isEqualTo(DEFAULT_MOOD_PICKER_ID);
        assertThat(testMoodPicker.getMood()).isEqualTo(DEFAULT_MOOD);
    }

    @Test
    @Transactional
    void createMoodPickerWithExistingId() throws Exception {
        // Create the MoodPicker with an existing ID
        moodPicker.setId(1L);

        int databaseSizeBeforeCreate = moodPickerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMoodPickerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(moodPicker)))
            .andExpect(status().isBadRequest());

        // Validate the MoodPicker in the database
        List<MoodPicker> moodPickerList = moodPickerRepository.findAll();
        assertThat(moodPickerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMoodPickers() throws Exception {
        // Initialize the database
        moodPickerRepository.saveAndFlush(moodPicker);

        // Get all the moodPickerList
        restMoodPickerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(moodPicker.getId().intValue())))
            .andExpect(jsonPath("$.[*].moodPickerID").value(hasItem(DEFAULT_MOOD_PICKER_ID.intValue())))
            .andExpect(jsonPath("$.[*].mood").value(hasItem(DEFAULT_MOOD.toString())));
    }

    @Test
    @Transactional
    void getMoodPicker() throws Exception {
        // Initialize the database
        moodPickerRepository.saveAndFlush(moodPicker);

        // Get the moodPicker
        restMoodPickerMockMvc
            .perform(get(ENTITY_API_URL_ID, moodPicker.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(moodPicker.getId().intValue()))
            .andExpect(jsonPath("$.moodPickerID").value(DEFAULT_MOOD_PICKER_ID.intValue()))
            .andExpect(jsonPath("$.mood").value(DEFAULT_MOOD.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMoodPicker() throws Exception {
        // Get the moodPicker
        restMoodPickerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMoodPicker() throws Exception {
        // Initialize the database
        moodPickerRepository.saveAndFlush(moodPicker);

        int databaseSizeBeforeUpdate = moodPickerRepository.findAll().size();

        // Update the moodPicker
        MoodPicker updatedMoodPicker = moodPickerRepository.findById(moodPicker.getId()).get();
        // Disconnect from session so that the updates on updatedMoodPicker are not directly saved in db
        em.detach(updatedMoodPicker);
        updatedMoodPicker.moodPickerID(UPDATED_MOOD_PICKER_ID).mood(UPDATED_MOOD);

        restMoodPickerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMoodPicker.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMoodPicker))
            )
            .andExpect(status().isOk());

        // Validate the MoodPicker in the database
        List<MoodPicker> moodPickerList = moodPickerRepository.findAll();
        assertThat(moodPickerList).hasSize(databaseSizeBeforeUpdate);
        MoodPicker testMoodPicker = moodPickerList.get(moodPickerList.size() - 1);
        assertThat(testMoodPicker.getMoodPickerID()).isEqualTo(UPDATED_MOOD_PICKER_ID);
        assertThat(testMoodPicker.getMood()).isEqualTo(UPDATED_MOOD);
    }

    @Test
    @Transactional
    void putNonExistingMoodPicker() throws Exception {
        int databaseSizeBeforeUpdate = moodPickerRepository.findAll().size();
        moodPicker.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMoodPickerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, moodPicker.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(moodPicker))
            )
            .andExpect(status().isBadRequest());

        // Validate the MoodPicker in the database
        List<MoodPicker> moodPickerList = moodPickerRepository.findAll();
        assertThat(moodPickerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMoodPicker() throws Exception {
        int databaseSizeBeforeUpdate = moodPickerRepository.findAll().size();
        moodPicker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoodPickerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(moodPicker))
            )
            .andExpect(status().isBadRequest());

        // Validate the MoodPicker in the database
        List<MoodPicker> moodPickerList = moodPickerRepository.findAll();
        assertThat(moodPickerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMoodPicker() throws Exception {
        int databaseSizeBeforeUpdate = moodPickerRepository.findAll().size();
        moodPicker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoodPickerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(moodPicker)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MoodPicker in the database
        List<MoodPicker> moodPickerList = moodPickerRepository.findAll();
        assertThat(moodPickerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMoodPickerWithPatch() throws Exception {
        // Initialize the database
        moodPickerRepository.saveAndFlush(moodPicker);

        int databaseSizeBeforeUpdate = moodPickerRepository.findAll().size();

        // Update the moodPicker using partial update
        MoodPicker partialUpdatedMoodPicker = new MoodPicker();
        partialUpdatedMoodPicker.setId(moodPicker.getId());

        partialUpdatedMoodPicker.mood(UPDATED_MOOD);

        restMoodPickerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMoodPicker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMoodPicker))
            )
            .andExpect(status().isOk());

        // Validate the MoodPicker in the database
        List<MoodPicker> moodPickerList = moodPickerRepository.findAll();
        assertThat(moodPickerList).hasSize(databaseSizeBeforeUpdate);
        MoodPicker testMoodPicker = moodPickerList.get(moodPickerList.size() - 1);
        assertThat(testMoodPicker.getMoodPickerID()).isEqualTo(DEFAULT_MOOD_PICKER_ID);
        assertThat(testMoodPicker.getMood()).isEqualTo(UPDATED_MOOD);
    }

    @Test
    @Transactional
    void fullUpdateMoodPickerWithPatch() throws Exception {
        // Initialize the database
        moodPickerRepository.saveAndFlush(moodPicker);

        int databaseSizeBeforeUpdate = moodPickerRepository.findAll().size();

        // Update the moodPicker using partial update
        MoodPicker partialUpdatedMoodPicker = new MoodPicker();
        partialUpdatedMoodPicker.setId(moodPicker.getId());

        partialUpdatedMoodPicker.moodPickerID(UPDATED_MOOD_PICKER_ID).mood(UPDATED_MOOD);

        restMoodPickerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMoodPicker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMoodPicker))
            )
            .andExpect(status().isOk());

        // Validate the MoodPicker in the database
        List<MoodPicker> moodPickerList = moodPickerRepository.findAll();
        assertThat(moodPickerList).hasSize(databaseSizeBeforeUpdate);
        MoodPicker testMoodPicker = moodPickerList.get(moodPickerList.size() - 1);
        assertThat(testMoodPicker.getMoodPickerID()).isEqualTo(UPDATED_MOOD_PICKER_ID);
        assertThat(testMoodPicker.getMood()).isEqualTo(UPDATED_MOOD);
    }

    @Test
    @Transactional
    void patchNonExistingMoodPicker() throws Exception {
        int databaseSizeBeforeUpdate = moodPickerRepository.findAll().size();
        moodPicker.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMoodPickerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, moodPicker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(moodPicker))
            )
            .andExpect(status().isBadRequest());

        // Validate the MoodPicker in the database
        List<MoodPicker> moodPickerList = moodPickerRepository.findAll();
        assertThat(moodPickerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMoodPicker() throws Exception {
        int databaseSizeBeforeUpdate = moodPickerRepository.findAll().size();
        moodPicker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoodPickerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(moodPicker))
            )
            .andExpect(status().isBadRequest());

        // Validate the MoodPicker in the database
        List<MoodPicker> moodPickerList = moodPickerRepository.findAll();
        assertThat(moodPickerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMoodPicker() throws Exception {
        int databaseSizeBeforeUpdate = moodPickerRepository.findAll().size();
        moodPicker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoodPickerMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(moodPicker))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MoodPicker in the database
        List<MoodPicker> moodPickerList = moodPickerRepository.findAll();
        assertThat(moodPickerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMoodPicker() throws Exception {
        // Initialize the database
        moodPickerRepository.saveAndFlush(moodPicker);

        int databaseSizeBeforeDelete = moodPickerRepository.findAll().size();

        // Delete the moodPicker
        restMoodPickerMockMvc
            .perform(delete(ENTITY_API_URL_ID, moodPicker.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MoodPicker> moodPickerList = moodPickerRepository.findAll();
        assertThat(moodPickerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
