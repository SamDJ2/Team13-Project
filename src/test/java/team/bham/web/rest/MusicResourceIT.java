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
import team.bham.domain.Music;
import team.bham.repository.MusicRepository;

/**
 * Integration tests for the {@link MusicResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MusicResourceIT {

    private static final String DEFAULT_LEVELS = "AAAAAAAAAA";
    private static final String UPDATED_LEVELS = "BBBBBBBBBB";

    private static final String DEFAULT_PROGRESS = "AAAAAAAAAA";
    private static final String UPDATED_PROGRESS = "BBBBBBBBBB";

    private static final Duration DEFAULT_TIMER = Duration.ofHours(6);
    private static final Duration UPDATED_TIMER = Duration.ofHours(12);

    private static final String ENTITY_API_URL = "/api/music";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MusicRepository musicRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMusicMockMvc;

    private Music music;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Music createEntity(EntityManager em) {
        Music music = new Music().levels(DEFAULT_LEVELS).progress(DEFAULT_PROGRESS).timer(DEFAULT_TIMER);
        return music;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Music createUpdatedEntity(EntityManager em) {
        Music music = new Music().levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);
        return music;
    }

    @BeforeEach
    public void initTest() {
        music = createEntity(em);
    }

    @Test
    @Transactional
    void createMusic() throws Exception {
        int databaseSizeBeforeCreate = musicRepository.findAll().size();
        // Create the Music
        restMusicMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(music)))
            .andExpect(status().isCreated());

        // Validate the Music in the database
        List<Music> musicList = musicRepository.findAll();
        assertThat(musicList).hasSize(databaseSizeBeforeCreate + 1);
        Music testMusic = musicList.get(musicList.size() - 1);
        assertThat(testMusic.getLevels()).isEqualTo(DEFAULT_LEVELS);
        assertThat(testMusic.getProgress()).isEqualTo(DEFAULT_PROGRESS);
        assertThat(testMusic.getTimer()).isEqualTo(DEFAULT_TIMER);
    }

    @Test
    @Transactional
    void createMusicWithExistingId() throws Exception {
        // Create the Music with an existing ID
        music.setId(1L);

        int databaseSizeBeforeCreate = musicRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMusicMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(music)))
            .andExpect(status().isBadRequest());

        // Validate the Music in the database
        List<Music> musicList = musicRepository.findAll();
        assertThat(musicList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMusic() throws Exception {
        // Initialize the database
        musicRepository.saveAndFlush(music);

        // Get all the musicList
        restMusicMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(music.getId().intValue())))
            .andExpect(jsonPath("$.[*].levels").value(hasItem(DEFAULT_LEVELS)))
            .andExpect(jsonPath("$.[*].progress").value(hasItem(DEFAULT_PROGRESS)))
            .andExpect(jsonPath("$.[*].timer").value(hasItem(DEFAULT_TIMER.toString())));
    }

    @Test
    @Transactional
    void getMusic() throws Exception {
        // Initialize the database
        musicRepository.saveAndFlush(music);

        // Get the music
        restMusicMockMvc
            .perform(get(ENTITY_API_URL_ID, music.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(music.getId().intValue()))
            .andExpect(jsonPath("$.levels").value(DEFAULT_LEVELS))
            .andExpect(jsonPath("$.progress").value(DEFAULT_PROGRESS))
            .andExpect(jsonPath("$.timer").value(DEFAULT_TIMER.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMusic() throws Exception {
        // Get the music
        restMusicMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMusic() throws Exception {
        // Initialize the database
        musicRepository.saveAndFlush(music);

        int databaseSizeBeforeUpdate = musicRepository.findAll().size();

        // Update the music
        Music updatedMusic = musicRepository.findById(music.getId()).get();
        // Disconnect from session so that the updates on updatedMusic are not directly saved in db
        em.detach(updatedMusic);
        updatedMusic.levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);

        restMusicMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMusic.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMusic))
            )
            .andExpect(status().isOk());

        // Validate the Music in the database
        List<Music> musicList = musicRepository.findAll();
        assertThat(musicList).hasSize(databaseSizeBeforeUpdate);
        Music testMusic = musicList.get(musicList.size() - 1);
        assertThat(testMusic.getLevels()).isEqualTo(UPDATED_LEVELS);
        assertThat(testMusic.getProgress()).isEqualTo(UPDATED_PROGRESS);
        assertThat(testMusic.getTimer()).isEqualTo(UPDATED_TIMER);
    }

    @Test
    @Transactional
    void putNonExistingMusic() throws Exception {
        int databaseSizeBeforeUpdate = musicRepository.findAll().size();
        music.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMusicMockMvc
            .perform(
                put(ENTITY_API_URL_ID, music.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(music))
            )
            .andExpect(status().isBadRequest());

        // Validate the Music in the database
        List<Music> musicList = musicRepository.findAll();
        assertThat(musicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMusic() throws Exception {
        int databaseSizeBeforeUpdate = musicRepository.findAll().size();
        music.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMusicMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(music))
            )
            .andExpect(status().isBadRequest());

        // Validate the Music in the database
        List<Music> musicList = musicRepository.findAll();
        assertThat(musicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMusic() throws Exception {
        int databaseSizeBeforeUpdate = musicRepository.findAll().size();
        music.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMusicMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(music)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Music in the database
        List<Music> musicList = musicRepository.findAll();
        assertThat(musicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMusicWithPatch() throws Exception {
        // Initialize the database
        musicRepository.saveAndFlush(music);

        int databaseSizeBeforeUpdate = musicRepository.findAll().size();

        // Update the music using partial update
        Music partialUpdatedMusic = new Music();
        partialUpdatedMusic.setId(music.getId());

        partialUpdatedMusic.levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS);

        restMusicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMusic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMusic))
            )
            .andExpect(status().isOk());

        // Validate the Music in the database
        List<Music> musicList = musicRepository.findAll();
        assertThat(musicList).hasSize(databaseSizeBeforeUpdate);
        Music testMusic = musicList.get(musicList.size() - 1);
        assertThat(testMusic.getLevels()).isEqualTo(UPDATED_LEVELS);
        assertThat(testMusic.getProgress()).isEqualTo(UPDATED_PROGRESS);
        assertThat(testMusic.getTimer()).isEqualTo(DEFAULT_TIMER);
    }

    @Test
    @Transactional
    void fullUpdateMusicWithPatch() throws Exception {
        // Initialize the database
        musicRepository.saveAndFlush(music);

        int databaseSizeBeforeUpdate = musicRepository.findAll().size();

        // Update the music using partial update
        Music partialUpdatedMusic = new Music();
        partialUpdatedMusic.setId(music.getId());

        partialUpdatedMusic.levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);

        restMusicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMusic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMusic))
            )
            .andExpect(status().isOk());

        // Validate the Music in the database
        List<Music> musicList = musicRepository.findAll();
        assertThat(musicList).hasSize(databaseSizeBeforeUpdate);
        Music testMusic = musicList.get(musicList.size() - 1);
        assertThat(testMusic.getLevels()).isEqualTo(UPDATED_LEVELS);
        assertThat(testMusic.getProgress()).isEqualTo(UPDATED_PROGRESS);
        assertThat(testMusic.getTimer()).isEqualTo(UPDATED_TIMER);
    }

    @Test
    @Transactional
    void patchNonExistingMusic() throws Exception {
        int databaseSizeBeforeUpdate = musicRepository.findAll().size();
        music.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMusicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, music.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(music))
            )
            .andExpect(status().isBadRequest());

        // Validate the Music in the database
        List<Music> musicList = musicRepository.findAll();
        assertThat(musicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMusic() throws Exception {
        int databaseSizeBeforeUpdate = musicRepository.findAll().size();
        music.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMusicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(music))
            )
            .andExpect(status().isBadRequest());

        // Validate the Music in the database
        List<Music> musicList = musicRepository.findAll();
        assertThat(musicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMusic() throws Exception {
        int databaseSizeBeforeUpdate = musicRepository.findAll().size();
        music.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMusicMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(music)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Music in the database
        List<Music> musicList = musicRepository.findAll();
        assertThat(musicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMusic() throws Exception {
        // Initialize the database
        musicRepository.saveAndFlush(music);

        int databaseSizeBeforeDelete = musicRepository.findAll().size();

        // Delete the music
        restMusicMockMvc
            .perform(delete(ENTITY_API_URL_ID, music.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Music> musicList = musicRepository.findAll();
        assertThat(musicList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
