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
import team.bham.domain.Alcohol;
import team.bham.repository.AlcoholRepository;

/**
 * Integration tests for the {@link AlcoholResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AlcoholResourceIT {

    private static final String DEFAULT_LEVELS = "AAAAAAAAAA";
    private static final String UPDATED_LEVELS = "BBBBBBBBBB";

    private static final String DEFAULT_PROGRESS = "AAAAAAAAAA";
    private static final String UPDATED_PROGRESS = "BBBBBBBBBB";

    private static final Duration DEFAULT_TIMER = Duration.ofHours(6);
    private static final Duration UPDATED_TIMER = Duration.ofHours(12);

    private static final String ENTITY_API_URL = "/api/alcohol";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AlcoholRepository alcoholRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAlcoholMockMvc;

    private Alcohol alcohol;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Alcohol createEntity(EntityManager em) {
        Alcohol alcohol = new Alcohol().levels(DEFAULT_LEVELS).progress(DEFAULT_PROGRESS).timer(DEFAULT_TIMER);
        return alcohol;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Alcohol createUpdatedEntity(EntityManager em) {
        Alcohol alcohol = new Alcohol().levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);
        return alcohol;
    }

    @BeforeEach
    public void initTest() {
        alcohol = createEntity(em);
    }

    @Test
    @Transactional
    void createAlcohol() throws Exception {
        int databaseSizeBeforeCreate = alcoholRepository.findAll().size();
        // Create the Alcohol
        restAlcoholMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(alcohol)))
            .andExpect(status().isCreated());

        // Validate the Alcohol in the database
        List<Alcohol> alcoholList = alcoholRepository.findAll();
        assertThat(alcoholList).hasSize(databaseSizeBeforeCreate + 1);
        Alcohol testAlcohol = alcoholList.get(alcoholList.size() - 1);
        assertThat(testAlcohol.getLevels()).isEqualTo(DEFAULT_LEVELS);
        assertThat(testAlcohol.getProgress()).isEqualTo(DEFAULT_PROGRESS);
        assertThat(testAlcohol.getTimer()).isEqualTo(DEFAULT_TIMER);
    }

    @Test
    @Transactional
    void createAlcoholWithExistingId() throws Exception {
        // Create the Alcohol with an existing ID
        alcohol.setId(1L);

        int databaseSizeBeforeCreate = alcoholRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAlcoholMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(alcohol)))
            .andExpect(status().isBadRequest());

        // Validate the Alcohol in the database
        List<Alcohol> alcoholList = alcoholRepository.findAll();
        assertThat(alcoholList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAlcohol() throws Exception {
        // Initialize the database
        alcoholRepository.saveAndFlush(alcohol);

        // Get all the alcoholList
        restAlcoholMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(alcohol.getId().intValue())))
            .andExpect(jsonPath("$.[*].levels").value(hasItem(DEFAULT_LEVELS)))
            .andExpect(jsonPath("$.[*].progress").value(hasItem(DEFAULT_PROGRESS)))
            .andExpect(jsonPath("$.[*].timer").value(hasItem(DEFAULT_TIMER.toString())));
    }

    @Test
    @Transactional
    void getAlcohol() throws Exception {
        // Initialize the database
        alcoholRepository.saveAndFlush(alcohol);

        // Get the alcohol
        restAlcoholMockMvc
            .perform(get(ENTITY_API_URL_ID, alcohol.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(alcohol.getId().intValue()))
            .andExpect(jsonPath("$.levels").value(DEFAULT_LEVELS))
            .andExpect(jsonPath("$.progress").value(DEFAULT_PROGRESS))
            .andExpect(jsonPath("$.timer").value(DEFAULT_TIMER.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAlcohol() throws Exception {
        // Get the alcohol
        restAlcoholMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAlcohol() throws Exception {
        // Initialize the database
        alcoholRepository.saveAndFlush(alcohol);

        int databaseSizeBeforeUpdate = alcoholRepository.findAll().size();

        // Update the alcohol
        Alcohol updatedAlcohol = alcoholRepository.findById(alcohol.getId()).get();
        // Disconnect from session so that the updates on updatedAlcohol are not directly saved in db
        em.detach(updatedAlcohol);
        updatedAlcohol.levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);

        restAlcoholMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAlcohol.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAlcohol))
            )
            .andExpect(status().isOk());

        // Validate the Alcohol in the database
        List<Alcohol> alcoholList = alcoholRepository.findAll();
        assertThat(alcoholList).hasSize(databaseSizeBeforeUpdate);
        Alcohol testAlcohol = alcoholList.get(alcoholList.size() - 1);
        assertThat(testAlcohol.getLevels()).isEqualTo(UPDATED_LEVELS);
        assertThat(testAlcohol.getProgress()).isEqualTo(UPDATED_PROGRESS);
        assertThat(testAlcohol.getTimer()).isEqualTo(UPDATED_TIMER);
    }

    @Test
    @Transactional
    void putNonExistingAlcohol() throws Exception {
        int databaseSizeBeforeUpdate = alcoholRepository.findAll().size();
        alcohol.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAlcoholMockMvc
            .perform(
                put(ENTITY_API_URL_ID, alcohol.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(alcohol))
            )
            .andExpect(status().isBadRequest());

        // Validate the Alcohol in the database
        List<Alcohol> alcoholList = alcoholRepository.findAll();
        assertThat(alcoholList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAlcohol() throws Exception {
        int databaseSizeBeforeUpdate = alcoholRepository.findAll().size();
        alcohol.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlcoholMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(alcohol))
            )
            .andExpect(status().isBadRequest());

        // Validate the Alcohol in the database
        List<Alcohol> alcoholList = alcoholRepository.findAll();
        assertThat(alcoholList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAlcohol() throws Exception {
        int databaseSizeBeforeUpdate = alcoholRepository.findAll().size();
        alcohol.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlcoholMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(alcohol)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Alcohol in the database
        List<Alcohol> alcoholList = alcoholRepository.findAll();
        assertThat(alcoholList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAlcoholWithPatch() throws Exception {
        // Initialize the database
        alcoholRepository.saveAndFlush(alcohol);

        int databaseSizeBeforeUpdate = alcoholRepository.findAll().size();

        // Update the alcohol using partial update
        Alcohol partialUpdatedAlcohol = new Alcohol();
        partialUpdatedAlcohol.setId(alcohol.getId());

        partialUpdatedAlcohol.progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);

        restAlcoholMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAlcohol.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAlcohol))
            )
            .andExpect(status().isOk());

        // Validate the Alcohol in the database
        List<Alcohol> alcoholList = alcoholRepository.findAll();
        assertThat(alcoholList).hasSize(databaseSizeBeforeUpdate);
        Alcohol testAlcohol = alcoholList.get(alcoholList.size() - 1);
        assertThat(testAlcohol.getLevels()).isEqualTo(DEFAULT_LEVELS);
        assertThat(testAlcohol.getProgress()).isEqualTo(UPDATED_PROGRESS);
        assertThat(testAlcohol.getTimer()).isEqualTo(UPDATED_TIMER);
    }

    @Test
    @Transactional
    void fullUpdateAlcoholWithPatch() throws Exception {
        // Initialize the database
        alcoholRepository.saveAndFlush(alcohol);

        int databaseSizeBeforeUpdate = alcoholRepository.findAll().size();

        // Update the alcohol using partial update
        Alcohol partialUpdatedAlcohol = new Alcohol();
        partialUpdatedAlcohol.setId(alcohol.getId());

        partialUpdatedAlcohol.levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);

        restAlcoholMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAlcohol.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAlcohol))
            )
            .andExpect(status().isOk());

        // Validate the Alcohol in the database
        List<Alcohol> alcoholList = alcoholRepository.findAll();
        assertThat(alcoholList).hasSize(databaseSizeBeforeUpdate);
        Alcohol testAlcohol = alcoholList.get(alcoholList.size() - 1);
        assertThat(testAlcohol.getLevels()).isEqualTo(UPDATED_LEVELS);
        assertThat(testAlcohol.getProgress()).isEqualTo(UPDATED_PROGRESS);
        assertThat(testAlcohol.getTimer()).isEqualTo(UPDATED_TIMER);
    }

    @Test
    @Transactional
    void patchNonExistingAlcohol() throws Exception {
        int databaseSizeBeforeUpdate = alcoholRepository.findAll().size();
        alcohol.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAlcoholMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, alcohol.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(alcohol))
            )
            .andExpect(status().isBadRequest());

        // Validate the Alcohol in the database
        List<Alcohol> alcoholList = alcoholRepository.findAll();
        assertThat(alcoholList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAlcohol() throws Exception {
        int databaseSizeBeforeUpdate = alcoholRepository.findAll().size();
        alcohol.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlcoholMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(alcohol))
            )
            .andExpect(status().isBadRequest());

        // Validate the Alcohol in the database
        List<Alcohol> alcoholList = alcoholRepository.findAll();
        assertThat(alcoholList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAlcohol() throws Exception {
        int databaseSizeBeforeUpdate = alcoholRepository.findAll().size();
        alcohol.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlcoholMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(alcohol)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Alcohol in the database
        List<Alcohol> alcoholList = alcoholRepository.findAll();
        assertThat(alcoholList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAlcohol() throws Exception {
        // Initialize the database
        alcoholRepository.saveAndFlush(alcohol);

        int databaseSizeBeforeDelete = alcoholRepository.findAll().size();

        // Delete the alcohol
        restAlcoholMockMvc
            .perform(delete(ENTITY_API_URL_ID, alcohol.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Alcohol> alcoholList = alcoholRepository.findAll();
        assertThat(alcoholList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
