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
import team.bham.domain.ScreenTime;
import team.bham.repository.ScreenTimeRepository;

/**
 * Integration tests for the {@link ScreenTimeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ScreenTimeResourceIT {

    private static final Boolean DEFAULT_SELECT_CATEGORY = false;
    private static final Boolean UPDATED_SELECT_CATEGORY = true;

    private static final String ENTITY_API_URL = "/api/screen-times";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ScreenTimeRepository screenTimeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restScreenTimeMockMvc;

    private ScreenTime screenTime;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ScreenTime createEntity(EntityManager em) {
        ScreenTime screenTime = new ScreenTime().selectCategory(DEFAULT_SELECT_CATEGORY);
        return screenTime;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ScreenTime createUpdatedEntity(EntityManager em) {
        ScreenTime screenTime = new ScreenTime().selectCategory(UPDATED_SELECT_CATEGORY);
        return screenTime;
    }

    @BeforeEach
    public void initTest() {
        screenTime = createEntity(em);
    }

    @Test
    @Transactional
    void createScreenTime() throws Exception {
        int databaseSizeBeforeCreate = screenTimeRepository.findAll().size();
        // Create the ScreenTime
        restScreenTimeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(screenTime)))
            .andExpect(status().isCreated());

        // Validate the ScreenTime in the database
        List<ScreenTime> screenTimeList = screenTimeRepository.findAll();
        assertThat(screenTimeList).hasSize(databaseSizeBeforeCreate + 1);
        ScreenTime testScreenTime = screenTimeList.get(screenTimeList.size() - 1);
        assertThat(testScreenTime.getSelectCategory()).isEqualTo(DEFAULT_SELECT_CATEGORY);
    }

    @Test
    @Transactional
    void createScreenTimeWithExistingId() throws Exception {
        // Create the ScreenTime with an existing ID
        screenTime.setId(1L);

        int databaseSizeBeforeCreate = screenTimeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restScreenTimeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(screenTime)))
            .andExpect(status().isBadRequest());

        // Validate the ScreenTime in the database
        List<ScreenTime> screenTimeList = screenTimeRepository.findAll();
        assertThat(screenTimeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllScreenTimes() throws Exception {
        // Initialize the database
        screenTimeRepository.saveAndFlush(screenTime);

        // Get all the screenTimeList
        restScreenTimeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(screenTime.getId().intValue())))
            .andExpect(jsonPath("$.[*].selectCategory").value(hasItem(DEFAULT_SELECT_CATEGORY.booleanValue())));
    }

    @Test
    @Transactional
    void getScreenTime() throws Exception {
        // Initialize the database
        screenTimeRepository.saveAndFlush(screenTime);

        // Get the screenTime
        restScreenTimeMockMvc
            .perform(get(ENTITY_API_URL_ID, screenTime.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(screenTime.getId().intValue()))
            .andExpect(jsonPath("$.selectCategory").value(DEFAULT_SELECT_CATEGORY.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingScreenTime() throws Exception {
        // Get the screenTime
        restScreenTimeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingScreenTime() throws Exception {
        // Initialize the database
        screenTimeRepository.saveAndFlush(screenTime);

        int databaseSizeBeforeUpdate = screenTimeRepository.findAll().size();

        // Update the screenTime
        ScreenTime updatedScreenTime = screenTimeRepository.findById(screenTime.getId()).get();
        // Disconnect from session so that the updates on updatedScreenTime are not directly saved in db
        em.detach(updatedScreenTime);
        updatedScreenTime.selectCategory(UPDATED_SELECT_CATEGORY);

        restScreenTimeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedScreenTime.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedScreenTime))
            )
            .andExpect(status().isOk());

        // Validate the ScreenTime in the database
        List<ScreenTime> screenTimeList = screenTimeRepository.findAll();
        assertThat(screenTimeList).hasSize(databaseSizeBeforeUpdate);
        ScreenTime testScreenTime = screenTimeList.get(screenTimeList.size() - 1);
        assertThat(testScreenTime.getSelectCategory()).isEqualTo(UPDATED_SELECT_CATEGORY);
    }

    @Test
    @Transactional
    void putNonExistingScreenTime() throws Exception {
        int databaseSizeBeforeUpdate = screenTimeRepository.findAll().size();
        screenTime.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restScreenTimeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, screenTime.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(screenTime))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScreenTime in the database
        List<ScreenTime> screenTimeList = screenTimeRepository.findAll();
        assertThat(screenTimeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchScreenTime() throws Exception {
        int databaseSizeBeforeUpdate = screenTimeRepository.findAll().size();
        screenTime.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScreenTimeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(screenTime))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScreenTime in the database
        List<ScreenTime> screenTimeList = screenTimeRepository.findAll();
        assertThat(screenTimeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamScreenTime() throws Exception {
        int databaseSizeBeforeUpdate = screenTimeRepository.findAll().size();
        screenTime.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScreenTimeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(screenTime)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ScreenTime in the database
        List<ScreenTime> screenTimeList = screenTimeRepository.findAll();
        assertThat(screenTimeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateScreenTimeWithPatch() throws Exception {
        // Initialize the database
        screenTimeRepository.saveAndFlush(screenTime);

        int databaseSizeBeforeUpdate = screenTimeRepository.findAll().size();

        // Update the screenTime using partial update
        ScreenTime partialUpdatedScreenTime = new ScreenTime();
        partialUpdatedScreenTime.setId(screenTime.getId());

        partialUpdatedScreenTime.selectCategory(UPDATED_SELECT_CATEGORY);

        restScreenTimeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedScreenTime.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedScreenTime))
            )
            .andExpect(status().isOk());

        // Validate the ScreenTime in the database
        List<ScreenTime> screenTimeList = screenTimeRepository.findAll();
        assertThat(screenTimeList).hasSize(databaseSizeBeforeUpdate);
        ScreenTime testScreenTime = screenTimeList.get(screenTimeList.size() - 1);
        assertThat(testScreenTime.getSelectCategory()).isEqualTo(UPDATED_SELECT_CATEGORY);
    }

    @Test
    @Transactional
    void fullUpdateScreenTimeWithPatch() throws Exception {
        // Initialize the database
        screenTimeRepository.saveAndFlush(screenTime);

        int databaseSizeBeforeUpdate = screenTimeRepository.findAll().size();

        // Update the screenTime using partial update
        ScreenTime partialUpdatedScreenTime = new ScreenTime();
        partialUpdatedScreenTime.setId(screenTime.getId());

        partialUpdatedScreenTime.selectCategory(UPDATED_SELECT_CATEGORY);

        restScreenTimeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedScreenTime.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedScreenTime))
            )
            .andExpect(status().isOk());

        // Validate the ScreenTime in the database
        List<ScreenTime> screenTimeList = screenTimeRepository.findAll();
        assertThat(screenTimeList).hasSize(databaseSizeBeforeUpdate);
        ScreenTime testScreenTime = screenTimeList.get(screenTimeList.size() - 1);
        assertThat(testScreenTime.getSelectCategory()).isEqualTo(UPDATED_SELECT_CATEGORY);
    }

    @Test
    @Transactional
    void patchNonExistingScreenTime() throws Exception {
        int databaseSizeBeforeUpdate = screenTimeRepository.findAll().size();
        screenTime.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restScreenTimeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, screenTime.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(screenTime))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScreenTime in the database
        List<ScreenTime> screenTimeList = screenTimeRepository.findAll();
        assertThat(screenTimeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchScreenTime() throws Exception {
        int databaseSizeBeforeUpdate = screenTimeRepository.findAll().size();
        screenTime.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScreenTimeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(screenTime))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScreenTime in the database
        List<ScreenTime> screenTimeList = screenTimeRepository.findAll();
        assertThat(screenTimeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamScreenTime() throws Exception {
        int databaseSizeBeforeUpdate = screenTimeRepository.findAll().size();
        screenTime.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScreenTimeMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(screenTime))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ScreenTime in the database
        List<ScreenTime> screenTimeList = screenTimeRepository.findAll();
        assertThat(screenTimeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteScreenTime() throws Exception {
        // Initialize the database
        screenTimeRepository.saveAndFlush(screenTime);

        int databaseSizeBeforeDelete = screenTimeRepository.findAll().size();

        // Delete the screenTime
        restScreenTimeMockMvc
            .perform(delete(ENTITY_API_URL_ID, screenTime.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ScreenTime> screenTimeList = screenTimeRepository.findAll();
        assertThat(screenTimeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
