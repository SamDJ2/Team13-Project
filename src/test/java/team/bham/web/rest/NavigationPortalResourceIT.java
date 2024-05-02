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
import team.bham.domain.NavigationPortal;
import team.bham.repository.NavigationPortalRepository;

/**
 * Integration tests for the {@link NavigationPortalResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class NavigationPortalResourceIT {

    private static final String DEFAULT_FEATURES = "AAAAAAAAAA";
    private static final String UPDATED_FEATURES = "BBBBBBBBBB";

    private static final Boolean DEFAULT_SELECTED_FEATURE = false;
    private static final Boolean UPDATED_SELECTED_FEATURE = true;

    private static final String ENTITY_API_URL = "/api/navigation-portals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private NavigationPortalRepository navigationPortalRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restNavigationPortalMockMvc;

    private NavigationPortal navigationPortal;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NavigationPortal createEntity(EntityManager em) {
        NavigationPortal navigationPortal = new NavigationPortal().features(DEFAULT_FEATURES).selectedFeature(DEFAULT_SELECTED_FEATURE);
        return navigationPortal;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NavigationPortal createUpdatedEntity(EntityManager em) {
        NavigationPortal navigationPortal = new NavigationPortal().features(UPDATED_FEATURES).selectedFeature(UPDATED_SELECTED_FEATURE);
        return navigationPortal;
    }

    @BeforeEach
    public void initTest() {
        navigationPortal = createEntity(em);
    }

    @Test
    @Transactional
    void createNavigationPortal() throws Exception {
        int databaseSizeBeforeCreate = navigationPortalRepository.findAll().size();
        // Create the NavigationPortal
        restNavigationPortalMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(navigationPortal))
            )
            .andExpect(status().isCreated());

        // Validate the NavigationPortal in the database
        List<NavigationPortal> navigationPortalList = navigationPortalRepository.findAll();
        assertThat(navigationPortalList).hasSize(databaseSizeBeforeCreate + 1);
        NavigationPortal testNavigationPortal = navigationPortalList.get(navigationPortalList.size() - 1);
        assertThat(testNavigationPortal.getFeatures()).isEqualTo(DEFAULT_FEATURES);
        assertThat(testNavigationPortal.getSelectedFeature()).isEqualTo(DEFAULT_SELECTED_FEATURE);
    }

    @Test
    @Transactional
    void createNavigationPortalWithExistingId() throws Exception {
        // Create the NavigationPortal with an existing ID
        navigationPortal.setId(1L);

        int databaseSizeBeforeCreate = navigationPortalRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restNavigationPortalMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(navigationPortal))
            )
            .andExpect(status().isBadRequest());

        // Validate the NavigationPortal in the database
        List<NavigationPortal> navigationPortalList = navigationPortalRepository.findAll();
        assertThat(navigationPortalList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllNavigationPortals() throws Exception {
        // Initialize the database
        navigationPortalRepository.saveAndFlush(navigationPortal);

        // Get all the navigationPortalList
        restNavigationPortalMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(navigationPortal.getId().intValue())))
            .andExpect(jsonPath("$.[*].features").value(hasItem(DEFAULT_FEATURES)))
            .andExpect(jsonPath("$.[*].selectedFeature").value(hasItem(DEFAULT_SELECTED_FEATURE.booleanValue())));
    }

    @Test
    @Transactional
    void getNavigationPortal() throws Exception {
        // Initialize the database
        navigationPortalRepository.saveAndFlush(navigationPortal);

        // Get the navigationPortal
        restNavigationPortalMockMvc
            .perform(get(ENTITY_API_URL_ID, navigationPortal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(navigationPortal.getId().intValue()))
            .andExpect(jsonPath("$.features").value(DEFAULT_FEATURES))
            .andExpect(jsonPath("$.selectedFeature").value(DEFAULT_SELECTED_FEATURE.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingNavigationPortal() throws Exception {
        // Get the navigationPortal
        restNavigationPortalMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingNavigationPortal() throws Exception {
        // Initialize the database
        navigationPortalRepository.saveAndFlush(navigationPortal);

        int databaseSizeBeforeUpdate = navigationPortalRepository.findAll().size();

        // Update the navigationPortal
        NavigationPortal updatedNavigationPortal = navigationPortalRepository.findById(navigationPortal.getId()).get();
        // Disconnect from session so that the updates on updatedNavigationPortal are not directly saved in db
        em.detach(updatedNavigationPortal);
        updatedNavigationPortal.features(UPDATED_FEATURES).selectedFeature(UPDATED_SELECTED_FEATURE);

        restNavigationPortalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedNavigationPortal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedNavigationPortal))
            )
            .andExpect(status().isOk());

        // Validate the NavigationPortal in the database
        List<NavigationPortal> navigationPortalList = navigationPortalRepository.findAll();
        assertThat(navigationPortalList).hasSize(databaseSizeBeforeUpdate);
        NavigationPortal testNavigationPortal = navigationPortalList.get(navigationPortalList.size() - 1);
        assertThat(testNavigationPortal.getFeatures()).isEqualTo(UPDATED_FEATURES);
        assertThat(testNavigationPortal.getSelectedFeature()).isEqualTo(UPDATED_SELECTED_FEATURE);
    }

    @Test
    @Transactional
    void putNonExistingNavigationPortal() throws Exception {
        int databaseSizeBeforeUpdate = navigationPortalRepository.findAll().size();
        navigationPortal.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNavigationPortalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, navigationPortal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(navigationPortal))
            )
            .andExpect(status().isBadRequest());

        // Validate the NavigationPortal in the database
        List<NavigationPortal> navigationPortalList = navigationPortalRepository.findAll();
        assertThat(navigationPortalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchNavigationPortal() throws Exception {
        int databaseSizeBeforeUpdate = navigationPortalRepository.findAll().size();
        navigationPortal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNavigationPortalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(navigationPortal))
            )
            .andExpect(status().isBadRequest());

        // Validate the NavigationPortal in the database
        List<NavigationPortal> navigationPortalList = navigationPortalRepository.findAll();
        assertThat(navigationPortalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamNavigationPortal() throws Exception {
        int databaseSizeBeforeUpdate = navigationPortalRepository.findAll().size();
        navigationPortal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNavigationPortalMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(navigationPortal))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the NavigationPortal in the database
        List<NavigationPortal> navigationPortalList = navigationPortalRepository.findAll();
        assertThat(navigationPortalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateNavigationPortalWithPatch() throws Exception {
        // Initialize the database
        navigationPortalRepository.saveAndFlush(navigationPortal);

        int databaseSizeBeforeUpdate = navigationPortalRepository.findAll().size();

        // Update the navigationPortal using partial update
        NavigationPortal partialUpdatedNavigationPortal = new NavigationPortal();
        partialUpdatedNavigationPortal.setId(navigationPortal.getId());

        partialUpdatedNavigationPortal.features(UPDATED_FEATURES);

        restNavigationPortalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNavigationPortal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNavigationPortal))
            )
            .andExpect(status().isOk());

        // Validate the NavigationPortal in the database
        List<NavigationPortal> navigationPortalList = navigationPortalRepository.findAll();
        assertThat(navigationPortalList).hasSize(databaseSizeBeforeUpdate);
        NavigationPortal testNavigationPortal = navigationPortalList.get(navigationPortalList.size() - 1);
        assertThat(testNavigationPortal.getFeatures()).isEqualTo(UPDATED_FEATURES);
        assertThat(testNavigationPortal.getSelectedFeature()).isEqualTo(DEFAULT_SELECTED_FEATURE);
    }

    @Test
    @Transactional
    void fullUpdateNavigationPortalWithPatch() throws Exception {
        // Initialize the database
        navigationPortalRepository.saveAndFlush(navigationPortal);

        int databaseSizeBeforeUpdate = navigationPortalRepository.findAll().size();

        // Update the navigationPortal using partial update
        NavigationPortal partialUpdatedNavigationPortal = new NavigationPortal();
        partialUpdatedNavigationPortal.setId(navigationPortal.getId());

        partialUpdatedNavigationPortal.features(UPDATED_FEATURES).selectedFeature(UPDATED_SELECTED_FEATURE);

        restNavigationPortalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNavigationPortal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNavigationPortal))
            )
            .andExpect(status().isOk());

        // Validate the NavigationPortal in the database
        List<NavigationPortal> navigationPortalList = navigationPortalRepository.findAll();
        assertThat(navigationPortalList).hasSize(databaseSizeBeforeUpdate);
        NavigationPortal testNavigationPortal = navigationPortalList.get(navigationPortalList.size() - 1);
        assertThat(testNavigationPortal.getFeatures()).isEqualTo(UPDATED_FEATURES);
        assertThat(testNavigationPortal.getSelectedFeature()).isEqualTo(UPDATED_SELECTED_FEATURE);
    }

    @Test
    @Transactional
    void patchNonExistingNavigationPortal() throws Exception {
        int databaseSizeBeforeUpdate = navigationPortalRepository.findAll().size();
        navigationPortal.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNavigationPortalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, navigationPortal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(navigationPortal))
            )
            .andExpect(status().isBadRequest());

        // Validate the NavigationPortal in the database
        List<NavigationPortal> navigationPortalList = navigationPortalRepository.findAll();
        assertThat(navigationPortalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchNavigationPortal() throws Exception {
        int databaseSizeBeforeUpdate = navigationPortalRepository.findAll().size();
        navigationPortal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNavigationPortalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(navigationPortal))
            )
            .andExpect(status().isBadRequest());

        // Validate the NavigationPortal in the database
        List<NavigationPortal> navigationPortalList = navigationPortalRepository.findAll();
        assertThat(navigationPortalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamNavigationPortal() throws Exception {
        int databaseSizeBeforeUpdate = navigationPortalRepository.findAll().size();
        navigationPortal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNavigationPortalMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(navigationPortal))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the NavigationPortal in the database
        List<NavigationPortal> navigationPortalList = navigationPortalRepository.findAll();
        assertThat(navigationPortalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteNavigationPortal() throws Exception {
        // Initialize the database
        navigationPortalRepository.saveAndFlush(navigationPortal);

        int databaseSizeBeforeDelete = navigationPortalRepository.findAll().size();

        // Delete the navigationPortal
        restNavigationPortalMockMvc
            .perform(delete(ENTITY_API_URL_ID, navigationPortal.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<NavigationPortal> navigationPortalList = navigationPortalRepository.findAll();
        assertThat(navigationPortalList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
