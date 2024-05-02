package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Duration;
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
import team.bham.domain.Grouping;
import team.bham.repository.GroupingRepository;

/**
 * Integration tests for the {@link GroupingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GroupingResourceIT {

    private static final String DEFAULT_I_D = "AAAAAAAAAA";
    private static final String UPDATED_I_D = "BBBBBBBBBB";

    private static final String DEFAULT_GROUPING_NAME = "AAAAAAAAAA";
    private static final String UPDATED_GROUPING_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_GROUPING_POINTS = 1;
    private static final Integer UPDATED_GROUPING_POINTS = 2;

    private static final Duration DEFAULT_REMAINING_TIME = Duration.ofHours(6);
    private static final Duration UPDATED_REMAINING_TIME = Duration.ofHours(12);

    private static final LocalDate DEFAULT_CURRENT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CURRENT_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/groupings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GroupingRepository groupingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGroupingMockMvc;

    private Grouping grouping;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Grouping createEntity(EntityManager em) {
        Grouping grouping = new Grouping()
            .iD(DEFAULT_I_D)
            .groupingName(DEFAULT_GROUPING_NAME)
            .groupingPoints(DEFAULT_GROUPING_POINTS)
            .remainingTime(DEFAULT_REMAINING_TIME)
            .currentDate(DEFAULT_CURRENT_DATE);
        return grouping;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Grouping createUpdatedEntity(EntityManager em) {
        Grouping grouping = new Grouping()
            .iD(UPDATED_I_D)
            .groupingName(UPDATED_GROUPING_NAME)
            .groupingPoints(UPDATED_GROUPING_POINTS)
            .remainingTime(UPDATED_REMAINING_TIME)
            .currentDate(UPDATED_CURRENT_DATE);
        return grouping;
    }

    @BeforeEach
    public void initTest() {
        grouping = createEntity(em);
    }

    @Test
    @Transactional
    void createGrouping() throws Exception {
        int databaseSizeBeforeCreate = groupingRepository.findAll().size();
        // Create the Grouping
        restGroupingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grouping)))
            .andExpect(status().isCreated());

        // Validate the Grouping in the database
        List<Grouping> groupingList = groupingRepository.findAll();
        assertThat(groupingList).hasSize(databaseSizeBeforeCreate + 1);
        Grouping testGrouping = groupingList.get(groupingList.size() - 1);
        assertThat(testGrouping.getiD()).isEqualTo(DEFAULT_I_D);
        assertThat(testGrouping.getGroupingName()).isEqualTo(DEFAULT_GROUPING_NAME);
        assertThat(testGrouping.getGroupingPoints()).isEqualTo(DEFAULT_GROUPING_POINTS);
        assertThat(testGrouping.getRemainingTime()).isEqualTo(DEFAULT_REMAINING_TIME);
        assertThat(testGrouping.getCurrentDate()).isEqualTo(DEFAULT_CURRENT_DATE);
    }

    @Test
    @Transactional
    void createGroupingWithExistingId() throws Exception {
        // Create the Grouping with an existing ID
        grouping.setId(1L);

        int databaseSizeBeforeCreate = groupingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGroupingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grouping)))
            .andExpect(status().isBadRequest());

        // Validate the Grouping in the database
        List<Grouping> groupingList = groupingRepository.findAll();
        assertThat(groupingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGroupings() throws Exception {
        // Initialize the database
        groupingRepository.saveAndFlush(grouping);

        // Get all the groupingList
        restGroupingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(grouping.getId().intValue())))
            .andExpect(jsonPath("$.[*].iD").value(hasItem(DEFAULT_I_D)))
            .andExpect(jsonPath("$.[*].groupingName").value(hasItem(DEFAULT_GROUPING_NAME)))
            .andExpect(jsonPath("$.[*].groupingPoints").value(hasItem(DEFAULT_GROUPING_POINTS)))
            .andExpect(jsonPath("$.[*].remainingTime").value(hasItem(DEFAULT_REMAINING_TIME.toString())))
            .andExpect(jsonPath("$.[*].currentDate").value(hasItem(DEFAULT_CURRENT_DATE.toString())));
    }

    @Test
    @Transactional
    void getGrouping() throws Exception {
        // Initialize the database
        groupingRepository.saveAndFlush(grouping);

        // Get the grouping
        restGroupingMockMvc
            .perform(get(ENTITY_API_URL_ID, grouping.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(grouping.getId().intValue()))
            .andExpect(jsonPath("$.iD").value(DEFAULT_I_D))
            .andExpect(jsonPath("$.groupingName").value(DEFAULT_GROUPING_NAME))
            .andExpect(jsonPath("$.groupingPoints").value(DEFAULT_GROUPING_POINTS))
            .andExpect(jsonPath("$.remainingTime").value(DEFAULT_REMAINING_TIME.toString()))
            .andExpect(jsonPath("$.currentDate").value(DEFAULT_CURRENT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingGrouping() throws Exception {
        // Get the grouping
        restGroupingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGrouping() throws Exception {
        // Initialize the database
        groupingRepository.saveAndFlush(grouping);

        int databaseSizeBeforeUpdate = groupingRepository.findAll().size();

        // Update the grouping
        Grouping updatedGrouping = groupingRepository.findById(grouping.getId()).get();
        // Disconnect from session so that the updates on updatedGrouping are not directly saved in db
        em.detach(updatedGrouping);
        updatedGrouping
            .iD(UPDATED_I_D)
            .groupingName(UPDATED_GROUPING_NAME)
            .groupingPoints(UPDATED_GROUPING_POINTS)
            .remainingTime(UPDATED_REMAINING_TIME)
            .currentDate(UPDATED_CURRENT_DATE);

        restGroupingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGrouping.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGrouping))
            )
            .andExpect(status().isOk());

        // Validate the Grouping in the database
        List<Grouping> groupingList = groupingRepository.findAll();
        assertThat(groupingList).hasSize(databaseSizeBeforeUpdate);
        Grouping testGrouping = groupingList.get(groupingList.size() - 1);
        assertThat(testGrouping.getiD()).isEqualTo(UPDATED_I_D);
        assertThat(testGrouping.getGroupingName()).isEqualTo(UPDATED_GROUPING_NAME);
        assertThat(testGrouping.getGroupingPoints()).isEqualTo(UPDATED_GROUPING_POINTS);
        assertThat(testGrouping.getRemainingTime()).isEqualTo(UPDATED_REMAINING_TIME);
        assertThat(testGrouping.getCurrentDate()).isEqualTo(UPDATED_CURRENT_DATE);
    }

    @Test
    @Transactional
    void putNonExistingGrouping() throws Exception {
        int databaseSizeBeforeUpdate = groupingRepository.findAll().size();
        grouping.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGroupingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, grouping.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grouping))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grouping in the database
        List<Grouping> groupingList = groupingRepository.findAll();
        assertThat(groupingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGrouping() throws Exception {
        int databaseSizeBeforeUpdate = groupingRepository.findAll().size();
        grouping.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGroupingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grouping))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grouping in the database
        List<Grouping> groupingList = groupingRepository.findAll();
        assertThat(groupingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGrouping() throws Exception {
        int databaseSizeBeforeUpdate = groupingRepository.findAll().size();
        grouping.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGroupingMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grouping)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Grouping in the database
        List<Grouping> groupingList = groupingRepository.findAll();
        assertThat(groupingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGroupingWithPatch() throws Exception {
        // Initialize the database
        groupingRepository.saveAndFlush(grouping);

        int databaseSizeBeforeUpdate = groupingRepository.findAll().size();

        // Update the grouping using partial update
        Grouping partialUpdatedGrouping = new Grouping();
        partialUpdatedGrouping.setId(grouping.getId());

        partialUpdatedGrouping.groupingName(UPDATED_GROUPING_NAME).currentDate(UPDATED_CURRENT_DATE);

        restGroupingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrouping.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrouping))
            )
            .andExpect(status().isOk());

        // Validate the Grouping in the database
        List<Grouping> groupingList = groupingRepository.findAll();
        assertThat(groupingList).hasSize(databaseSizeBeforeUpdate);
        Grouping testGrouping = groupingList.get(groupingList.size() - 1);
        assertThat(testGrouping.getiD()).isEqualTo(DEFAULT_I_D);
        assertThat(testGrouping.getGroupingName()).isEqualTo(UPDATED_GROUPING_NAME);
        assertThat(testGrouping.getGroupingPoints()).isEqualTo(DEFAULT_GROUPING_POINTS);
        assertThat(testGrouping.getRemainingTime()).isEqualTo(DEFAULT_REMAINING_TIME);
        assertThat(testGrouping.getCurrentDate()).isEqualTo(UPDATED_CURRENT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateGroupingWithPatch() throws Exception {
        // Initialize the database
        groupingRepository.saveAndFlush(grouping);

        int databaseSizeBeforeUpdate = groupingRepository.findAll().size();

        // Update the grouping using partial update
        Grouping partialUpdatedGrouping = new Grouping();
        partialUpdatedGrouping.setId(grouping.getId());

        partialUpdatedGrouping
            .iD(UPDATED_I_D)
            .groupingName(UPDATED_GROUPING_NAME)
            .groupingPoints(UPDATED_GROUPING_POINTS)
            .remainingTime(UPDATED_REMAINING_TIME)
            .currentDate(UPDATED_CURRENT_DATE);

        restGroupingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrouping.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrouping))
            )
            .andExpect(status().isOk());

        // Validate the Grouping in the database
        List<Grouping> groupingList = groupingRepository.findAll();
        assertThat(groupingList).hasSize(databaseSizeBeforeUpdate);
        Grouping testGrouping = groupingList.get(groupingList.size() - 1);
        assertThat(testGrouping.getiD()).isEqualTo(UPDATED_I_D);
        assertThat(testGrouping.getGroupingName()).isEqualTo(UPDATED_GROUPING_NAME);
        assertThat(testGrouping.getGroupingPoints()).isEqualTo(UPDATED_GROUPING_POINTS);
        assertThat(testGrouping.getRemainingTime()).isEqualTo(UPDATED_REMAINING_TIME);
        assertThat(testGrouping.getCurrentDate()).isEqualTo(UPDATED_CURRENT_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingGrouping() throws Exception {
        int databaseSizeBeforeUpdate = groupingRepository.findAll().size();
        grouping.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGroupingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, grouping.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grouping))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grouping in the database
        List<Grouping> groupingList = groupingRepository.findAll();
        assertThat(groupingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGrouping() throws Exception {
        int databaseSizeBeforeUpdate = groupingRepository.findAll().size();
        grouping.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGroupingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grouping))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grouping in the database
        List<Grouping> groupingList = groupingRepository.findAll();
        assertThat(groupingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGrouping() throws Exception {
        int databaseSizeBeforeUpdate = groupingRepository.findAll().size();
        grouping.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGroupingMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(grouping)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Grouping in the database
        List<Grouping> groupingList = groupingRepository.findAll();
        assertThat(groupingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGrouping() throws Exception {
        // Initialize the database
        groupingRepository.saveAndFlush(grouping);

        int databaseSizeBeforeDelete = groupingRepository.findAll().size();

        // Delete the grouping
        restGroupingMockMvc
            .perform(delete(ENTITY_API_URL_ID, grouping.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Grouping> groupingList = groupingRepository.findAll();
        assertThat(groupingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
