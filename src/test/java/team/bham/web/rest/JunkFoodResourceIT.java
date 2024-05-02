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
import team.bham.domain.JunkFood;
import team.bham.repository.JunkFoodRepository;

/**
 * Integration tests for the {@link JunkFoodResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class JunkFoodResourceIT {

    private static final String DEFAULT_LEVELS = "AAAAAAAAAA";
    private static final String UPDATED_LEVELS = "BBBBBBBBBB";

    private static final String DEFAULT_PROGRESS = "AAAAAAAAAA";
    private static final String UPDATED_PROGRESS = "BBBBBBBBBB";

    private static final Duration DEFAULT_TIMER = Duration.ofHours(6);
    private static final Duration UPDATED_TIMER = Duration.ofHours(12);

    private static final String ENTITY_API_URL = "/api/junk-foods";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private JunkFoodRepository junkFoodRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restJunkFoodMockMvc;

    private JunkFood junkFood;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JunkFood createEntity(EntityManager em) {
        JunkFood junkFood = new JunkFood().levels(DEFAULT_LEVELS).progress(DEFAULT_PROGRESS).timer(DEFAULT_TIMER);
        return junkFood;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JunkFood createUpdatedEntity(EntityManager em) {
        JunkFood junkFood = new JunkFood().levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);
        return junkFood;
    }

    @BeforeEach
    public void initTest() {
        junkFood = createEntity(em);
    }

    @Test
    @Transactional
    void createJunkFood() throws Exception {
        int databaseSizeBeforeCreate = junkFoodRepository.findAll().size();
        // Create the JunkFood
        restJunkFoodMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(junkFood)))
            .andExpect(status().isCreated());

        // Validate the JunkFood in the database
        List<JunkFood> junkFoodList = junkFoodRepository.findAll();
        assertThat(junkFoodList).hasSize(databaseSizeBeforeCreate + 1);
        JunkFood testJunkFood = junkFoodList.get(junkFoodList.size() - 1);
        assertThat(testJunkFood.getLevels()).isEqualTo(DEFAULT_LEVELS);
        assertThat(testJunkFood.getProgress()).isEqualTo(DEFAULT_PROGRESS);
        assertThat(testJunkFood.getTimer()).isEqualTo(DEFAULT_TIMER);
    }

    @Test
    @Transactional
    void createJunkFoodWithExistingId() throws Exception {
        // Create the JunkFood with an existing ID
        junkFood.setId(1L);

        int databaseSizeBeforeCreate = junkFoodRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restJunkFoodMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(junkFood)))
            .andExpect(status().isBadRequest());

        // Validate the JunkFood in the database
        List<JunkFood> junkFoodList = junkFoodRepository.findAll();
        assertThat(junkFoodList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllJunkFoods() throws Exception {
        // Initialize the database
        junkFoodRepository.saveAndFlush(junkFood);

        // Get all the junkFoodList
        restJunkFoodMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(junkFood.getId().intValue())))
            .andExpect(jsonPath("$.[*].levels").value(hasItem(DEFAULT_LEVELS)))
            .andExpect(jsonPath("$.[*].progress").value(hasItem(DEFAULT_PROGRESS)))
            .andExpect(jsonPath("$.[*].timer").value(hasItem(DEFAULT_TIMER.toString())));
    }

    @Test
    @Transactional
    void getJunkFood() throws Exception {
        // Initialize the database
        junkFoodRepository.saveAndFlush(junkFood);

        // Get the junkFood
        restJunkFoodMockMvc
            .perform(get(ENTITY_API_URL_ID, junkFood.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(junkFood.getId().intValue()))
            .andExpect(jsonPath("$.levels").value(DEFAULT_LEVELS))
            .andExpect(jsonPath("$.progress").value(DEFAULT_PROGRESS))
            .andExpect(jsonPath("$.timer").value(DEFAULT_TIMER.toString()));
    }

    @Test
    @Transactional
    void getNonExistingJunkFood() throws Exception {
        // Get the junkFood
        restJunkFoodMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingJunkFood() throws Exception {
        // Initialize the database
        junkFoodRepository.saveAndFlush(junkFood);

        int databaseSizeBeforeUpdate = junkFoodRepository.findAll().size();

        // Update the junkFood
        JunkFood updatedJunkFood = junkFoodRepository.findById(junkFood.getId()).get();
        // Disconnect from session so that the updates on updatedJunkFood are not directly saved in db
        em.detach(updatedJunkFood);
        updatedJunkFood.levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);

        restJunkFoodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedJunkFood.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedJunkFood))
            )
            .andExpect(status().isOk());

        // Validate the JunkFood in the database
        List<JunkFood> junkFoodList = junkFoodRepository.findAll();
        assertThat(junkFoodList).hasSize(databaseSizeBeforeUpdate);
        JunkFood testJunkFood = junkFoodList.get(junkFoodList.size() - 1);
        assertThat(testJunkFood.getLevels()).isEqualTo(UPDATED_LEVELS);
        assertThat(testJunkFood.getProgress()).isEqualTo(UPDATED_PROGRESS);
        assertThat(testJunkFood.getTimer()).isEqualTo(UPDATED_TIMER);
    }

    @Test
    @Transactional
    void putNonExistingJunkFood() throws Exception {
        int databaseSizeBeforeUpdate = junkFoodRepository.findAll().size();
        junkFood.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJunkFoodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, junkFood.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(junkFood))
            )
            .andExpect(status().isBadRequest());

        // Validate the JunkFood in the database
        List<JunkFood> junkFoodList = junkFoodRepository.findAll();
        assertThat(junkFoodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchJunkFood() throws Exception {
        int databaseSizeBeforeUpdate = junkFoodRepository.findAll().size();
        junkFood.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJunkFoodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(junkFood))
            )
            .andExpect(status().isBadRequest());

        // Validate the JunkFood in the database
        List<JunkFood> junkFoodList = junkFoodRepository.findAll();
        assertThat(junkFoodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamJunkFood() throws Exception {
        int databaseSizeBeforeUpdate = junkFoodRepository.findAll().size();
        junkFood.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJunkFoodMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(junkFood)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the JunkFood in the database
        List<JunkFood> junkFoodList = junkFoodRepository.findAll();
        assertThat(junkFoodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateJunkFoodWithPatch() throws Exception {
        // Initialize the database
        junkFoodRepository.saveAndFlush(junkFood);

        int databaseSizeBeforeUpdate = junkFoodRepository.findAll().size();

        // Update the junkFood using partial update
        JunkFood partialUpdatedJunkFood = new JunkFood();
        partialUpdatedJunkFood.setId(junkFood.getId());

        partialUpdatedJunkFood.levels(UPDATED_LEVELS).timer(UPDATED_TIMER);

        restJunkFoodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJunkFood.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJunkFood))
            )
            .andExpect(status().isOk());

        // Validate the JunkFood in the database
        List<JunkFood> junkFoodList = junkFoodRepository.findAll();
        assertThat(junkFoodList).hasSize(databaseSizeBeforeUpdate);
        JunkFood testJunkFood = junkFoodList.get(junkFoodList.size() - 1);
        assertThat(testJunkFood.getLevels()).isEqualTo(UPDATED_LEVELS);
        assertThat(testJunkFood.getProgress()).isEqualTo(DEFAULT_PROGRESS);
        assertThat(testJunkFood.getTimer()).isEqualTo(UPDATED_TIMER);
    }

    @Test
    @Transactional
    void fullUpdateJunkFoodWithPatch() throws Exception {
        // Initialize the database
        junkFoodRepository.saveAndFlush(junkFood);

        int databaseSizeBeforeUpdate = junkFoodRepository.findAll().size();

        // Update the junkFood using partial update
        JunkFood partialUpdatedJunkFood = new JunkFood();
        partialUpdatedJunkFood.setId(junkFood.getId());

        partialUpdatedJunkFood.levels(UPDATED_LEVELS).progress(UPDATED_PROGRESS).timer(UPDATED_TIMER);

        restJunkFoodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJunkFood.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJunkFood))
            )
            .andExpect(status().isOk());

        // Validate the JunkFood in the database
        List<JunkFood> junkFoodList = junkFoodRepository.findAll();
        assertThat(junkFoodList).hasSize(databaseSizeBeforeUpdate);
        JunkFood testJunkFood = junkFoodList.get(junkFoodList.size() - 1);
        assertThat(testJunkFood.getLevels()).isEqualTo(UPDATED_LEVELS);
        assertThat(testJunkFood.getProgress()).isEqualTo(UPDATED_PROGRESS);
        assertThat(testJunkFood.getTimer()).isEqualTo(UPDATED_TIMER);
    }

    @Test
    @Transactional
    void patchNonExistingJunkFood() throws Exception {
        int databaseSizeBeforeUpdate = junkFoodRepository.findAll().size();
        junkFood.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJunkFoodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, junkFood.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(junkFood))
            )
            .andExpect(status().isBadRequest());

        // Validate the JunkFood in the database
        List<JunkFood> junkFoodList = junkFoodRepository.findAll();
        assertThat(junkFoodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchJunkFood() throws Exception {
        int databaseSizeBeforeUpdate = junkFoodRepository.findAll().size();
        junkFood.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJunkFoodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(junkFood))
            )
            .andExpect(status().isBadRequest());

        // Validate the JunkFood in the database
        List<JunkFood> junkFoodList = junkFoodRepository.findAll();
        assertThat(junkFoodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamJunkFood() throws Exception {
        int databaseSizeBeforeUpdate = junkFoodRepository.findAll().size();
        junkFood.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJunkFoodMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(junkFood)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the JunkFood in the database
        List<JunkFood> junkFoodList = junkFoodRepository.findAll();
        assertThat(junkFoodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteJunkFood() throws Exception {
        // Initialize the database
        junkFoodRepository.saveAndFlush(junkFood);

        int databaseSizeBeforeDelete = junkFoodRepository.findAll().size();

        // Delete the junkFood
        restJunkFoodMockMvc
            .perform(delete(ENTITY_API_URL_ID, junkFood.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<JunkFood> junkFoodList = junkFoodRepository.findAll();
        assertThat(junkFoodList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
