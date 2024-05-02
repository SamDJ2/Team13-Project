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
import team.bham.domain.ProfileCustomization;
import team.bham.repository.ProfileCustomizationRepository;

/**
 * Integration tests for the {@link ProfileCustomizationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProfileCustomizationResourceIT {

    private static final Boolean DEFAULT_PREFERENCES = false;
    private static final Boolean UPDATED_PREFERENCES = true;

    private static final Boolean DEFAULT_PRIVACY_SETTINGS = false;
    private static final Boolean UPDATED_PRIVACY_SETTINGS = true;

    private static final String DEFAULT_ACCOUNT_HISTORY = "AAAAAAAAAA";
    private static final String UPDATED_ACCOUNT_HISTORY = "BBBBBBBBBB";

    private static final String DEFAULT_BIO_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_BIO_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/profile-customizations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProfileCustomizationRepository profileCustomizationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProfileCustomizationMockMvc;

    private ProfileCustomization profileCustomization;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProfileCustomization createEntity(EntityManager em) {
        ProfileCustomization profileCustomization = new ProfileCustomization()
            .preferences(DEFAULT_PREFERENCES)
            .privacySettings(DEFAULT_PRIVACY_SETTINGS)
            .accountHistory(DEFAULT_ACCOUNT_HISTORY)
            .bioDescription(DEFAULT_BIO_DESCRIPTION);
        return profileCustomization;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProfileCustomization createUpdatedEntity(EntityManager em) {
        ProfileCustomization profileCustomization = new ProfileCustomization()
            .preferences(UPDATED_PREFERENCES)
            .privacySettings(UPDATED_PRIVACY_SETTINGS)
            .accountHistory(UPDATED_ACCOUNT_HISTORY)
            .bioDescription(UPDATED_BIO_DESCRIPTION);
        return profileCustomization;
    }

    @BeforeEach
    public void initTest() {
        profileCustomization = createEntity(em);
    }

    @Test
    @Transactional
    void createProfileCustomization() throws Exception {
        int databaseSizeBeforeCreate = profileCustomizationRepository.findAll().size();
        // Create the ProfileCustomization
        restProfileCustomizationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(profileCustomization))
            )
            .andExpect(status().isCreated());

        // Validate the ProfileCustomization in the database
        List<ProfileCustomization> profileCustomizationList = profileCustomizationRepository.findAll();
        assertThat(profileCustomizationList).hasSize(databaseSizeBeforeCreate + 1);
        ProfileCustomization testProfileCustomization = profileCustomizationList.get(profileCustomizationList.size() - 1);
        assertThat(testProfileCustomization.getPreferences()).isEqualTo(DEFAULT_PREFERENCES);
        assertThat(testProfileCustomization.getPrivacySettings()).isEqualTo(DEFAULT_PRIVACY_SETTINGS);
        assertThat(testProfileCustomization.getAccountHistory()).isEqualTo(DEFAULT_ACCOUNT_HISTORY);
        assertThat(testProfileCustomization.getBioDescription()).isEqualTo(DEFAULT_BIO_DESCRIPTION);
    }

    @Test
    @Transactional
    void createProfileCustomizationWithExistingId() throws Exception {
        // Create the ProfileCustomization with an existing ID
        profileCustomization.setId(1L);

        int databaseSizeBeforeCreate = profileCustomizationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProfileCustomizationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(profileCustomization))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProfileCustomization in the database
        List<ProfileCustomization> profileCustomizationList = profileCustomizationRepository.findAll();
        assertThat(profileCustomizationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProfileCustomizations() throws Exception {
        // Initialize the database
        profileCustomizationRepository.saveAndFlush(profileCustomization);

        // Get all the profileCustomizationList
        restProfileCustomizationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(profileCustomization.getId().intValue())))
            .andExpect(jsonPath("$.[*].preferences").value(hasItem(DEFAULT_PREFERENCES.booleanValue())))
            .andExpect(jsonPath("$.[*].privacySettings").value(hasItem(DEFAULT_PRIVACY_SETTINGS.booleanValue())))
            .andExpect(jsonPath("$.[*].accountHistory").value(hasItem(DEFAULT_ACCOUNT_HISTORY)))
            .andExpect(jsonPath("$.[*].bioDescription").value(hasItem(DEFAULT_BIO_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getProfileCustomization() throws Exception {
        // Initialize the database
        profileCustomizationRepository.saveAndFlush(profileCustomization);

        // Get the profileCustomization
        restProfileCustomizationMockMvc
            .perform(get(ENTITY_API_URL_ID, profileCustomization.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(profileCustomization.getId().intValue()))
            .andExpect(jsonPath("$.preferences").value(DEFAULT_PREFERENCES.booleanValue()))
            .andExpect(jsonPath("$.privacySettings").value(DEFAULT_PRIVACY_SETTINGS.booleanValue()))
            .andExpect(jsonPath("$.accountHistory").value(DEFAULT_ACCOUNT_HISTORY))
            .andExpect(jsonPath("$.bioDescription").value(DEFAULT_BIO_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingProfileCustomization() throws Exception {
        // Get the profileCustomization
        restProfileCustomizationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProfileCustomization() throws Exception {
        // Initialize the database
        profileCustomizationRepository.saveAndFlush(profileCustomization);

        int databaseSizeBeforeUpdate = profileCustomizationRepository.findAll().size();

        // Update the profileCustomization
        ProfileCustomization updatedProfileCustomization = profileCustomizationRepository.findById(profileCustomization.getId()).get();
        // Disconnect from session so that the updates on updatedProfileCustomization are not directly saved in db
        em.detach(updatedProfileCustomization);
        updatedProfileCustomization
            .preferences(UPDATED_PREFERENCES)
            .privacySettings(UPDATED_PRIVACY_SETTINGS)
            .accountHistory(UPDATED_ACCOUNT_HISTORY)
            .bioDescription(UPDATED_BIO_DESCRIPTION);

        restProfileCustomizationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProfileCustomization.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProfileCustomization))
            )
            .andExpect(status().isOk());

        // Validate the ProfileCustomization in the database
        List<ProfileCustomization> profileCustomizationList = profileCustomizationRepository.findAll();
        assertThat(profileCustomizationList).hasSize(databaseSizeBeforeUpdate);
        ProfileCustomization testProfileCustomization = profileCustomizationList.get(profileCustomizationList.size() - 1);
        assertThat(testProfileCustomization.getPreferences()).isEqualTo(UPDATED_PREFERENCES);
        assertThat(testProfileCustomization.getPrivacySettings()).isEqualTo(UPDATED_PRIVACY_SETTINGS);
        assertThat(testProfileCustomization.getAccountHistory()).isEqualTo(UPDATED_ACCOUNT_HISTORY);
        assertThat(testProfileCustomization.getBioDescription()).isEqualTo(UPDATED_BIO_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingProfileCustomization() throws Exception {
        int databaseSizeBeforeUpdate = profileCustomizationRepository.findAll().size();
        profileCustomization.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProfileCustomizationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, profileCustomization.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(profileCustomization))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProfileCustomization in the database
        List<ProfileCustomization> profileCustomizationList = profileCustomizationRepository.findAll();
        assertThat(profileCustomizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProfileCustomization() throws Exception {
        int databaseSizeBeforeUpdate = profileCustomizationRepository.findAll().size();
        profileCustomization.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfileCustomizationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(profileCustomization))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProfileCustomization in the database
        List<ProfileCustomization> profileCustomizationList = profileCustomizationRepository.findAll();
        assertThat(profileCustomizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProfileCustomization() throws Exception {
        int databaseSizeBeforeUpdate = profileCustomizationRepository.findAll().size();
        profileCustomization.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfileCustomizationMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(profileCustomization))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProfileCustomization in the database
        List<ProfileCustomization> profileCustomizationList = profileCustomizationRepository.findAll();
        assertThat(profileCustomizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProfileCustomizationWithPatch() throws Exception {
        // Initialize the database
        profileCustomizationRepository.saveAndFlush(profileCustomization);

        int databaseSizeBeforeUpdate = profileCustomizationRepository.findAll().size();

        // Update the profileCustomization using partial update
        ProfileCustomization partialUpdatedProfileCustomization = new ProfileCustomization();
        partialUpdatedProfileCustomization.setId(profileCustomization.getId());

        partialUpdatedProfileCustomization.preferences(UPDATED_PREFERENCES).privacySettings(UPDATED_PRIVACY_SETTINGS);

        restProfileCustomizationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProfileCustomization.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProfileCustomization))
            )
            .andExpect(status().isOk());

        // Validate the ProfileCustomization in the database
        List<ProfileCustomization> profileCustomizationList = profileCustomizationRepository.findAll();
        assertThat(profileCustomizationList).hasSize(databaseSizeBeforeUpdate);
        ProfileCustomization testProfileCustomization = profileCustomizationList.get(profileCustomizationList.size() - 1);
        assertThat(testProfileCustomization.getPreferences()).isEqualTo(UPDATED_PREFERENCES);
        assertThat(testProfileCustomization.getPrivacySettings()).isEqualTo(UPDATED_PRIVACY_SETTINGS);
        assertThat(testProfileCustomization.getAccountHistory()).isEqualTo(DEFAULT_ACCOUNT_HISTORY);
        assertThat(testProfileCustomization.getBioDescription()).isEqualTo(DEFAULT_BIO_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateProfileCustomizationWithPatch() throws Exception {
        // Initialize the database
        profileCustomizationRepository.saveAndFlush(profileCustomization);

        int databaseSizeBeforeUpdate = profileCustomizationRepository.findAll().size();

        // Update the profileCustomization using partial update
        ProfileCustomization partialUpdatedProfileCustomization = new ProfileCustomization();
        partialUpdatedProfileCustomization.setId(profileCustomization.getId());

        partialUpdatedProfileCustomization
            .preferences(UPDATED_PREFERENCES)
            .privacySettings(UPDATED_PRIVACY_SETTINGS)
            .accountHistory(UPDATED_ACCOUNT_HISTORY)
            .bioDescription(UPDATED_BIO_DESCRIPTION);

        restProfileCustomizationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProfileCustomization.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProfileCustomization))
            )
            .andExpect(status().isOk());

        // Validate the ProfileCustomization in the database
        List<ProfileCustomization> profileCustomizationList = profileCustomizationRepository.findAll();
        assertThat(profileCustomizationList).hasSize(databaseSizeBeforeUpdate);
        ProfileCustomization testProfileCustomization = profileCustomizationList.get(profileCustomizationList.size() - 1);
        assertThat(testProfileCustomization.getPreferences()).isEqualTo(UPDATED_PREFERENCES);
        assertThat(testProfileCustomization.getPrivacySettings()).isEqualTo(UPDATED_PRIVACY_SETTINGS);
        assertThat(testProfileCustomization.getAccountHistory()).isEqualTo(UPDATED_ACCOUNT_HISTORY);
        assertThat(testProfileCustomization.getBioDescription()).isEqualTo(UPDATED_BIO_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingProfileCustomization() throws Exception {
        int databaseSizeBeforeUpdate = profileCustomizationRepository.findAll().size();
        profileCustomization.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProfileCustomizationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, profileCustomization.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(profileCustomization))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProfileCustomization in the database
        List<ProfileCustomization> profileCustomizationList = profileCustomizationRepository.findAll();
        assertThat(profileCustomizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProfileCustomization() throws Exception {
        int databaseSizeBeforeUpdate = profileCustomizationRepository.findAll().size();
        profileCustomization.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfileCustomizationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(profileCustomization))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProfileCustomization in the database
        List<ProfileCustomization> profileCustomizationList = profileCustomizationRepository.findAll();
        assertThat(profileCustomizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProfileCustomization() throws Exception {
        int databaseSizeBeforeUpdate = profileCustomizationRepository.findAll().size();
        profileCustomization.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfileCustomizationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(profileCustomization))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProfileCustomization in the database
        List<ProfileCustomization> profileCustomizationList = profileCustomizationRepository.findAll();
        assertThat(profileCustomizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProfileCustomization() throws Exception {
        // Initialize the database
        profileCustomizationRepository.saveAndFlush(profileCustomization);

        int databaseSizeBeforeDelete = profileCustomizationRepository.findAll().size();

        // Delete the profileCustomization
        restProfileCustomizationMockMvc
            .perform(delete(ENTITY_API_URL_ID, profileCustomization.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProfileCustomization> profileCustomizationList = profileCustomizationRepository.findAll();
        assertThat(profileCustomizationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
