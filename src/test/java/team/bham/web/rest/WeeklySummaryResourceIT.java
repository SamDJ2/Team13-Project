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
import team.bham.domain.WeeklySummary;
import team.bham.repository.WeeklySummaryRepository;

/**
 * Integration tests for the {@link WeeklySummaryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class WeeklySummaryResourceIT {

    private static final Long DEFAULT_SUMMARY_ID = 1L;
    private static final Long UPDATED_SUMMARY_ID = 2L;

    private static final String DEFAULT_SUMMARY_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_SUMMARY_TEXT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/weekly-summaries";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private WeeklySummaryRepository weeklySummaryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWeeklySummaryMockMvc;

    private WeeklySummary weeklySummary;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WeeklySummary createEntity(EntityManager em) {
        WeeklySummary weeklySummary = new WeeklySummary().summaryID(DEFAULT_SUMMARY_ID).summaryText(DEFAULT_SUMMARY_TEXT);
        return weeklySummary;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WeeklySummary createUpdatedEntity(EntityManager em) {
        WeeklySummary weeklySummary = new WeeklySummary().summaryID(UPDATED_SUMMARY_ID).summaryText(UPDATED_SUMMARY_TEXT);
        return weeklySummary;
    }

    @BeforeEach
    public void initTest() {
        weeklySummary = createEntity(em);
    }

    @Test
    @Transactional
    void createWeeklySummary() throws Exception {
        int databaseSizeBeforeCreate = weeklySummaryRepository.findAll().size();
        // Create the WeeklySummary
        restWeeklySummaryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(weeklySummary)))
            .andExpect(status().isCreated());

        // Validate the WeeklySummary in the database
        List<WeeklySummary> weeklySummaryList = weeklySummaryRepository.findAll();
        assertThat(weeklySummaryList).hasSize(databaseSizeBeforeCreate + 1);
        WeeklySummary testWeeklySummary = weeklySummaryList.get(weeklySummaryList.size() - 1);
        assertThat(testWeeklySummary.getSummaryID()).isEqualTo(DEFAULT_SUMMARY_ID);
        assertThat(testWeeklySummary.getSummaryText()).isEqualTo(DEFAULT_SUMMARY_TEXT);
    }

    @Test
    @Transactional
    void createWeeklySummaryWithExistingId() throws Exception {
        // Create the WeeklySummary with an existing ID
        weeklySummary.setId(1L);

        int databaseSizeBeforeCreate = weeklySummaryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restWeeklySummaryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(weeklySummary)))
            .andExpect(status().isBadRequest());

        // Validate the WeeklySummary in the database
        List<WeeklySummary> weeklySummaryList = weeklySummaryRepository.findAll();
        assertThat(weeklySummaryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllWeeklySummaries() throws Exception {
        // Initialize the database
        weeklySummaryRepository.saveAndFlush(weeklySummary);

        // Get all the weeklySummaryList
        restWeeklySummaryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(weeklySummary.getId().intValue())))
            .andExpect(jsonPath("$.[*].summaryID").value(hasItem(DEFAULT_SUMMARY_ID.intValue())))
            .andExpect(jsonPath("$.[*].summaryText").value(hasItem(DEFAULT_SUMMARY_TEXT)));
    }

    @Test
    @Transactional
    void getWeeklySummary() throws Exception {
        // Initialize the database
        weeklySummaryRepository.saveAndFlush(weeklySummary);

        // Get the weeklySummary
        restWeeklySummaryMockMvc
            .perform(get(ENTITY_API_URL_ID, weeklySummary.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(weeklySummary.getId().intValue()))
            .andExpect(jsonPath("$.summaryID").value(DEFAULT_SUMMARY_ID.intValue()))
            .andExpect(jsonPath("$.summaryText").value(DEFAULT_SUMMARY_TEXT));
    }

    @Test
    @Transactional
    void getNonExistingWeeklySummary() throws Exception {
        // Get the weeklySummary
        restWeeklySummaryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingWeeklySummary() throws Exception {
        // Initialize the database
        weeklySummaryRepository.saveAndFlush(weeklySummary);

        int databaseSizeBeforeUpdate = weeklySummaryRepository.findAll().size();

        // Update the weeklySummary
        WeeklySummary updatedWeeklySummary = weeklySummaryRepository.findById(weeklySummary.getId()).get();
        // Disconnect from session so that the updates on updatedWeeklySummary are not directly saved in db
        em.detach(updatedWeeklySummary);
        updatedWeeklySummary.summaryID(UPDATED_SUMMARY_ID).summaryText(UPDATED_SUMMARY_TEXT);

        restWeeklySummaryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedWeeklySummary.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedWeeklySummary))
            )
            .andExpect(status().isOk());

        // Validate the WeeklySummary in the database
        List<WeeklySummary> weeklySummaryList = weeklySummaryRepository.findAll();
        assertThat(weeklySummaryList).hasSize(databaseSizeBeforeUpdate);
        WeeklySummary testWeeklySummary = weeklySummaryList.get(weeklySummaryList.size() - 1);
        assertThat(testWeeklySummary.getSummaryID()).isEqualTo(UPDATED_SUMMARY_ID);
        assertThat(testWeeklySummary.getSummaryText()).isEqualTo(UPDATED_SUMMARY_TEXT);
    }

    @Test
    @Transactional
    void putNonExistingWeeklySummary() throws Exception {
        int databaseSizeBeforeUpdate = weeklySummaryRepository.findAll().size();
        weeklySummary.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWeeklySummaryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, weeklySummary.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(weeklySummary))
            )
            .andExpect(status().isBadRequest());

        // Validate the WeeklySummary in the database
        List<WeeklySummary> weeklySummaryList = weeklySummaryRepository.findAll();
        assertThat(weeklySummaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchWeeklySummary() throws Exception {
        int databaseSizeBeforeUpdate = weeklySummaryRepository.findAll().size();
        weeklySummary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWeeklySummaryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(weeklySummary))
            )
            .andExpect(status().isBadRequest());

        // Validate the WeeklySummary in the database
        List<WeeklySummary> weeklySummaryList = weeklySummaryRepository.findAll();
        assertThat(weeklySummaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamWeeklySummary() throws Exception {
        int databaseSizeBeforeUpdate = weeklySummaryRepository.findAll().size();
        weeklySummary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWeeklySummaryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(weeklySummary)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the WeeklySummary in the database
        List<WeeklySummary> weeklySummaryList = weeklySummaryRepository.findAll();
        assertThat(weeklySummaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateWeeklySummaryWithPatch() throws Exception {
        // Initialize the database
        weeklySummaryRepository.saveAndFlush(weeklySummary);

        int databaseSizeBeforeUpdate = weeklySummaryRepository.findAll().size();

        // Update the weeklySummary using partial update
        WeeklySummary partialUpdatedWeeklySummary = new WeeklySummary();
        partialUpdatedWeeklySummary.setId(weeklySummary.getId());

        partialUpdatedWeeklySummary.summaryText(UPDATED_SUMMARY_TEXT);

        restWeeklySummaryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWeeklySummary.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWeeklySummary))
            )
            .andExpect(status().isOk());

        // Validate the WeeklySummary in the database
        List<WeeklySummary> weeklySummaryList = weeklySummaryRepository.findAll();
        assertThat(weeklySummaryList).hasSize(databaseSizeBeforeUpdate);
        WeeklySummary testWeeklySummary = weeklySummaryList.get(weeklySummaryList.size() - 1);
        assertThat(testWeeklySummary.getSummaryID()).isEqualTo(DEFAULT_SUMMARY_ID);
        assertThat(testWeeklySummary.getSummaryText()).isEqualTo(UPDATED_SUMMARY_TEXT);
    }

    @Test
    @Transactional
    void fullUpdateWeeklySummaryWithPatch() throws Exception {
        // Initialize the database
        weeklySummaryRepository.saveAndFlush(weeklySummary);

        int databaseSizeBeforeUpdate = weeklySummaryRepository.findAll().size();

        // Update the weeklySummary using partial update
        WeeklySummary partialUpdatedWeeklySummary = new WeeklySummary();
        partialUpdatedWeeklySummary.setId(weeklySummary.getId());

        partialUpdatedWeeklySummary.summaryID(UPDATED_SUMMARY_ID).summaryText(UPDATED_SUMMARY_TEXT);

        restWeeklySummaryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWeeklySummary.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWeeklySummary))
            )
            .andExpect(status().isOk());

        // Validate the WeeklySummary in the database
        List<WeeklySummary> weeklySummaryList = weeklySummaryRepository.findAll();
        assertThat(weeklySummaryList).hasSize(databaseSizeBeforeUpdate);
        WeeklySummary testWeeklySummary = weeklySummaryList.get(weeklySummaryList.size() - 1);
        assertThat(testWeeklySummary.getSummaryID()).isEqualTo(UPDATED_SUMMARY_ID);
        assertThat(testWeeklySummary.getSummaryText()).isEqualTo(UPDATED_SUMMARY_TEXT);
    }

    @Test
    @Transactional
    void patchNonExistingWeeklySummary() throws Exception {
        int databaseSizeBeforeUpdate = weeklySummaryRepository.findAll().size();
        weeklySummary.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWeeklySummaryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, weeklySummary.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(weeklySummary))
            )
            .andExpect(status().isBadRequest());

        // Validate the WeeklySummary in the database
        List<WeeklySummary> weeklySummaryList = weeklySummaryRepository.findAll();
        assertThat(weeklySummaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchWeeklySummary() throws Exception {
        int databaseSizeBeforeUpdate = weeklySummaryRepository.findAll().size();
        weeklySummary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWeeklySummaryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(weeklySummary))
            )
            .andExpect(status().isBadRequest());

        // Validate the WeeklySummary in the database
        List<WeeklySummary> weeklySummaryList = weeklySummaryRepository.findAll();
        assertThat(weeklySummaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamWeeklySummary() throws Exception {
        int databaseSizeBeforeUpdate = weeklySummaryRepository.findAll().size();
        weeklySummary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWeeklySummaryMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(weeklySummary))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the WeeklySummary in the database
        List<WeeklySummary> weeklySummaryList = weeklySummaryRepository.findAll();
        assertThat(weeklySummaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteWeeklySummary() throws Exception {
        // Initialize the database
        weeklySummaryRepository.saveAndFlush(weeklySummary);

        int databaseSizeBeforeDelete = weeklySummaryRepository.findAll().size();

        // Delete the weeklySummary
        restWeeklySummaryMockMvc
            .perform(delete(ENTITY_API_URL_ID, weeklySummary.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<WeeklySummary> weeklySummaryList = weeklySummaryRepository.findAll();
        assertThat(weeklySummaryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
