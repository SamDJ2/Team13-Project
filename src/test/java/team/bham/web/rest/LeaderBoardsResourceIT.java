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
import team.bham.domain.LeaderBoards;
import team.bham.repository.LeaderBoardsRepository;

/**
 * Integration tests for the {@link LeaderBoardsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LeaderBoardsResourceIT {

    private static final String DEFAULT_STANDINGS = "AAAAAAAAAA";
    private static final String UPDATED_STANDINGS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/leader-boards";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LeaderBoardsRepository leaderBoardsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLeaderBoardsMockMvc;

    private LeaderBoards leaderBoards;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LeaderBoards createEntity(EntityManager em) {
        LeaderBoards leaderBoards = new LeaderBoards().standings(DEFAULT_STANDINGS);
        return leaderBoards;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LeaderBoards createUpdatedEntity(EntityManager em) {
        LeaderBoards leaderBoards = new LeaderBoards().standings(UPDATED_STANDINGS);
        return leaderBoards;
    }

    @BeforeEach
    public void initTest() {
        leaderBoards = createEntity(em);
    }

    @Test
    @Transactional
    void createLeaderBoards() throws Exception {
        int databaseSizeBeforeCreate = leaderBoardsRepository.findAll().size();
        // Create the LeaderBoards
        restLeaderBoardsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leaderBoards)))
            .andExpect(status().isCreated());

        // Validate the LeaderBoards in the database
        List<LeaderBoards> leaderBoardsList = leaderBoardsRepository.findAll();
        assertThat(leaderBoardsList).hasSize(databaseSizeBeforeCreate + 1);
        LeaderBoards testLeaderBoards = leaderBoardsList.get(leaderBoardsList.size() - 1);
        assertThat(testLeaderBoards.getStandings()).isEqualTo(DEFAULT_STANDINGS);
    }

    @Test
    @Transactional
    void createLeaderBoardsWithExistingId() throws Exception {
        // Create the LeaderBoards with an existing ID
        leaderBoards.setId(1L);

        int databaseSizeBeforeCreate = leaderBoardsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLeaderBoardsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leaderBoards)))
            .andExpect(status().isBadRequest());

        // Validate the LeaderBoards in the database
        List<LeaderBoards> leaderBoardsList = leaderBoardsRepository.findAll();
        assertThat(leaderBoardsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLeaderBoards() throws Exception {
        // Initialize the database
        leaderBoardsRepository.saveAndFlush(leaderBoards);

        // Get all the leaderBoardsList
        restLeaderBoardsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(leaderBoards.getId().intValue())))
            .andExpect(jsonPath("$.[*].standings").value(hasItem(DEFAULT_STANDINGS)));
    }

    @Test
    @Transactional
    void getLeaderBoards() throws Exception {
        // Initialize the database
        leaderBoardsRepository.saveAndFlush(leaderBoards);

        // Get the leaderBoards
        restLeaderBoardsMockMvc
            .perform(get(ENTITY_API_URL_ID, leaderBoards.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(leaderBoards.getId().intValue()))
            .andExpect(jsonPath("$.standings").value(DEFAULT_STANDINGS));
    }

    @Test
    @Transactional
    void getNonExistingLeaderBoards() throws Exception {
        // Get the leaderBoards
        restLeaderBoardsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLeaderBoards() throws Exception {
        // Initialize the database
        leaderBoardsRepository.saveAndFlush(leaderBoards);

        int databaseSizeBeforeUpdate = leaderBoardsRepository.findAll().size();

        // Update the leaderBoards
        LeaderBoards updatedLeaderBoards = leaderBoardsRepository.findById(leaderBoards.getId()).get();
        // Disconnect from session so that the updates on updatedLeaderBoards are not directly saved in db
        em.detach(updatedLeaderBoards);
        updatedLeaderBoards.standings(UPDATED_STANDINGS);

        restLeaderBoardsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLeaderBoards.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLeaderBoards))
            )
            .andExpect(status().isOk());

        // Validate the LeaderBoards in the database
        List<LeaderBoards> leaderBoardsList = leaderBoardsRepository.findAll();
        assertThat(leaderBoardsList).hasSize(databaseSizeBeforeUpdate);
        LeaderBoards testLeaderBoards = leaderBoardsList.get(leaderBoardsList.size() - 1);
        assertThat(testLeaderBoards.getStandings()).isEqualTo(UPDATED_STANDINGS);
    }

    @Test
    @Transactional
    void putNonExistingLeaderBoards() throws Exception {
        int databaseSizeBeforeUpdate = leaderBoardsRepository.findAll().size();
        leaderBoards.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLeaderBoardsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, leaderBoards.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(leaderBoards))
            )
            .andExpect(status().isBadRequest());

        // Validate the LeaderBoards in the database
        List<LeaderBoards> leaderBoardsList = leaderBoardsRepository.findAll();
        assertThat(leaderBoardsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLeaderBoards() throws Exception {
        int databaseSizeBeforeUpdate = leaderBoardsRepository.findAll().size();
        leaderBoards.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeaderBoardsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(leaderBoards))
            )
            .andExpect(status().isBadRequest());

        // Validate the LeaderBoards in the database
        List<LeaderBoards> leaderBoardsList = leaderBoardsRepository.findAll();
        assertThat(leaderBoardsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLeaderBoards() throws Exception {
        int databaseSizeBeforeUpdate = leaderBoardsRepository.findAll().size();
        leaderBoards.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeaderBoardsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leaderBoards)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LeaderBoards in the database
        List<LeaderBoards> leaderBoardsList = leaderBoardsRepository.findAll();
        assertThat(leaderBoardsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLeaderBoardsWithPatch() throws Exception {
        // Initialize the database
        leaderBoardsRepository.saveAndFlush(leaderBoards);

        int databaseSizeBeforeUpdate = leaderBoardsRepository.findAll().size();

        // Update the leaderBoards using partial update
        LeaderBoards partialUpdatedLeaderBoards = new LeaderBoards();
        partialUpdatedLeaderBoards.setId(leaderBoards.getId());

        partialUpdatedLeaderBoards.standings(UPDATED_STANDINGS);

        restLeaderBoardsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLeaderBoards.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLeaderBoards))
            )
            .andExpect(status().isOk());

        // Validate the LeaderBoards in the database
        List<LeaderBoards> leaderBoardsList = leaderBoardsRepository.findAll();
        assertThat(leaderBoardsList).hasSize(databaseSizeBeforeUpdate);
        LeaderBoards testLeaderBoards = leaderBoardsList.get(leaderBoardsList.size() - 1);
        assertThat(testLeaderBoards.getStandings()).isEqualTo(UPDATED_STANDINGS);
    }

    @Test
    @Transactional
    void fullUpdateLeaderBoardsWithPatch() throws Exception {
        // Initialize the database
        leaderBoardsRepository.saveAndFlush(leaderBoards);

        int databaseSizeBeforeUpdate = leaderBoardsRepository.findAll().size();

        // Update the leaderBoards using partial update
        LeaderBoards partialUpdatedLeaderBoards = new LeaderBoards();
        partialUpdatedLeaderBoards.setId(leaderBoards.getId());

        partialUpdatedLeaderBoards.standings(UPDATED_STANDINGS);

        restLeaderBoardsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLeaderBoards.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLeaderBoards))
            )
            .andExpect(status().isOk());

        // Validate the LeaderBoards in the database
        List<LeaderBoards> leaderBoardsList = leaderBoardsRepository.findAll();
        assertThat(leaderBoardsList).hasSize(databaseSizeBeforeUpdate);
        LeaderBoards testLeaderBoards = leaderBoardsList.get(leaderBoardsList.size() - 1);
        assertThat(testLeaderBoards.getStandings()).isEqualTo(UPDATED_STANDINGS);
    }

    @Test
    @Transactional
    void patchNonExistingLeaderBoards() throws Exception {
        int databaseSizeBeforeUpdate = leaderBoardsRepository.findAll().size();
        leaderBoards.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLeaderBoardsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, leaderBoards.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(leaderBoards))
            )
            .andExpect(status().isBadRequest());

        // Validate the LeaderBoards in the database
        List<LeaderBoards> leaderBoardsList = leaderBoardsRepository.findAll();
        assertThat(leaderBoardsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLeaderBoards() throws Exception {
        int databaseSizeBeforeUpdate = leaderBoardsRepository.findAll().size();
        leaderBoards.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeaderBoardsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(leaderBoards))
            )
            .andExpect(status().isBadRequest());

        // Validate the LeaderBoards in the database
        List<LeaderBoards> leaderBoardsList = leaderBoardsRepository.findAll();
        assertThat(leaderBoardsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLeaderBoards() throws Exception {
        int databaseSizeBeforeUpdate = leaderBoardsRepository.findAll().size();
        leaderBoards.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeaderBoardsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(leaderBoards))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LeaderBoards in the database
        List<LeaderBoards> leaderBoardsList = leaderBoardsRepository.findAll();
        assertThat(leaderBoardsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLeaderBoards() throws Exception {
        // Initialize the database
        leaderBoardsRepository.saveAndFlush(leaderBoards);

        int databaseSizeBeforeDelete = leaderBoardsRepository.findAll().size();

        // Delete the leaderBoards
        restLeaderBoardsMockMvc
            .perform(delete(ENTITY_API_URL_ID, leaderBoards.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LeaderBoards> leaderBoardsList = leaderBoardsRepository.findAll();
        assertThat(leaderBoardsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
