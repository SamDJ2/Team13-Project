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
import team.bham.domain.Habitstracking;
import team.bham.repository.HabitstrackingRepository;

/**
 * Integration tests for the {@link HabitstrackingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class HabitstrackingResourceIT {

    private static final String DEFAULT_NAME_OF_HABIT = "AAAAAAAAAA";
    private static final String UPDATED_NAME_OF_HABIT = "BBBBBBBBBB";

    private static final String DEFAULT_DAY_OF_HABIT = "AAAAAAAAAA";
    private static final String UPDATED_DAY_OF_HABIT = "BBBBBBBBBB";

    private static final Integer DEFAULT_WEEK_OF_HABIT = 1;
    private static final Integer UPDATED_WEEK_OF_HABIT = 2;

    private static final Boolean DEFAULT_COMPLETED_HABIT = false;
    private static final Boolean UPDATED_COMPLETED_HABIT = true;

    private static final String DEFAULT_USERNAME_HABIT = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME_HABIT = "BBBBBBBBBB";

    private static final Integer DEFAULT_HABIT_IDEN = 1;
    private static final Integer UPDATED_HABIT_IDEN = 2;

    private static final String DEFAULT_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_SUMMARY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/habitstrackings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HabitstrackingRepository habitstrackingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHabitstrackingMockMvc;

    private Habitstracking habitstracking;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Habitstracking createEntity(EntityManager em) {
        Habitstracking habitstracking = new Habitstracking()
            .nameOfHabit(DEFAULT_NAME_OF_HABIT)
            .dayOfHabit(DEFAULT_DAY_OF_HABIT)
            .weekOfHabit(DEFAULT_WEEK_OF_HABIT)
            .completedHabit(DEFAULT_COMPLETED_HABIT)
            .usernameHabit(DEFAULT_USERNAME_HABIT)
            .habitIDEN(DEFAULT_HABIT_IDEN)
            .summary(DEFAULT_SUMMARY);
        return habitstracking;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Habitstracking createUpdatedEntity(EntityManager em) {
        Habitstracking habitstracking = new Habitstracking()
            .nameOfHabit(UPDATED_NAME_OF_HABIT)
            .dayOfHabit(UPDATED_DAY_OF_HABIT)
            .weekOfHabit(UPDATED_WEEK_OF_HABIT)
            .completedHabit(UPDATED_COMPLETED_HABIT)
            .usernameHabit(UPDATED_USERNAME_HABIT)
            .habitIDEN(UPDATED_HABIT_IDEN)
            .summary(UPDATED_SUMMARY);
        return habitstracking;
    }

    @BeforeEach
    public void initTest() {
        habitstracking = createEntity(em);
    }

    @Test
    @Transactional
    void createHabitstracking() throws Exception {
        int databaseSizeBeforeCreate = habitstrackingRepository.findAll().size();
        // Create the Habitstracking
        restHabitstrackingMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(habitstracking))
            )
            .andExpect(status().isCreated());

        // Validate the Habitstracking in the database
        List<Habitstracking> habitstrackingList = habitstrackingRepository.findAll();
        assertThat(habitstrackingList).hasSize(databaseSizeBeforeCreate + 1);
        Habitstracking testHabitstracking = habitstrackingList.get(habitstrackingList.size() - 1);
        assertThat(testHabitstracking.getNameOfHabit()).isEqualTo(DEFAULT_NAME_OF_HABIT);
        assertThat(testHabitstracking.getDayOfHabit()).isEqualTo(DEFAULT_DAY_OF_HABIT);
        assertThat(testHabitstracking.getWeekOfHabit()).isEqualTo(DEFAULT_WEEK_OF_HABIT);
        assertThat(testHabitstracking.getCompletedHabit()).isEqualTo(DEFAULT_COMPLETED_HABIT);
        assertThat(testHabitstracking.getUsernameHabit()).isEqualTo(DEFAULT_USERNAME_HABIT);
        assertThat(testHabitstracking.getHabitIDEN()).isEqualTo(DEFAULT_HABIT_IDEN);
        assertThat(testHabitstracking.getSummary()).isEqualTo(DEFAULT_SUMMARY);
    }

    @Test
    @Transactional
    void createHabitstrackingWithExistingId() throws Exception {
        // Create the Habitstracking with an existing ID
        habitstracking.setId(1L);

        int databaseSizeBeforeCreate = habitstrackingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHabitstrackingMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(habitstracking))
            )
            .andExpect(status().isBadRequest());

        // Validate the Habitstracking in the database
        List<Habitstracking> habitstrackingList = habitstrackingRepository.findAll();
        assertThat(habitstrackingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllHabitstrackings() throws Exception {
        // Initialize the database
        habitstrackingRepository.saveAndFlush(habitstracking);

        // Get all the habitstrackingList
        restHabitstrackingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(habitstracking.getId().intValue())))
            .andExpect(jsonPath("$.[*].nameOfHabit").value(hasItem(DEFAULT_NAME_OF_HABIT)))
            .andExpect(jsonPath("$.[*].dayOfHabit").value(hasItem(DEFAULT_DAY_OF_HABIT)))
            .andExpect(jsonPath("$.[*].weekOfHabit").value(hasItem(DEFAULT_WEEK_OF_HABIT)))
            .andExpect(jsonPath("$.[*].completedHabit").value(hasItem(DEFAULT_COMPLETED_HABIT.booleanValue())))
            .andExpect(jsonPath("$.[*].usernameHabit").value(hasItem(DEFAULT_USERNAME_HABIT)))
            .andExpect(jsonPath("$.[*].habitIDEN").value(hasItem(DEFAULT_HABIT_IDEN)))
            .andExpect(jsonPath("$.[*].summary").value(hasItem(DEFAULT_SUMMARY)));
    }

    @Test
    @Transactional
    void getHabitstracking() throws Exception {
        // Initialize the database
        habitstrackingRepository.saveAndFlush(habitstracking);

        // Get the habitstracking
        restHabitstrackingMockMvc
            .perform(get(ENTITY_API_URL_ID, habitstracking.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(habitstracking.getId().intValue()))
            .andExpect(jsonPath("$.nameOfHabit").value(DEFAULT_NAME_OF_HABIT))
            .andExpect(jsonPath("$.dayOfHabit").value(DEFAULT_DAY_OF_HABIT))
            .andExpect(jsonPath("$.weekOfHabit").value(DEFAULT_WEEK_OF_HABIT))
            .andExpect(jsonPath("$.completedHabit").value(DEFAULT_COMPLETED_HABIT.booleanValue()))
            .andExpect(jsonPath("$.usernameHabit").value(DEFAULT_USERNAME_HABIT))
            .andExpect(jsonPath("$.habitIDEN").value(DEFAULT_HABIT_IDEN))
            .andExpect(jsonPath("$.summary").value(DEFAULT_SUMMARY));
    }

    @Test
    @Transactional
    void getNonExistingHabitstracking() throws Exception {
        // Get the habitstracking
        restHabitstrackingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHabitstracking() throws Exception {
        // Initialize the database
        habitstrackingRepository.saveAndFlush(habitstracking);

        int databaseSizeBeforeUpdate = habitstrackingRepository.findAll().size();

        // Update the habitstracking
        Habitstracking updatedHabitstracking = habitstrackingRepository.findById(habitstracking.getId()).get();
        // Disconnect from session so that the updates on updatedHabitstracking are not directly saved in db
        em.detach(updatedHabitstracking);
        updatedHabitstracking
            .nameOfHabit(UPDATED_NAME_OF_HABIT)
            .dayOfHabit(UPDATED_DAY_OF_HABIT)
            .weekOfHabit(UPDATED_WEEK_OF_HABIT)
            .completedHabit(UPDATED_COMPLETED_HABIT)
            .usernameHabit(UPDATED_USERNAME_HABIT)
            .habitIDEN(UPDATED_HABIT_IDEN)
            .summary(UPDATED_SUMMARY);

        restHabitstrackingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHabitstracking.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHabitstracking))
            )
            .andExpect(status().isOk());

        // Validate the Habitstracking in the database
        List<Habitstracking> habitstrackingList = habitstrackingRepository.findAll();
        assertThat(habitstrackingList).hasSize(databaseSizeBeforeUpdate);
        Habitstracking testHabitstracking = habitstrackingList.get(habitstrackingList.size() - 1);
        assertThat(testHabitstracking.getNameOfHabit()).isEqualTo(UPDATED_NAME_OF_HABIT);
        assertThat(testHabitstracking.getDayOfHabit()).isEqualTo(UPDATED_DAY_OF_HABIT);
        assertThat(testHabitstracking.getWeekOfHabit()).isEqualTo(UPDATED_WEEK_OF_HABIT);
        assertThat(testHabitstracking.getCompletedHabit()).isEqualTo(UPDATED_COMPLETED_HABIT);
        assertThat(testHabitstracking.getUsernameHabit()).isEqualTo(UPDATED_USERNAME_HABIT);
        assertThat(testHabitstracking.getHabitIDEN()).isEqualTo(UPDATED_HABIT_IDEN);
        assertThat(testHabitstracking.getSummary()).isEqualTo(UPDATED_SUMMARY);
    }

    @Test
    @Transactional
    void putNonExistingHabitstracking() throws Exception {
        int databaseSizeBeforeUpdate = habitstrackingRepository.findAll().size();
        habitstracking.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHabitstrackingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, habitstracking.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(habitstracking))
            )
            .andExpect(status().isBadRequest());

        // Validate the Habitstracking in the database
        List<Habitstracking> habitstrackingList = habitstrackingRepository.findAll();
        assertThat(habitstrackingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHabitstracking() throws Exception {
        int databaseSizeBeforeUpdate = habitstrackingRepository.findAll().size();
        habitstracking.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitstrackingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(habitstracking))
            )
            .andExpect(status().isBadRequest());

        // Validate the Habitstracking in the database
        List<Habitstracking> habitstrackingList = habitstrackingRepository.findAll();
        assertThat(habitstrackingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHabitstracking() throws Exception {
        int databaseSizeBeforeUpdate = habitstrackingRepository.findAll().size();
        habitstracking.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitstrackingMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(habitstracking)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Habitstracking in the database
        List<Habitstracking> habitstrackingList = habitstrackingRepository.findAll();
        assertThat(habitstrackingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHabitstrackingWithPatch() throws Exception {
        // Initialize the database
        habitstrackingRepository.saveAndFlush(habitstracking);

        int databaseSizeBeforeUpdate = habitstrackingRepository.findAll().size();

        // Update the habitstracking using partial update
        Habitstracking partialUpdatedHabitstracking = new Habitstracking();
        partialUpdatedHabitstracking.setId(habitstracking.getId());

        partialUpdatedHabitstracking
            .nameOfHabit(UPDATED_NAME_OF_HABIT)
            .usernameHabit(UPDATED_USERNAME_HABIT)
            .habitIDEN(UPDATED_HABIT_IDEN)
            .summary(UPDATED_SUMMARY);

        restHabitstrackingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHabitstracking.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHabitstracking))
            )
            .andExpect(status().isOk());

        // Validate the Habitstracking in the database
        List<Habitstracking> habitstrackingList = habitstrackingRepository.findAll();
        assertThat(habitstrackingList).hasSize(databaseSizeBeforeUpdate);
        Habitstracking testHabitstracking = habitstrackingList.get(habitstrackingList.size() - 1);
        assertThat(testHabitstracking.getNameOfHabit()).isEqualTo(UPDATED_NAME_OF_HABIT);
        assertThat(testHabitstracking.getDayOfHabit()).isEqualTo(DEFAULT_DAY_OF_HABIT);
        assertThat(testHabitstracking.getWeekOfHabit()).isEqualTo(DEFAULT_WEEK_OF_HABIT);
        assertThat(testHabitstracking.getCompletedHabit()).isEqualTo(DEFAULT_COMPLETED_HABIT);
        assertThat(testHabitstracking.getUsernameHabit()).isEqualTo(UPDATED_USERNAME_HABIT);
        assertThat(testHabitstracking.getHabitIDEN()).isEqualTo(UPDATED_HABIT_IDEN);
        assertThat(testHabitstracking.getSummary()).isEqualTo(UPDATED_SUMMARY);
    }

    @Test
    @Transactional
    void fullUpdateHabitstrackingWithPatch() throws Exception {
        // Initialize the database
        habitstrackingRepository.saveAndFlush(habitstracking);

        int databaseSizeBeforeUpdate = habitstrackingRepository.findAll().size();

        // Update the habitstracking using partial update
        Habitstracking partialUpdatedHabitstracking = new Habitstracking();
        partialUpdatedHabitstracking.setId(habitstracking.getId());

        partialUpdatedHabitstracking
            .nameOfHabit(UPDATED_NAME_OF_HABIT)
            .dayOfHabit(UPDATED_DAY_OF_HABIT)
            .weekOfHabit(UPDATED_WEEK_OF_HABIT)
            .completedHabit(UPDATED_COMPLETED_HABIT)
            .usernameHabit(UPDATED_USERNAME_HABIT)
            .habitIDEN(UPDATED_HABIT_IDEN)
            .summary(UPDATED_SUMMARY);

        restHabitstrackingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHabitstracking.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHabitstracking))
            )
            .andExpect(status().isOk());

        // Validate the Habitstracking in the database
        List<Habitstracking> habitstrackingList = habitstrackingRepository.findAll();
        assertThat(habitstrackingList).hasSize(databaseSizeBeforeUpdate);
        Habitstracking testHabitstracking = habitstrackingList.get(habitstrackingList.size() - 1);
        assertThat(testHabitstracking.getNameOfHabit()).isEqualTo(UPDATED_NAME_OF_HABIT);
        assertThat(testHabitstracking.getDayOfHabit()).isEqualTo(UPDATED_DAY_OF_HABIT);
        assertThat(testHabitstracking.getWeekOfHabit()).isEqualTo(UPDATED_WEEK_OF_HABIT);
        assertThat(testHabitstracking.getCompletedHabit()).isEqualTo(UPDATED_COMPLETED_HABIT);
        assertThat(testHabitstracking.getUsernameHabit()).isEqualTo(UPDATED_USERNAME_HABIT);
        assertThat(testHabitstracking.getHabitIDEN()).isEqualTo(UPDATED_HABIT_IDEN);
        assertThat(testHabitstracking.getSummary()).isEqualTo(UPDATED_SUMMARY);
    }

    @Test
    @Transactional
    void patchNonExistingHabitstracking() throws Exception {
        int databaseSizeBeforeUpdate = habitstrackingRepository.findAll().size();
        habitstracking.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHabitstrackingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, habitstracking.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(habitstracking))
            )
            .andExpect(status().isBadRequest());

        // Validate the Habitstracking in the database
        List<Habitstracking> habitstrackingList = habitstrackingRepository.findAll();
        assertThat(habitstrackingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHabitstracking() throws Exception {
        int databaseSizeBeforeUpdate = habitstrackingRepository.findAll().size();
        habitstracking.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitstrackingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(habitstracking))
            )
            .andExpect(status().isBadRequest());

        // Validate the Habitstracking in the database
        List<Habitstracking> habitstrackingList = habitstrackingRepository.findAll();
        assertThat(habitstrackingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHabitstracking() throws Exception {
        int databaseSizeBeforeUpdate = habitstrackingRepository.findAll().size();
        habitstracking.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitstrackingMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(habitstracking))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Habitstracking in the database
        List<Habitstracking> habitstrackingList = habitstrackingRepository.findAll();
        assertThat(habitstrackingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHabitstracking() throws Exception {
        // Initialize the database
        habitstrackingRepository.saveAndFlush(habitstracking);

        int databaseSizeBeforeDelete = habitstrackingRepository.findAll().size();

        // Delete the habitstracking
        restHabitstrackingMockMvc
            .perform(delete(ENTITY_API_URL_ID, habitstracking.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Habitstracking> habitstrackingList = habitstrackingRepository.findAll();
        assertThat(habitstrackingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
