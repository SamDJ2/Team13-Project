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
import team.bham.domain.MoodJournalPage;
import team.bham.domain.enumeration.TabLabel;
import team.bham.repository.MoodJournalPageRepository;

/**
 * Integration tests for the {@link MoodJournalPageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MoodJournalPageResourceIT {

    private static final String DEFAULT_ALL_ENTRIES = "AAAAAAAAAA";
    private static final String UPDATED_ALL_ENTRIES = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final TabLabel DEFAULT_CURRENT_TAB = TabLabel.All;
    private static final TabLabel UPDATED_CURRENT_TAB = TabLabel.Entries;

    private static final String ENTITY_API_URL = "/api/mood-journal-pages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MoodJournalPageRepository moodJournalPageRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMoodJournalPageMockMvc;

    private MoodJournalPage moodJournalPage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MoodJournalPage createEntity(EntityManager em) {
        MoodJournalPage moodJournalPage = new MoodJournalPage()
            .allEntries(DEFAULT_ALL_ENTRIES)
            .date(DEFAULT_DATE)
            .currentTab(DEFAULT_CURRENT_TAB);
        return moodJournalPage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MoodJournalPage createUpdatedEntity(EntityManager em) {
        MoodJournalPage moodJournalPage = new MoodJournalPage()
            .allEntries(UPDATED_ALL_ENTRIES)
            .date(UPDATED_DATE)
            .currentTab(UPDATED_CURRENT_TAB);
        return moodJournalPage;
    }

    @BeforeEach
    public void initTest() {
        moodJournalPage = createEntity(em);
    }

    @Test
    @Transactional
    void createMoodJournalPage() throws Exception {
        int databaseSizeBeforeCreate = moodJournalPageRepository.findAll().size();
        // Create the MoodJournalPage
        restMoodJournalPageMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(moodJournalPage))
            )
            .andExpect(status().isCreated());

        // Validate the MoodJournalPage in the database
        List<MoodJournalPage> moodJournalPageList = moodJournalPageRepository.findAll();
        assertThat(moodJournalPageList).hasSize(databaseSizeBeforeCreate + 1);
        MoodJournalPage testMoodJournalPage = moodJournalPageList.get(moodJournalPageList.size() - 1);
        assertThat(testMoodJournalPage.getAllEntries()).isEqualTo(DEFAULT_ALL_ENTRIES);
        assertThat(testMoodJournalPage.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testMoodJournalPage.getCurrentTab()).isEqualTo(DEFAULT_CURRENT_TAB);
    }

    @Test
    @Transactional
    void createMoodJournalPageWithExistingId() throws Exception {
        // Create the MoodJournalPage with an existing ID
        moodJournalPage.setId(1L);

        int databaseSizeBeforeCreate = moodJournalPageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMoodJournalPageMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(moodJournalPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the MoodJournalPage in the database
        List<MoodJournalPage> moodJournalPageList = moodJournalPageRepository.findAll();
        assertThat(moodJournalPageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMoodJournalPages() throws Exception {
        // Initialize the database
        moodJournalPageRepository.saveAndFlush(moodJournalPage);

        // Get all the moodJournalPageList
        restMoodJournalPageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(moodJournalPage.getId().intValue())))
            .andExpect(jsonPath("$.[*].allEntries").value(hasItem(DEFAULT_ALL_ENTRIES)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].currentTab").value(hasItem(DEFAULT_CURRENT_TAB.toString())));
    }

    @Test
    @Transactional
    void getMoodJournalPage() throws Exception {
        // Initialize the database
        moodJournalPageRepository.saveAndFlush(moodJournalPage);

        // Get the moodJournalPage
        restMoodJournalPageMockMvc
            .perform(get(ENTITY_API_URL_ID, moodJournalPage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(moodJournalPage.getId().intValue()))
            .andExpect(jsonPath("$.allEntries").value(DEFAULT_ALL_ENTRIES))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.currentTab").value(DEFAULT_CURRENT_TAB.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMoodJournalPage() throws Exception {
        // Get the moodJournalPage
        restMoodJournalPageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMoodJournalPage() throws Exception {
        // Initialize the database
        moodJournalPageRepository.saveAndFlush(moodJournalPage);

        int databaseSizeBeforeUpdate = moodJournalPageRepository.findAll().size();

        // Update the moodJournalPage
        MoodJournalPage updatedMoodJournalPage = moodJournalPageRepository.findById(moodJournalPage.getId()).get();
        // Disconnect from session so that the updates on updatedMoodJournalPage are not directly saved in db
        em.detach(updatedMoodJournalPage);
        updatedMoodJournalPage.allEntries(UPDATED_ALL_ENTRIES).date(UPDATED_DATE).currentTab(UPDATED_CURRENT_TAB);

        restMoodJournalPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMoodJournalPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMoodJournalPage))
            )
            .andExpect(status().isOk());

        // Validate the MoodJournalPage in the database
        List<MoodJournalPage> moodJournalPageList = moodJournalPageRepository.findAll();
        assertThat(moodJournalPageList).hasSize(databaseSizeBeforeUpdate);
        MoodJournalPage testMoodJournalPage = moodJournalPageList.get(moodJournalPageList.size() - 1);
        assertThat(testMoodJournalPage.getAllEntries()).isEqualTo(UPDATED_ALL_ENTRIES);
        assertThat(testMoodJournalPage.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testMoodJournalPage.getCurrentTab()).isEqualTo(UPDATED_CURRENT_TAB);
    }

    @Test
    @Transactional
    void putNonExistingMoodJournalPage() throws Exception {
        int databaseSizeBeforeUpdate = moodJournalPageRepository.findAll().size();
        moodJournalPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMoodJournalPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, moodJournalPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(moodJournalPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the MoodJournalPage in the database
        List<MoodJournalPage> moodJournalPageList = moodJournalPageRepository.findAll();
        assertThat(moodJournalPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMoodJournalPage() throws Exception {
        int databaseSizeBeforeUpdate = moodJournalPageRepository.findAll().size();
        moodJournalPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoodJournalPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(moodJournalPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the MoodJournalPage in the database
        List<MoodJournalPage> moodJournalPageList = moodJournalPageRepository.findAll();
        assertThat(moodJournalPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMoodJournalPage() throws Exception {
        int databaseSizeBeforeUpdate = moodJournalPageRepository.findAll().size();
        moodJournalPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoodJournalPageMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(moodJournalPage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MoodJournalPage in the database
        List<MoodJournalPage> moodJournalPageList = moodJournalPageRepository.findAll();
        assertThat(moodJournalPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMoodJournalPageWithPatch() throws Exception {
        // Initialize the database
        moodJournalPageRepository.saveAndFlush(moodJournalPage);

        int databaseSizeBeforeUpdate = moodJournalPageRepository.findAll().size();

        // Update the moodJournalPage using partial update
        MoodJournalPage partialUpdatedMoodJournalPage = new MoodJournalPage();
        partialUpdatedMoodJournalPage.setId(moodJournalPage.getId());

        partialUpdatedMoodJournalPage.currentTab(UPDATED_CURRENT_TAB);

        restMoodJournalPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMoodJournalPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMoodJournalPage))
            )
            .andExpect(status().isOk());

        // Validate the MoodJournalPage in the database
        List<MoodJournalPage> moodJournalPageList = moodJournalPageRepository.findAll();
        assertThat(moodJournalPageList).hasSize(databaseSizeBeforeUpdate);
        MoodJournalPage testMoodJournalPage = moodJournalPageList.get(moodJournalPageList.size() - 1);
        assertThat(testMoodJournalPage.getAllEntries()).isEqualTo(DEFAULT_ALL_ENTRIES);
        assertThat(testMoodJournalPage.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testMoodJournalPage.getCurrentTab()).isEqualTo(UPDATED_CURRENT_TAB);
    }

    @Test
    @Transactional
    void fullUpdateMoodJournalPageWithPatch() throws Exception {
        // Initialize the database
        moodJournalPageRepository.saveAndFlush(moodJournalPage);

        int databaseSizeBeforeUpdate = moodJournalPageRepository.findAll().size();

        // Update the moodJournalPage using partial update
        MoodJournalPage partialUpdatedMoodJournalPage = new MoodJournalPage();
        partialUpdatedMoodJournalPage.setId(moodJournalPage.getId());

        partialUpdatedMoodJournalPage.allEntries(UPDATED_ALL_ENTRIES).date(UPDATED_DATE).currentTab(UPDATED_CURRENT_TAB);

        restMoodJournalPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMoodJournalPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMoodJournalPage))
            )
            .andExpect(status().isOk());

        // Validate the MoodJournalPage in the database
        List<MoodJournalPage> moodJournalPageList = moodJournalPageRepository.findAll();
        assertThat(moodJournalPageList).hasSize(databaseSizeBeforeUpdate);
        MoodJournalPage testMoodJournalPage = moodJournalPageList.get(moodJournalPageList.size() - 1);
        assertThat(testMoodJournalPage.getAllEntries()).isEqualTo(UPDATED_ALL_ENTRIES);
        assertThat(testMoodJournalPage.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testMoodJournalPage.getCurrentTab()).isEqualTo(UPDATED_CURRENT_TAB);
    }

    @Test
    @Transactional
    void patchNonExistingMoodJournalPage() throws Exception {
        int databaseSizeBeforeUpdate = moodJournalPageRepository.findAll().size();
        moodJournalPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMoodJournalPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, moodJournalPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(moodJournalPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the MoodJournalPage in the database
        List<MoodJournalPage> moodJournalPageList = moodJournalPageRepository.findAll();
        assertThat(moodJournalPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMoodJournalPage() throws Exception {
        int databaseSizeBeforeUpdate = moodJournalPageRepository.findAll().size();
        moodJournalPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoodJournalPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(moodJournalPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the MoodJournalPage in the database
        List<MoodJournalPage> moodJournalPageList = moodJournalPageRepository.findAll();
        assertThat(moodJournalPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMoodJournalPage() throws Exception {
        int databaseSizeBeforeUpdate = moodJournalPageRepository.findAll().size();
        moodJournalPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoodJournalPageMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(moodJournalPage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MoodJournalPage in the database
        List<MoodJournalPage> moodJournalPageList = moodJournalPageRepository.findAll();
        assertThat(moodJournalPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMoodJournalPage() throws Exception {
        // Initialize the database
        moodJournalPageRepository.saveAndFlush(moodJournalPage);

        int databaseSizeBeforeDelete = moodJournalPageRepository.findAll().size();

        // Delete the moodJournalPage
        restMoodJournalPageMockMvc
            .perform(delete(ENTITY_API_URL_ID, moodJournalPage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MoodJournalPage> moodJournalPageList = moodJournalPageRepository.findAll();
        assertThat(moodJournalPageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
