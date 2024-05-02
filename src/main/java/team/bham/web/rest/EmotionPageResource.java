package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.EmotionPage;
import team.bham.repository.EmotionPageRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.EmotionPage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EmotionPageResource {

    private final Logger log = LoggerFactory.getLogger(EmotionPageResource.class);

    private static final String ENTITY_NAME = "emotionPage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmotionPageRepository emotionPageRepository;

    public EmotionPageResource(EmotionPageRepository emotionPageRepository) {
        this.emotionPageRepository = emotionPageRepository;
    }

    /**
     * {@code POST  /emotion-pages} : Create a new emotionPage.
     *
     * @param emotionPage the emotionPage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new emotionPage, or with status {@code 400 (Bad Request)} if the emotionPage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/emotion-pages")
    public ResponseEntity<EmotionPage> createEmotionPage(@RequestBody EmotionPage emotionPage) throws URISyntaxException {
        log.debug("REST request to save EmotionPage : {}", emotionPage);
        if (emotionPage.getId() != null) {
            throw new BadRequestAlertException("A new emotionPage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EmotionPage result = emotionPageRepository.save(emotionPage);
        return ResponseEntity
            .created(new URI("/api/emotion-pages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /emotion-pages/:id} : Updates an existing emotionPage.
     *
     * @param id the id of the emotionPage to save.
     * @param emotionPage the emotionPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emotionPage,
     * or with status {@code 400 (Bad Request)} if the emotionPage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the emotionPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/emotion-pages/{id}")
    public ResponseEntity<EmotionPage> updateEmotionPage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EmotionPage emotionPage
    ) throws URISyntaxException {
        log.debug("REST request to update EmotionPage : {}, {}", id, emotionPage);
        if (emotionPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emotionPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emotionPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EmotionPage result = emotionPageRepository.save(emotionPage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, emotionPage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /emotion-pages/:id} : Partial updates given fields of an existing emotionPage, field will ignore if it is null
     *
     * @param id the id of the emotionPage to save.
     * @param emotionPage the emotionPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emotionPage,
     * or with status {@code 400 (Bad Request)} if the emotionPage is not valid,
     * or with status {@code 404 (Not Found)} if the emotionPage is not found,
     * or with status {@code 500 (Internal Server Error)} if the emotionPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/emotion-pages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EmotionPage> partialUpdateEmotionPage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EmotionPage emotionPage
    ) throws URISyntaxException {
        log.debug("REST request to partial update EmotionPage partially : {}, {}", id, emotionPage);
        if (emotionPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emotionPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emotionPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EmotionPage> result = emotionPageRepository
            .findById(emotionPage.getId())
            .map(existingEmotionPage -> {
                if (emotionPage.getPrompts() != null) {
                    existingEmotionPage.setPrompts(emotionPage.getPrompts());
                }
                if (emotionPage.getDate() != null) {
                    existingEmotionPage.setDate(emotionPage.getDate());
                }
                if (emotionPage.getPromptedEntry() != null) {
                    existingEmotionPage.setPromptedEntry(emotionPage.getPromptedEntry());
                }
                if (emotionPage.getCurrentTab() != null) {
                    existingEmotionPage.setCurrentTab(emotionPage.getCurrentTab());
                }

                return existingEmotionPage;
            })
            .map(emotionPageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, emotionPage.getId().toString())
        );
    }

    /**
     * {@code GET  /emotion-pages} : get all the emotionPages.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of emotionPages in body.
     */
    @GetMapping("/emotion-pages")
    public List<EmotionPage> getAllEmotionPages(@RequestParam(required = false) String filter) {
        if ("promptspage-is-null".equals(filter)) {
            log.debug("REST request to get all EmotionPages where promptsPage is null");
            return StreamSupport
                .stream(emotionPageRepository.findAll().spliterator(), false)
                .filter(emotionPage -> emotionPage.getPromptsPage() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all EmotionPages");
        return emotionPageRepository.findAll();
    }

    /**
     * {@code GET  /emotion-pages/:id} : get the "id" emotionPage.
     *
     * @param id the id of the emotionPage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the emotionPage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/emotion-pages/{id}")
    public ResponseEntity<EmotionPage> getEmotionPage(@PathVariable Long id) {
        log.debug("REST request to get EmotionPage : {}", id);
        Optional<EmotionPage> emotionPage = emotionPageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(emotionPage);
    }

    /**
     * {@code DELETE  /emotion-pages/:id} : delete the "id" emotionPage.
     *
     * @param id the id of the emotionPage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/emotion-pages/{id}")
    public ResponseEntity<Void> deleteEmotionPage(@PathVariable Long id) {
        log.debug("REST request to delete EmotionPage : {}", id);
        emotionPageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
