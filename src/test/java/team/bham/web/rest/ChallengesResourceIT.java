package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.Challenges;
import team.bham.repository.ChallengesRepository;

/**
 * Integration tests for the {@link ChallengesResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ChallengesResourceIT {

    private static final Boolean DEFAULT_SELECT_CHALLENGE = false;
    private static final Boolean UPDATED_SELECT_CHALLENGE = true;

    private static final String DEFAULT_ALL_CHALLENGES = "AAAAAAAAAA";
    private static final String UPDATED_ALL_CHALLENGES = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/challenges";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChallengesRepository challengesRepository;

    @Mock
    private ChallengesRepository challengesRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChallengesMockMvc;

    private Challenges challenges;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Challenges createEntity(EntityManager em) {
        Challenges challenges = new Challenges().selectChallenge(DEFAULT_SELECT_CHALLENGE).allChallenges(DEFAULT_ALL_CHALLENGES);
        return challenges;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Challenges createUpdatedEntity(EntityManager em) {
        Challenges challenges = new Challenges().selectChallenge(UPDATED_SELECT_CHALLENGE).allChallenges(UPDATED_ALL_CHALLENGES);
        return challenges;
    }

    @BeforeEach
    public void initTest() {
        challenges = createEntity(em);
    }

    @Test
    @Transactional
    void createChallenges() throws Exception {
        int databaseSizeBeforeCreate = challengesRepository.findAll().size();
        // Create the Challenges
        restChallengesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(challenges)))
            .andExpect(status().isCreated());

        // Validate the Challenges in the database
        List<Challenges> challengesList = challengesRepository.findAll();
        assertThat(challengesList).hasSize(databaseSizeBeforeCreate + 1);
        Challenges testChallenges = challengesList.get(challengesList.size() - 1);
        assertThat(testChallenges.getSelectChallenge()).isEqualTo(DEFAULT_SELECT_CHALLENGE);
        assertThat(testChallenges.getAllChallenges()).isEqualTo(DEFAULT_ALL_CHALLENGES);
    }

    @Test
    @Transactional
    void createChallengesWithExistingId() throws Exception {
        // Create the Challenges with an existing ID
        challenges.setId(1L);

        int databaseSizeBeforeCreate = challengesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChallengesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(challenges)))
            .andExpect(status().isBadRequest());

        // Validate the Challenges in the database
        List<Challenges> challengesList = challengesRepository.findAll();
        assertThat(challengesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllChallenges() throws Exception {
        // Initialize the database
        challengesRepository.saveAndFlush(challenges);

        // Get all the challengesList
        restChallengesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(challenges.getId().intValue())))
            .andExpect(jsonPath("$.[*].selectChallenge").value(hasItem(DEFAULT_SELECT_CHALLENGE.booleanValue())))
            .andExpect(jsonPath("$.[*].allChallenges").value(hasItem(DEFAULT_ALL_CHALLENGES)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllChallengesWithEagerRelationshipsIsEnabled() throws Exception {
        when(challengesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restChallengesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(challengesRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllChallengesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(challengesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restChallengesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(challengesRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getChallenges() throws Exception {
        // Initialize the database
        challengesRepository.saveAndFlush(challenges);

        // Get the challenges
        restChallengesMockMvc
            .perform(get(ENTITY_API_URL_ID, challenges.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(challenges.getId().intValue()))
            .andExpect(jsonPath("$.selectChallenge").value(DEFAULT_SELECT_CHALLENGE.booleanValue()))
            .andExpect(jsonPath("$.allChallenges").value(DEFAULT_ALL_CHALLENGES));
    }

    @Test
    @Transactional
    void getNonExistingChallenges() throws Exception {
        // Get the challenges
        restChallengesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingChallenges() throws Exception {
        // Initialize the database
        challengesRepository.saveAndFlush(challenges);

        int databaseSizeBeforeUpdate = challengesRepository.findAll().size();

        // Update the challenges
        Challenges updatedChallenges = challengesRepository.findById(challenges.getId()).get();
        // Disconnect from session so that the updates on updatedChallenges are not directly saved in db
        em.detach(updatedChallenges);
        updatedChallenges.selectChallenge(UPDATED_SELECT_CHALLENGE).allChallenges(UPDATED_ALL_CHALLENGES);

        restChallengesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChallenges.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChallenges))
            )
            .andExpect(status().isOk());

        // Validate the Challenges in the database
        List<Challenges> challengesList = challengesRepository.findAll();
        assertThat(challengesList).hasSize(databaseSizeBeforeUpdate);
        Challenges testChallenges = challengesList.get(challengesList.size() - 1);
        assertThat(testChallenges.getSelectChallenge()).isEqualTo(UPDATED_SELECT_CHALLENGE);
        assertThat(testChallenges.getAllChallenges()).isEqualTo(UPDATED_ALL_CHALLENGES);
    }

    @Test
    @Transactional
    void putNonExistingChallenges() throws Exception {
        int databaseSizeBeforeUpdate = challengesRepository.findAll().size();
        challenges.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChallengesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, challenges.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(challenges))
            )
            .andExpect(status().isBadRequest());

        // Validate the Challenges in the database
        List<Challenges> challengesList = challengesRepository.findAll();
        assertThat(challengesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChallenges() throws Exception {
        int databaseSizeBeforeUpdate = challengesRepository.findAll().size();
        challenges.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChallengesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(challenges))
            )
            .andExpect(status().isBadRequest());

        // Validate the Challenges in the database
        List<Challenges> challengesList = challengesRepository.findAll();
        assertThat(challengesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChallenges() throws Exception {
        int databaseSizeBeforeUpdate = challengesRepository.findAll().size();
        challenges.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChallengesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(challenges)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Challenges in the database
        List<Challenges> challengesList = challengesRepository.findAll();
        assertThat(challengesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChallengesWithPatch() throws Exception {
        // Initialize the database
        challengesRepository.saveAndFlush(challenges);

        int databaseSizeBeforeUpdate = challengesRepository.findAll().size();

        // Update the challenges using partial update
        Challenges partialUpdatedChallenges = new Challenges();
        partialUpdatedChallenges.setId(challenges.getId());

        partialUpdatedChallenges.allChallenges(UPDATED_ALL_CHALLENGES);

        restChallengesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChallenges.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChallenges))
            )
            .andExpect(status().isOk());

        // Validate the Challenges in the database
        List<Challenges> challengesList = challengesRepository.findAll();
        assertThat(challengesList).hasSize(databaseSizeBeforeUpdate);
        Challenges testChallenges = challengesList.get(challengesList.size() - 1);
        assertThat(testChallenges.getSelectChallenge()).isEqualTo(DEFAULT_SELECT_CHALLENGE);
        assertThat(testChallenges.getAllChallenges()).isEqualTo(UPDATED_ALL_CHALLENGES);
    }

    @Test
    @Transactional
    void fullUpdateChallengesWithPatch() throws Exception {
        // Initialize the database
        challengesRepository.saveAndFlush(challenges);

        int databaseSizeBeforeUpdate = challengesRepository.findAll().size();

        // Update the challenges using partial update
        Challenges partialUpdatedChallenges = new Challenges();
        partialUpdatedChallenges.setId(challenges.getId());

        partialUpdatedChallenges.selectChallenge(UPDATED_SELECT_CHALLENGE).allChallenges(UPDATED_ALL_CHALLENGES);

        restChallengesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChallenges.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChallenges))
            )
            .andExpect(status().isOk());

        // Validate the Challenges in the database
        List<Challenges> challengesList = challengesRepository.findAll();
        assertThat(challengesList).hasSize(databaseSizeBeforeUpdate);
        Challenges testChallenges = challengesList.get(challengesList.size() - 1);
        assertThat(testChallenges.getSelectChallenge()).isEqualTo(UPDATED_SELECT_CHALLENGE);
        assertThat(testChallenges.getAllChallenges()).isEqualTo(UPDATED_ALL_CHALLENGES);
    }

    @Test
    @Transactional
    void patchNonExistingChallenges() throws Exception {
        int databaseSizeBeforeUpdate = challengesRepository.findAll().size();
        challenges.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChallengesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, challenges.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(challenges))
            )
            .andExpect(status().isBadRequest());

        // Validate the Challenges in the database
        List<Challenges> challengesList = challengesRepository.findAll();
        assertThat(challengesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChallenges() throws Exception {
        int databaseSizeBeforeUpdate = challengesRepository.findAll().size();
        challenges.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChallengesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(challenges))
            )
            .andExpect(status().isBadRequest());

        // Validate the Challenges in the database
        List<Challenges> challengesList = challengesRepository.findAll();
        assertThat(challengesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChallenges() throws Exception {
        int databaseSizeBeforeUpdate = challengesRepository.findAll().size();
        challenges.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChallengesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(challenges))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Challenges in the database
        List<Challenges> challengesList = challengesRepository.findAll();
        assertThat(challengesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChallenges() throws Exception {
        // Initialize the database
        challengesRepository.saveAndFlush(challenges);

        int databaseSizeBeforeDelete = challengesRepository.findAll().size();

        // Delete the challenges
        restChallengesMockMvc
            .perform(delete(ENTITY_API_URL_ID, challenges.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Challenges> challengesList = challengesRepository.findAll();
        assertThat(challengesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
