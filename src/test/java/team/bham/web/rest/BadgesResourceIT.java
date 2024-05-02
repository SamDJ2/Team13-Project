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
import org.springframework.util.Base64Utils;
import team.bham.IntegrationTest;
import team.bham.domain.Badges;
import team.bham.repository.BadgesRepository;

/**
 * Integration tests for the {@link BadgesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BadgesResourceIT {

    private static final Integer DEFAULT_BADGE_NO = 1;
    private static final Integer UPDATED_BADGE_NO = 2;

    private static final Integer DEFAULT_REQUIRED_POINTS = 1;
    private static final Integer UPDATED_REQUIRED_POINTS = 2;

    private static final byte[] DEFAULT_BADGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_BADGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_BADGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_BADGE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/badges";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BadgesRepository badgesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBadgesMockMvc;

    private Badges badges;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Badges createEntity(EntityManager em) {
        Badges badges = new Badges()
            .badgeNo(DEFAULT_BADGE_NO)
            .requiredPoints(DEFAULT_REQUIRED_POINTS)
            .badge(DEFAULT_BADGE)
            .badgeContentType(DEFAULT_BADGE_CONTENT_TYPE);
        return badges;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Badges createUpdatedEntity(EntityManager em) {
        Badges badges = new Badges()
            .badgeNo(UPDATED_BADGE_NO)
            .requiredPoints(UPDATED_REQUIRED_POINTS)
            .badge(UPDATED_BADGE)
            .badgeContentType(UPDATED_BADGE_CONTENT_TYPE);
        return badges;
    }

    @BeforeEach
    public void initTest() {
        badges = createEntity(em);
    }

    @Test
    @Transactional
    void createBadges() throws Exception {
        int databaseSizeBeforeCreate = badgesRepository.findAll().size();
        // Create the Badges
        restBadgesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(badges)))
            .andExpect(status().isCreated());

        // Validate the Badges in the database
        List<Badges> badgesList = badgesRepository.findAll();
        assertThat(badgesList).hasSize(databaseSizeBeforeCreate + 1);
        Badges testBadges = badgesList.get(badgesList.size() - 1);
        assertThat(testBadges.getBadgeNo()).isEqualTo(DEFAULT_BADGE_NO);
        assertThat(testBadges.getRequiredPoints()).isEqualTo(DEFAULT_REQUIRED_POINTS);
        assertThat(testBadges.getBadge()).isEqualTo(DEFAULT_BADGE);
        assertThat(testBadges.getBadgeContentType()).isEqualTo(DEFAULT_BADGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createBadgesWithExistingId() throws Exception {
        // Create the Badges with an existing ID
        badges.setId(1L);

        int databaseSizeBeforeCreate = badgesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBadgesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(badges)))
            .andExpect(status().isBadRequest());

        // Validate the Badges in the database
        List<Badges> badgesList = badgesRepository.findAll();
        assertThat(badgesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBadges() throws Exception {
        // Initialize the database
        badgesRepository.saveAndFlush(badges);

        // Get all the badgesList
        restBadgesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(badges.getId().intValue())))
            .andExpect(jsonPath("$.[*].badgeNo").value(hasItem(DEFAULT_BADGE_NO)))
            .andExpect(jsonPath("$.[*].requiredPoints").value(hasItem(DEFAULT_REQUIRED_POINTS)))
            .andExpect(jsonPath("$.[*].badgeContentType").value(hasItem(DEFAULT_BADGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].badge").value(hasItem(Base64Utils.encodeToString(DEFAULT_BADGE))));
    }

    @Test
    @Transactional
    void getBadges() throws Exception {
        // Initialize the database
        badgesRepository.saveAndFlush(badges);

        // Get the badges
        restBadgesMockMvc
            .perform(get(ENTITY_API_URL_ID, badges.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(badges.getId().intValue()))
            .andExpect(jsonPath("$.badgeNo").value(DEFAULT_BADGE_NO))
            .andExpect(jsonPath("$.requiredPoints").value(DEFAULT_REQUIRED_POINTS))
            .andExpect(jsonPath("$.badgeContentType").value(DEFAULT_BADGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.badge").value(Base64Utils.encodeToString(DEFAULT_BADGE)));
    }

    @Test
    @Transactional
    void getNonExistingBadges() throws Exception {
        // Get the badges
        restBadgesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBadges() throws Exception {
        // Initialize the database
        badgesRepository.saveAndFlush(badges);

        int databaseSizeBeforeUpdate = badgesRepository.findAll().size();

        // Update the badges
        Badges updatedBadges = badgesRepository.findById(badges.getId()).get();
        // Disconnect from session so that the updates on updatedBadges are not directly saved in db
        em.detach(updatedBadges);
        updatedBadges
            .badgeNo(UPDATED_BADGE_NO)
            .requiredPoints(UPDATED_REQUIRED_POINTS)
            .badge(UPDATED_BADGE)
            .badgeContentType(UPDATED_BADGE_CONTENT_TYPE);

        restBadgesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBadges.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBadges))
            )
            .andExpect(status().isOk());

        // Validate the Badges in the database
        List<Badges> badgesList = badgesRepository.findAll();
        assertThat(badgesList).hasSize(databaseSizeBeforeUpdate);
        Badges testBadges = badgesList.get(badgesList.size() - 1);
        assertThat(testBadges.getBadgeNo()).isEqualTo(UPDATED_BADGE_NO);
        assertThat(testBadges.getRequiredPoints()).isEqualTo(UPDATED_REQUIRED_POINTS);
        assertThat(testBadges.getBadge()).isEqualTo(UPDATED_BADGE);
        assertThat(testBadges.getBadgeContentType()).isEqualTo(UPDATED_BADGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingBadges() throws Exception {
        int databaseSizeBeforeUpdate = badgesRepository.findAll().size();
        badges.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBadgesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, badges.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(badges))
            )
            .andExpect(status().isBadRequest());

        // Validate the Badges in the database
        List<Badges> badgesList = badgesRepository.findAll();
        assertThat(badgesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBadges() throws Exception {
        int databaseSizeBeforeUpdate = badgesRepository.findAll().size();
        badges.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBadgesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(badges))
            )
            .andExpect(status().isBadRequest());

        // Validate the Badges in the database
        List<Badges> badgesList = badgesRepository.findAll();
        assertThat(badgesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBadges() throws Exception {
        int databaseSizeBeforeUpdate = badgesRepository.findAll().size();
        badges.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBadgesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(badges)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Badges in the database
        List<Badges> badgesList = badgesRepository.findAll();
        assertThat(badgesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBadgesWithPatch() throws Exception {
        // Initialize the database
        badgesRepository.saveAndFlush(badges);

        int databaseSizeBeforeUpdate = badgesRepository.findAll().size();

        // Update the badges using partial update
        Badges partialUpdatedBadges = new Badges();
        partialUpdatedBadges.setId(badges.getId());

        partialUpdatedBadges.requiredPoints(UPDATED_REQUIRED_POINTS).badge(UPDATED_BADGE).badgeContentType(UPDATED_BADGE_CONTENT_TYPE);

        restBadgesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBadges.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBadges))
            )
            .andExpect(status().isOk());

        // Validate the Badges in the database
        List<Badges> badgesList = badgesRepository.findAll();
        assertThat(badgesList).hasSize(databaseSizeBeforeUpdate);
        Badges testBadges = badgesList.get(badgesList.size() - 1);
        assertThat(testBadges.getBadgeNo()).isEqualTo(DEFAULT_BADGE_NO);
        assertThat(testBadges.getRequiredPoints()).isEqualTo(UPDATED_REQUIRED_POINTS);
        assertThat(testBadges.getBadge()).isEqualTo(UPDATED_BADGE);
        assertThat(testBadges.getBadgeContentType()).isEqualTo(UPDATED_BADGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateBadgesWithPatch() throws Exception {
        // Initialize the database
        badgesRepository.saveAndFlush(badges);

        int databaseSizeBeforeUpdate = badgesRepository.findAll().size();

        // Update the badges using partial update
        Badges partialUpdatedBadges = new Badges();
        partialUpdatedBadges.setId(badges.getId());

        partialUpdatedBadges
            .badgeNo(UPDATED_BADGE_NO)
            .requiredPoints(UPDATED_REQUIRED_POINTS)
            .badge(UPDATED_BADGE)
            .badgeContentType(UPDATED_BADGE_CONTENT_TYPE);

        restBadgesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBadges.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBadges))
            )
            .andExpect(status().isOk());

        // Validate the Badges in the database
        List<Badges> badgesList = badgesRepository.findAll();
        assertThat(badgesList).hasSize(databaseSizeBeforeUpdate);
        Badges testBadges = badgesList.get(badgesList.size() - 1);
        assertThat(testBadges.getBadgeNo()).isEqualTo(UPDATED_BADGE_NO);
        assertThat(testBadges.getRequiredPoints()).isEqualTo(UPDATED_REQUIRED_POINTS);
        assertThat(testBadges.getBadge()).isEqualTo(UPDATED_BADGE);
        assertThat(testBadges.getBadgeContentType()).isEqualTo(UPDATED_BADGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingBadges() throws Exception {
        int databaseSizeBeforeUpdate = badgesRepository.findAll().size();
        badges.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBadgesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, badges.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(badges))
            )
            .andExpect(status().isBadRequest());

        // Validate the Badges in the database
        List<Badges> badgesList = badgesRepository.findAll();
        assertThat(badgesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBadges() throws Exception {
        int databaseSizeBeforeUpdate = badgesRepository.findAll().size();
        badges.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBadgesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(badges))
            )
            .andExpect(status().isBadRequest());

        // Validate the Badges in the database
        List<Badges> badgesList = badgesRepository.findAll();
        assertThat(badgesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBadges() throws Exception {
        int databaseSizeBeforeUpdate = badgesRepository.findAll().size();
        badges.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBadgesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(badges)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Badges in the database
        List<Badges> badgesList = badgesRepository.findAll();
        assertThat(badgesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBadges() throws Exception {
        // Initialize the database
        badgesRepository.saveAndFlush(badges);

        int databaseSizeBeforeDelete = badgesRepository.findAll().size();

        // Delete the badges
        restBadgesMockMvc
            .perform(delete(ENTITY_API_URL_ID, badges.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Badges> badgesList = badgesRepository.findAll();
        assertThat(badgesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
