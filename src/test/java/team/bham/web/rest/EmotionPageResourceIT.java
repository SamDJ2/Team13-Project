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
import team.bham.domain.EmotionPage;
import team.bham.domain.enumeration.AIGeneratedPrompts;
import team.bham.domain.enumeration.TabLabel;
import team.bham.repository.EmotionPageRepository;

/**
 * Integration tests for the {@link EmotionPageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EmotionPageResourceIT {

    private static final AIGeneratedPrompts DEFAULT_PROMPTS = AIGeneratedPrompts.Example1;
    private static final AIGeneratedPrompts UPDATED_PROMPTS = AIGeneratedPrompts.Example2;

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_PROMPTED_ENTRY = "AAAAAAAAAA";
    private static final String UPDATED_PROMPTED_ENTRY = "BBBBBBBBBB";

    private static final TabLabel DEFAULT_CURRENT_TAB = TabLabel.All;
    private static final TabLabel UPDATED_CURRENT_TAB = TabLabel.Entries;

    private static final String ENTITY_API_URL = "/api/emotion-pages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EmotionPageRepository emotionPageRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEmotionPageMockMvc;

    private EmotionPage emotionPage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmotionPage createEntity(EntityManager em) {
        EmotionPage emotionPage = new EmotionPage()
            .prompts(DEFAULT_PROMPTS)
            .date(DEFAULT_DATE)
            .promptedEntry(DEFAULT_PROMPTED_ENTRY)
            .currentTab(DEFAULT_CURRENT_TAB);
        return emotionPage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmotionPage createUpdatedEntity(EntityManager em) {
        EmotionPage emotionPage = new EmotionPage()
            .prompts(UPDATED_PROMPTS)
            .date(UPDATED_DATE)
            .promptedEntry(UPDATED_PROMPTED_ENTRY)
            .currentTab(UPDATED_CURRENT_TAB);
        return emotionPage;
    }

    @BeforeEach
    public void initTest() {
        emotionPage = createEntity(em);
    }

    @Test
    @Transactional
    void createEmotionPage() throws Exception {
        int databaseSizeBeforeCreate = emotionPageRepository.findAll().size();
        // Create the EmotionPage
        restEmotionPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emotionPage)))
            .andExpect(status().isCreated());

        // Validate the EmotionPage in the database
        List<EmotionPage> emotionPageList = emotionPageRepository.findAll();
        assertThat(emotionPageList).hasSize(databaseSizeBeforeCreate + 1);
        EmotionPage testEmotionPage = emotionPageList.get(emotionPageList.size() - 1);
        assertThat(testEmotionPage.getPrompts()).isEqualTo(DEFAULT_PROMPTS);
        assertThat(testEmotionPage.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testEmotionPage.getPromptedEntry()).isEqualTo(DEFAULT_PROMPTED_ENTRY);
        assertThat(testEmotionPage.getCurrentTab()).isEqualTo(DEFAULT_CURRENT_TAB);
    }

    @Test
    @Transactional
    void createEmotionPageWithExistingId() throws Exception {
        // Create the EmotionPage with an existing ID
        emotionPage.setId(1L);

        int databaseSizeBeforeCreate = emotionPageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEmotionPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emotionPage)))
            .andExpect(status().isBadRequest());

        // Validate the EmotionPage in the database
        List<EmotionPage> emotionPageList = emotionPageRepository.findAll();
        assertThat(emotionPageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEmotionPages() throws Exception {
        // Initialize the database
        emotionPageRepository.saveAndFlush(emotionPage);

        // Get all the emotionPageList
        restEmotionPageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(emotionPage.getId().intValue())))
            .andExpect(jsonPath("$.[*].prompts").value(hasItem(DEFAULT_PROMPTS.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].promptedEntry").value(hasItem(DEFAULT_PROMPTED_ENTRY)))
            .andExpect(jsonPath("$.[*].currentTab").value(hasItem(DEFAULT_CURRENT_TAB.toString())));
    }

    @Test
    @Transactional
    void getEmotionPage() throws Exception {
        // Initialize the database
        emotionPageRepository.saveAndFlush(emotionPage);

        // Get the emotionPage
        restEmotionPageMockMvc
            .perform(get(ENTITY_API_URL_ID, emotionPage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(emotionPage.getId().intValue()))
            .andExpect(jsonPath("$.prompts").value(DEFAULT_PROMPTS.toString()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.promptedEntry").value(DEFAULT_PROMPTED_ENTRY))
            .andExpect(jsonPath("$.currentTab").value(DEFAULT_CURRENT_TAB.toString()));
    }

    @Test
    @Transactional
    void getNonExistingEmotionPage() throws Exception {
        // Get the emotionPage
        restEmotionPageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEmotionPage() throws Exception {
        // Initialize the database
        emotionPageRepository.saveAndFlush(emotionPage);

        int databaseSizeBeforeUpdate = emotionPageRepository.findAll().size();

        // Update the emotionPage
        EmotionPage updatedEmotionPage = emotionPageRepository.findById(emotionPage.getId()).get();
        // Disconnect from session so that the updates on updatedEmotionPage are not directly saved in db
        em.detach(updatedEmotionPage);
        updatedEmotionPage
            .prompts(UPDATED_PROMPTS)
            .date(UPDATED_DATE)
            .promptedEntry(UPDATED_PROMPTED_ENTRY)
            .currentTab(UPDATED_CURRENT_TAB);

        restEmotionPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEmotionPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEmotionPage))
            )
            .andExpect(status().isOk());

        // Validate the EmotionPage in the database
        List<EmotionPage> emotionPageList = emotionPageRepository.findAll();
        assertThat(emotionPageList).hasSize(databaseSizeBeforeUpdate);
        EmotionPage testEmotionPage = emotionPageList.get(emotionPageList.size() - 1);
        assertThat(testEmotionPage.getPrompts()).isEqualTo(UPDATED_PROMPTS);
        assertThat(testEmotionPage.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEmotionPage.getPromptedEntry()).isEqualTo(UPDATED_PROMPTED_ENTRY);
        assertThat(testEmotionPage.getCurrentTab()).isEqualTo(UPDATED_CURRENT_TAB);
    }

    @Test
    @Transactional
    void putNonExistingEmotionPage() throws Exception {
        int databaseSizeBeforeUpdate = emotionPageRepository.findAll().size();
        emotionPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmotionPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, emotionPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emotionPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmotionPage in the database
        List<EmotionPage> emotionPageList = emotionPageRepository.findAll();
        assertThat(emotionPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEmotionPage() throws Exception {
        int databaseSizeBeforeUpdate = emotionPageRepository.findAll().size();
        emotionPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmotionPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emotionPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmotionPage in the database
        List<EmotionPage> emotionPageList = emotionPageRepository.findAll();
        assertThat(emotionPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEmotionPage() throws Exception {
        int databaseSizeBeforeUpdate = emotionPageRepository.findAll().size();
        emotionPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmotionPageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emotionPage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EmotionPage in the database
        List<EmotionPage> emotionPageList = emotionPageRepository.findAll();
        assertThat(emotionPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEmotionPageWithPatch() throws Exception {
        // Initialize the database
        emotionPageRepository.saveAndFlush(emotionPage);

        int databaseSizeBeforeUpdate = emotionPageRepository.findAll().size();

        // Update the emotionPage using partial update
        EmotionPage partialUpdatedEmotionPage = new EmotionPage();
        partialUpdatedEmotionPage.setId(emotionPage.getId());

        partialUpdatedEmotionPage.prompts(UPDATED_PROMPTS).date(UPDATED_DATE).promptedEntry(UPDATED_PROMPTED_ENTRY);

        restEmotionPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmotionPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmotionPage))
            )
            .andExpect(status().isOk());

        // Validate the EmotionPage in the database
        List<EmotionPage> emotionPageList = emotionPageRepository.findAll();
        assertThat(emotionPageList).hasSize(databaseSizeBeforeUpdate);
        EmotionPage testEmotionPage = emotionPageList.get(emotionPageList.size() - 1);
        assertThat(testEmotionPage.getPrompts()).isEqualTo(UPDATED_PROMPTS);
        assertThat(testEmotionPage.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEmotionPage.getPromptedEntry()).isEqualTo(UPDATED_PROMPTED_ENTRY);
        assertThat(testEmotionPage.getCurrentTab()).isEqualTo(DEFAULT_CURRENT_TAB);
    }

    @Test
    @Transactional
    void fullUpdateEmotionPageWithPatch() throws Exception {
        // Initialize the database
        emotionPageRepository.saveAndFlush(emotionPage);

        int databaseSizeBeforeUpdate = emotionPageRepository.findAll().size();

        // Update the emotionPage using partial update
        EmotionPage partialUpdatedEmotionPage = new EmotionPage();
        partialUpdatedEmotionPage.setId(emotionPage.getId());

        partialUpdatedEmotionPage
            .prompts(UPDATED_PROMPTS)
            .date(UPDATED_DATE)
            .promptedEntry(UPDATED_PROMPTED_ENTRY)
            .currentTab(UPDATED_CURRENT_TAB);

        restEmotionPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmotionPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmotionPage))
            )
            .andExpect(status().isOk());

        // Validate the EmotionPage in the database
        List<EmotionPage> emotionPageList = emotionPageRepository.findAll();
        assertThat(emotionPageList).hasSize(databaseSizeBeforeUpdate);
        EmotionPage testEmotionPage = emotionPageList.get(emotionPageList.size() - 1);
        assertThat(testEmotionPage.getPrompts()).isEqualTo(UPDATED_PROMPTS);
        assertThat(testEmotionPage.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEmotionPage.getPromptedEntry()).isEqualTo(UPDATED_PROMPTED_ENTRY);
        assertThat(testEmotionPage.getCurrentTab()).isEqualTo(UPDATED_CURRENT_TAB);
    }

    @Test
    @Transactional
    void patchNonExistingEmotionPage() throws Exception {
        int databaseSizeBeforeUpdate = emotionPageRepository.findAll().size();
        emotionPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmotionPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, emotionPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emotionPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmotionPage in the database
        List<EmotionPage> emotionPageList = emotionPageRepository.findAll();
        assertThat(emotionPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEmotionPage() throws Exception {
        int databaseSizeBeforeUpdate = emotionPageRepository.findAll().size();
        emotionPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmotionPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emotionPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmotionPage in the database
        List<EmotionPage> emotionPageList = emotionPageRepository.findAll();
        assertThat(emotionPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEmotionPage() throws Exception {
        int databaseSizeBeforeUpdate = emotionPageRepository.findAll().size();
        emotionPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmotionPageMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(emotionPage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EmotionPage in the database
        List<EmotionPage> emotionPageList = emotionPageRepository.findAll();
        assertThat(emotionPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEmotionPage() throws Exception {
        // Initialize the database
        emotionPageRepository.saveAndFlush(emotionPage);

        int databaseSizeBeforeDelete = emotionPageRepository.findAll().size();

        // Delete the emotionPage
        restEmotionPageMockMvc
            .perform(delete(ENTITY_API_URL_ID, emotionPage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EmotionPage> emotionPageList = emotionPageRepository.findAll();
        assertThat(emotionPageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
