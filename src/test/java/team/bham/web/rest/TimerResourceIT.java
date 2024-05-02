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
import team.bham.domain.Timer;
import team.bham.domain.UserDB;
import team.bham.repository.TimerRepository;
import team.bham.service.criteria.TimerCriteria;

/**
 * Integration tests for the {@link TimerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TimerResourceIT {

    private static final LocalDate DEFAULT_START_TIME = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_TIME = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate SMALLER_START_TIME = LocalDate.ofEpochDay(-1L);

    private static final Boolean DEFAULT_IS_ACTIVE = false;
    private static final Boolean UPDATED_IS_ACTIVE = true;

    private static final String ENTITY_API_URL = "/api/timers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TimerRepository timerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTimerMockMvc;

    private Timer timer;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Timer createEntity(EntityManager em) {
        Timer timer = new Timer().startTime(DEFAULT_START_TIME).isActive(DEFAULT_IS_ACTIVE);
        return timer;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Timer createUpdatedEntity(EntityManager em) {
        Timer timer = new Timer().startTime(UPDATED_START_TIME).isActive(UPDATED_IS_ACTIVE);
        return timer;
    }

    @BeforeEach
    public void initTest() {
        timer = createEntity(em);
    }

    @Test
    @Transactional
    void createTimer() throws Exception {
        int databaseSizeBeforeCreate = timerRepository.findAll().size();
        // Create the Timer
        restTimerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timer)))
            .andExpect(status().isCreated());

        // Validate the Timer in the database
        List<Timer> timerList = timerRepository.findAll();
        assertThat(timerList).hasSize(databaseSizeBeforeCreate + 1);
        Timer testTimer = timerList.get(timerList.size() - 1);
        assertThat(testTimer.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testTimer.getIsActive()).isEqualTo(DEFAULT_IS_ACTIVE);
    }

    @Test
    @Transactional
    void createTimerWithExistingId() throws Exception {
        // Create the Timer with an existing ID
        timer.setId(1L);

        int databaseSizeBeforeCreate = timerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTimerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timer)))
            .andExpect(status().isBadRequest());

        // Validate the Timer in the database
        List<Timer> timerList = timerRepository.findAll();
        assertThat(timerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTimers() throws Exception {
        // Initialize the database
        timerRepository.saveAndFlush(timer);

        // Get all the timerList
        restTimerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(timer.getId().intValue())))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(DEFAULT_START_TIME.toString())))
            .andExpect(jsonPath("$.[*].isActive").value(hasItem(DEFAULT_IS_ACTIVE.booleanValue())));
    }

    @Test
    @Transactional
    void getTimer() throws Exception {
        // Initialize the database
        timerRepository.saveAndFlush(timer);

        // Get the timer
        restTimerMockMvc
            .perform(get(ENTITY_API_URL_ID, timer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(timer.getId().intValue()))
            .andExpect(jsonPath("$.startTime").value(DEFAULT_START_TIME.toString()))
            .andExpect(jsonPath("$.isActive").value(DEFAULT_IS_ACTIVE.booleanValue()));
    }

    @Test
    @Transactional
    void getTimersByIdFiltering() throws Exception {
        // Initialize the database
        timerRepository.saveAndFlush(timer);

        Long id = timer.getId();

        defaultTimerShouldBeFound("id.equals=" + id);
        defaultTimerShouldNotBeFound("id.notEquals=" + id);

        defaultTimerShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultTimerShouldNotBeFound("id.greaterThan=" + id);

        defaultTimerShouldBeFound("id.lessThanOrEqual=" + id);
        defaultTimerShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllTimersByStartTimeIsEqualToSomething() throws Exception {
        // Initialize the database
        timerRepository.saveAndFlush(timer);

        // Get all the timerList where startTime equals to DEFAULT_START_TIME
        defaultTimerShouldBeFound("startTime.equals=" + DEFAULT_START_TIME);

        // Get all the timerList where startTime equals to UPDATED_START_TIME
        defaultTimerShouldNotBeFound("startTime.equals=" + UPDATED_START_TIME);
    }

    @Test
    @Transactional
    void getAllTimersByStartTimeIsInShouldWork() throws Exception {
        // Initialize the database
        timerRepository.saveAndFlush(timer);

        // Get all the timerList where startTime in DEFAULT_START_TIME or UPDATED_START_TIME
        defaultTimerShouldBeFound("startTime.in=" + DEFAULT_START_TIME + "," + UPDATED_START_TIME);

        // Get all the timerList where startTime equals to UPDATED_START_TIME
        defaultTimerShouldNotBeFound("startTime.in=" + UPDATED_START_TIME);
    }

    @Test
    @Transactional
    void getAllTimersByStartTimeIsNullOrNotNull() throws Exception {
        // Initialize the database
        timerRepository.saveAndFlush(timer);

        // Get all the timerList where startTime is not null
        defaultTimerShouldBeFound("startTime.specified=true");

        // Get all the timerList where startTime is null
        defaultTimerShouldNotBeFound("startTime.specified=false");
    }

    @Test
    @Transactional
    void getAllTimersByStartTimeIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        timerRepository.saveAndFlush(timer);

        // Get all the timerList where startTime is greater than or equal to DEFAULT_START_TIME
        defaultTimerShouldBeFound("startTime.greaterThanOrEqual=" + DEFAULT_START_TIME);

        // Get all the timerList where startTime is greater than or equal to UPDATED_START_TIME
        defaultTimerShouldNotBeFound("startTime.greaterThanOrEqual=" + UPDATED_START_TIME);
    }

    @Test
    @Transactional
    void getAllTimersByStartTimeIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        timerRepository.saveAndFlush(timer);

        // Get all the timerList where startTime is less than or equal to DEFAULT_START_TIME
        defaultTimerShouldBeFound("startTime.lessThanOrEqual=" + DEFAULT_START_TIME);

        // Get all the timerList where startTime is less than or equal to SMALLER_START_TIME
        defaultTimerShouldNotBeFound("startTime.lessThanOrEqual=" + SMALLER_START_TIME);
    }

    @Test
    @Transactional
    void getAllTimersByStartTimeIsLessThanSomething() throws Exception {
        // Initialize the database
        timerRepository.saveAndFlush(timer);

        // Get all the timerList where startTime is less than DEFAULT_START_TIME
        defaultTimerShouldNotBeFound("startTime.lessThan=" + DEFAULT_START_TIME);

        // Get all the timerList where startTime is less than UPDATED_START_TIME
        defaultTimerShouldBeFound("startTime.lessThan=" + UPDATED_START_TIME);
    }

    @Test
    @Transactional
    void getAllTimersByStartTimeIsGreaterThanSomething() throws Exception {
        // Initialize the database
        timerRepository.saveAndFlush(timer);

        // Get all the timerList where startTime is greater than DEFAULT_START_TIME
        defaultTimerShouldNotBeFound("startTime.greaterThan=" + DEFAULT_START_TIME);

        // Get all the timerList where startTime is greater than SMALLER_START_TIME
        defaultTimerShouldBeFound("startTime.greaterThan=" + SMALLER_START_TIME);
    }

    @Test
    @Transactional
    void getAllTimersByIsActiveIsEqualToSomething() throws Exception {
        // Initialize the database
        timerRepository.saveAndFlush(timer);

        // Get all the timerList where isActive equals to DEFAULT_IS_ACTIVE
        defaultTimerShouldBeFound("isActive.equals=" + DEFAULT_IS_ACTIVE);

        // Get all the timerList where isActive equals to UPDATED_IS_ACTIVE
        defaultTimerShouldNotBeFound("isActive.equals=" + UPDATED_IS_ACTIVE);
    }

    @Test
    @Transactional
    void getAllTimersByIsActiveIsInShouldWork() throws Exception {
        // Initialize the database
        timerRepository.saveAndFlush(timer);

        // Get all the timerList where isActive in DEFAULT_IS_ACTIVE or UPDATED_IS_ACTIVE
        defaultTimerShouldBeFound("isActive.in=" + DEFAULT_IS_ACTIVE + "," + UPDATED_IS_ACTIVE);

        // Get all the timerList where isActive equals to UPDATED_IS_ACTIVE
        defaultTimerShouldNotBeFound("isActive.in=" + UPDATED_IS_ACTIVE);
    }

    @Test
    @Transactional
    void getAllTimersByIsActiveIsNullOrNotNull() throws Exception {
        // Initialize the database
        timerRepository.saveAndFlush(timer);

        // Get all the timerList where isActive is not null
        defaultTimerShouldBeFound("isActive.specified=true");

        // Get all the timerList where isActive is null
        defaultTimerShouldNotBeFound("isActive.specified=false");
    }

    @Test
    @Transactional
    void getAllTimersByTimingsIsEqualToSomething() throws Exception {
        UserDB timings;
        if (TestUtil.findAll(em, UserDB.class).isEmpty()) {
            timerRepository.saveAndFlush(timer);
            timings = UserDBResourceIT.createEntity(em);
        } else {
            timings = TestUtil.findAll(em, UserDB.class).get(0);
        }
        em.persist(timings);
        em.flush();
        timer.setTimings(timings);
        timerRepository.saveAndFlush(timer);
        Long timingsId = timings.getId();

        // Get all the timerList where timings equals to timingsId
        defaultTimerShouldBeFound("timingsId.equals=" + timingsId);

        // Get all the timerList where timings equals to (timingsId + 1)
        defaultTimerShouldNotBeFound("timingsId.equals=" + (timingsId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultTimerShouldBeFound(String filter) throws Exception {
        restTimerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(timer.getId().intValue())))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(DEFAULT_START_TIME.toString())))
            .andExpect(jsonPath("$.[*].isActive").value(hasItem(DEFAULT_IS_ACTIVE.booleanValue())));

        // Check, that the count call also returns 1
        restTimerMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultTimerShouldNotBeFound(String filter) throws Exception {
        restTimerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restTimerMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingTimer() throws Exception {
        // Get the timer
        restTimerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTimer() throws Exception {
        // Initialize the database
        timerRepository.saveAndFlush(timer);

        int databaseSizeBeforeUpdate = timerRepository.findAll().size();

        // Update the timer
        Timer updatedTimer = timerRepository.findById(timer.getId()).get();
        // Disconnect from session so that the updates on updatedTimer are not directly saved in db
        em.detach(updatedTimer);
        updatedTimer.startTime(UPDATED_START_TIME).isActive(UPDATED_IS_ACTIVE);

        restTimerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTimer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTimer))
            )
            .andExpect(status().isOk());

        // Validate the Timer in the database
        List<Timer> timerList = timerRepository.findAll();
        assertThat(timerList).hasSize(databaseSizeBeforeUpdate);
        Timer testTimer = timerList.get(timerList.size() - 1);
        assertThat(testTimer.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testTimer.getIsActive()).isEqualTo(UPDATED_IS_ACTIVE);
    }

    @Test
    @Transactional
    void putNonExistingTimer() throws Exception {
        int databaseSizeBeforeUpdate = timerRepository.findAll().size();
        timer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, timer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(timer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Timer in the database
        List<Timer> timerList = timerRepository.findAll();
        assertThat(timerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTimer() throws Exception {
        int databaseSizeBeforeUpdate = timerRepository.findAll().size();
        timer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(timer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Timer in the database
        List<Timer> timerList = timerRepository.findAll();
        assertThat(timerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTimer() throws Exception {
        int databaseSizeBeforeUpdate = timerRepository.findAll().size();
        timer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timer)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Timer in the database
        List<Timer> timerList = timerRepository.findAll();
        assertThat(timerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTimerWithPatch() throws Exception {
        // Initialize the database
        timerRepository.saveAndFlush(timer);

        int databaseSizeBeforeUpdate = timerRepository.findAll().size();

        // Update the timer using partial update
        Timer partialUpdatedTimer = new Timer();
        partialUpdatedTimer.setId(timer.getId());

        partialUpdatedTimer.isActive(UPDATED_IS_ACTIVE);

        restTimerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTimer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTimer))
            )
            .andExpect(status().isOk());

        // Validate the Timer in the database
        List<Timer> timerList = timerRepository.findAll();
        assertThat(timerList).hasSize(databaseSizeBeforeUpdate);
        Timer testTimer = timerList.get(timerList.size() - 1);
        assertThat(testTimer.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testTimer.getIsActive()).isEqualTo(UPDATED_IS_ACTIVE);
    }

    @Test
    @Transactional
    void fullUpdateTimerWithPatch() throws Exception {
        // Initialize the database
        timerRepository.saveAndFlush(timer);

        int databaseSizeBeforeUpdate = timerRepository.findAll().size();

        // Update the timer using partial update
        Timer partialUpdatedTimer = new Timer();
        partialUpdatedTimer.setId(timer.getId());

        partialUpdatedTimer.startTime(UPDATED_START_TIME).isActive(UPDATED_IS_ACTIVE);

        restTimerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTimer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTimer))
            )
            .andExpect(status().isOk());

        // Validate the Timer in the database
        List<Timer> timerList = timerRepository.findAll();
        assertThat(timerList).hasSize(databaseSizeBeforeUpdate);
        Timer testTimer = timerList.get(timerList.size() - 1);
        assertThat(testTimer.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testTimer.getIsActive()).isEqualTo(UPDATED_IS_ACTIVE);
    }

    @Test
    @Transactional
    void patchNonExistingTimer() throws Exception {
        int databaseSizeBeforeUpdate = timerRepository.findAll().size();
        timer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, timer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(timer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Timer in the database
        List<Timer> timerList = timerRepository.findAll();
        assertThat(timerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTimer() throws Exception {
        int databaseSizeBeforeUpdate = timerRepository.findAll().size();
        timer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(timer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Timer in the database
        List<Timer> timerList = timerRepository.findAll();
        assertThat(timerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTimer() throws Exception {
        int databaseSizeBeforeUpdate = timerRepository.findAll().size();
        timer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimerMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(timer)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Timer in the database
        List<Timer> timerList = timerRepository.findAll();
        assertThat(timerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTimer() throws Exception {
        // Initialize the database
        timerRepository.saveAndFlush(timer);

        int databaseSizeBeforeDelete = timerRepository.findAll().size();

        // Delete the timer
        restTimerMockMvc
            .perform(delete(ENTITY_API_URL_ID, timer.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Timer> timerList = timerRepository.findAll();
        assertThat(timerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
