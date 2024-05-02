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
import team.bham.domain.PromptsFeature;
import team.bham.repository.PromptsFeatureRepository;

/**
 * Integration tests for the {@link PromptsFeatureResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PromptsFeatureResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_PROMPT = "AAAAAAAAAA";
    private static final String UPDATED_PROMPT = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/prompts-features";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PromptsFeatureRepository promptsFeatureRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPromptsFeatureMockMvc;

    private PromptsFeature promptsFeature;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PromptsFeature createEntity(EntityManager em) {
        PromptsFeature promptsFeature = new PromptsFeature()
            .title(DEFAULT_TITLE)
            .prompt(DEFAULT_PROMPT)
            .content(DEFAULT_CONTENT)
            .date(DEFAULT_DATE);
        return promptsFeature;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PromptsFeature createUpdatedEntity(EntityManager em) {
        PromptsFeature promptsFeature = new PromptsFeature()
            .title(UPDATED_TITLE)
            .prompt(UPDATED_PROMPT)
            .content(UPDATED_CONTENT)
            .date(UPDATED_DATE);
        return promptsFeature;
    }

    @BeforeEach
    public void initTest() {
        promptsFeature = createEntity(em);
    }

    @Test
    @Transactional
    void createPromptsFeature() throws Exception {
        int databaseSizeBeforeCreate = promptsFeatureRepository.findAll().size();
        // Create the PromptsFeature
        restPromptsFeatureMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(promptsFeature))
            )
            .andExpect(status().isCreated());

        // Validate the PromptsFeature in the database
        List<PromptsFeature> promptsFeatureList = promptsFeatureRepository.findAll();
        assertThat(promptsFeatureList).hasSize(databaseSizeBeforeCreate + 1);
        PromptsFeature testPromptsFeature = promptsFeatureList.get(promptsFeatureList.size() - 1);
        assertThat(testPromptsFeature.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testPromptsFeature.getPrompt()).isEqualTo(DEFAULT_PROMPT);
        assertThat(testPromptsFeature.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testPromptsFeature.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createPromptsFeatureWithExistingId() throws Exception {
        // Create the PromptsFeature with an existing ID
        promptsFeature.setId(1L);

        int databaseSizeBeforeCreate = promptsFeatureRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPromptsFeatureMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(promptsFeature))
            )
            .andExpect(status().isBadRequest());

        // Validate the PromptsFeature in the database
        List<PromptsFeature> promptsFeatureList = promptsFeatureRepository.findAll();
        assertThat(promptsFeatureList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPromptsFeatures() throws Exception {
        // Initialize the database
        promptsFeatureRepository.saveAndFlush(promptsFeature);

        // Get all the promptsFeatureList
        restPromptsFeatureMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(promptsFeature.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].prompt").value(hasItem(DEFAULT_PROMPT)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getPromptsFeature() throws Exception {
        // Initialize the database
        promptsFeatureRepository.saveAndFlush(promptsFeature);

        // Get the promptsFeature
        restPromptsFeatureMockMvc
            .perform(get(ENTITY_API_URL_ID, promptsFeature.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(promptsFeature.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.prompt").value(DEFAULT_PROMPT))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPromptsFeature() throws Exception {
        // Get the promptsFeature
        restPromptsFeatureMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPromptsFeature() throws Exception {
        // Initialize the database
        promptsFeatureRepository.saveAndFlush(promptsFeature);

        int databaseSizeBeforeUpdate = promptsFeatureRepository.findAll().size();

        // Update the promptsFeature
        PromptsFeature updatedPromptsFeature = promptsFeatureRepository.findById(promptsFeature.getId()).get();
        // Disconnect from session so that the updates on updatedPromptsFeature are not directly saved in db
        em.detach(updatedPromptsFeature);
        updatedPromptsFeature.title(UPDATED_TITLE).prompt(UPDATED_PROMPT).content(UPDATED_CONTENT).date(UPDATED_DATE);

        restPromptsFeatureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPromptsFeature.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPromptsFeature))
            )
            .andExpect(status().isOk());

        // Validate the PromptsFeature in the database
        List<PromptsFeature> promptsFeatureList = promptsFeatureRepository.findAll();
        assertThat(promptsFeatureList).hasSize(databaseSizeBeforeUpdate);
        PromptsFeature testPromptsFeature = promptsFeatureList.get(promptsFeatureList.size() - 1);
        assertThat(testPromptsFeature.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testPromptsFeature.getPrompt()).isEqualTo(UPDATED_PROMPT);
        assertThat(testPromptsFeature.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testPromptsFeature.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingPromptsFeature() throws Exception {
        int databaseSizeBeforeUpdate = promptsFeatureRepository.findAll().size();
        promptsFeature.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPromptsFeatureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, promptsFeature.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(promptsFeature))
            )
            .andExpect(status().isBadRequest());

        // Validate the PromptsFeature in the database
        List<PromptsFeature> promptsFeatureList = promptsFeatureRepository.findAll();
        assertThat(promptsFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPromptsFeature() throws Exception {
        int databaseSizeBeforeUpdate = promptsFeatureRepository.findAll().size();
        promptsFeature.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPromptsFeatureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(promptsFeature))
            )
            .andExpect(status().isBadRequest());

        // Validate the PromptsFeature in the database
        List<PromptsFeature> promptsFeatureList = promptsFeatureRepository.findAll();
        assertThat(promptsFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPromptsFeature() throws Exception {
        int databaseSizeBeforeUpdate = promptsFeatureRepository.findAll().size();
        promptsFeature.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPromptsFeatureMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(promptsFeature)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PromptsFeature in the database
        List<PromptsFeature> promptsFeatureList = promptsFeatureRepository.findAll();
        assertThat(promptsFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePromptsFeatureWithPatch() throws Exception {
        // Initialize the database
        promptsFeatureRepository.saveAndFlush(promptsFeature);

        int databaseSizeBeforeUpdate = promptsFeatureRepository.findAll().size();

        // Update the promptsFeature using partial update
        PromptsFeature partialUpdatedPromptsFeature = new PromptsFeature();
        partialUpdatedPromptsFeature.setId(promptsFeature.getId());

        partialUpdatedPromptsFeature.date(UPDATED_DATE);

        restPromptsFeatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPromptsFeature.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPromptsFeature))
            )
            .andExpect(status().isOk());

        // Validate the PromptsFeature in the database
        List<PromptsFeature> promptsFeatureList = promptsFeatureRepository.findAll();
        assertThat(promptsFeatureList).hasSize(databaseSizeBeforeUpdate);
        PromptsFeature testPromptsFeature = promptsFeatureList.get(promptsFeatureList.size() - 1);
        assertThat(testPromptsFeature.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testPromptsFeature.getPrompt()).isEqualTo(DEFAULT_PROMPT);
        assertThat(testPromptsFeature.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testPromptsFeature.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdatePromptsFeatureWithPatch() throws Exception {
        // Initialize the database
        promptsFeatureRepository.saveAndFlush(promptsFeature);

        int databaseSizeBeforeUpdate = promptsFeatureRepository.findAll().size();

        // Update the promptsFeature using partial update
        PromptsFeature partialUpdatedPromptsFeature = new PromptsFeature();
        partialUpdatedPromptsFeature.setId(promptsFeature.getId());

        partialUpdatedPromptsFeature.title(UPDATED_TITLE).prompt(UPDATED_PROMPT).content(UPDATED_CONTENT).date(UPDATED_DATE);

        restPromptsFeatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPromptsFeature.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPromptsFeature))
            )
            .andExpect(status().isOk());

        // Validate the PromptsFeature in the database
        List<PromptsFeature> promptsFeatureList = promptsFeatureRepository.findAll();
        assertThat(promptsFeatureList).hasSize(databaseSizeBeforeUpdate);
        PromptsFeature testPromptsFeature = promptsFeatureList.get(promptsFeatureList.size() - 1);
        assertThat(testPromptsFeature.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testPromptsFeature.getPrompt()).isEqualTo(UPDATED_PROMPT);
        assertThat(testPromptsFeature.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testPromptsFeature.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingPromptsFeature() throws Exception {
        int databaseSizeBeforeUpdate = promptsFeatureRepository.findAll().size();
        promptsFeature.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPromptsFeatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, promptsFeature.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(promptsFeature))
            )
            .andExpect(status().isBadRequest());

        // Validate the PromptsFeature in the database
        List<PromptsFeature> promptsFeatureList = promptsFeatureRepository.findAll();
        assertThat(promptsFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPromptsFeature() throws Exception {
        int databaseSizeBeforeUpdate = promptsFeatureRepository.findAll().size();
        promptsFeature.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPromptsFeatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(promptsFeature))
            )
            .andExpect(status().isBadRequest());

        // Validate the PromptsFeature in the database
        List<PromptsFeature> promptsFeatureList = promptsFeatureRepository.findAll();
        assertThat(promptsFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPromptsFeature() throws Exception {
        int databaseSizeBeforeUpdate = promptsFeatureRepository.findAll().size();
        promptsFeature.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPromptsFeatureMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(promptsFeature))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PromptsFeature in the database
        List<PromptsFeature> promptsFeatureList = promptsFeatureRepository.findAll();
        assertThat(promptsFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePromptsFeature() throws Exception {
        // Initialize the database
        promptsFeatureRepository.saveAndFlush(promptsFeature);

        int databaseSizeBeforeDelete = promptsFeatureRepository.findAll().size();

        // Delete the promptsFeature
        restPromptsFeatureMockMvc
            .perform(delete(ENTITY_API_URL_ID, promptsFeature.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PromptsFeature> promptsFeatureList = promptsFeatureRepository.findAll();
        assertThat(promptsFeatureList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
