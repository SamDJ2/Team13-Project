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
import team.bham.domain.NewWeeklyHabitTracker;
import team.bham.repository.NewWeeklyHabitTrackerRepository;

/**
 * Integration tests for the {@link NewWeeklyHabitTrackerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class NewWeeklyHabitTrackerResourceIT {

    private static final Long DEFAULT_RECORD_ID = 1L;
    private static final Long UPDATED_RECORD_ID = 2L;

    private static final Boolean DEFAULT_HABIT_COMPLETION = false;
    private static final Boolean UPDATED_HABIT_COMPLETION = true;

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/new-weekly-habit-trackers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private NewWeeklyHabitTrackerRepository newWeeklyHabitTrackerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restNewWeeklyHabitTrackerMockMvc;

    private NewWeeklyHabitTracker newWeeklyHabitTracker;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NewWeeklyHabitTracker createEntity(EntityManager em) {
        NewWeeklyHabitTracker newWeeklyHabitTracker = new NewWeeklyHabitTracker()
            .recordID(DEFAULT_RECORD_ID)
            .habitCompletion(DEFAULT_HABIT_COMPLETION)
            .date(DEFAULT_DATE);
        return newWeeklyHabitTracker;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NewWeeklyHabitTracker createUpdatedEntity(EntityManager em) {
        NewWeeklyHabitTracker newWeeklyHabitTracker = new NewWeeklyHabitTracker()
            .recordID(UPDATED_RECORD_ID)
            .habitCompletion(UPDATED_HABIT_COMPLETION)
            .date(UPDATED_DATE);
        return newWeeklyHabitTracker;
    }

    @BeforeEach
    public void initTest() {
        newWeeklyHabitTracker = createEntity(em);
    }

    @Test
    @Transactional
    void createNewWeeklyHabitTracker() throws Exception {
        int databaseSizeBeforeCreate = newWeeklyHabitTrackerRepository.findAll().size();
        // Create the NewWeeklyHabitTracker
        restNewWeeklyHabitTrackerMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(newWeeklyHabitTracker))
            )
            .andExpect(status().isCreated());

        // Validate the NewWeeklyHabitTracker in the database
        List<NewWeeklyHabitTracker> newWeeklyHabitTrackerList = newWeeklyHabitTrackerRepository.findAll();
        assertThat(newWeeklyHabitTrackerList).hasSize(databaseSizeBeforeCreate + 1);
        NewWeeklyHabitTracker testNewWeeklyHabitTracker = newWeeklyHabitTrackerList.get(newWeeklyHabitTrackerList.size() - 1);
        assertThat(testNewWeeklyHabitTracker.getRecordID()).isEqualTo(DEFAULT_RECORD_ID);
        assertThat(testNewWeeklyHabitTracker.getHabitCompletion()).isEqualTo(DEFAULT_HABIT_COMPLETION);
        assertThat(testNewWeeklyHabitTracker.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createNewWeeklyHabitTrackerWithExistingId() throws Exception {
        // Create the NewWeeklyHabitTracker with an existing ID
        newWeeklyHabitTracker.setId(1L);

        int databaseSizeBeforeCreate = newWeeklyHabitTrackerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restNewWeeklyHabitTrackerMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(newWeeklyHabitTracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the NewWeeklyHabitTracker in the database
        List<NewWeeklyHabitTracker> newWeeklyHabitTrackerList = newWeeklyHabitTrackerRepository.findAll();
        assertThat(newWeeklyHabitTrackerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllNewWeeklyHabitTrackers() throws Exception {
        // Initialize the database
        newWeeklyHabitTrackerRepository.saveAndFlush(newWeeklyHabitTracker);

        // Get all the newWeeklyHabitTrackerList
        restNewWeeklyHabitTrackerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(newWeeklyHabitTracker.getId().intValue())))
            .andExpect(jsonPath("$.[*].recordID").value(hasItem(DEFAULT_RECORD_ID.intValue())))
            .andExpect(jsonPath("$.[*].habitCompletion").value(hasItem(DEFAULT_HABIT_COMPLETION.booleanValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getNewWeeklyHabitTracker() throws Exception {
        // Initialize the database
        newWeeklyHabitTrackerRepository.saveAndFlush(newWeeklyHabitTracker);

        // Get the newWeeklyHabitTracker
        restNewWeeklyHabitTrackerMockMvc
            .perform(get(ENTITY_API_URL_ID, newWeeklyHabitTracker.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(newWeeklyHabitTracker.getId().intValue()))
            .andExpect(jsonPath("$.recordID").value(DEFAULT_RECORD_ID.intValue()))
            .andExpect(jsonPath("$.habitCompletion").value(DEFAULT_HABIT_COMPLETION.booleanValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingNewWeeklyHabitTracker() throws Exception {
        // Get the newWeeklyHabitTracker
        restNewWeeklyHabitTrackerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingNewWeeklyHabitTracker() throws Exception {
        // Initialize the database
        newWeeklyHabitTrackerRepository.saveAndFlush(newWeeklyHabitTracker);

        int databaseSizeBeforeUpdate = newWeeklyHabitTrackerRepository.findAll().size();

        // Update the newWeeklyHabitTracker
        NewWeeklyHabitTracker updatedNewWeeklyHabitTracker = newWeeklyHabitTrackerRepository.findById(newWeeklyHabitTracker.getId()).get();
        // Disconnect from session so that the updates on updatedNewWeeklyHabitTracker are not directly saved in db
        em.detach(updatedNewWeeklyHabitTracker);
        updatedNewWeeklyHabitTracker.recordID(UPDATED_RECORD_ID).habitCompletion(UPDATED_HABIT_COMPLETION).date(UPDATED_DATE);

        restNewWeeklyHabitTrackerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedNewWeeklyHabitTracker.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedNewWeeklyHabitTracker))
            )
            .andExpect(status().isOk());

        // Validate the NewWeeklyHabitTracker in the database
        List<NewWeeklyHabitTracker> newWeeklyHabitTrackerList = newWeeklyHabitTrackerRepository.findAll();
        assertThat(newWeeklyHabitTrackerList).hasSize(databaseSizeBeforeUpdate);
        NewWeeklyHabitTracker testNewWeeklyHabitTracker = newWeeklyHabitTrackerList.get(newWeeklyHabitTrackerList.size() - 1);
        assertThat(testNewWeeklyHabitTracker.getRecordID()).isEqualTo(UPDATED_RECORD_ID);
        assertThat(testNewWeeklyHabitTracker.getHabitCompletion()).isEqualTo(UPDATED_HABIT_COMPLETION);
        assertThat(testNewWeeklyHabitTracker.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingNewWeeklyHabitTracker() throws Exception {
        int databaseSizeBeforeUpdate = newWeeklyHabitTrackerRepository.findAll().size();
        newWeeklyHabitTracker.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNewWeeklyHabitTrackerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, newWeeklyHabitTracker.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(newWeeklyHabitTracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the NewWeeklyHabitTracker in the database
        List<NewWeeklyHabitTracker> newWeeklyHabitTrackerList = newWeeklyHabitTrackerRepository.findAll();
        assertThat(newWeeklyHabitTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchNewWeeklyHabitTracker() throws Exception {
        int databaseSizeBeforeUpdate = newWeeklyHabitTrackerRepository.findAll().size();
        newWeeklyHabitTracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNewWeeklyHabitTrackerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(newWeeklyHabitTracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the NewWeeklyHabitTracker in the database
        List<NewWeeklyHabitTracker> newWeeklyHabitTrackerList = newWeeklyHabitTrackerRepository.findAll();
        assertThat(newWeeklyHabitTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamNewWeeklyHabitTracker() throws Exception {
        int databaseSizeBeforeUpdate = newWeeklyHabitTrackerRepository.findAll().size();
        newWeeklyHabitTracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNewWeeklyHabitTrackerMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(newWeeklyHabitTracker))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the NewWeeklyHabitTracker in the database
        List<NewWeeklyHabitTracker> newWeeklyHabitTrackerList = newWeeklyHabitTrackerRepository.findAll();
        assertThat(newWeeklyHabitTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateNewWeeklyHabitTrackerWithPatch() throws Exception {
        // Initialize the database
        newWeeklyHabitTrackerRepository.saveAndFlush(newWeeklyHabitTracker);

        int databaseSizeBeforeUpdate = newWeeklyHabitTrackerRepository.findAll().size();

        // Update the newWeeklyHabitTracker using partial update
        NewWeeklyHabitTracker partialUpdatedNewWeeklyHabitTracker = new NewWeeklyHabitTracker();
        partialUpdatedNewWeeklyHabitTracker.setId(newWeeklyHabitTracker.getId());

        partialUpdatedNewWeeklyHabitTracker.recordID(UPDATED_RECORD_ID);

        restNewWeeklyHabitTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNewWeeklyHabitTracker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNewWeeklyHabitTracker))
            )
            .andExpect(status().isOk());

        // Validate the NewWeeklyHabitTracker in the database
        List<NewWeeklyHabitTracker> newWeeklyHabitTrackerList = newWeeklyHabitTrackerRepository.findAll();
        assertThat(newWeeklyHabitTrackerList).hasSize(databaseSizeBeforeUpdate);
        NewWeeklyHabitTracker testNewWeeklyHabitTracker = newWeeklyHabitTrackerList.get(newWeeklyHabitTrackerList.size() - 1);
        assertThat(testNewWeeklyHabitTracker.getRecordID()).isEqualTo(UPDATED_RECORD_ID);
        assertThat(testNewWeeklyHabitTracker.getHabitCompletion()).isEqualTo(DEFAULT_HABIT_COMPLETION);
        assertThat(testNewWeeklyHabitTracker.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateNewWeeklyHabitTrackerWithPatch() throws Exception {
        // Initialize the database
        newWeeklyHabitTrackerRepository.saveAndFlush(newWeeklyHabitTracker);

        int databaseSizeBeforeUpdate = newWeeklyHabitTrackerRepository.findAll().size();

        // Update the newWeeklyHabitTracker using partial update
        NewWeeklyHabitTracker partialUpdatedNewWeeklyHabitTracker = new NewWeeklyHabitTracker();
        partialUpdatedNewWeeklyHabitTracker.setId(newWeeklyHabitTracker.getId());

        partialUpdatedNewWeeklyHabitTracker.recordID(UPDATED_RECORD_ID).habitCompletion(UPDATED_HABIT_COMPLETION).date(UPDATED_DATE);

        restNewWeeklyHabitTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNewWeeklyHabitTracker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNewWeeklyHabitTracker))
            )
            .andExpect(status().isOk());

        // Validate the NewWeeklyHabitTracker in the database
        List<NewWeeklyHabitTracker> newWeeklyHabitTrackerList = newWeeklyHabitTrackerRepository.findAll();
        assertThat(newWeeklyHabitTrackerList).hasSize(databaseSizeBeforeUpdate);
        NewWeeklyHabitTracker testNewWeeklyHabitTracker = newWeeklyHabitTrackerList.get(newWeeklyHabitTrackerList.size() - 1);
        assertThat(testNewWeeklyHabitTracker.getRecordID()).isEqualTo(UPDATED_RECORD_ID);
        assertThat(testNewWeeklyHabitTracker.getHabitCompletion()).isEqualTo(UPDATED_HABIT_COMPLETION);
        assertThat(testNewWeeklyHabitTracker.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingNewWeeklyHabitTracker() throws Exception {
        int databaseSizeBeforeUpdate = newWeeklyHabitTrackerRepository.findAll().size();
        newWeeklyHabitTracker.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNewWeeklyHabitTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, newWeeklyHabitTracker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(newWeeklyHabitTracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the NewWeeklyHabitTracker in the database
        List<NewWeeklyHabitTracker> newWeeklyHabitTrackerList = newWeeklyHabitTrackerRepository.findAll();
        assertThat(newWeeklyHabitTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchNewWeeklyHabitTracker() throws Exception {
        int databaseSizeBeforeUpdate = newWeeklyHabitTrackerRepository.findAll().size();
        newWeeklyHabitTracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNewWeeklyHabitTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(newWeeklyHabitTracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the NewWeeklyHabitTracker in the database
        List<NewWeeklyHabitTracker> newWeeklyHabitTrackerList = newWeeklyHabitTrackerRepository.findAll();
        assertThat(newWeeklyHabitTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamNewWeeklyHabitTracker() throws Exception {
        int databaseSizeBeforeUpdate = newWeeklyHabitTrackerRepository.findAll().size();
        newWeeklyHabitTracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNewWeeklyHabitTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(newWeeklyHabitTracker))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the NewWeeklyHabitTracker in the database
        List<NewWeeklyHabitTracker> newWeeklyHabitTrackerList = newWeeklyHabitTrackerRepository.findAll();
        assertThat(newWeeklyHabitTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteNewWeeklyHabitTracker() throws Exception {
        // Initialize the database
        newWeeklyHabitTrackerRepository.saveAndFlush(newWeeklyHabitTracker);

        int databaseSizeBeforeDelete = newWeeklyHabitTrackerRepository.findAll().size();

        // Delete the newWeeklyHabitTracker
        restNewWeeklyHabitTrackerMockMvc
            .perform(delete(ENTITY_API_URL_ID, newWeeklyHabitTracker.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<NewWeeklyHabitTracker> newWeeklyHabitTrackerList = newWeeklyHabitTrackerRepository.findAll();
        assertThat(newWeeklyHabitTrackerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
