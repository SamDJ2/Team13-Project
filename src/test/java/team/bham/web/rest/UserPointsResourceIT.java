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
import team.bham.domain.UserPoints;
import team.bham.repository.UserPointsRepository;

/**
 * Integration tests for the {@link UserPointsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserPointsResourceIT {

    private static final Long DEFAULT_USER_ID = 1L;
    private static final Long UPDATED_USER_ID = 2L;

    private static final Integer DEFAULT_CURRENT_POINTS = 1;
    private static final Integer UPDATED_CURRENT_POINTS = 2;

    private static final Integer DEFAULT_PREVIOUS_POINTS = 1;
    private static final Integer UPDATED_PREVIOUS_POINTS = 2;

    private static final Integer DEFAULT_TOTAL_POINTS = 1;
    private static final Integer UPDATED_TOTAL_POINTS = 2;

    private static final String ENTITY_API_URL = "/api/user-points";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserPointsRepository userPointsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserPointsMockMvc;

    private UserPoints userPoints;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserPoints createEntity(EntityManager em) {
        UserPoints userPoints = new UserPoints()
            .userID(DEFAULT_USER_ID)
            .currentPoints(DEFAULT_CURRENT_POINTS)
            .previousPoints(DEFAULT_PREVIOUS_POINTS)
            .totalPoints(DEFAULT_TOTAL_POINTS);
        return userPoints;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserPoints createUpdatedEntity(EntityManager em) {
        UserPoints userPoints = new UserPoints()
            .userID(UPDATED_USER_ID)
            .currentPoints(UPDATED_CURRENT_POINTS)
            .previousPoints(UPDATED_PREVIOUS_POINTS)
            .totalPoints(UPDATED_TOTAL_POINTS);
        return userPoints;
    }

    @BeforeEach
    public void initTest() {
        userPoints = createEntity(em);
    }

    @Test
    @Transactional
    void createUserPoints() throws Exception {
        int databaseSizeBeforeCreate = userPointsRepository.findAll().size();
        // Create the UserPoints
        restUserPointsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userPoints)))
            .andExpect(status().isCreated());

        // Validate the UserPoints in the database
        List<UserPoints> userPointsList = userPointsRepository.findAll();
        assertThat(userPointsList).hasSize(databaseSizeBeforeCreate + 1);
        UserPoints testUserPoints = userPointsList.get(userPointsList.size() - 1);
        assertThat(testUserPoints.getUserID()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testUserPoints.getCurrentPoints()).isEqualTo(DEFAULT_CURRENT_POINTS);
        assertThat(testUserPoints.getPreviousPoints()).isEqualTo(DEFAULT_PREVIOUS_POINTS);
        assertThat(testUserPoints.getTotalPoints()).isEqualTo(DEFAULT_TOTAL_POINTS);
    }

    @Test
    @Transactional
    void createUserPointsWithExistingId() throws Exception {
        // Create the UserPoints with an existing ID
        userPoints.setId(1L);

        int databaseSizeBeforeCreate = userPointsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserPointsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userPoints)))
            .andExpect(status().isBadRequest());

        // Validate the UserPoints in the database
        List<UserPoints> userPointsList = userPointsRepository.findAll();
        assertThat(userPointsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserPoints() throws Exception {
        // Initialize the database
        userPointsRepository.saveAndFlush(userPoints);

        // Get all the userPointsList
        restUserPointsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userPoints.getId().intValue())))
            .andExpect(jsonPath("$.[*].userID").value(hasItem(DEFAULT_USER_ID.intValue())))
            .andExpect(jsonPath("$.[*].currentPoints").value(hasItem(DEFAULT_CURRENT_POINTS)))
            .andExpect(jsonPath("$.[*].previousPoints").value(hasItem(DEFAULT_PREVIOUS_POINTS)))
            .andExpect(jsonPath("$.[*].totalPoints").value(hasItem(DEFAULT_TOTAL_POINTS)));
    }

    @Test
    @Transactional
    void getUserPoints() throws Exception {
        // Initialize the database
        userPointsRepository.saveAndFlush(userPoints);

        // Get the userPoints
        restUserPointsMockMvc
            .perform(get(ENTITY_API_URL_ID, userPoints.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userPoints.getId().intValue()))
            .andExpect(jsonPath("$.userID").value(DEFAULT_USER_ID.intValue()))
            .andExpect(jsonPath("$.currentPoints").value(DEFAULT_CURRENT_POINTS))
            .andExpect(jsonPath("$.previousPoints").value(DEFAULT_PREVIOUS_POINTS))
            .andExpect(jsonPath("$.totalPoints").value(DEFAULT_TOTAL_POINTS));
    }

    @Test
    @Transactional
    void getNonExistingUserPoints() throws Exception {
        // Get the userPoints
        restUserPointsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserPoints() throws Exception {
        // Initialize the database
        userPointsRepository.saveAndFlush(userPoints);

        int databaseSizeBeforeUpdate = userPointsRepository.findAll().size();

        // Update the userPoints
        UserPoints updatedUserPoints = userPointsRepository.findById(userPoints.getId()).get();
        // Disconnect from session so that the updates on updatedUserPoints are not directly saved in db
        em.detach(updatedUserPoints);
        updatedUserPoints
            .userID(UPDATED_USER_ID)
            .currentPoints(UPDATED_CURRENT_POINTS)
            .previousPoints(UPDATED_PREVIOUS_POINTS)
            .totalPoints(UPDATED_TOTAL_POINTS);

        restUserPointsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserPoints.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserPoints))
            )
            .andExpect(status().isOk());

        // Validate the UserPoints in the database
        List<UserPoints> userPointsList = userPointsRepository.findAll();
        assertThat(userPointsList).hasSize(databaseSizeBeforeUpdate);
        UserPoints testUserPoints = userPointsList.get(userPointsList.size() - 1);
        assertThat(testUserPoints.getUserID()).isEqualTo(UPDATED_USER_ID);
        assertThat(testUserPoints.getCurrentPoints()).isEqualTo(UPDATED_CURRENT_POINTS);
        assertThat(testUserPoints.getPreviousPoints()).isEqualTo(UPDATED_PREVIOUS_POINTS);
        assertThat(testUserPoints.getTotalPoints()).isEqualTo(UPDATED_TOTAL_POINTS);
    }

    @Test
    @Transactional
    void putNonExistingUserPoints() throws Exception {
        int databaseSizeBeforeUpdate = userPointsRepository.findAll().size();
        userPoints.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserPointsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userPoints.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userPoints))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPoints in the database
        List<UserPoints> userPointsList = userPointsRepository.findAll();
        assertThat(userPointsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserPoints() throws Exception {
        int databaseSizeBeforeUpdate = userPointsRepository.findAll().size();
        userPoints.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPointsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userPoints))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPoints in the database
        List<UserPoints> userPointsList = userPointsRepository.findAll();
        assertThat(userPointsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserPoints() throws Exception {
        int databaseSizeBeforeUpdate = userPointsRepository.findAll().size();
        userPoints.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPointsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userPoints)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserPoints in the database
        List<UserPoints> userPointsList = userPointsRepository.findAll();
        assertThat(userPointsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserPointsWithPatch() throws Exception {
        // Initialize the database
        userPointsRepository.saveAndFlush(userPoints);

        int databaseSizeBeforeUpdate = userPointsRepository.findAll().size();

        // Update the userPoints using partial update
        UserPoints partialUpdatedUserPoints = new UserPoints();
        partialUpdatedUserPoints.setId(userPoints.getId());

        partialUpdatedUserPoints.currentPoints(UPDATED_CURRENT_POINTS).previousPoints(UPDATED_PREVIOUS_POINTS);

        restUserPointsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserPoints.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserPoints))
            )
            .andExpect(status().isOk());

        // Validate the UserPoints in the database
        List<UserPoints> userPointsList = userPointsRepository.findAll();
        assertThat(userPointsList).hasSize(databaseSizeBeforeUpdate);
        UserPoints testUserPoints = userPointsList.get(userPointsList.size() - 1);
        assertThat(testUserPoints.getUserID()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testUserPoints.getCurrentPoints()).isEqualTo(UPDATED_CURRENT_POINTS);
        assertThat(testUserPoints.getPreviousPoints()).isEqualTo(UPDATED_PREVIOUS_POINTS);
        assertThat(testUserPoints.getTotalPoints()).isEqualTo(DEFAULT_TOTAL_POINTS);
    }

    @Test
    @Transactional
    void fullUpdateUserPointsWithPatch() throws Exception {
        // Initialize the database
        userPointsRepository.saveAndFlush(userPoints);

        int databaseSizeBeforeUpdate = userPointsRepository.findAll().size();

        // Update the userPoints using partial update
        UserPoints partialUpdatedUserPoints = new UserPoints();
        partialUpdatedUserPoints.setId(userPoints.getId());

        partialUpdatedUserPoints
            .userID(UPDATED_USER_ID)
            .currentPoints(UPDATED_CURRENT_POINTS)
            .previousPoints(UPDATED_PREVIOUS_POINTS)
            .totalPoints(UPDATED_TOTAL_POINTS);

        restUserPointsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserPoints.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserPoints))
            )
            .andExpect(status().isOk());

        // Validate the UserPoints in the database
        List<UserPoints> userPointsList = userPointsRepository.findAll();
        assertThat(userPointsList).hasSize(databaseSizeBeforeUpdate);
        UserPoints testUserPoints = userPointsList.get(userPointsList.size() - 1);
        assertThat(testUserPoints.getUserID()).isEqualTo(UPDATED_USER_ID);
        assertThat(testUserPoints.getCurrentPoints()).isEqualTo(UPDATED_CURRENT_POINTS);
        assertThat(testUserPoints.getPreviousPoints()).isEqualTo(UPDATED_PREVIOUS_POINTS);
        assertThat(testUserPoints.getTotalPoints()).isEqualTo(UPDATED_TOTAL_POINTS);
    }

    @Test
    @Transactional
    void patchNonExistingUserPoints() throws Exception {
        int databaseSizeBeforeUpdate = userPointsRepository.findAll().size();
        userPoints.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserPointsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userPoints.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userPoints))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPoints in the database
        List<UserPoints> userPointsList = userPointsRepository.findAll();
        assertThat(userPointsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserPoints() throws Exception {
        int databaseSizeBeforeUpdate = userPointsRepository.findAll().size();
        userPoints.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPointsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userPoints))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPoints in the database
        List<UserPoints> userPointsList = userPointsRepository.findAll();
        assertThat(userPointsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserPoints() throws Exception {
        int databaseSizeBeforeUpdate = userPointsRepository.findAll().size();
        userPoints.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPointsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userPoints))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserPoints in the database
        List<UserPoints> userPointsList = userPointsRepository.findAll();
        assertThat(userPointsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserPoints() throws Exception {
        // Initialize the database
        userPointsRepository.saveAndFlush(userPoints);

        int databaseSizeBeforeDelete = userPointsRepository.findAll().size();

        // Delete the userPoints
        restUserPointsMockMvc
            .perform(delete(ENTITY_API_URL_ID, userPoints.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserPoints> userPointsList = userPointsRepository.findAll();
        assertThat(userPointsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
