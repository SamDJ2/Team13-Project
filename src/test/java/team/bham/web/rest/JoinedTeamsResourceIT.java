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
import team.bham.domain.JoinedTeams;
import team.bham.repository.JoinedTeamsRepository;

/**
 * Integration tests for the {@link JoinedTeamsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class JoinedTeamsResourceIT {

    private static final Integer DEFAULT_TEAM_ID = 1;
    private static final Integer UPDATED_TEAM_ID = 2;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_MEMBER_SINCE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_MEMBER_SINCE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/joined-teams";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private JoinedTeamsRepository joinedTeamsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restJoinedTeamsMockMvc;

    private JoinedTeams joinedTeams;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JoinedTeams createEntity(EntityManager em) {
        JoinedTeams joinedTeams = new JoinedTeams()
            .teamID(DEFAULT_TEAM_ID)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .memberSince(DEFAULT_MEMBER_SINCE);
        return joinedTeams;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JoinedTeams createUpdatedEntity(EntityManager em) {
        JoinedTeams joinedTeams = new JoinedTeams()
            .teamID(UPDATED_TEAM_ID)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .memberSince(UPDATED_MEMBER_SINCE);
        return joinedTeams;
    }

    @BeforeEach
    public void initTest() {
        joinedTeams = createEntity(em);
    }

    @Test
    @Transactional
    void createJoinedTeams() throws Exception {
        int databaseSizeBeforeCreate = joinedTeamsRepository.findAll().size();
        // Create the JoinedTeams
        restJoinedTeamsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(joinedTeams)))
            .andExpect(status().isCreated());

        // Validate the JoinedTeams in the database
        List<JoinedTeams> joinedTeamsList = joinedTeamsRepository.findAll();
        assertThat(joinedTeamsList).hasSize(databaseSizeBeforeCreate + 1);
        JoinedTeams testJoinedTeams = joinedTeamsList.get(joinedTeamsList.size() - 1);
        assertThat(testJoinedTeams.getTeamID()).isEqualTo(DEFAULT_TEAM_ID);
        assertThat(testJoinedTeams.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testJoinedTeams.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testJoinedTeams.getMemberSince()).isEqualTo(DEFAULT_MEMBER_SINCE);
    }

    @Test
    @Transactional
    void createJoinedTeamsWithExistingId() throws Exception {
        // Create the JoinedTeams with an existing ID
        joinedTeams.setId(1L);

        int databaseSizeBeforeCreate = joinedTeamsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restJoinedTeamsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(joinedTeams)))
            .andExpect(status().isBadRequest());

        // Validate the JoinedTeams in the database
        List<JoinedTeams> joinedTeamsList = joinedTeamsRepository.findAll();
        assertThat(joinedTeamsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllJoinedTeams() throws Exception {
        // Initialize the database
        joinedTeamsRepository.saveAndFlush(joinedTeams);

        // Get all the joinedTeamsList
        restJoinedTeamsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(joinedTeams.getId().intValue())))
            .andExpect(jsonPath("$.[*].teamID").value(hasItem(DEFAULT_TEAM_ID)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].memberSince").value(hasItem(DEFAULT_MEMBER_SINCE.toString())));
    }

    @Test
    @Transactional
    void getJoinedTeams() throws Exception {
        // Initialize the database
        joinedTeamsRepository.saveAndFlush(joinedTeams);

        // Get the joinedTeams
        restJoinedTeamsMockMvc
            .perform(get(ENTITY_API_URL_ID, joinedTeams.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(joinedTeams.getId().intValue()))
            .andExpect(jsonPath("$.teamID").value(DEFAULT_TEAM_ID))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.memberSince").value(DEFAULT_MEMBER_SINCE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingJoinedTeams() throws Exception {
        // Get the joinedTeams
        restJoinedTeamsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingJoinedTeams() throws Exception {
        // Initialize the database
        joinedTeamsRepository.saveAndFlush(joinedTeams);

        int databaseSizeBeforeUpdate = joinedTeamsRepository.findAll().size();

        // Update the joinedTeams
        JoinedTeams updatedJoinedTeams = joinedTeamsRepository.findById(joinedTeams.getId()).get();
        // Disconnect from session so that the updates on updatedJoinedTeams are not directly saved in db
        em.detach(updatedJoinedTeams);
        updatedJoinedTeams.teamID(UPDATED_TEAM_ID).name(UPDATED_NAME).description(UPDATED_DESCRIPTION).memberSince(UPDATED_MEMBER_SINCE);

        restJoinedTeamsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedJoinedTeams.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedJoinedTeams))
            )
            .andExpect(status().isOk());

        // Validate the JoinedTeams in the database
        List<JoinedTeams> joinedTeamsList = joinedTeamsRepository.findAll();
        assertThat(joinedTeamsList).hasSize(databaseSizeBeforeUpdate);
        JoinedTeams testJoinedTeams = joinedTeamsList.get(joinedTeamsList.size() - 1);
        assertThat(testJoinedTeams.getTeamID()).isEqualTo(UPDATED_TEAM_ID);
        assertThat(testJoinedTeams.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testJoinedTeams.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testJoinedTeams.getMemberSince()).isEqualTo(UPDATED_MEMBER_SINCE);
    }

    @Test
    @Transactional
    void putNonExistingJoinedTeams() throws Exception {
        int databaseSizeBeforeUpdate = joinedTeamsRepository.findAll().size();
        joinedTeams.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJoinedTeamsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, joinedTeams.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(joinedTeams))
            )
            .andExpect(status().isBadRequest());

        // Validate the JoinedTeams in the database
        List<JoinedTeams> joinedTeamsList = joinedTeamsRepository.findAll();
        assertThat(joinedTeamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchJoinedTeams() throws Exception {
        int databaseSizeBeforeUpdate = joinedTeamsRepository.findAll().size();
        joinedTeams.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJoinedTeamsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(joinedTeams))
            )
            .andExpect(status().isBadRequest());

        // Validate the JoinedTeams in the database
        List<JoinedTeams> joinedTeamsList = joinedTeamsRepository.findAll();
        assertThat(joinedTeamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamJoinedTeams() throws Exception {
        int databaseSizeBeforeUpdate = joinedTeamsRepository.findAll().size();
        joinedTeams.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJoinedTeamsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(joinedTeams)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the JoinedTeams in the database
        List<JoinedTeams> joinedTeamsList = joinedTeamsRepository.findAll();
        assertThat(joinedTeamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateJoinedTeamsWithPatch() throws Exception {
        // Initialize the database
        joinedTeamsRepository.saveAndFlush(joinedTeams);

        int databaseSizeBeforeUpdate = joinedTeamsRepository.findAll().size();

        // Update the joinedTeams using partial update
        JoinedTeams partialUpdatedJoinedTeams = new JoinedTeams();
        partialUpdatedJoinedTeams.setId(joinedTeams.getId());

        partialUpdatedJoinedTeams.teamID(UPDATED_TEAM_ID).description(UPDATED_DESCRIPTION);

        restJoinedTeamsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJoinedTeams.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJoinedTeams))
            )
            .andExpect(status().isOk());

        // Validate the JoinedTeams in the database
        List<JoinedTeams> joinedTeamsList = joinedTeamsRepository.findAll();
        assertThat(joinedTeamsList).hasSize(databaseSizeBeforeUpdate);
        JoinedTeams testJoinedTeams = joinedTeamsList.get(joinedTeamsList.size() - 1);
        assertThat(testJoinedTeams.getTeamID()).isEqualTo(UPDATED_TEAM_ID);
        assertThat(testJoinedTeams.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testJoinedTeams.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testJoinedTeams.getMemberSince()).isEqualTo(DEFAULT_MEMBER_SINCE);
    }

    @Test
    @Transactional
    void fullUpdateJoinedTeamsWithPatch() throws Exception {
        // Initialize the database
        joinedTeamsRepository.saveAndFlush(joinedTeams);

        int databaseSizeBeforeUpdate = joinedTeamsRepository.findAll().size();

        // Update the joinedTeams using partial update
        JoinedTeams partialUpdatedJoinedTeams = new JoinedTeams();
        partialUpdatedJoinedTeams.setId(joinedTeams.getId());

        partialUpdatedJoinedTeams
            .teamID(UPDATED_TEAM_ID)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .memberSince(UPDATED_MEMBER_SINCE);

        restJoinedTeamsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJoinedTeams.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJoinedTeams))
            )
            .andExpect(status().isOk());

        // Validate the JoinedTeams in the database
        List<JoinedTeams> joinedTeamsList = joinedTeamsRepository.findAll();
        assertThat(joinedTeamsList).hasSize(databaseSizeBeforeUpdate);
        JoinedTeams testJoinedTeams = joinedTeamsList.get(joinedTeamsList.size() - 1);
        assertThat(testJoinedTeams.getTeamID()).isEqualTo(UPDATED_TEAM_ID);
        assertThat(testJoinedTeams.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testJoinedTeams.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testJoinedTeams.getMemberSince()).isEqualTo(UPDATED_MEMBER_SINCE);
    }

    @Test
    @Transactional
    void patchNonExistingJoinedTeams() throws Exception {
        int databaseSizeBeforeUpdate = joinedTeamsRepository.findAll().size();
        joinedTeams.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJoinedTeamsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, joinedTeams.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(joinedTeams))
            )
            .andExpect(status().isBadRequest());

        // Validate the JoinedTeams in the database
        List<JoinedTeams> joinedTeamsList = joinedTeamsRepository.findAll();
        assertThat(joinedTeamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchJoinedTeams() throws Exception {
        int databaseSizeBeforeUpdate = joinedTeamsRepository.findAll().size();
        joinedTeams.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJoinedTeamsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(joinedTeams))
            )
            .andExpect(status().isBadRequest());

        // Validate the JoinedTeams in the database
        List<JoinedTeams> joinedTeamsList = joinedTeamsRepository.findAll();
        assertThat(joinedTeamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamJoinedTeams() throws Exception {
        int databaseSizeBeforeUpdate = joinedTeamsRepository.findAll().size();
        joinedTeams.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJoinedTeamsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(joinedTeams))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the JoinedTeams in the database
        List<JoinedTeams> joinedTeamsList = joinedTeamsRepository.findAll();
        assertThat(joinedTeamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteJoinedTeams() throws Exception {
        // Initialize the database
        joinedTeamsRepository.saveAndFlush(joinedTeams);

        int databaseSizeBeforeDelete = joinedTeamsRepository.findAll().size();

        // Delete the joinedTeams
        restJoinedTeamsMockMvc
            .perform(delete(ENTITY_API_URL_ID, joinedTeams.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<JoinedTeams> joinedTeamsList = joinedTeamsRepository.findAll();
        assertThat(joinedTeamsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
