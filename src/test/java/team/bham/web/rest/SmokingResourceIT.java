package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Duration;
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
import team.bham.domain.Smoking;
import team.bham.repository.SmokingRepository;

/**
 * Integration tests for the {@link SmokingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SmokingResourceIT {

    private static final String DEFAULT_LEVELS = "AAAAAAAAAA";
    private static final String UPDATED_LEVELS = "BBBBBBBBBB";

    private static final String DEFAULT_PROGRESS = "AAAAAAAAAA";
    private static final String UPDATED_PROGRESS = "BBBBBBBBBB";

    private static final Duration DEFAULT_TIMER = Duration.ofHours(6);
    private static final Duration UPDATED_TIMER = Duration.ofHours(12);

    private static final String ENTITY_API_URL = "/api/smokings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SmokingRepository smokingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSmokingMockMvc;

    private Smoking smoking;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Smoking createEntity(EntityManager em) {
        Smoking smoking = new Smoking().levels(DEFAULT_LEVELS).progress(DEFAULT_PROGRESS).timer(DEFAULT_TIMER);
        return smoking;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Smoking createUpdatedEntity(EntityManager em) {
        Smoking smoking = new Smoking().levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);
        return smoking;
    }

    @BeforeEach
    public void initTest() {
        smoking = createEntity(em);
    }

    @Test
    @Transactional
    void createSmoking() throws Exception {
        int databaseSizeBeforeCreate = smokingRepository.findAll().size();
        // Create the Smoking
        restSmokingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(smoking)))
            .andExpect(status().isCreated());

        // Validate the Smoking in the database
        List<Smoking> smokingList = smokingRepository.findAll();
        assertThat(smokingList).hasSize(databaseSizeBeforeCreate + 1);
        Smoking testSmoking = smokingList.get(smokingList.size() - 1);
        assertThat(testSmoking.getLevels()).isEqualTo(DEFAULT_LEVELS);
        assertThat(testSmoking.getProgress()).isEqualTo(DEFAULT_PROGRESS);
        assertThat(testSmoking.getTimer()).isEqualTo(DEFAULT_TIMER);
    }

    @Test
    @Transactional
    void createSmokingWithExistingId() throws Exception {
        // Create the Smoking with an existing ID
        smoking.setId(1L);

        int databaseSizeBeforeCreate = smokingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSmokingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(smoking)))
            .andExpect(status().isBadRequest());

        // Validate the Smoking in the database
        List<Smoking> smokingList = smokingRepository.findAll();
        assertThat(smokingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSmokings() throws Exception {
        // Initialize the database
        smokingRepository.saveAndFlush(smoking);

        // Get all the smokingList
        restSmokingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(smoking.getId().intValue())))
            .andExpect(jsonPath("$.[*].levels").value(hasItem(DEFAULT_LEVELS)))
            .andExpect(jsonPath("$.[*].progress").value(hasItem(DEFAULT_PROGRESS)))
            .andExpect(jsonPath("$.[*].timer").value(hasItem(DEFAULT_TIMER.toString())));
    }

    @Test
    @Transactional
    void getSmoking() throws Exception {
        // Initialize the database
        smokingRepository.saveAndFlush(smoking);

        // Get the smoking
        restSmokingMockMvc
            .perform(get(ENTITY_API_URL_ID, smoking.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(smoking.getId().intValue()))
            .andExpect(jsonPath("$.levels").value(DEFAULT_LEVELS))
            .andExpect(jsonPath("$.progress").value(DEFAULT_PROGRESS))
            .andExpect(jsonPath("$.timer").value(DEFAULT_TIMER.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSmoking() throws Exception {
        // Get the smoking
        restSmokingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSmoking() throws Exception {
        // Initialize the database
        smokingRepository.saveAndFlush(smoking);

        int databaseSizeBeforeUpdate = smokingRepository.findAll().size();

        // Update the smoking
        Smoking updatedSmoking = smokingRepository.findById(smoking.getId()).get();
        // Disconnect from session so that the updates on updatedSmoking are not directly saved in db
        em.detach(updatedSmoking);
        updatedSmoking.levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);

        restSmokingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSmoking.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSmoking))
            )
            .andExpect(status().isOk());

        // Validate the Smoking in the database
        List<Smoking> smokingList = smokingRepository.findAll();
        assertThat(smokingList).hasSize(databaseSizeBeforeUpdate);
        Smoking testSmoking = smokingList.get(smokingList.size() - 1);
        assertThat(testSmoking.getLevels()).isEqualTo(UPDATED_LEVELS);
        assertThat(testSmoking.getProgress()).isEqualTo(UPDATED_PROGRESS);
        assertThat(testSmoking.getTimer()).isEqualTo(UPDATED_TIMER);
    }

    @Test
    @Transactional
    void putNonExistingSmoking() throws Exception {
        int databaseSizeBeforeUpdate = smokingRepository.findAll().size();
        smoking.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSmokingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, smoking.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(smoking))
            )
            .andExpect(status().isBadRequest());

        // Validate the Smoking in the database
        List<Smoking> smokingList = smokingRepository.findAll();
        assertThat(smokingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSmoking() throws Exception {
        int databaseSizeBeforeUpdate = smokingRepository.findAll().size();
        smoking.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSmokingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(smoking))
            )
            .andExpect(status().isBadRequest());

        // Validate the Smoking in the database
        List<Smoking> smokingList = smokingRepository.findAll();
        assertThat(smokingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSmoking() throws Exception {
        int databaseSizeBeforeUpdate = smokingRepository.findAll().size();
        smoking.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSmokingMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(smoking)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Smoking in the database
        List<Smoking> smokingList = smokingRepository.findAll();
        assertThat(smokingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSmokingWithPatch() throws Exception {
        // Initialize the database
        smokingRepository.saveAndFlush(smoking);

        int databaseSizeBeforeUpdate = smokingRepository.findAll().size();

        // Update the smoking using partial update
        Smoking partialUpdatedSmoking = new Smoking();
        partialUpdatedSmoking.setId(smoking.getId());

        partialUpdatedSmoking.timer(UPDATED_TIMER);

        restSmokingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSmoking.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSmoking))
            )
            .andExpect(status().isOk());

        // Validate the Smoking in the database
        List<Smoking> smokingList = smokingRepository.findAll();
        assertThat(smokingList).hasSize(databaseSizeBeforeUpdate);
        Smoking testSmoking = smokingList.get(smokingList.size() - 1);
        assertThat(testSmoking.getLevels()).isEqualTo(DEFAULT_LEVELS);
        assertThat(testSmoking.getProgress()).isEqualTo(DEFAULT_PROGRESS);
        assertThat(testSmoking.getTimer()).isEqualTo(UPDATED_TIMER);
    }

    @Test
    @Transactional
    void fullUpdateSmokingWithPatch() throws Exception {
        // Initialize the database
        smokingRepository.saveAndFlush(smoking);

        int databaseSizeBeforeUpdate = smokingRepository.findAll().size();

        // Update the smoking using partial update
        Smoking partialUpdatedSmoking = new Smoking();
        partialUpdatedSmoking.setId(smoking.getId());

        partialUpdatedSmoking.levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);

        restSmokingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSmoking.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSmoking))
            )
            .andExpect(status().isOk());

        // Validate the Smoking in the database
        List<Smoking> smokingList = smokingRepository.findAll();
        assertThat(smokingList).hasSize(databaseSizeBeforeUpdate);
        Smoking testSmoking = smokingList.get(smokingList.size() - 1);
        assertThat(testSmoking.getLevels()).isEqualTo(UPDATED_LEVELS);
        assertThat(testSmoking.getProgress()).isEqualTo(UPDATED_PROGRESS);
        assertThat(testSmoking.getTimer()).isEqualTo(UPDATED_TIMER);
    }

    @Test
    @Transactional
    void patchNonExistingSmoking() throws Exception {
        int databaseSizeBeforeUpdate = smokingRepository.findAll().size();
        smoking.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSmokingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, smoking.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(smoking))
            )
            .andExpect(status().isBadRequest());

        // Validate the Smoking in the database
        List<Smoking> smokingList = smokingRepository.findAll();
        assertThat(smokingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSmoking() throws Exception {
        int databaseSizeBeforeUpdate = smokingRepository.findAll().size();
        smoking.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSmokingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(smoking))
            )
            .andExpect(status().isBadRequest());

        // Validate the Smoking in the database
        List<Smoking> smokingList = smokingRepository.findAll();
        assertThat(smokingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSmoking() throws Exception {
        int databaseSizeBeforeUpdate = smokingRepository.findAll().size();
        smoking.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSmokingMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(smoking)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Smoking in the database
        List<Smoking> smokingList = smokingRepository.findAll();
        assertThat(smokingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSmoking() throws Exception {
        // Initialize the database
        smokingRepository.saveAndFlush(smoking);

        int databaseSizeBeforeDelete = smokingRepository.findAll().size();

        // Delete the smoking
        restSmokingMockMvc
            .perform(delete(ENTITY_API_URL_ID, smoking.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Smoking> smokingList = smokingRepository.findAll();
        assertThat(smokingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
