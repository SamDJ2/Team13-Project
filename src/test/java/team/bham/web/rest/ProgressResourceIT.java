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
import team.bham.domain.Progress;
import team.bham.repository.ProgressRepository;

/**
 * Integration tests for the {@link ProgressResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProgressResourceIT {

    private static final Long DEFAULT_DETOX_PROGRESS = 1L;
    private static final Long UPDATED_DETOX_PROGRESS = 2L;

    private static final Long DEFAULT_DETOX_TOTAL = 1L;
    private static final Long UPDATED_DETOX_TOTAL = 2L;

    private static final String DEFAULT_CHALLENGES_INFO = "AAAAAAAAAA";
    private static final String UPDATED_CHALLENGES_INFO = "BBBBBBBBBB";

    private static final String DEFAULT_LEADERBOARD_INFO = "AAAAAAAAAA";
    private static final String UPDATED_LEADERBOARD_INFO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/progresses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProgressMockMvc;

    private Progress progress;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Progress createEntity(EntityManager em) {
        Progress progress = new Progress()
            .detoxProgress(DEFAULT_DETOX_PROGRESS)
            .detoxTotal(DEFAULT_DETOX_TOTAL)
            .challengesInfo(DEFAULT_CHALLENGES_INFO)
            .leaderboardInfo(DEFAULT_LEADERBOARD_INFO);
        return progress;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Progress createUpdatedEntity(EntityManager em) {
        Progress progress = new Progress()
            .detoxProgress(UPDATED_DETOX_PROGRESS)
            .detoxTotal(UPDATED_DETOX_TOTAL)
            .challengesInfo(UPDATED_CHALLENGES_INFO)
            .leaderboardInfo(UPDATED_LEADERBOARD_INFO);
        return progress;
    }

    @BeforeEach
    public void initTest() {
        progress = createEntity(em);
    }

    @Test
    @Transactional
    void createProgress() throws Exception {
        int databaseSizeBeforeCreate = progressRepository.findAll().size();
        // Create the Progress
        restProgressMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(progress)))
            .andExpect(status().isCreated());

        // Validate the Progress in the database
        List<Progress> progressList = progressRepository.findAll();
        assertThat(progressList).hasSize(databaseSizeBeforeCreate + 1);
        Progress testProgress = progressList.get(progressList.size() - 1);
        assertThat(testProgress.getDetoxProgress()).isEqualTo(DEFAULT_DETOX_PROGRESS);
        assertThat(testProgress.getDetoxTotal()).isEqualTo(DEFAULT_DETOX_TOTAL);
        assertThat(testProgress.getChallengesInfo()).isEqualTo(DEFAULT_CHALLENGES_INFO);
        assertThat(testProgress.getLeaderboardInfo()).isEqualTo(DEFAULT_LEADERBOARD_INFO);
    }

    @Test
    @Transactional
    void createProgressWithExistingId() throws Exception {
        // Create the Progress with an existing ID
        progress.setId(1L);

        int databaseSizeBeforeCreate = progressRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProgressMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(progress)))
            .andExpect(status().isBadRequest());

        // Validate the Progress in the database
        List<Progress> progressList = progressRepository.findAll();
        assertThat(progressList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProgresses() throws Exception {
        // Initialize the database
        progressRepository.saveAndFlush(progress);

        // Get all the progressList
        restProgressMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(progress.getId().intValue())))
            .andExpect(jsonPath("$.[*].detoxProgress").value(hasItem(DEFAULT_DETOX_PROGRESS.intValue())))
            .andExpect(jsonPath("$.[*].detoxTotal").value(hasItem(DEFAULT_DETOX_TOTAL.intValue())))
            .andExpect(jsonPath("$.[*].challengesInfo").value(hasItem(DEFAULT_CHALLENGES_INFO)))
            .andExpect(jsonPath("$.[*].leaderboardInfo").value(hasItem(DEFAULT_LEADERBOARD_INFO)));
    }

    @Test
    @Transactional
    void getProgress() throws Exception {
        // Initialize the database
        progressRepository.saveAndFlush(progress);

        // Get the progress
        restProgressMockMvc
            .perform(get(ENTITY_API_URL_ID, progress.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(progress.getId().intValue()))
            .andExpect(jsonPath("$.detoxProgress").value(DEFAULT_DETOX_PROGRESS.intValue()))
            .andExpect(jsonPath("$.detoxTotal").value(DEFAULT_DETOX_TOTAL.intValue()))
            .andExpect(jsonPath("$.challengesInfo").value(DEFAULT_CHALLENGES_INFO))
            .andExpect(jsonPath("$.leaderboardInfo").value(DEFAULT_LEADERBOARD_INFO));
    }

    @Test
    @Transactional
    void getNonExistingProgress() throws Exception {
        // Get the progress
        restProgressMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProgress() throws Exception {
        // Initialize the database
        progressRepository.saveAndFlush(progress);

        int databaseSizeBeforeUpdate = progressRepository.findAll().size();

        // Update the progress
        Progress updatedProgress = progressRepository.findById(progress.getId()).get();
        // Disconnect from session so that the updates on updatedProgress are not directly saved in db
        em.detach(updatedProgress);
        updatedProgress
            .detoxProgress(UPDATED_DETOX_PROGRESS)
            .detoxTotal(UPDATED_DETOX_TOTAL)
            .challengesInfo(UPDATED_CHALLENGES_INFO)
            .leaderboardInfo(UPDATED_LEADERBOARD_INFO);

        restProgressMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProgress.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProgress))
            )
            .andExpect(status().isOk());

        // Validate the Progress in the database
        List<Progress> progressList = progressRepository.findAll();
        assertThat(progressList).hasSize(databaseSizeBeforeUpdate);
        Progress testProgress = progressList.get(progressList.size() - 1);
        assertThat(testProgress.getDetoxProgress()).isEqualTo(UPDATED_DETOX_PROGRESS);
        assertThat(testProgress.getDetoxTotal()).isEqualTo(UPDATED_DETOX_TOTAL);
        assertThat(testProgress.getChallengesInfo()).isEqualTo(UPDATED_CHALLENGES_INFO);
        assertThat(testProgress.getLeaderboardInfo()).isEqualTo(UPDATED_LEADERBOARD_INFO);
    }

    @Test
    @Transactional
    void putNonExistingProgress() throws Exception {
        int databaseSizeBeforeUpdate = progressRepository.findAll().size();
        progress.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProgressMockMvc
            .perform(
                put(ENTITY_API_URL_ID, progress.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(progress))
            )
            .andExpect(status().isBadRequest());

        // Validate the Progress in the database
        List<Progress> progressList = progressRepository.findAll();
        assertThat(progressList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProgress() throws Exception {
        int databaseSizeBeforeUpdate = progressRepository.findAll().size();
        progress.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProgressMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(progress))
            )
            .andExpect(status().isBadRequest());

        // Validate the Progress in the database
        List<Progress> progressList = progressRepository.findAll();
        assertThat(progressList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProgress() throws Exception {
        int databaseSizeBeforeUpdate = progressRepository.findAll().size();
        progress.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProgressMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(progress)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Progress in the database
        List<Progress> progressList = progressRepository.findAll();
        assertThat(progressList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProgressWithPatch() throws Exception {
        // Initialize the database
        progressRepository.saveAndFlush(progress);

        int databaseSizeBeforeUpdate = progressRepository.findAll().size();

        // Update the progress using partial update
        Progress partialUpdatedProgress = new Progress();
        partialUpdatedProgress.setId(progress.getId());

        partialUpdatedProgress.detoxTotal(UPDATED_DETOX_TOTAL);

        restProgressMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProgress.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProgress))
            )
            .andExpect(status().isOk());

        // Validate the Progress in the database
        List<Progress> progressList = progressRepository.findAll();
        assertThat(progressList).hasSize(databaseSizeBeforeUpdate);
        Progress testProgress = progressList.get(progressList.size() - 1);
        assertThat(testProgress.getDetoxProgress()).isEqualTo(DEFAULT_DETOX_PROGRESS);
        assertThat(testProgress.getDetoxTotal()).isEqualTo(UPDATED_DETOX_TOTAL);
        assertThat(testProgress.getChallengesInfo()).isEqualTo(DEFAULT_CHALLENGES_INFO);
        assertThat(testProgress.getLeaderboardInfo()).isEqualTo(DEFAULT_LEADERBOARD_INFO);
    }

    @Test
    @Transactional
    void fullUpdateProgressWithPatch() throws Exception {
        // Initialize the database
        progressRepository.saveAndFlush(progress);

        int databaseSizeBeforeUpdate = progressRepository.findAll().size();

        // Update the progress using partial update
        Progress partialUpdatedProgress = new Progress();
        partialUpdatedProgress.setId(progress.getId());

        partialUpdatedProgress
            .detoxProgress(UPDATED_DETOX_PROGRESS)
            .detoxTotal(UPDATED_DETOX_TOTAL)
            .challengesInfo(UPDATED_CHALLENGES_INFO)
            .leaderboardInfo(UPDATED_LEADERBOARD_INFO);

        restProgressMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProgress.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProgress))
            )
            .andExpect(status().isOk());

        // Validate the Progress in the database
        List<Progress> progressList = progressRepository.findAll();
        assertThat(progressList).hasSize(databaseSizeBeforeUpdate);
        Progress testProgress = progressList.get(progressList.size() - 1);
        assertThat(testProgress.getDetoxProgress()).isEqualTo(UPDATED_DETOX_PROGRESS);
        assertThat(testProgress.getDetoxTotal()).isEqualTo(UPDATED_DETOX_TOTAL);
        assertThat(testProgress.getChallengesInfo()).isEqualTo(UPDATED_CHALLENGES_INFO);
        assertThat(testProgress.getLeaderboardInfo()).isEqualTo(UPDATED_LEADERBOARD_INFO);
    }

    @Test
    @Transactional
    void patchNonExistingProgress() throws Exception {
        int databaseSizeBeforeUpdate = progressRepository.findAll().size();
        progress.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProgressMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, progress.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(progress))
            )
            .andExpect(status().isBadRequest());

        // Validate the Progress in the database
        List<Progress> progressList = progressRepository.findAll();
        assertThat(progressList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProgress() throws Exception {
        int databaseSizeBeforeUpdate = progressRepository.findAll().size();
        progress.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProgressMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(progress))
            )
            .andExpect(status().isBadRequest());

        // Validate the Progress in the database
        List<Progress> progressList = progressRepository.findAll();
        assertThat(progressList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProgress() throws Exception {
        int databaseSizeBeforeUpdate = progressRepository.findAll().size();
        progress.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProgressMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(progress)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Progress in the database
        List<Progress> progressList = progressRepository.findAll();
        assertThat(progressList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProgress() throws Exception {
        // Initialize the database
        progressRepository.saveAndFlush(progress);

        int databaseSizeBeforeDelete = progressRepository.findAll().size();

        // Delete the progress
        restProgressMockMvc
            .perform(delete(ENTITY_API_URL_ID, progress.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Progress> progressList = progressRepository.findAll();
        assertThat(progressList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
