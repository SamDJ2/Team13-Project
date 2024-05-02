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
import team.bham.domain.Habit;
import team.bham.repository.HabitRepository;

/**
 * Integration tests for the {@link HabitResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class HabitResourceIT {

    private static final Long DEFAULT_HABIT_ID = 1L;
    private static final Long UPDATED_HABIT_ID = 2L;

    private static final String DEFAULT_HABIT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_HABIT_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/habits";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HabitRepository habitRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHabitMockMvc;

    private Habit habit;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Habit createEntity(EntityManager em) {
        Habit habit = new Habit().habitID(DEFAULT_HABIT_ID).habitName(DEFAULT_HABIT_NAME);
        return habit;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Habit createUpdatedEntity(EntityManager em) {
        Habit habit = new Habit().habitID(UPDATED_HABIT_ID).habitName(UPDATED_HABIT_NAME);
        return habit;
    }

    @BeforeEach
    public void initTest() {
        habit = createEntity(em);
    }

    @Test
    @Transactional
    void createHabit() throws Exception {
        int databaseSizeBeforeCreate = habitRepository.findAll().size();
        // Create the Habit
        restHabitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(habit)))
            .andExpect(status().isCreated());

        // Validate the Habit in the database
        List<Habit> habitList = habitRepository.findAll();
        assertThat(habitList).hasSize(databaseSizeBeforeCreate + 1);
        Habit testHabit = habitList.get(habitList.size() - 1);
        assertThat(testHabit.getHabitID()).isEqualTo(DEFAULT_HABIT_ID);
        assertThat(testHabit.getHabitName()).isEqualTo(DEFAULT_HABIT_NAME);
    }

    @Test
    @Transactional
    void createHabitWithExistingId() throws Exception {
        // Create the Habit with an existing ID
        habit.setId(1L);

        int databaseSizeBeforeCreate = habitRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHabitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(habit)))
            .andExpect(status().isBadRequest());

        // Validate the Habit in the database
        List<Habit> habitList = habitRepository.findAll();
        assertThat(habitList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllHabits() throws Exception {
        // Initialize the database
        habitRepository.saveAndFlush(habit);

        // Get all the habitList
        restHabitMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(habit.getId().intValue())))
            .andExpect(jsonPath("$.[*].habitID").value(hasItem(DEFAULT_HABIT_ID.intValue())))
            .andExpect(jsonPath("$.[*].habitName").value(hasItem(DEFAULT_HABIT_NAME)));
    }

    @Test
    @Transactional
    void getHabit() throws Exception {
        // Initialize the database
        habitRepository.saveAndFlush(habit);

        // Get the habit
        restHabitMockMvc
            .perform(get(ENTITY_API_URL_ID, habit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(habit.getId().intValue()))
            .andExpect(jsonPath("$.habitID").value(DEFAULT_HABIT_ID.intValue()))
            .andExpect(jsonPath("$.habitName").value(DEFAULT_HABIT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingHabit() throws Exception {
        // Get the habit
        restHabitMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHabit() throws Exception {
        // Initialize the database
        habitRepository.saveAndFlush(habit);

        int databaseSizeBeforeUpdate = habitRepository.findAll().size();

        // Update the habit
        Habit updatedHabit = habitRepository.findById(habit.getId()).get();
        // Disconnect from session so that the updates on updatedHabit are not directly saved in db
        em.detach(updatedHabit);
        updatedHabit.habitID(UPDATED_HABIT_ID).habitName(UPDATED_HABIT_NAME);

        restHabitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHabit.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHabit))
            )
            .andExpect(status().isOk());

        // Validate the Habit in the database
        List<Habit> habitList = habitRepository.findAll();
        assertThat(habitList).hasSize(databaseSizeBeforeUpdate);
        Habit testHabit = habitList.get(habitList.size() - 1);
        assertThat(testHabit.getHabitID()).isEqualTo(UPDATED_HABIT_ID);
        assertThat(testHabit.getHabitName()).isEqualTo(UPDATED_HABIT_NAME);
    }

    @Test
    @Transactional
    void putNonExistingHabit() throws Exception {
        int databaseSizeBeforeUpdate = habitRepository.findAll().size();
        habit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHabitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, habit.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(habit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Habit in the database
        List<Habit> habitList = habitRepository.findAll();
        assertThat(habitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHabit() throws Exception {
        int databaseSizeBeforeUpdate = habitRepository.findAll().size();
        habit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(habit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Habit in the database
        List<Habit> habitList = habitRepository.findAll();
        assertThat(habitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHabit() throws Exception {
        int databaseSizeBeforeUpdate = habitRepository.findAll().size();
        habit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(habit)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Habit in the database
        List<Habit> habitList = habitRepository.findAll();
        assertThat(habitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHabitWithPatch() throws Exception {
        // Initialize the database
        habitRepository.saveAndFlush(habit);

        int databaseSizeBeforeUpdate = habitRepository.findAll().size();

        // Update the habit using partial update
        Habit partialUpdatedHabit = new Habit();
        partialUpdatedHabit.setId(habit.getId());

        partialUpdatedHabit.habitName(UPDATED_HABIT_NAME);

        restHabitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHabit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHabit))
            )
            .andExpect(status().isOk());

        // Validate the Habit in the database
        List<Habit> habitList = habitRepository.findAll();
        assertThat(habitList).hasSize(databaseSizeBeforeUpdate);
        Habit testHabit = habitList.get(habitList.size() - 1);
        assertThat(testHabit.getHabitID()).isEqualTo(DEFAULT_HABIT_ID);
        assertThat(testHabit.getHabitName()).isEqualTo(UPDATED_HABIT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateHabitWithPatch() throws Exception {
        // Initialize the database
        habitRepository.saveAndFlush(habit);

        int databaseSizeBeforeUpdate = habitRepository.findAll().size();

        // Update the habit using partial update
        Habit partialUpdatedHabit = new Habit();
        partialUpdatedHabit.setId(habit.getId());

        partialUpdatedHabit.habitID(UPDATED_HABIT_ID).habitName(UPDATED_HABIT_NAME);

        restHabitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHabit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHabit))
            )
            .andExpect(status().isOk());

        // Validate the Habit in the database
        List<Habit> habitList = habitRepository.findAll();
        assertThat(habitList).hasSize(databaseSizeBeforeUpdate);
        Habit testHabit = habitList.get(habitList.size() - 1);
        assertThat(testHabit.getHabitID()).isEqualTo(UPDATED_HABIT_ID);
        assertThat(testHabit.getHabitName()).isEqualTo(UPDATED_HABIT_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingHabit() throws Exception {
        int databaseSizeBeforeUpdate = habitRepository.findAll().size();
        habit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHabitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, habit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(habit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Habit in the database
        List<Habit> habitList = habitRepository.findAll();
        assertThat(habitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHabit() throws Exception {
        int databaseSizeBeforeUpdate = habitRepository.findAll().size();
        habit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(habit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Habit in the database
        List<Habit> habitList = habitRepository.findAll();
        assertThat(habitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHabit() throws Exception {
        int databaseSizeBeforeUpdate = habitRepository.findAll().size();
        habit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(habit)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Habit in the database
        List<Habit> habitList = habitRepository.findAll();
        assertThat(habitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHabit() throws Exception {
        // Initialize the database
        habitRepository.saveAndFlush(habit);

        int databaseSizeBeforeDelete = habitRepository.findAll().size();

        // Delete the habit
        restHabitMockMvc
            .perform(delete(ENTITY_API_URL_ID, habit.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Habit> habitList = habitRepository.findAll();
        assertThat(habitList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
