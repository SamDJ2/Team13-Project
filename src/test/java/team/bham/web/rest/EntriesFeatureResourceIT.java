package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
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
import team.bham.domain.EntriesFeature;
import team.bham.repository.EntriesFeatureRepository;

/**
 * Integration tests for the {@link EntriesFeatureResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EntriesFeatureResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/entries-features";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EntriesFeatureRepository entriesFeatureRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEntriesFeatureMockMvc;

    private EntriesFeature entriesFeature;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EntriesFeature createEntity(EntityManager em) {
        EntriesFeature entriesFeature = new EntriesFeature().title(DEFAULT_TITLE).content(DEFAULT_CONTENT).date(DEFAULT_DATE);
        return entriesFeature;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EntriesFeature createUpdatedEntity(EntityManager em) {
        EntriesFeature entriesFeature = new EntriesFeature().title(UPDATED_TITLE).content(UPDATED_CONTENT).date(UPDATED_DATE);
        return entriesFeature;
    }

    @BeforeEach
    public void initTest() {
        entriesFeature = createEntity(em);
    }

    @Test
    @Transactional
    void createEntriesFeature() throws Exception {
        int databaseSizeBeforeCreate = entriesFeatureRepository.findAll().size();
        // Create the EntriesFeature
        restEntriesFeatureMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(entriesFeature))
            )
            .andExpect(status().isCreated());

        // Validate the EntriesFeature in the database
        List<EntriesFeature> entriesFeatureList = entriesFeatureRepository.findAll();
        assertThat(entriesFeatureList).hasSize(databaseSizeBeforeCreate + 1);
        EntriesFeature testEntriesFeature = entriesFeatureList.get(entriesFeatureList.size() - 1);
        assertThat(testEntriesFeature.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testEntriesFeature.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testEntriesFeature.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createEntriesFeatureWithExistingId() throws Exception {
        // Create the EntriesFeature with an existing ID
        entriesFeature.setId(1L);

        int databaseSizeBeforeCreate = entriesFeatureRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEntriesFeatureMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(entriesFeature))
            )
            .andExpect(status().isBadRequest());

        // Validate the EntriesFeature in the database
        List<EntriesFeature> entriesFeatureList = entriesFeatureRepository.findAll();
        assertThat(entriesFeatureList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEntriesFeatures() throws Exception {
        // Initialize the database
        entriesFeatureRepository.saveAndFlush(entriesFeature);

        // Get all the entriesFeatureList
        restEntriesFeatureMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(entriesFeature.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getEntriesFeature() throws Exception {
        // Initialize the database
        entriesFeatureRepository.saveAndFlush(entriesFeature);

        // Get the entriesFeature
        restEntriesFeatureMockMvc
            .perform(get(ENTITY_API_URL_ID, entriesFeature.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(entriesFeature.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingEntriesFeature() throws Exception {
        // Get the entriesFeature
        restEntriesFeatureMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEntriesFeature() throws Exception {
        // Initialize the database
        entriesFeatureRepository.saveAndFlush(entriesFeature);

        int databaseSizeBeforeUpdate = entriesFeatureRepository.findAll().size();

        // Update the entriesFeature
        EntriesFeature updatedEntriesFeature = entriesFeatureRepository.findById(entriesFeature.getId()).get();
        // Disconnect from session so that the updates on updatedEntriesFeature are not directly saved in db
        em.detach(updatedEntriesFeature);
        updatedEntriesFeature.title(UPDATED_TITLE).content(UPDATED_CONTENT).date(UPDATED_DATE);

        restEntriesFeatureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEntriesFeature.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEntriesFeature))
            )
            .andExpect(status().isOk());

        // Validate the EntriesFeature in the database
        List<EntriesFeature> entriesFeatureList = entriesFeatureRepository.findAll();
        assertThat(entriesFeatureList).hasSize(databaseSizeBeforeUpdate);
        EntriesFeature testEntriesFeature = entriesFeatureList.get(entriesFeatureList.size() - 1);
        assertThat(testEntriesFeature.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testEntriesFeature.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testEntriesFeature.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingEntriesFeature() throws Exception {
        int databaseSizeBeforeUpdate = entriesFeatureRepository.findAll().size();
        entriesFeature.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEntriesFeatureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, entriesFeature.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(entriesFeature))
            )
            .andExpect(status().isBadRequest());

        // Validate the EntriesFeature in the database
        List<EntriesFeature> entriesFeatureList = entriesFeatureRepository.findAll();
        assertThat(entriesFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEntriesFeature() throws Exception {
        int databaseSizeBeforeUpdate = entriesFeatureRepository.findAll().size();
        entriesFeature.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEntriesFeatureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(entriesFeature))
            )
            .andExpect(status().isBadRequest());

        // Validate the EntriesFeature in the database
        List<EntriesFeature> entriesFeatureList = entriesFeatureRepository.findAll();
        assertThat(entriesFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEntriesFeature() throws Exception {
        int databaseSizeBeforeUpdate = entriesFeatureRepository.findAll().size();
        entriesFeature.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEntriesFeatureMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(entriesFeature)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EntriesFeature in the database
        List<EntriesFeature> entriesFeatureList = entriesFeatureRepository.findAll();
        assertThat(entriesFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEntriesFeatureWithPatch() throws Exception {
        // Initialize the database
        entriesFeatureRepository.saveAndFlush(entriesFeature);

        int databaseSizeBeforeUpdate = entriesFeatureRepository.findAll().size();

        // Update the entriesFeature using partial update
        EntriesFeature partialUpdatedEntriesFeature = new EntriesFeature();
        partialUpdatedEntriesFeature.setId(entriesFeature.getId());

        partialUpdatedEntriesFeature.content(UPDATED_CONTENT);

        restEntriesFeatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEntriesFeature.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEntriesFeature))
            )
            .andExpect(status().isOk());

        // Validate the EntriesFeature in the database
        List<EntriesFeature> entriesFeatureList = entriesFeatureRepository.findAll();
        assertThat(entriesFeatureList).hasSize(databaseSizeBeforeUpdate);
        EntriesFeature testEntriesFeature = entriesFeatureList.get(entriesFeatureList.size() - 1);
        assertThat(testEntriesFeature.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testEntriesFeature.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testEntriesFeature.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateEntriesFeatureWithPatch() throws Exception {
        // Initialize the database
        entriesFeatureRepository.saveAndFlush(entriesFeature);

        int databaseSizeBeforeUpdate = entriesFeatureRepository.findAll().size();

        // Update the entriesFeature using partial update
        EntriesFeature partialUpdatedEntriesFeature = new EntriesFeature();
        partialUpdatedEntriesFeature.setId(entriesFeature.getId());

        partialUpdatedEntriesFeature.title(UPDATED_TITLE).content(UPDATED_CONTENT).date(UPDATED_DATE);

        restEntriesFeatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEntriesFeature.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEntriesFeature))
            )
            .andExpect(status().isOk());

        // Validate the EntriesFeature in the database
        List<EntriesFeature> entriesFeatureList = entriesFeatureRepository.findAll();
        assertThat(entriesFeatureList).hasSize(databaseSizeBeforeUpdate);
        EntriesFeature testEntriesFeature = entriesFeatureList.get(entriesFeatureList.size() - 1);
        assertThat(testEntriesFeature.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testEntriesFeature.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testEntriesFeature.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingEntriesFeature() throws Exception {
        int databaseSizeBeforeUpdate = entriesFeatureRepository.findAll().size();
        entriesFeature.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEntriesFeatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, entriesFeature.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(entriesFeature))
            )
            .andExpect(status().isBadRequest());

        // Validate the EntriesFeature in the database
        List<EntriesFeature> entriesFeatureList = entriesFeatureRepository.findAll();
        assertThat(entriesFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEntriesFeature() throws Exception {
        int databaseSizeBeforeUpdate = entriesFeatureRepository.findAll().size();
        entriesFeature.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEntriesFeatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(entriesFeature))
            )
            .andExpect(status().isBadRequest());

        // Validate the EntriesFeature in the database
        List<EntriesFeature> entriesFeatureList = entriesFeatureRepository.findAll();
        assertThat(entriesFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEntriesFeature() throws Exception {
        int databaseSizeBeforeUpdate = entriesFeatureRepository.findAll().size();
        entriesFeature.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEntriesFeatureMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(entriesFeature))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EntriesFeature in the database
        List<EntriesFeature> entriesFeatureList = entriesFeatureRepository.findAll();
        assertThat(entriesFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEntriesFeature() throws Exception {
        // Initialize the database
        entriesFeatureRepository.saveAndFlush(entriesFeature);

        int databaseSizeBeforeDelete = entriesFeatureRepository.findAll().size();

        // Delete the entriesFeature
        restEntriesFeatureMockMvc
            .perform(delete(ENTITY_API_URL_ID, entriesFeature.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EntriesFeature> entriesFeatureList = entriesFeatureRepository.findAll();
        assertThat(entriesFeatureList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
