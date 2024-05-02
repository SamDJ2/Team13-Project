package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.PromptsPage;
import team.bham.repository.PromptsPageRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.PromptsPage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PromptsPageResource {

    private final Logger log = LoggerFactory.getLogger(PromptsPageResource.class);

    private static final String ENTITY_NAME = "promptsPage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PromptsPageRepository promptsPageRepository;

    public PromptsPageResource(PromptsPageRepository promptsPageRepository) {
        this.promptsPageRepository = promptsPageRepository;
    }

    /**
     * {@code POST  /prompts-pages} : Create a new promptsPage.
     *
     * @param promptsPage the promptsPage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new promptsPage, or with status {@code 400 (Bad Request)} if the promptsPage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/prompts-pages")
    public ResponseEntity<PromptsPage> createPromptsPage(@RequestBody PromptsPage promptsPage) throws URISyntaxException {
        log.debug("REST request to save PromptsPage : {}", promptsPage);
        if (promptsPage.getId() != null) {
            throw new BadRequestAlertException("A new promptsPage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PromptsPage result = promptsPageRepository.save(promptsPage);
        return ResponseEntity
            .created(new URI("/api/prompts-pages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /prompts-pages/:id} : Updates an existing promptsPage.
     *
     * @param id the id of the promptsPage to save.
     * @param promptsPage the promptsPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated promptsPage,
     * or with status {@code 400 (Bad Request)} if the promptsPage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the promptsPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/prompts-pages/{id}")
    public ResponseEntity<PromptsPage> updatePromptsPage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PromptsPage promptsPage
    ) throws URISyntaxException {
        log.debug("REST request to update PromptsPage : {}, {}", id, promptsPage);
        if (promptsPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, promptsPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!promptsPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PromptsPage result = promptsPageRepository.save(promptsPage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, promptsPage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /prompts-pages/:id} : Partial updates given fields of an existing promptsPage, field will ignore if it is null
     *
     * @param id the id of the promptsPage to save.
     * @param promptsPage the promptsPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated promptsPage,
     * or with status {@code 400 (Bad Request)} if the promptsPage is not valid,
     * or with status {@code 404 (Not Found)} if the promptsPage is not found,
     * or with status {@code 500 (Internal Server Error)} if the promptsPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/prompts-pages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PromptsPage> partialUpdatePromptsPage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PromptsPage promptsPage
    ) throws URISyntaxException {
        log.debug("REST request to partial update PromptsPage partially : {}, {}", id, promptsPage);
        if (promptsPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, promptsPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!promptsPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PromptsPage> result = promptsPageRepository
            .findById(promptsPage.getId())
            .map(existingPromptsPage -> {
                if (promptsPage.getPromptedEntries() != null) {
                    existingPromptsPage.setPromptedEntries(promptsPage.getPromptedEntries());
                }
                if (promptsPage.getDate() != null) {
                    existingPromptsPage.setDate(promptsPage.getDate());
                }
                if (promptsPage.getEmotionFromMoodPicker() != null) {
                    existingPromptsPage.setEmotionFromMoodPicker(promptsPage.getEmotionFromMoodPicker());
                }
                if (promptsPage.getCurrentTab() != null) {
                    existingPromptsPage.setCurrentTab(promptsPage.getCurrentTab());
                }

                return existingPromptsPage;
            })
            .map(promptsPageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, promptsPage.getId().toString())
        );
    }

    /**
     * {@code GET  /prompts-pages} : get all the promptsPages.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of promptsPages in body.
     */
    @GetMapping("/prompts-pages")
    public List<PromptsPage> getAllPromptsPages() {
        log.debug("REST request to get all PromptsPages");
        return promptsPageRepository.findAll();
    }

    /**
     * {@code GET  /prompts-pages/:id} : get the "id" promptsPage.
     *
     * @param id the id of the promptsPage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the promptsPage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/prompts-pages/{id}")
    public ResponseEntity<PromptsPage> getPromptsPage(@PathVariable Long id) {
        log.debug("REST request to get PromptsPage : {}", id);
        Optional<PromptsPage> promptsPage = promptsPageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(promptsPage);
    }

    /**
     * {@code DELETE  /prompts-pages/:id} : delete the "id" promptsPage.
     *
     * @param id the id of the promptsPage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/prompts-pages/{id}")
    public ResponseEntity<Void> deletePromptsPage(@PathVariable Long id) {
        log.debug("REST request to delete PromptsPage : {}", id);
        promptsPageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
