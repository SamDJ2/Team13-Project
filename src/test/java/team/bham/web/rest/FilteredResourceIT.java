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
import team.bham.domain.Filtered;
import team.bham.repository.FilteredRepository;

/**
 * Integration tests for the {@link FilteredResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FilteredResourceIT {

    private static final String DEFAULT_SEARCH = "AAAAAAAAAA";
    private static final String UPDATED_SEARCH = "BBBBBBBBBB";

    private static final String DEFAULT_RESULTS = "AAAAAAAAAA";
    private static final String UPDATED_RESULTS = "BBBBBBBBBB";

    private static final Boolean DEFAULT_FILTERING = false;
    private static final Boolean UPDATED_FILTERING = true;

    private static final String ENTITY_API_URL = "/api/filtereds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FilteredRepository filteredRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFilteredMockMvc;

    private Filtered filtered;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Filtered createEntity(EntityManager em) {
        Filtered filtered = new Filtered().search(DEFAULT_SEARCH).results(DEFAULT_RESULTS).filtering(DEFAULT_FILTERING);
        return filtered;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Filtered createUpdatedEntity(EntityManager em) {
        Filtered filtered = new Filtered().search(UPDATED_SEARCH).results(UPDATED_RESULTS).filtering(UPDATED_FILTERING);
        return filtered;
    }

    @BeforeEach
    public void initTest() {
        filtered = createEntity(em);
    }

    @Test
    @Transactional
    void createFiltered() throws Exception {
        int databaseSizeBeforeCreate = filteredRepository.findAll().size();
        // Create the Filtered
        restFilteredMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(filtered)))
            .andExpect(status().isCreated());

        // Validate the Filtered in the database
        List<Filtered> filteredList = filteredRepository.findAll();
        assertThat(filteredList).hasSize(databaseSizeBeforeCreate + 1);
        Filtered testFiltered = filteredList.get(filteredList.size() - 1);
        assertThat(testFiltered.getSearch()).isEqualTo(DEFAULT_SEARCH);
        assertThat(testFiltered.getResults()).isEqualTo(DEFAULT_RESULTS);
        assertThat(testFiltered.getFiltering()).isEqualTo(DEFAULT_FILTERING);
    }

    @Test
    @Transactional
    void createFilteredWithExistingId() throws Exception {
        // Create the Filtered with an existing ID
        filtered.setId(1L);

        int databaseSizeBeforeCreate = filteredRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFilteredMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(filtered)))
            .andExpect(status().isBadRequest());

        // Validate the Filtered in the database
        List<Filtered> filteredList = filteredRepository.findAll();
        assertThat(filteredList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFiltereds() throws Exception {
        // Initialize the database
        filteredRepository.saveAndFlush(filtered);

        // Get all the filteredList
        restFilteredMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(filtered.getId().intValue())))
            .andExpect(jsonPath("$.[*].search").value(hasItem(DEFAULT_SEARCH)))
            .andExpect(jsonPath("$.[*].results").value(hasItem(DEFAULT_RESULTS)))
            .andExpect(jsonPath("$.[*].filtering").value(hasItem(DEFAULT_FILTERING.booleanValue())));
    }

    @Test
    @Transactional
    void getFiltered() throws Exception {
        // Initialize the database
        filteredRepository.saveAndFlush(filtered);

        // Get the filtered
        restFilteredMockMvc
            .perform(get(ENTITY_API_URL_ID, filtered.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(filtered.getId().intValue()))
            .andExpect(jsonPath("$.search").value(DEFAULT_SEARCH))
            .andExpect(jsonPath("$.results").value(DEFAULT_RESULTS))
            .andExpect(jsonPath("$.filtering").value(DEFAULT_FILTERING.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingFiltered() throws Exception {
        // Get the filtered
        restFilteredMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFiltered() throws Exception {
        // Initialize the database
        filteredRepository.saveAndFlush(filtered);

        int databaseSizeBeforeUpdate = filteredRepository.findAll().size();

        // Update the filtered
        Filtered updatedFiltered = filteredRepository.findById(filtered.getId()).get();
        // Disconnect from session so that the updates on updatedFiltered are not directly saved in db
        em.detach(updatedFiltered);
        updatedFiltered.search(UPDATED_SEARCH).results(UPDATED_RESULTS).filtering(UPDATED_FILTERING);

        restFilteredMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFiltered.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFiltered))
            )
            .andExpect(status().isOk());

        // Validate the Filtered in the database
        List<Filtered> filteredList = filteredRepository.findAll();
        assertThat(filteredList).hasSize(databaseSizeBeforeUpdate);
        Filtered testFiltered = filteredList.get(filteredList.size() - 1);
        assertThat(testFiltered.getSearch()).isEqualTo(UPDATED_SEARCH);
        assertThat(testFiltered.getResults()).isEqualTo(UPDATED_RESULTS);
        assertThat(testFiltered.getFiltering()).isEqualTo(UPDATED_FILTERING);
    }

    @Test
    @Transactional
    void putNonExistingFiltered() throws Exception {
        int databaseSizeBeforeUpdate = filteredRepository.findAll().size();
        filtered.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFilteredMockMvc
            .perform(
                put(ENTITY_API_URL_ID, filtered.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(filtered))
            )
            .andExpect(status().isBadRequest());

        // Validate the Filtered in the database
        List<Filtered> filteredList = filteredRepository.findAll();
        assertThat(filteredList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFiltered() throws Exception {
        int databaseSizeBeforeUpdate = filteredRepository.findAll().size();
        filtered.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFilteredMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(filtered))
            )
            .andExpect(status().isBadRequest());

        // Validate the Filtered in the database
        List<Filtered> filteredList = filteredRepository.findAll();
        assertThat(filteredList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFiltered() throws Exception {
        int databaseSizeBeforeUpdate = filteredRepository.findAll().size();
        filtered.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFilteredMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(filtered)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Filtered in the database
        List<Filtered> filteredList = filteredRepository.findAll();
        assertThat(filteredList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFilteredWithPatch() throws Exception {
        // Initialize the database
        filteredRepository.saveAndFlush(filtered);

        int databaseSizeBeforeUpdate = filteredRepository.findAll().size();

        // Update the filtered using partial update
        Filtered partialUpdatedFiltered = new Filtered();
        partialUpdatedFiltered.setId(filtered.getId());

        partialUpdatedFiltered.results(UPDATED_RESULTS);

        restFilteredMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFiltered.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFiltered))
            )
            .andExpect(status().isOk());

        // Validate the Filtered in the database
        List<Filtered> filteredList = filteredRepository.findAll();
        assertThat(filteredList).hasSize(databaseSizeBeforeUpdate);
        Filtered testFiltered = filteredList.get(filteredList.size() - 1);
        assertThat(testFiltered.getSearch()).isEqualTo(DEFAULT_SEARCH);
        assertThat(testFiltered.getResults()).isEqualTo(UPDATED_RESULTS);
        assertThat(testFiltered.getFiltering()).isEqualTo(DEFAULT_FILTERING);
    }

    @Test
    @Transactional
    void fullUpdateFilteredWithPatch() throws Exception {
        // Initialize the database
        filteredRepository.saveAndFlush(filtered);

        int databaseSizeBeforeUpdate = filteredRepository.findAll().size();

        // Update the filtered using partial update
        Filtered partialUpdatedFiltered = new Filtered();
        partialUpdatedFiltered.setId(filtered.getId());

        partialUpdatedFiltered.search(UPDATED_SEARCH).results(UPDATED_RESULTS).filtering(UPDATED_FILTERING);

        restFilteredMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFiltered.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFiltered))
            )
            .andExpect(status().isOk());

        // Validate the Filtered in the database
        List<Filtered> filteredList = filteredRepository.findAll();
        assertThat(filteredList).hasSize(databaseSizeBeforeUpdate);
        Filtered testFiltered = filteredList.get(filteredList.size() - 1);
        assertThat(testFiltered.getSearch()).isEqualTo(UPDATED_SEARCH);
        assertThat(testFiltered.getResults()).isEqualTo(UPDATED_RESULTS);
        assertThat(testFiltered.getFiltering()).isEqualTo(UPDATED_FILTERING);
    }

    @Test
    @Transactional
    void patchNonExistingFiltered() throws Exception {
        int databaseSizeBeforeUpdate = filteredRepository.findAll().size();
        filtered.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFilteredMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, filtered.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(filtered))
            )
            .andExpect(status().isBadRequest());

        // Validate the Filtered in the database
        List<Filtered> filteredList = filteredRepository.findAll();
        assertThat(filteredList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFiltered() throws Exception {
        int databaseSizeBeforeUpdate = filteredRepository.findAll().size();
        filtered.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFilteredMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(filtered))
            )
            .andExpect(status().isBadRequest());

        // Validate the Filtered in the database
        List<Filtered> filteredList = filteredRepository.findAll();
        assertThat(filteredList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFiltered() throws Exception {
        int databaseSizeBeforeUpdate = filteredRepository.findAll().size();
        filtered.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFilteredMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(filtered)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Filtered in the database
        List<Filtered> filteredList = filteredRepository.findAll();
        assertThat(filteredList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFiltered() throws Exception {
        // Initialize the database
        filteredRepository.saveAndFlush(filtered);

        int databaseSizeBeforeDelete = filteredRepository.findAll().size();

        // Delete the filtered
        restFilteredMockMvc
            .perform(delete(ENTITY_API_URL_ID, filtered.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Filtered> filteredList = filteredRepository.findAll();
        assertThat(filteredList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
