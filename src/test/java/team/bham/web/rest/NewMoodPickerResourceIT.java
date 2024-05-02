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
import team.bham.domain.NewMoodPicker;
import team.bham.repository.NewMoodPickerRepository;

/**
 * Integration tests for the {@link NewMoodPickerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class NewMoodPickerResourceIT {

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_MOOD = "AAAAAAAAAA";
    private static final String UPDATED_MOOD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/new-mood-pickers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private NewMoodPickerRepository newMoodPickerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restNewMoodPickerMockMvc;

    private NewMoodPicker newMoodPicker;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NewMoodPicker createEntity(EntityManager em) {
        NewMoodPicker newMoodPicker = new NewMoodPicker().username(DEFAULT_USERNAME).mood(DEFAULT_MOOD);
        return newMoodPicker;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NewMoodPicker createUpdatedEntity(EntityManager em) {
        NewMoodPicker newMoodPicker = new NewMoodPicker().username(UPDATED_USERNAME).mood(UPDATED_MOOD);
        return newMoodPicker;
    }

    @BeforeEach
    public void initTest() {
        newMoodPicker = createEntity(em);
    }

    @Test
    @Transactional
    void createNewMoodPicker() throws Exception {
        int databaseSizeBeforeCreate = newMoodPickerRepository.findAll().size();
        // Create the NewMoodPicker
        restNewMoodPickerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(newMoodPicker)))
            .andExpect(status().isCreated());

        // Validate the NewMoodPicker in the database
        List<NewMoodPicker> newMoodPickerList = newMoodPickerRepository.findAll();
        assertThat(newMoodPickerList).hasSize(databaseSizeBeforeCreate + 1);
        NewMoodPicker testNewMoodPicker = newMoodPickerList.get(newMoodPickerList.size() - 1);
        assertThat(testNewMoodPicker.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testNewMoodPicker.getMood()).isEqualTo(DEFAULT_MOOD);
    }

    @Test
    @Transactional
    void createNewMoodPickerWithExistingId() throws Exception {
        // Create the NewMoodPicker with an existing ID
        newMoodPicker.setId(1L);

        int databaseSizeBeforeCreate = newMoodPickerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restNewMoodPickerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(newMoodPicker)))
            .andExpect(status().isBadRequest());

        // Validate the NewMoodPicker in the database
        List<NewMoodPicker> newMoodPickerList = newMoodPickerRepository.findAll();
        assertThat(newMoodPickerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllNewMoodPickers() throws Exception {
        // Initialize the database
        newMoodPickerRepository.saveAndFlush(newMoodPicker);

        // Get all the newMoodPickerList
        restNewMoodPickerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(newMoodPicker.getId().intValue())))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].mood").value(hasItem(DEFAULT_MOOD)));
    }

    @Test
    @Transactional
    void getNewMoodPicker() throws Exception {
        // Initialize the database
        newMoodPickerRepository.saveAndFlush(newMoodPicker);

        // Get the newMoodPicker
        restNewMoodPickerMockMvc
            .perform(get(ENTITY_API_URL_ID, newMoodPicker.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(newMoodPicker.getId().intValue()))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.mood").value(DEFAULT_MOOD));
    }

    @Test
    @Transactional
    void getNonExistingNewMoodPicker() throws Exception {
        // Get the newMoodPicker
        restNewMoodPickerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingNewMoodPicker() throws Exception {
        // Initialize the database
        newMoodPickerRepository.saveAndFlush(newMoodPicker);

        int databaseSizeBeforeUpdate = newMoodPickerRepository.findAll().size();

        // Update the newMoodPicker
        NewMoodPicker updatedNewMoodPicker = newMoodPickerRepository.findById(newMoodPicker.getId()).get();
        // Disconnect from session so that the updates on updatedNewMoodPicker are not directly saved in db
        em.detach(updatedNewMoodPicker);
        updatedNewMoodPicker.username(UPDATED_USERNAME).mood(UPDATED_MOOD);

        restNewMoodPickerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedNewMoodPicker.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedNewMoodPicker))
            )
            .andExpect(status().isOk());

        // Validate the NewMoodPicker in the database
        List<NewMoodPicker> newMoodPickerList = newMoodPickerRepository.findAll();
        assertThat(newMoodPickerList).hasSize(databaseSizeBeforeUpdate);
        NewMoodPicker testNewMoodPicker = newMoodPickerList.get(newMoodPickerList.size() - 1);
        assertThat(testNewMoodPicker.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testNewMoodPicker.getMood()).isEqualTo(UPDATED_MOOD);
    }

    @Test
    @Transactional
    void putNonExistingNewMoodPicker() throws Exception {
        int databaseSizeBeforeUpdate = newMoodPickerRepository.findAll().size();
        newMoodPicker.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNewMoodPickerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, newMoodPicker.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(newMoodPicker))
            )
            .andExpect(status().isBadRequest());

        // Validate the NewMoodPicker in the database
        List<NewMoodPicker> newMoodPickerList = newMoodPickerRepository.findAll();
        assertThat(newMoodPickerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchNewMoodPicker() throws Exception {
        int databaseSizeBeforeUpdate = newMoodPickerRepository.findAll().size();
        newMoodPicker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNewMoodPickerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(newMoodPicker))
            )
            .andExpect(status().isBadRequest());

        // Validate the NewMoodPicker in the database
        List<NewMoodPicker> newMoodPickerList = newMoodPickerRepository.findAll();
        assertThat(newMoodPickerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamNewMoodPicker() throws Exception {
        int databaseSizeBeforeUpdate = newMoodPickerRepository.findAll().size();
        newMoodPicker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNewMoodPickerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(newMoodPicker)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the NewMoodPicker in the database
        List<NewMoodPicker> newMoodPickerList = newMoodPickerRepository.findAll();
        assertThat(newMoodPickerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateNewMoodPickerWithPatch() throws Exception {
        // Initialize the database
        newMoodPickerRepository.saveAndFlush(newMoodPicker);

        int databaseSizeBeforeUpdate = newMoodPickerRepository.findAll().size();

        // Update the newMoodPicker using partial update
        NewMoodPicker partialUpdatedNewMoodPicker = new NewMoodPicker();
        partialUpdatedNewMoodPicker.setId(newMoodPicker.getId());

        restNewMoodPickerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNewMoodPicker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNewMoodPicker))
            )
            .andExpect(status().isOk());

        // Validate the NewMoodPicker in the database
        List<NewMoodPicker> newMoodPickerList = newMoodPickerRepository.findAll();
        assertThat(newMoodPickerList).hasSize(databaseSizeBeforeUpdate);
        NewMoodPicker testNewMoodPicker = newMoodPickerList.get(newMoodPickerList.size() - 1);
        assertThat(testNewMoodPicker.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testNewMoodPicker.getMood()).isEqualTo(DEFAULT_MOOD);
    }

    @Test
    @Transactional
    void fullUpdateNewMoodPickerWithPatch() throws Exception {
        // Initialize the database
        newMoodPickerRepository.saveAndFlush(newMoodPicker);

        int databaseSizeBeforeUpdate = newMoodPickerRepository.findAll().size();

        // Update the newMoodPicker using partial update
        NewMoodPicker partialUpdatedNewMoodPicker = new NewMoodPicker();
        partialUpdatedNewMoodPicker.setId(newMoodPicker.getId());

        partialUpdatedNewMoodPicker.username(UPDATED_USERNAME).mood(UPDATED_MOOD);

        restNewMoodPickerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNewMoodPicker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNewMoodPicker))
            )
            .andExpect(status().isOk());

        // Validate the NewMoodPicker in the database
        List<NewMoodPicker> newMoodPickerList = newMoodPickerRepository.findAll();
        assertThat(newMoodPickerList).hasSize(databaseSizeBeforeUpdate);
        NewMoodPicker testNewMoodPicker = newMoodPickerList.get(newMoodPickerList.size() - 1);
        assertThat(testNewMoodPicker.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testNewMoodPicker.getMood()).isEqualTo(UPDATED_MOOD);
    }

    @Test
    @Transactional
    void patchNonExistingNewMoodPicker() throws Exception {
        int databaseSizeBeforeUpdate = newMoodPickerRepository.findAll().size();
        newMoodPicker.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNewMoodPickerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, newMoodPicker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(newMoodPicker))
            )
            .andExpect(status().isBadRequest());

        // Validate the NewMoodPicker in the database
        List<NewMoodPicker> newMoodPickerList = newMoodPickerRepository.findAll();
        assertThat(newMoodPickerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchNewMoodPicker() throws Exception {
        int databaseSizeBeforeUpdate = newMoodPickerRepository.findAll().size();
        newMoodPicker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNewMoodPickerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(newMoodPicker))
            )
            .andExpect(status().isBadRequest());

        // Validate the NewMoodPicker in the database
        List<NewMoodPicker> newMoodPickerList = newMoodPickerRepository.findAll();
        assertThat(newMoodPickerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamNewMoodPicker() throws Exception {
        int databaseSizeBeforeUpdate = newMoodPickerRepository.findAll().size();
        newMoodPicker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNewMoodPickerMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(newMoodPicker))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the NewMoodPicker in the database
        List<NewMoodPicker> newMoodPickerList = newMoodPickerRepository.findAll();
        assertThat(newMoodPickerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteNewMoodPicker() throws Exception {
        // Initialize the database
        newMoodPickerRepository.saveAndFlush(newMoodPicker);

        int databaseSizeBeforeDelete = newMoodPickerRepository.findAll().size();

        // Delete the newMoodPicker
        restNewMoodPickerMockMvc
            .perform(delete(ENTITY_API_URL_ID, newMoodPicker.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<NewMoodPicker> newMoodPickerList = newMoodPickerRepository.findAll();
        assertThat(newMoodPickerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
