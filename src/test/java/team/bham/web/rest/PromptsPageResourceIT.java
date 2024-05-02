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
import team.bham.domain.PromptsPage;
import team.bham.domain.enumeration.TabLabel;
import team.bham.repository.PromptsPageRepository;

/**
 * Integration tests for the {@link PromptsPageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PromptsPageResourceIT {

    private static final String DEFAULT_PROMPTED_ENTRIES = "AAAAAAAAAA";
    private static final String UPDATED_PROMPTED_ENTRIES = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_EMOTION_FROM_MOOD_PICKER = "AAAAAAAAAA";
    private static final String UPDATED_EMOTION_FROM_MOOD_PICKER = "BBBBBBBBBB";

    private static final TabLabel DEFAULT_CURRENT_TAB = TabLabel.All;
    private static final TabLabel UPDATED_CURRENT_TAB = TabLabel.Entries;

    private static final String ENTITY_API_URL = "/api/prompts-pages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PromptsPageRepository promptsPageRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPromptsPageMockMvc;

    private PromptsPage promptsPage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PromptsPage createEntity(EntityManager em) {
        PromptsPage promptsPage = new PromptsPage()
            .promptedEntries(DEFAULT_PROMPTED_ENTRIES)
            .date(DEFAULT_DATE)
            .emotionFromMoodPicker(DEFAULT_EMOTION_FROM_MOOD_PICKER)
            .currentTab(DEFAULT_CURRENT_TAB);
        return promptsPage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PromptsPage createUpdatedEntity(EntityManager em) {
        PromptsPage promptsPage = new PromptsPage()
            .promptedEntries(UPDATED_PROMPTED_ENTRIES)
            .date(UPDATED_DATE)
            .emotionFromMoodPicker(UPDATED_EMOTION_FROM_MOOD_PICKER)
            .currentTab(UPDATED_CURRENT_TAB);
        return promptsPage;
    }

    @BeforeEach
    public void initTest() {
        promptsPage = createEntity(em);
    }

    @Test
    @Transactional
    void createPromptsPage() throws Exception {
        int databaseSizeBeforeCreate = promptsPageRepository.findAll().size();
        // Create the PromptsPage
        restPromptsPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(promptsPage)))
            .andExpect(status().isCreated());

        // Validate the PromptsPage in the database
        List<PromptsPage> promptsPageList = promptsPageRepository.findAll();
        assertThat(promptsPageList).hasSize(databaseSizeBeforeCreate + 1);
        PromptsPage testPromptsPage = promptsPageList.get(promptsPageList.size() - 1);
        assertThat(testPromptsPage.getPromptedEntries()).isEqualTo(DEFAULT_PROMPTED_ENTRIES);
        assertThat(testPromptsPage.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testPromptsPage.getEmotionFromMoodPicker()).isEqualTo(DEFAULT_EMOTION_FROM_MOOD_PICKER);
        assertThat(testPromptsPage.getCurrentTab()).isEqualTo(DEFAULT_CURRENT_TAB);
    }

    @Test
    @Transactional
    void createPromptsPageWithExistingId() throws Exception {
        // Create the PromptsPage with an existing ID
        promptsPage.setId(1L);

        int databaseSizeBeforeCreate = promptsPageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPromptsPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(promptsPage)))
            .andExpect(status().isBadRequest());

        // Validate the PromptsPage in the database
        List<PromptsPage> promptsPageList = promptsPageRepository.findAll();
        assertThat(promptsPageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPromptsPages() throws Exception {
        // Initialize the database
        promptsPageRepository.saveAndFlush(promptsPage);

        // Get all the promptsPageList
        restPromptsPageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(promptsPage.getId().intValue())))
            .andExpect(jsonPath("$.[*].promptedEntries").value(hasItem(DEFAULT_PROMPTED_ENTRIES)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].emotionFromMoodPicker").value(hasItem(DEFAULT_EMOTION_FROM_MOOD_PICKER)))
            .andExpect(jsonPath("$.[*].currentTab").value(hasItem(DEFAULT_CURRENT_TAB.toString())));
    }

    @Test
    @Transactional
    void getPromptsPage() throws Exception {
        // Initialize the database
        promptsPageRepository.saveAndFlush(promptsPage);

        // Get the promptsPage
        restPromptsPageMockMvc
            .perform(get(ENTITY_API_URL_ID, promptsPage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(promptsPage.getId().intValue()))
            .andExpect(jsonPath("$.promptedEntries").value(DEFAULT_PROMPTED_ENTRIES))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.emotionFromMoodPicker").value(DEFAULT_EMOTION_FROM_MOOD_PICKER))
            .andExpect(jsonPath("$.currentTab").value(DEFAULT_CURRENT_TAB.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPromptsPage() throws Exception {
        // Get the promptsPage
        restPromptsPageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPromptsPage() throws Exception {
        // Initialize the database
        promptsPageRepository.saveAndFlush(promptsPage);

        int databaseSizeBeforeUpdate = promptsPageRepository.findAll().size();

        // Update the promptsPage
        PromptsPage updatedPromptsPage = promptsPageRepository.findById(promptsPage.getId()).get();
        // Disconnect from session so that the updates on updatedPromptsPage are not directly saved in db
        em.detach(updatedPromptsPage);
        updatedPromptsPage
            .promptedEntries(UPDATED_PROMPTED_ENTRIES)
            .date(UPDATED_DATE)
            .emotionFromMoodPicker(UPDATED_EMOTION_FROM_MOOD_PICKER)
            .currentTab(UPDATED_CURRENT_TAB);

        restPromptsPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPromptsPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPromptsPage))
            )
            .andExpect(status().isOk());

        // Validate the PromptsPage in the database
        List<PromptsPage> promptsPageList = promptsPageRepository.findAll();
        assertThat(promptsPageList).hasSize(databaseSizeBeforeUpdate);
        PromptsPage testPromptsPage = promptsPageList.get(promptsPageList.size() - 1);
        assertThat(testPromptsPage.getPromptedEntries()).isEqualTo(UPDATED_PROMPTED_ENTRIES);
        assertThat(testPromptsPage.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPromptsPage.getEmotionFromMoodPicker()).isEqualTo(UPDATED_EMOTION_FROM_MOOD_PICKER);
        assertThat(testPromptsPage.getCurrentTab()).isEqualTo(UPDATED_CURRENT_TAB);
    }

    @Test
    @Transactional
    void putNonExistingPromptsPage() throws Exception {
        int databaseSizeBeforeUpdate = promptsPageRepository.findAll().size();
        promptsPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPromptsPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, promptsPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(promptsPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the PromptsPage in the database
        List<PromptsPage> promptsPageList = promptsPageRepository.findAll();
        assertThat(promptsPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPromptsPage() throws Exception {
        int databaseSizeBeforeUpdate = promptsPageRepository.findAll().size();
        promptsPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPromptsPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(promptsPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the PromptsPage in the database
        List<PromptsPage> promptsPageList = promptsPageRepository.findAll();
        assertThat(promptsPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPromptsPage() throws Exception {
        int databaseSizeBeforeUpdate = promptsPageRepository.findAll().size();
        promptsPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPromptsPageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(promptsPage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PromptsPage in the database
        List<PromptsPage> promptsPageList = promptsPageRepository.findAll();
        assertThat(promptsPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePromptsPageWithPatch() throws Exception {
        // Initialize the database
        promptsPageRepository.saveAndFlush(promptsPage);

        int databaseSizeBeforeUpdate = promptsPageRepository.findAll().size();

        // Update the promptsPage using partial update
        PromptsPage partialUpdatedPromptsPage = new PromptsPage();
        partialUpdatedPromptsPage.setId(promptsPage.getId());

        partialUpdatedPromptsPage.date(UPDATED_DATE).emotionFromMoodPicker(UPDATED_EMOTION_FROM_MOOD_PICKER);

        restPromptsPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPromptsPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPromptsPage))
            )
            .andExpect(status().isOk());

        // Validate the PromptsPage in the database
        List<PromptsPage> promptsPageList = promptsPageRepository.findAll();
        assertThat(promptsPageList).hasSize(databaseSizeBeforeUpdate);
        PromptsPage testPromptsPage = promptsPageList.get(promptsPageList.size() - 1);
        assertThat(testPromptsPage.getPromptedEntries()).isEqualTo(DEFAULT_PROMPTED_ENTRIES);
        assertThat(testPromptsPage.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPromptsPage.getEmotionFromMoodPicker()).isEqualTo(UPDATED_EMOTION_FROM_MOOD_PICKER);
        assertThat(testPromptsPage.getCurrentTab()).isEqualTo(DEFAULT_CURRENT_TAB);
    }

    @Test
    @Transactional
    void fullUpdatePromptsPageWithPatch() throws Exception {
        // Initialize the database
        promptsPageRepository.saveAndFlush(promptsPage);

        int databaseSizeBeforeUpdate = promptsPageRepository.findAll().size();

        // Update the promptsPage using partial update
        PromptsPage partialUpdatedPromptsPage = new PromptsPage();
        partialUpdatedPromptsPage.setId(promptsPage.getId());

        partialUpdatedPromptsPage
            .promptedEntries(UPDATED_PROMPTED_ENTRIES)
            .date(UPDATED_DATE)
            .emotionFromMoodPicker(UPDATED_EMOTION_FROM_MOOD_PICKER)
            .currentTab(UPDATED_CURRENT_TAB);

        restPromptsPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPromptsPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPromptsPage))
            )
            .andExpect(status().isOk());

        // Validate the PromptsPage in the database
        List<PromptsPage> promptsPageList = promptsPageRepository.findAll();
        assertThat(promptsPageList).hasSize(databaseSizeBeforeUpdate);
        PromptsPage testPromptsPage = promptsPageList.get(promptsPageList.size() - 1);
        assertThat(testPromptsPage.getPromptedEntries()).isEqualTo(UPDATED_PROMPTED_ENTRIES);
        assertThat(testPromptsPage.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPromptsPage.getEmotionFromMoodPicker()).isEqualTo(UPDATED_EMOTION_FROM_MOOD_PICKER);
        assertThat(testPromptsPage.getCurrentTab()).isEqualTo(UPDATED_CURRENT_TAB);
    }

    @Test
    @Transactional
    void patchNonExistingPromptsPage() throws Exception {
        int databaseSizeBeforeUpdate = promptsPageRepository.findAll().size();
        promptsPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPromptsPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, promptsPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(promptsPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the PromptsPage in the database
        List<PromptsPage> promptsPageList = promptsPageRepository.findAll();
        assertThat(promptsPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPromptsPage() throws Exception {
        int databaseSizeBeforeUpdate = promptsPageRepository.findAll().size();
        promptsPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPromptsPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(promptsPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the PromptsPage in the database
        List<PromptsPage> promptsPageList = promptsPageRepository.findAll();
        assertThat(promptsPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPromptsPage() throws Exception {
        int databaseSizeBeforeUpdate = promptsPageRepository.findAll().size();
        promptsPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPromptsPageMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(promptsPage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PromptsPage in the database
        List<PromptsPage> promptsPageList = promptsPageRepository.findAll();
        assertThat(promptsPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePromptsPage() throws Exception {
        // Initialize the database
        promptsPageRepository.saveAndFlush(promptsPage);

        int databaseSizeBeforeDelete = promptsPageRepository.findAll().size();

        // Delete the promptsPage
        restPromptsPageMockMvc
            .perform(delete(ENTITY_API_URL_ID, promptsPage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PromptsPage> promptsPageList = promptsPageRepository.findAll();
        assertThat(promptsPageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
