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
import team.bham.domain.EntriesPage;
import team.bham.domain.enumeration.TabLabel;
import team.bham.repository.EntriesPageRepository;

/**
 * Integration tests for the {@link EntriesPageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EntriesPageResourceIT {

    private static final String DEFAULT_NORMAL_ENTRIES = "AAAAAAAAAA";
    private static final String UPDATED_NORMAL_ENTRIES = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final TabLabel DEFAULT_CURRENT_TAB = TabLabel.All;
    private static final TabLabel UPDATED_CURRENT_TAB = TabLabel.Entries;

    private static final String ENTITY_API_URL = "/api/entries-pages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EntriesPageRepository entriesPageRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEntriesPageMockMvc;

    private EntriesPage entriesPage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EntriesPage createEntity(EntityManager em) {
        EntriesPage entriesPage = new EntriesPage()
            .normalEntries(DEFAULT_NORMAL_ENTRIES)
            .date(DEFAULT_DATE)
            .currentTab(DEFAULT_CURRENT_TAB);
        return entriesPage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EntriesPage createUpdatedEntity(EntityManager em) {
        EntriesPage entriesPage = new EntriesPage()
            .normalEntries(UPDATED_NORMAL_ENTRIES)
            .date(UPDATED_DATE)
            .currentTab(UPDATED_CURRENT_TAB);
        return entriesPage;
    }

    @BeforeEach
    public void initTest() {
        entriesPage = createEntity(em);
    }

    @Test
    @Transactional
    void createEntriesPage() throws Exception {
        int databaseSizeBeforeCreate = entriesPageRepository.findAll().size();
        // Create the EntriesPage
        restEntriesPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(entriesPage)))
            .andExpect(status().isCreated());

        // Validate the EntriesPage in the database
        List<EntriesPage> entriesPageList = entriesPageRepository.findAll();
        assertThat(entriesPageList).hasSize(databaseSizeBeforeCreate + 1);
        EntriesPage testEntriesPage = entriesPageList.get(entriesPageList.size() - 1);
        assertThat(testEntriesPage.getNormalEntries()).isEqualTo(DEFAULT_NORMAL_ENTRIES);
        assertThat(testEntriesPage.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testEntriesPage.getCurrentTab()).isEqualTo(DEFAULT_CURRENT_TAB);
    }

    @Test
    @Transactional
    void createEntriesPageWithExistingId() throws Exception {
        // Create the EntriesPage with an existing ID
        entriesPage.setId(1L);

        int databaseSizeBeforeCreate = entriesPageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEntriesPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(entriesPage)))
            .andExpect(status().isBadRequest());

        // Validate the EntriesPage in the database
        List<EntriesPage> entriesPageList = entriesPageRepository.findAll();
        assertThat(entriesPageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEntriesPages() throws Exception {
        // Initialize the database
        entriesPageRepository.saveAndFlush(entriesPage);

        // Get all the entriesPageList
        restEntriesPageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(entriesPage.getId().intValue())))
            .andExpect(jsonPath("$.[*].normalEntries").value(hasItem(DEFAULT_NORMAL_ENTRIES)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].currentTab").value(hasItem(DEFAULT_CURRENT_TAB.toString())));
    }

    @Test
    @Transactional
    void getEntriesPage() throws Exception {
        // Initialize the database
        entriesPageRepository.saveAndFlush(entriesPage);

        // Get the entriesPage
        restEntriesPageMockMvc
            .perform(get(ENTITY_API_URL_ID, entriesPage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(entriesPage.getId().intValue()))
            .andExpect(jsonPath("$.normalEntries").value(DEFAULT_NORMAL_ENTRIES))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.currentTab").value(DEFAULT_CURRENT_TAB.toString()));
    }

    @Test
    @Transactional
    void getNonExistingEntriesPage() throws Exception {
        // Get the entriesPage
        restEntriesPageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEntriesPage() throws Exception {
        // Initialize the database
        entriesPageRepository.saveAndFlush(entriesPage);

        int databaseSizeBeforeUpdate = entriesPageRepository.findAll().size();

        // Update the entriesPage
        EntriesPage updatedEntriesPage = entriesPageRepository.findById(entriesPage.getId()).get();
        // Disconnect from session so that the updates on updatedEntriesPage are not directly saved in db
        em.detach(updatedEntriesPage);
        updatedEntriesPage.normalEntries(UPDATED_NORMAL_ENTRIES).date(UPDATED_DATE).currentTab(UPDATED_CURRENT_TAB);

        restEntriesPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEntriesPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEntriesPage))
            )
            .andExpect(status().isOk());

        // Validate the EntriesPage in the database
        List<EntriesPage> entriesPageList = entriesPageRepository.findAll();
        assertThat(entriesPageList).hasSize(databaseSizeBeforeUpdate);
        EntriesPage testEntriesPage = entriesPageList.get(entriesPageList.size() - 1);
        assertThat(testEntriesPage.getNormalEntries()).isEqualTo(UPDATED_NORMAL_ENTRIES);
        assertThat(testEntriesPage.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEntriesPage.getCurrentTab()).isEqualTo(UPDATED_CURRENT_TAB);
    }

    @Test
    @Transactional
    void putNonExistingEntriesPage() throws Exception {
        int databaseSizeBeforeUpdate = entriesPageRepository.findAll().size();
        entriesPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEntriesPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, entriesPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(entriesPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EntriesPage in the database
        List<EntriesPage> entriesPageList = entriesPageRepository.findAll();
        assertThat(entriesPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEntriesPage() throws Exception {
        int databaseSizeBeforeUpdate = entriesPageRepository.findAll().size();
        entriesPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEntriesPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(entriesPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EntriesPage in the database
        List<EntriesPage> entriesPageList = entriesPageRepository.findAll();
        assertThat(entriesPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEntriesPage() throws Exception {
        int databaseSizeBeforeUpdate = entriesPageRepository.findAll().size();
        entriesPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEntriesPageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(entriesPage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EntriesPage in the database
        List<EntriesPage> entriesPageList = entriesPageRepository.findAll();
        assertThat(entriesPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEntriesPageWithPatch() throws Exception {
        // Initialize the database
        entriesPageRepository.saveAndFlush(entriesPage);

        int databaseSizeBeforeUpdate = entriesPageRepository.findAll().size();

        // Update the entriesPage using partial update
        EntriesPage partialUpdatedEntriesPage = new EntriesPage();
        partialUpdatedEntriesPage.setId(entriesPage.getId());

        partialUpdatedEntriesPage.currentTab(UPDATED_CURRENT_TAB);

        restEntriesPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEntriesPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEntriesPage))
            )
            .andExpect(status().isOk());

        // Validate the EntriesPage in the database
        List<EntriesPage> entriesPageList = entriesPageRepository.findAll();
        assertThat(entriesPageList).hasSize(databaseSizeBeforeUpdate);
        EntriesPage testEntriesPage = entriesPageList.get(entriesPageList.size() - 1);
        assertThat(testEntriesPage.getNormalEntries()).isEqualTo(DEFAULT_NORMAL_ENTRIES);
        assertThat(testEntriesPage.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testEntriesPage.getCurrentTab()).isEqualTo(UPDATED_CURRENT_TAB);
    }

    @Test
    @Transactional
    void fullUpdateEntriesPageWithPatch() throws Exception {
        // Initialize the database
        entriesPageRepository.saveAndFlush(entriesPage);

        int databaseSizeBeforeUpdate = entriesPageRepository.findAll().size();

        // Update the entriesPage using partial update
        EntriesPage partialUpdatedEntriesPage = new EntriesPage();
        partialUpdatedEntriesPage.setId(entriesPage.getId());

        partialUpdatedEntriesPage.normalEntries(UPDATED_NORMAL_ENTRIES).date(UPDATED_DATE).currentTab(UPDATED_CURRENT_TAB);

        restEntriesPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEntriesPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEntriesPage))
            )
            .andExpect(status().isOk());

        // Validate the EntriesPage in the database
        List<EntriesPage> entriesPageList = entriesPageRepository.findAll();
        assertThat(entriesPageList).hasSize(databaseSizeBeforeUpdate);
        EntriesPage testEntriesPage = entriesPageList.get(entriesPageList.size() - 1);
        assertThat(testEntriesPage.getNormalEntries()).isEqualTo(UPDATED_NORMAL_ENTRIES);
        assertThat(testEntriesPage.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEntriesPage.getCurrentTab()).isEqualTo(UPDATED_CURRENT_TAB);
    }

    @Test
    @Transactional
    void patchNonExistingEntriesPage() throws Exception {
        int databaseSizeBeforeUpdate = entriesPageRepository.findAll().size();
        entriesPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEntriesPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, entriesPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(entriesPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EntriesPage in the database
        List<EntriesPage> entriesPageList = entriesPageRepository.findAll();
        assertThat(entriesPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEntriesPage() throws Exception {
        int databaseSizeBeforeUpdate = entriesPageRepository.findAll().size();
        entriesPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEntriesPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(entriesPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EntriesPage in the database
        List<EntriesPage> entriesPageList = entriesPageRepository.findAll();
        assertThat(entriesPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEntriesPage() throws Exception {
        int databaseSizeBeforeUpdate = entriesPageRepository.findAll().size();
        entriesPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEntriesPageMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(entriesPage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EntriesPage in the database
        List<EntriesPage> entriesPageList = entriesPageRepository.findAll();
        assertThat(entriesPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEntriesPage() throws Exception {
        // Initialize the database
        entriesPageRepository.saveAndFlush(entriesPage);

        int databaseSizeBeforeDelete = entriesPageRepository.findAll().size();

        // Delete the entriesPage
        restEntriesPageMockMvc
            .perform(delete(ENTITY_API_URL_ID, entriesPage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EntriesPage> entriesPageList = entriesPageRepository.findAll();
        assertThat(entriesPageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
