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
import team.bham.domain.VideoGames;
import team.bham.repository.VideoGamesRepository;

/**
 * Integration tests for the {@link VideoGamesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VideoGamesResourceIT {

    private static final String DEFAULT_LEVELS = "AAAAAAAAAA";
    private static final String UPDATED_LEVELS = "BBBBBBBBBB";

    private static final String DEFAULT_PROGRESS = "AAAAAAAAAA";
    private static final String UPDATED_PROGRESS = "BBBBBBBBBB";

    private static final Duration DEFAULT_TIMER = Duration.ofHours(6);
    private static final Duration UPDATED_TIMER = Duration.ofHours(12);

    private static final String ENTITY_API_URL = "/api/video-games";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VideoGamesRepository videoGamesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVideoGamesMockMvc;

    private VideoGames videoGames;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VideoGames createEntity(EntityManager em) {
        VideoGames videoGames = new VideoGames().levels(DEFAULT_LEVELS).progress(DEFAULT_PROGRESS).timer(DEFAULT_TIMER);
        return videoGames;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VideoGames createUpdatedEntity(EntityManager em) {
        VideoGames videoGames = new VideoGames().levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);
        return videoGames;
    }

    @BeforeEach
    public void initTest() {
        videoGames = createEntity(em);
    }

    @Test
    @Transactional
    void createVideoGames() throws Exception {
        int databaseSizeBeforeCreate = videoGamesRepository.findAll().size();
        // Create the VideoGames
        restVideoGamesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(videoGames)))
            .andExpect(status().isCreated());

        // Validate the VideoGames in the database
        List<VideoGames> videoGamesList = videoGamesRepository.findAll();
        assertThat(videoGamesList).hasSize(databaseSizeBeforeCreate + 1);
        VideoGames testVideoGames = videoGamesList.get(videoGamesList.size() - 1);
        assertThat(testVideoGames.getLevels()).isEqualTo(DEFAULT_LEVELS);
        assertThat(testVideoGames.getProgress()).isEqualTo(DEFAULT_PROGRESS);
        assertThat(testVideoGames.getTimer()).isEqualTo(DEFAULT_TIMER);
    }

    @Test
    @Transactional
    void createVideoGamesWithExistingId() throws Exception {
        // Create the VideoGames with an existing ID
        videoGames.setId(1L);

        int databaseSizeBeforeCreate = videoGamesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVideoGamesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(videoGames)))
            .andExpect(status().isBadRequest());

        // Validate the VideoGames in the database
        List<VideoGames> videoGamesList = videoGamesRepository.findAll();
        assertThat(videoGamesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVideoGames() throws Exception {
        // Initialize the database
        videoGamesRepository.saveAndFlush(videoGames);

        // Get all the videoGamesList
        restVideoGamesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(videoGames.getId().intValue())))
            .andExpect(jsonPath("$.[*].levels").value(hasItem(DEFAULT_LEVELS)))
            .andExpect(jsonPath("$.[*].progress").value(hasItem(DEFAULT_PROGRESS)))
            .andExpect(jsonPath("$.[*].timer").value(hasItem(DEFAULT_TIMER.toString())));
    }

    @Test
    @Transactional
    void getVideoGames() throws Exception {
        // Initialize the database
        videoGamesRepository.saveAndFlush(videoGames);

        // Get the videoGames
        restVideoGamesMockMvc
            .perform(get(ENTITY_API_URL_ID, videoGames.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(videoGames.getId().intValue()))
            .andExpect(jsonPath("$.levels").value(DEFAULT_LEVELS))
            .andExpect(jsonPath("$.progress").value(DEFAULT_PROGRESS))
            .andExpect(jsonPath("$.timer").value(DEFAULT_TIMER.toString()));
    }

    @Test
    @Transactional
    void getNonExistingVideoGames() throws Exception {
        // Get the videoGames
        restVideoGamesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVideoGames() throws Exception {
        // Initialize the database
        videoGamesRepository.saveAndFlush(videoGames);

        int databaseSizeBeforeUpdate = videoGamesRepository.findAll().size();

        // Update the videoGames
        VideoGames updatedVideoGames = videoGamesRepository.findById(videoGames.getId()).get();
        // Disconnect from session so that the updates on updatedVideoGames are not directly saved in db
        em.detach(updatedVideoGames);
        updatedVideoGames.levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);

        restVideoGamesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVideoGames.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVideoGames))
            )
            .andExpect(status().isOk());

        // Validate the VideoGames in the database
        List<VideoGames> videoGamesList = videoGamesRepository.findAll();
        assertThat(videoGamesList).hasSize(databaseSizeBeforeUpdate);
        VideoGames testVideoGames = videoGamesList.get(videoGamesList.size() - 1);
        assertThat(testVideoGames.getLevels()).isEqualTo(UPDATED_LEVELS);
        assertThat(testVideoGames.getProgress()).isEqualTo(UPDATED_PROGRESS);
        assertThat(testVideoGames.getTimer()).isEqualTo(UPDATED_TIMER);
    }

    @Test
    @Transactional
    void putNonExistingVideoGames() throws Exception {
        int databaseSizeBeforeUpdate = videoGamesRepository.findAll().size();
        videoGames.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVideoGamesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, videoGames.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(videoGames))
            )
            .andExpect(status().isBadRequest());

        // Validate the VideoGames in the database
        List<VideoGames> videoGamesList = videoGamesRepository.findAll();
        assertThat(videoGamesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVideoGames() throws Exception {
        int databaseSizeBeforeUpdate = videoGamesRepository.findAll().size();
        videoGames.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVideoGamesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(videoGames))
            )
            .andExpect(status().isBadRequest());

        // Validate the VideoGames in the database
        List<VideoGames> videoGamesList = videoGamesRepository.findAll();
        assertThat(videoGamesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVideoGames() throws Exception {
        int databaseSizeBeforeUpdate = videoGamesRepository.findAll().size();
        videoGames.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVideoGamesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(videoGames)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the VideoGames in the database
        List<VideoGames> videoGamesList = videoGamesRepository.findAll();
        assertThat(videoGamesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVideoGamesWithPatch() throws Exception {
        // Initialize the database
        videoGamesRepository.saveAndFlush(videoGames);

        int databaseSizeBeforeUpdate = videoGamesRepository.findAll().size();

        // Update the videoGames using partial update
        VideoGames partialUpdatedVideoGames = new VideoGames();
        partialUpdatedVideoGames.setId(videoGames.getId());

        partialUpdatedVideoGames.levels(UPDATED_LEVELS);

        restVideoGamesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVideoGames.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVideoGames))
            )
            .andExpect(status().isOk());

        // Validate the VideoGames in the database
        List<VideoGames> videoGamesList = videoGamesRepository.findAll();
        assertThat(videoGamesList).hasSize(databaseSizeBeforeUpdate);
        VideoGames testVideoGames = videoGamesList.get(videoGamesList.size() - 1);
        assertThat(testVideoGames.getLevels()).isEqualTo(UPDATED_LEVELS);
        assertThat(testVideoGames.getProgress()).isEqualTo(DEFAULT_PROGRESS);
        assertThat(testVideoGames.getTimer()).isEqualTo(DEFAULT_TIMER);
    }

    @Test
    @Transactional
    void fullUpdateVideoGamesWithPatch() throws Exception {
        // Initialize the database
        videoGamesRepository.saveAndFlush(videoGames);

        int databaseSizeBeforeUpdate = videoGamesRepository.findAll().size();

        // Update the videoGames using partial update
        VideoGames partialUpdatedVideoGames = new VideoGames();
        partialUpdatedVideoGames.setId(videoGames.getId());

        partialUpdatedVideoGames.levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);

        restVideoGamesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVideoGames.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVideoGames))
            )
            .andExpect(status().isOk());

        // Validate the VideoGames in the database
        List<VideoGames> videoGamesList = videoGamesRepository.findAll();
        assertThat(videoGamesList).hasSize(databaseSizeBeforeUpdate);
        VideoGames testVideoGames = videoGamesList.get(videoGamesList.size() - 1);
        assertThat(testVideoGames.getLevels()).isEqualTo(UPDATED_LEVELS);
        assertThat(testVideoGames.getProgress()).isEqualTo(UPDATED_PROGRESS);
        assertThat(testVideoGames.getTimer()).isEqualTo(UPDATED_TIMER);
    }

    @Test
    @Transactional
    void patchNonExistingVideoGames() throws Exception {
        int databaseSizeBeforeUpdate = videoGamesRepository.findAll().size();
        videoGames.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVideoGamesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, videoGames.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(videoGames))
            )
            .andExpect(status().isBadRequest());

        // Validate the VideoGames in the database
        List<VideoGames> videoGamesList = videoGamesRepository.findAll();
        assertThat(videoGamesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVideoGames() throws Exception {
        int databaseSizeBeforeUpdate = videoGamesRepository.findAll().size();
        videoGames.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVideoGamesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(videoGames))
            )
            .andExpect(status().isBadRequest());

        // Validate the VideoGames in the database
        List<VideoGames> videoGamesList = videoGamesRepository.findAll();
        assertThat(videoGamesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVideoGames() throws Exception {
        int databaseSizeBeforeUpdate = videoGamesRepository.findAll().size();
        videoGames.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVideoGamesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(videoGames))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VideoGames in the database
        List<VideoGames> videoGamesList = videoGamesRepository.findAll();
        assertThat(videoGamesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVideoGames() throws Exception {
        // Initialize the database
        videoGamesRepository.saveAndFlush(videoGames);

        int databaseSizeBeforeDelete = videoGamesRepository.findAll().size();

        // Delete the videoGames
        restVideoGamesMockMvc
            .perform(delete(ENTITY_API_URL_ID, videoGames.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<VideoGames> videoGamesList = videoGamesRepository.findAll();
        assertThat(videoGamesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
