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
import team.bham.domain.LandingPage;
import team.bham.repository.LandingPageRepository;

/**
 * Integration tests for the {@link LandingPageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LandingPageResourceIT {

    private static final String DEFAULT_GET_STARTED = "AAAAAAAAAA";
    private static final String UPDATED_GET_STARTED = "BBBBBBBBBB";

    private static final String DEFAULT_ABOUT = "AAAAAAAAAA";
    private static final String UPDATED_ABOUT = "BBBBBBBBBB";

    private static final String DEFAULT_TEAM = "AAAAAAAAAA";
    private static final String UPDATED_TEAM = "BBBBBBBBBB";

    private static final String DEFAULT_CONTACT = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/landing-pages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LandingPageRepository landingPageRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLandingPageMockMvc;

    private LandingPage landingPage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LandingPage createEntity(EntityManager em) {
        LandingPage landingPage = new LandingPage()
            .getStarted(DEFAULT_GET_STARTED)
            .about(DEFAULT_ABOUT)
            .team(DEFAULT_TEAM)
            .contact(DEFAULT_CONTACT);
        return landingPage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LandingPage createUpdatedEntity(EntityManager em) {
        LandingPage landingPage = new LandingPage()
            .getStarted(UPDATED_GET_STARTED)
            .about(UPDATED_ABOUT)
            .team(UPDATED_TEAM)
            .contact(UPDATED_CONTACT);
        return landingPage;
    }

    @BeforeEach
    public void initTest() {
        landingPage = createEntity(em);
    }

    @Test
    @Transactional
    void createLandingPage() throws Exception {
        int databaseSizeBeforeCreate = landingPageRepository.findAll().size();
        // Create the LandingPage
        restLandingPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(landingPage)))
            .andExpect(status().isCreated());

        // Validate the LandingPage in the database
        List<LandingPage> landingPageList = landingPageRepository.findAll();
        assertThat(landingPageList).hasSize(databaseSizeBeforeCreate + 1);
        LandingPage testLandingPage = landingPageList.get(landingPageList.size() - 1);
        assertThat(testLandingPage.getGetStarted()).isEqualTo(DEFAULT_GET_STARTED);
        assertThat(testLandingPage.getAbout()).isEqualTo(DEFAULT_ABOUT);
        assertThat(testLandingPage.getTeam()).isEqualTo(DEFAULT_TEAM);
        assertThat(testLandingPage.getContact()).isEqualTo(DEFAULT_CONTACT);
    }

    @Test
    @Transactional
    void createLandingPageWithExistingId() throws Exception {
        // Create the LandingPage with an existing ID
        landingPage.setId(1L);

        int databaseSizeBeforeCreate = landingPageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLandingPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(landingPage)))
            .andExpect(status().isBadRequest());

        // Validate the LandingPage in the database
        List<LandingPage> landingPageList = landingPageRepository.findAll();
        assertThat(landingPageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLandingPages() throws Exception {
        // Initialize the database
        landingPageRepository.saveAndFlush(landingPage);

        // Get all the landingPageList
        restLandingPageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(landingPage.getId().intValue())))
            .andExpect(jsonPath("$.[*].getStarted").value(hasItem(DEFAULT_GET_STARTED)))
            .andExpect(jsonPath("$.[*].about").value(hasItem(DEFAULT_ABOUT)))
            .andExpect(jsonPath("$.[*].team").value(hasItem(DEFAULT_TEAM)))
            .andExpect(jsonPath("$.[*].contact").value(hasItem(DEFAULT_CONTACT)));
    }

    @Test
    @Transactional
    void getLandingPage() throws Exception {
        // Initialize the database
        landingPageRepository.saveAndFlush(landingPage);

        // Get the landingPage
        restLandingPageMockMvc
            .perform(get(ENTITY_API_URL_ID, landingPage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(landingPage.getId().intValue()))
            .andExpect(jsonPath("$.getStarted").value(DEFAULT_GET_STARTED))
            .andExpect(jsonPath("$.about").value(DEFAULT_ABOUT))
            .andExpect(jsonPath("$.team").value(DEFAULT_TEAM))
            .andExpect(jsonPath("$.contact").value(DEFAULT_CONTACT));
    }

    @Test
    @Transactional
    void getNonExistingLandingPage() throws Exception {
        // Get the landingPage
        restLandingPageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLandingPage() throws Exception {
        // Initialize the database
        landingPageRepository.saveAndFlush(landingPage);

        int databaseSizeBeforeUpdate = landingPageRepository.findAll().size();

        // Update the landingPage
        LandingPage updatedLandingPage = landingPageRepository.findById(landingPage.getId()).get();
        // Disconnect from session so that the updates on updatedLandingPage are not directly saved in db
        em.detach(updatedLandingPage);
        updatedLandingPage.getStarted(UPDATED_GET_STARTED).about(UPDATED_ABOUT).team(UPDATED_TEAM).contact(UPDATED_CONTACT);

        restLandingPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLandingPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLandingPage))
            )
            .andExpect(status().isOk());

        // Validate the LandingPage in the database
        List<LandingPage> landingPageList = landingPageRepository.findAll();
        assertThat(landingPageList).hasSize(databaseSizeBeforeUpdate);
        LandingPage testLandingPage = landingPageList.get(landingPageList.size() - 1);
        assertThat(testLandingPage.getGetStarted()).isEqualTo(UPDATED_GET_STARTED);
        assertThat(testLandingPage.getAbout()).isEqualTo(UPDATED_ABOUT);
        assertThat(testLandingPage.getTeam()).isEqualTo(UPDATED_TEAM);
        assertThat(testLandingPage.getContact()).isEqualTo(UPDATED_CONTACT);
    }

    @Test
    @Transactional
    void putNonExistingLandingPage() throws Exception {
        int databaseSizeBeforeUpdate = landingPageRepository.findAll().size();
        landingPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLandingPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, landingPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(landingPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the LandingPage in the database
        List<LandingPage> landingPageList = landingPageRepository.findAll();
        assertThat(landingPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLandingPage() throws Exception {
        int databaseSizeBeforeUpdate = landingPageRepository.findAll().size();
        landingPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLandingPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(landingPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the LandingPage in the database
        List<LandingPage> landingPageList = landingPageRepository.findAll();
        assertThat(landingPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLandingPage() throws Exception {
        int databaseSizeBeforeUpdate = landingPageRepository.findAll().size();
        landingPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLandingPageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(landingPage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LandingPage in the database
        List<LandingPage> landingPageList = landingPageRepository.findAll();
        assertThat(landingPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLandingPageWithPatch() throws Exception {
        // Initialize the database
        landingPageRepository.saveAndFlush(landingPage);

        int databaseSizeBeforeUpdate = landingPageRepository.findAll().size();

        // Update the landingPage using partial update
        LandingPage partialUpdatedLandingPage = new LandingPage();
        partialUpdatedLandingPage.setId(landingPage.getId());

        partialUpdatedLandingPage.team(UPDATED_TEAM);

        restLandingPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLandingPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLandingPage))
            )
            .andExpect(status().isOk());

        // Validate the LandingPage in the database
        List<LandingPage> landingPageList = landingPageRepository.findAll();
        assertThat(landingPageList).hasSize(databaseSizeBeforeUpdate);
        LandingPage testLandingPage = landingPageList.get(landingPageList.size() - 1);
        assertThat(testLandingPage.getGetStarted()).isEqualTo(DEFAULT_GET_STARTED);
        assertThat(testLandingPage.getAbout()).isEqualTo(DEFAULT_ABOUT);
        assertThat(testLandingPage.getTeam()).isEqualTo(UPDATED_TEAM);
        assertThat(testLandingPage.getContact()).isEqualTo(DEFAULT_CONTACT);
    }

    @Test
    @Transactional
    void fullUpdateLandingPageWithPatch() throws Exception {
        // Initialize the database
        landingPageRepository.saveAndFlush(landingPage);

        int databaseSizeBeforeUpdate = landingPageRepository.findAll().size();

        // Update the landingPage using partial update
        LandingPage partialUpdatedLandingPage = new LandingPage();
        partialUpdatedLandingPage.setId(landingPage.getId());

        partialUpdatedLandingPage.getStarted(UPDATED_GET_STARTED).about(UPDATED_ABOUT).team(UPDATED_TEAM).contact(UPDATED_CONTACT);

        restLandingPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLandingPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLandingPage))
            )
            .andExpect(status().isOk());

        // Validate the LandingPage in the database
        List<LandingPage> landingPageList = landingPageRepository.findAll();
        assertThat(landingPageList).hasSize(databaseSizeBeforeUpdate);
        LandingPage testLandingPage = landingPageList.get(landingPageList.size() - 1);
        assertThat(testLandingPage.getGetStarted()).isEqualTo(UPDATED_GET_STARTED);
        assertThat(testLandingPage.getAbout()).isEqualTo(UPDATED_ABOUT);
        assertThat(testLandingPage.getTeam()).isEqualTo(UPDATED_TEAM);
        assertThat(testLandingPage.getContact()).isEqualTo(UPDATED_CONTACT);
    }

    @Test
    @Transactional
    void patchNonExistingLandingPage() throws Exception {
        int databaseSizeBeforeUpdate = landingPageRepository.findAll().size();
        landingPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLandingPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, landingPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(landingPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the LandingPage in the database
        List<LandingPage> landingPageList = landingPageRepository.findAll();
        assertThat(landingPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLandingPage() throws Exception {
        int databaseSizeBeforeUpdate = landingPageRepository.findAll().size();
        landingPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLandingPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(landingPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the LandingPage in the database
        List<LandingPage> landingPageList = landingPageRepository.findAll();
        assertThat(landingPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLandingPage() throws Exception {
        int databaseSizeBeforeUpdate = landingPageRepository.findAll().size();
        landingPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLandingPageMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(landingPage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LandingPage in the database
        List<LandingPage> landingPageList = landingPageRepository.findAll();
        assertThat(landingPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLandingPage() throws Exception {
        // Initialize the database
        landingPageRepository.saveAndFlush(landingPage);

        int databaseSizeBeforeDelete = landingPageRepository.findAll().size();

        // Delete the landingPage
        restLandingPageMockMvc
            .perform(delete(ENTITY_API_URL_ID, landingPage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LandingPage> landingPageList = landingPageRepository.findAll();
        assertThat(landingPageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
