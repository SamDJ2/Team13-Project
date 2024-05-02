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
import team.bham.domain.UserDB;
import team.bham.repository.UserDBRepository;

/**
 * Integration tests for the {@link UserDBResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserDBResourceIT {

    private static final Long DEFAULT_USER_ID = 1L;
    private static final Long UPDATED_USER_ID = 2L;

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PASSWORD = "AAAAAAAAAA";
    private static final String UPDATED_PASSWORD = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PROFILE_PICTURE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PROFILE_PICTURE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PROFILE_PICTURE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PROFILE_PICTURE_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_USER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_USER_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/user-dbs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserDBRepository userDBRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserDBMockMvc;

    private UserDB userDB;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserDB createEntity(EntityManager em) {
        UserDB userDB = new UserDB()
            .userID(DEFAULT_USER_ID)
            .email(DEFAULT_EMAIL)
            .password(DEFAULT_PASSWORD)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .profilePicture(DEFAULT_PROFILE_PICTURE)
            .profilePictureContentType(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE)
            .userName(DEFAULT_USER_NAME);
        return userDB;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserDB createUpdatedEntity(EntityManager em) {
        UserDB userDB = new UserDB()
            .userID(UPDATED_USER_ID)
            .email(UPDATED_EMAIL)
            .password(UPDATED_PASSWORD)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .profilePicture(UPDATED_PROFILE_PICTURE)
            .profilePictureContentType(UPDATED_PROFILE_PICTURE_CONTENT_TYPE)
            .userName(UPDATED_USER_NAME);
        return userDB;
    }

    @BeforeEach
    public void initTest() {
        userDB = createEntity(em);
    }

    @Test
    @Transactional
    void createUserDB() throws Exception {
        int databaseSizeBeforeCreate = userDBRepository.findAll().size();
        // Create the UserDB
        restUserDBMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userDB)))
            .andExpect(status().isCreated());

        // Validate the UserDB in the database
        List<UserDB> userDBList = userDBRepository.findAll();
        assertThat(userDBList).hasSize(databaseSizeBeforeCreate + 1);
        UserDB testUserDB = userDBList.get(userDBList.size() - 1);
        assertThat(testUserDB.getUserID()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testUserDB.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testUserDB.getPassword()).isEqualTo(DEFAULT_PASSWORD);
        assertThat(testUserDB.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testUserDB.getProfilePicture()).isEqualTo(DEFAULT_PROFILE_PICTURE);
        assertThat(testUserDB.getProfilePictureContentType()).isEqualTo(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE);
        assertThat(testUserDB.getUserName()).isEqualTo(DEFAULT_USER_NAME);
    }

    @Test
    @Transactional
    void createUserDBWithExistingId() throws Exception {
        // Create the UserDB with an existing ID
        userDB.setId(1L);

        int databaseSizeBeforeCreate = userDBRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserDBMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userDB)))
            .andExpect(status().isBadRequest());

        // Validate the UserDB in the database
        List<UserDB> userDBList = userDBRepository.findAll();
        assertThat(userDBList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserDBS() throws Exception {
        // Initialize the database
        userDBRepository.saveAndFlush(userDB);

        // Get all the userDBList
        restUserDBMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userDB.getId().intValue())))
            .andExpect(jsonPath("$.[*].userID").value(hasItem(DEFAULT_USER_ID.intValue())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].password").value(hasItem(DEFAULT_PASSWORD)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].profilePictureContentType").value(hasItem(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].profilePicture").value(hasItem(Base64Utils.encodeToString(DEFAULT_PROFILE_PICTURE))))
            .andExpect(jsonPath("$.[*].userName").value(hasItem(DEFAULT_USER_NAME)));
    }

    @Test
    @Transactional
    void getUserDB() throws Exception {
        // Initialize the database
        userDBRepository.saveAndFlush(userDB);

        // Get the userDB
        restUserDBMockMvc
            .perform(get(ENTITY_API_URL_ID, userDB.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userDB.getId().intValue()))
            .andExpect(jsonPath("$.userID").value(DEFAULT_USER_ID.intValue()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.password").value(DEFAULT_PASSWORD))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.profilePictureContentType").value(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE))
            .andExpect(jsonPath("$.profilePicture").value(Base64Utils.encodeToString(DEFAULT_PROFILE_PICTURE)))
            .andExpect(jsonPath("$.userName").value(DEFAULT_USER_NAME));
    }

    @Test
    @Transactional
    void getNonExistingUserDB() throws Exception {
        // Get the userDB
        restUserDBMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserDB() throws Exception {
        // Initialize the database
        userDBRepository.saveAndFlush(userDB);

        int databaseSizeBeforeUpdate = userDBRepository.findAll().size();

        // Update the userDB
        UserDB updatedUserDB = userDBRepository.findById(userDB.getId()).get();
        // Disconnect from session so that the updates on updatedUserDB are not directly saved in db
        em.detach(updatedUserDB);
        updatedUserDB
            .userID(UPDATED_USER_ID)
            .email(UPDATED_EMAIL)
            .password(UPDATED_PASSWORD)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .profilePicture(UPDATED_PROFILE_PICTURE)
            .profilePictureContentType(UPDATED_PROFILE_PICTURE_CONTENT_TYPE)
            .userName(UPDATED_USER_NAME);

        restUserDBMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserDB.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserDB))
            )
            .andExpect(status().isOk());

        // Validate the UserDB in the database
        List<UserDB> userDBList = userDBRepository.findAll();
        assertThat(userDBList).hasSize(databaseSizeBeforeUpdate);
        UserDB testUserDB = userDBList.get(userDBList.size() - 1);
        assertThat(testUserDB.getUserID()).isEqualTo(UPDATED_USER_ID);
        assertThat(testUserDB.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testUserDB.getPassword()).isEqualTo(UPDATED_PASSWORD);
        assertThat(testUserDB.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testUserDB.getProfilePicture()).isEqualTo(UPDATED_PROFILE_PICTURE);
        assertThat(testUserDB.getProfilePictureContentType()).isEqualTo(UPDATED_PROFILE_PICTURE_CONTENT_TYPE);
        assertThat(testUserDB.getUserName()).isEqualTo(UPDATED_USER_NAME);
    }

    @Test
    @Transactional
    void putNonExistingUserDB() throws Exception {
        int databaseSizeBeforeUpdate = userDBRepository.findAll().size();
        userDB.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserDBMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userDB.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userDB))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserDB in the database
        List<UserDB> userDBList = userDBRepository.findAll();
        assertThat(userDBList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserDB() throws Exception {
        int databaseSizeBeforeUpdate = userDBRepository.findAll().size();
        userDB.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserDBMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userDB))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserDB in the database
        List<UserDB> userDBList = userDBRepository.findAll();
        assertThat(userDBList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserDB() throws Exception {
        int databaseSizeBeforeUpdate = userDBRepository.findAll().size();
        userDB.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserDBMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userDB)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserDB in the database
        List<UserDB> userDBList = userDBRepository.findAll();
        assertThat(userDBList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserDBWithPatch() throws Exception {
        // Initialize the database
        userDBRepository.saveAndFlush(userDB);

        int databaseSizeBeforeUpdate = userDBRepository.findAll().size();

        // Update the userDB using partial update
        UserDB partialUpdatedUserDB = new UserDB();
        partialUpdatedUserDB.setId(userDB.getId());

        partialUpdatedUserDB.email(UPDATED_EMAIL).password(UPDATED_PASSWORD);

        restUserDBMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserDB.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserDB))
            )
            .andExpect(status().isOk());

        // Validate the UserDB in the database
        List<UserDB> userDBList = userDBRepository.findAll();
        assertThat(userDBList).hasSize(databaseSizeBeforeUpdate);
        UserDB testUserDB = userDBList.get(userDBList.size() - 1);
        assertThat(testUserDB.getUserID()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testUserDB.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testUserDB.getPassword()).isEqualTo(UPDATED_PASSWORD);
        assertThat(testUserDB.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testUserDB.getProfilePicture()).isEqualTo(DEFAULT_PROFILE_PICTURE);
        assertThat(testUserDB.getProfilePictureContentType()).isEqualTo(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE);
        assertThat(testUserDB.getUserName()).isEqualTo(DEFAULT_USER_NAME);
    }

    @Test
    @Transactional
    void fullUpdateUserDBWithPatch() throws Exception {
        // Initialize the database
        userDBRepository.saveAndFlush(userDB);

        int databaseSizeBeforeUpdate = userDBRepository.findAll().size();

        // Update the userDB using partial update
        UserDB partialUpdatedUserDB = new UserDB();
        partialUpdatedUserDB.setId(userDB.getId());

        partialUpdatedUserDB
            .userID(UPDATED_USER_ID)
            .email(UPDATED_EMAIL)
            .password(UPDATED_PASSWORD)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .profilePicture(UPDATED_PROFILE_PICTURE)
            .profilePictureContentType(UPDATED_PROFILE_PICTURE_CONTENT_TYPE)
            .userName(UPDATED_USER_NAME);

        restUserDBMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserDB.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserDB))
            )
            .andExpect(status().isOk());

        // Validate the UserDB in the database
        List<UserDB> userDBList = userDBRepository.findAll();
        assertThat(userDBList).hasSize(databaseSizeBeforeUpdate);
        UserDB testUserDB = userDBList.get(userDBList.size() - 1);
        assertThat(testUserDB.getUserID()).isEqualTo(UPDATED_USER_ID);
        assertThat(testUserDB.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testUserDB.getPassword()).isEqualTo(UPDATED_PASSWORD);
        assertThat(testUserDB.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testUserDB.getProfilePicture()).isEqualTo(UPDATED_PROFILE_PICTURE);
        assertThat(testUserDB.getProfilePictureContentType()).isEqualTo(UPDATED_PROFILE_PICTURE_CONTENT_TYPE);
        assertThat(testUserDB.getUserName()).isEqualTo(UPDATED_USER_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingUserDB() throws Exception {
        int databaseSizeBeforeUpdate = userDBRepository.findAll().size();
        userDB.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserDBMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userDB.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userDB))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserDB in the database
        List<UserDB> userDBList = userDBRepository.findAll();
        assertThat(userDBList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserDB() throws Exception {
        int databaseSizeBeforeUpdate = userDBRepository.findAll().size();
        userDB.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserDBMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userDB))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserDB in the database
        List<UserDB> userDBList = userDBRepository.findAll();
        assertThat(userDBList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserDB() throws Exception {
        int databaseSizeBeforeUpdate = userDBRepository.findAll().size();
        userDB.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserDBMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userDB)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserDB in the database
        List<UserDB> userDBList = userDBRepository.findAll();
        assertThat(userDBList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserDB() throws Exception {
        // Initialize the database
        userDBRepository.saveAndFlush(userDB);

        int databaseSizeBeforeDelete = userDBRepository.findAll().size();

        // Delete the userDB
        restUserDBMockMvc
            .perform(delete(ENTITY_API_URL_ID, userDB.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserDB> userDBList = userDBRepository.findAll();
        assertThat(userDBList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
