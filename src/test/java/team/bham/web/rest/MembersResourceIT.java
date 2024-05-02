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
import team.bham.domain.Members;
import team.bham.repository.MembersRepository;

/**
 * Integration tests for the {@link MembersResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MembersResourceIT {

    private static final Long DEFAULT_GROUP_ID = 1L;
    private static final Long UPDATED_GROUP_ID = 2L;

    private static final Long DEFAULT_USER_ID = 1L;
    private static final Long UPDATED_USER_ID = 2L;

    private static final Boolean DEFAULT_LEADER = false;
    private static final Boolean UPDATED_LEADER = true;

    private static final String ENTITY_API_URL = "/api/members";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MembersRepository membersRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMembersMockMvc;

    private Members members;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Members createEntity(EntityManager em) {
        Members members = new Members().groupID(DEFAULT_GROUP_ID).userID(DEFAULT_USER_ID).leader(DEFAULT_LEADER);
        return members;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Members createUpdatedEntity(EntityManager em) {
        Members members = new Members().groupID(UPDATED_GROUP_ID).userID(UPDATED_USER_ID).leader(UPDATED_LEADER);
        return members;
    }

    @BeforeEach
    public void initTest() {
        members = createEntity(em);
    }

    @Test
    @Transactional
    void createMembers() throws Exception {
        int databaseSizeBeforeCreate = membersRepository.findAll().size();
        // Create the Members
        restMembersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(members)))
            .andExpect(status().isCreated());

        // Validate the Members in the database
        List<Members> membersList = membersRepository.findAll();
        assertThat(membersList).hasSize(databaseSizeBeforeCreate + 1);
        Members testMembers = membersList.get(membersList.size() - 1);
        assertThat(testMembers.getGroupID()).isEqualTo(DEFAULT_GROUP_ID);
        assertThat(testMembers.getUserID()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testMembers.getLeader()).isEqualTo(DEFAULT_LEADER);
    }

    @Test
    @Transactional
    void createMembersWithExistingId() throws Exception {
        // Create the Members with an existing ID
        members.setId(1L);

        int databaseSizeBeforeCreate = membersRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMembersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(members)))
            .andExpect(status().isBadRequest());

        // Validate the Members in the database
        List<Members> membersList = membersRepository.findAll();
        assertThat(membersList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMembers() throws Exception {
        // Initialize the database
        membersRepository.saveAndFlush(members);

        // Get all the membersList
        restMembersMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(members.getId().intValue())))
            .andExpect(jsonPath("$.[*].groupID").value(hasItem(DEFAULT_GROUP_ID.intValue())))
            .andExpect(jsonPath("$.[*].userID").value(hasItem(DEFAULT_USER_ID.intValue())))
            .andExpect(jsonPath("$.[*].leader").value(hasItem(DEFAULT_LEADER.booleanValue())));
    }

    @Test
    @Transactional
    void getMembers() throws Exception {
        // Initialize the database
        membersRepository.saveAndFlush(members);

        // Get the members
        restMembersMockMvc
            .perform(get(ENTITY_API_URL_ID, members.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(members.getId().intValue()))
            .andExpect(jsonPath("$.groupID").value(DEFAULT_GROUP_ID.intValue()))
            .andExpect(jsonPath("$.userID").value(DEFAULT_USER_ID.intValue()))
            .andExpect(jsonPath("$.leader").value(DEFAULT_LEADER.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingMembers() throws Exception {
        // Get the members
        restMembersMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMembers() throws Exception {
        // Initialize the database
        membersRepository.saveAndFlush(members);

        int databaseSizeBeforeUpdate = membersRepository.findAll().size();

        // Update the members
        Members updatedMembers = membersRepository.findById(members.getId()).get();
        // Disconnect from session so that the updates on updatedMembers are not directly saved in db
        em.detach(updatedMembers);
        updatedMembers.groupID(UPDATED_GROUP_ID).userID(UPDATED_USER_ID).leader(UPDATED_LEADER);

        restMembersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMembers.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMembers))
            )
            .andExpect(status().isOk());

        // Validate the Members in the database
        List<Members> membersList = membersRepository.findAll();
        assertThat(membersList).hasSize(databaseSizeBeforeUpdate);
        Members testMembers = membersList.get(membersList.size() - 1);
        assertThat(testMembers.getGroupID()).isEqualTo(UPDATED_GROUP_ID);
        assertThat(testMembers.getUserID()).isEqualTo(UPDATED_USER_ID);
        assertThat(testMembers.getLeader()).isEqualTo(UPDATED_LEADER);
    }

    @Test
    @Transactional
    void putNonExistingMembers() throws Exception {
        int databaseSizeBeforeUpdate = membersRepository.findAll().size();
        members.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMembersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, members.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(members))
            )
            .andExpect(status().isBadRequest());

        // Validate the Members in the database
        List<Members> membersList = membersRepository.findAll();
        assertThat(membersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMembers() throws Exception {
        int databaseSizeBeforeUpdate = membersRepository.findAll().size();
        members.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMembersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(members))
            )
            .andExpect(status().isBadRequest());

        // Validate the Members in the database
        List<Members> membersList = membersRepository.findAll();
        assertThat(membersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMembers() throws Exception {
        int databaseSizeBeforeUpdate = membersRepository.findAll().size();
        members.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMembersMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(members)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Members in the database
        List<Members> membersList = membersRepository.findAll();
        assertThat(membersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMembersWithPatch() throws Exception {
        // Initialize the database
        membersRepository.saveAndFlush(members);

        int databaseSizeBeforeUpdate = membersRepository.findAll().size();

        // Update the members using partial update
        Members partialUpdatedMembers = new Members();
        partialUpdatedMembers.setId(members.getId());

        partialUpdatedMembers.groupID(UPDATED_GROUP_ID).leader(UPDATED_LEADER);

        restMembersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMembers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMembers))
            )
            .andExpect(status().isOk());

        // Validate the Members in the database
        List<Members> membersList = membersRepository.findAll();
        assertThat(membersList).hasSize(databaseSizeBeforeUpdate);
        Members testMembers = membersList.get(membersList.size() - 1);
        assertThat(testMembers.getGroupID()).isEqualTo(UPDATED_GROUP_ID);
        assertThat(testMembers.getUserID()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testMembers.getLeader()).isEqualTo(UPDATED_LEADER);
    }

    @Test
    @Transactional
    void fullUpdateMembersWithPatch() throws Exception {
        // Initialize the database
        membersRepository.saveAndFlush(members);

        int databaseSizeBeforeUpdate = membersRepository.findAll().size();

        // Update the members using partial update
        Members partialUpdatedMembers = new Members();
        partialUpdatedMembers.setId(members.getId());

        partialUpdatedMembers.groupID(UPDATED_GROUP_ID).userID(UPDATED_USER_ID).leader(UPDATED_LEADER);

        restMembersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMembers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMembers))
            )
            .andExpect(status().isOk());

        // Validate the Members in the database
        List<Members> membersList = membersRepository.findAll();
        assertThat(membersList).hasSize(databaseSizeBeforeUpdate);
        Members testMembers = membersList.get(membersList.size() - 1);
        assertThat(testMembers.getGroupID()).isEqualTo(UPDATED_GROUP_ID);
        assertThat(testMembers.getUserID()).isEqualTo(UPDATED_USER_ID);
        assertThat(testMembers.getLeader()).isEqualTo(UPDATED_LEADER);
    }

    @Test
    @Transactional
    void patchNonExistingMembers() throws Exception {
        int databaseSizeBeforeUpdate = membersRepository.findAll().size();
        members.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMembersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, members.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(members))
            )
            .andExpect(status().isBadRequest());

        // Validate the Members in the database
        List<Members> membersList = membersRepository.findAll();
        assertThat(membersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMembers() throws Exception {
        int databaseSizeBeforeUpdate = membersRepository.findAll().size();
        members.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMembersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(members))
            )
            .andExpect(status().isBadRequest());

        // Validate the Members in the database
        List<Members> membersList = membersRepository.findAll();
        assertThat(membersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMembers() throws Exception {
        int databaseSizeBeforeUpdate = membersRepository.findAll().size();
        members.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMembersMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(members)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Members in the database
        List<Members> membersList = membersRepository.findAll();
        assertThat(membersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMembers() throws Exception {
        // Initialize the database
        membersRepository.saveAndFlush(members);

        int databaseSizeBeforeDelete = membersRepository.findAll().size();

        // Delete the members
        restMembersMockMvc
            .perform(delete(ENTITY_API_URL_ID, members.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Members> membersList = membersRepository.findAll();
        assertThat(membersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
