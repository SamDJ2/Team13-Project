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
import team.bham.domain.Movies;
import team.bham.repository.MoviesRepository;

/**
 * Integration tests for the {@link MoviesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MoviesResourceIT {

    private static final String DEFAULT_LEVELS = "AAAAAAAAAA";
    private static final String UPDATED_LEVELS = "BBBBBBBBBB";

    private static final String DEFAULT_PROGRESS = "AAAAAAAAAA";
    private static final String UPDATED_PROGRESS = "BBBBBBBBBB";

    private static final Duration DEFAULT_TIMER = Duration.ofHours(6);
    private static final Duration UPDATED_TIMER = Duration.ofHours(12);

    private static final String ENTITY_API_URL = "/api/movies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MoviesRepository moviesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMoviesMockMvc;

    private Movies movies;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Movies createEntity(EntityManager em) {
        Movies movies = new Movies().levels(DEFAULT_LEVELS).progress(DEFAULT_PROGRESS).timer(DEFAULT_TIMER);
        return movies;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Movies createUpdatedEntity(EntityManager em) {
        Movies movies = new Movies().levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);
        return movies;
    }

    @BeforeEach
    public void initTest() {
        movies = createEntity(em);
    }

    @Test
    @Transactional
    void createMovies() throws Exception {
        int databaseSizeBeforeCreate = moviesRepository.findAll().size();
        // Create the Movies
        restMoviesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(movies)))
            .andExpect(status().isCreated());

        // Validate the Movies in the database
        List<Movies> moviesList = moviesRepository.findAll();
        assertThat(moviesList).hasSize(databaseSizeBeforeCreate + 1);
        Movies testMovies = moviesList.get(moviesList.size() - 1);
        assertThat(testMovies.getLevels()).isEqualTo(DEFAULT_LEVELS);
        assertThat(testMovies.getProgress()).isEqualTo(DEFAULT_PROGRESS);
        assertThat(testMovies.getTimer()).isEqualTo(DEFAULT_TIMER);
    }

    @Test
    @Transactional
    void createMoviesWithExistingId() throws Exception {
        // Create the Movies with an existing ID
        movies.setId(1L);

        int databaseSizeBeforeCreate = moviesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMoviesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(movies)))
            .andExpect(status().isBadRequest());

        // Validate the Movies in the database
        List<Movies> moviesList = moviesRepository.findAll();
        assertThat(moviesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMovies() throws Exception {
        // Initialize the database
        moviesRepository.saveAndFlush(movies);

        // Get all the moviesList
        restMoviesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(movies.getId().intValue())))
            .andExpect(jsonPath("$.[*].levels").value(hasItem(DEFAULT_LEVELS)))
            .andExpect(jsonPath("$.[*].progress").value(hasItem(DEFAULT_PROGRESS)))
            .andExpect(jsonPath("$.[*].timer").value(hasItem(DEFAULT_TIMER.toString())));
    }

    @Test
    @Transactional
    void getMovies() throws Exception {
        // Initialize the database
        moviesRepository.saveAndFlush(movies);

        // Get the movies
        restMoviesMockMvc
            .perform(get(ENTITY_API_URL_ID, movies.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(movies.getId().intValue()))
            .andExpect(jsonPath("$.levels").value(DEFAULT_LEVELS))
            .andExpect(jsonPath("$.progress").value(DEFAULT_PROGRESS))
            .andExpect(jsonPath("$.timer").value(DEFAULT_TIMER.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMovies() throws Exception {
        // Get the movies
        restMoviesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMovies() throws Exception {
        // Initialize the database
        moviesRepository.saveAndFlush(movies);

        int databaseSizeBeforeUpdate = moviesRepository.findAll().size();

        // Update the movies
        Movies updatedMovies = moviesRepository.findById(movies.getId()).get();
        // Disconnect from session so that the updates on updatedMovies are not directly saved in db
        em.detach(updatedMovies);
        updatedMovies.levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);

        restMoviesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMovies.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMovies))
            )
            .andExpect(status().isOk());

        // Validate the Movies in the database
        List<Movies> moviesList = moviesRepository.findAll();
        assertThat(moviesList).hasSize(databaseSizeBeforeUpdate);
        Movies testMovies = moviesList.get(moviesList.size() - 1);
        assertThat(testMovies.getLevels()).isEqualTo(UPDATED_LEVELS);
        assertThat(testMovies.getProgress()).isEqualTo(UPDATED_PROGRESS);
        assertThat(testMovies.getTimer()).isEqualTo(UPDATED_TIMER);
    }

    @Test
    @Transactional
    void putNonExistingMovies() throws Exception {
        int databaseSizeBeforeUpdate = moviesRepository.findAll().size();
        movies.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMoviesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, movies.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(movies))
            )
            .andExpect(status().isBadRequest());

        // Validate the Movies in the database
        List<Movies> moviesList = moviesRepository.findAll();
        assertThat(moviesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMovies() throws Exception {
        int databaseSizeBeforeUpdate = moviesRepository.findAll().size();
        movies.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoviesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(movies))
            )
            .andExpect(status().isBadRequest());

        // Validate the Movies in the database
        List<Movies> moviesList = moviesRepository.findAll();
        assertThat(moviesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMovies() throws Exception {
        int databaseSizeBeforeUpdate = moviesRepository.findAll().size();
        movies.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoviesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(movies)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Movies in the database
        List<Movies> moviesList = moviesRepository.findAll();
        assertThat(moviesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMoviesWithPatch() throws Exception {
        // Initialize the database
        moviesRepository.saveAndFlush(movies);

        int databaseSizeBeforeUpdate = moviesRepository.findAll().size();

        // Update the movies using partial update
        Movies partialUpdatedMovies = new Movies();
        partialUpdatedMovies.setId(movies.getId());

        partialUpdatedMovies.progress(UPDATED_PROGRESS);

        restMoviesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMovies.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMovies))
            )
            .andExpect(status().isOk());

        // Validate the Movies in the database
        List<Movies> moviesList = moviesRepository.findAll();
        assertThat(moviesList).hasSize(databaseSizeBeforeUpdate);
        Movies testMovies = moviesList.get(moviesList.size() - 1);
        assertThat(testMovies.getLevels()).isEqualTo(DEFAULT_LEVELS);
        assertThat(testMovies.getProgress()).isEqualTo(UPDATED_PROGRESS);
        assertThat(testMovies.getTimer()).isEqualTo(DEFAULT_TIMER);
    }

    @Test
    @Transactional
    void fullUpdateMoviesWithPatch() throws Exception {
        // Initialize the database
        moviesRepository.saveAndFlush(movies);

        int databaseSizeBeforeUpdate = moviesRepository.findAll().size();

        // Update the movies using partial update
        Movies partialUpdatedMovies = new Movies();
        partialUpdatedMovies.setId(movies.getId());

        partialUpdatedMovies.levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);

        restMoviesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMovies.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMovies))
            )
            .andExpect(status().isOk());

        // Validate the Movies in the database
        List<Movies> moviesList = moviesRepository.findAll();
        assertThat(moviesList).hasSize(databaseSizeBeforeUpdate);
        Movies testMovies = moviesList.get(moviesList.size() - 1);
        assertThat(testMovies.getLevels()).isEqualTo(UPDATED_LEVELS);
        assertThat(testMovies.getProgress()).isEqualTo(UPDATED_PROGRESS);
        assertThat(testMovies.getTimer()).isEqualTo(UPDATED_TIMER);
    }

    @Test
    @Transactional
    void patchNonExistingMovies() throws Exception {
        int databaseSizeBeforeUpdate = moviesRepository.findAll().size();
        movies.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMoviesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, movies.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(movies))
            )
            .andExpect(status().isBadRequest());

        // Validate the Movies in the database
        List<Movies> moviesList = moviesRepository.findAll();
        assertThat(moviesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMovies() throws Exception {
        int databaseSizeBeforeUpdate = moviesRepository.findAll().size();
        movies.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoviesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(movies))
            )
            .andExpect(status().isBadRequest());

        // Validate the Movies in the database
        List<Movies> moviesList = moviesRepository.findAll();
        assertThat(moviesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMovies() throws Exception {
        int databaseSizeBeforeUpdate = moviesRepository.findAll().size();
        movies.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoviesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(movies)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Movies in the database
        List<Movies> moviesList = moviesRepository.findAll();
        assertThat(moviesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMovies() throws Exception {
        // Initialize the database
        moviesRepository.saveAndFlush(movies);

        int databaseSizeBeforeDelete = moviesRepository.findAll().size();

        // Delete the movies
        restMoviesMockMvc
            .perform(delete(ENTITY_API_URL_ID, movies.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Movies> moviesList = moviesRepository.findAll();
        assertThat(moviesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
