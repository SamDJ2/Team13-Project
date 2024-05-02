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
import team.bham.domain.MoodJournalPage;
import team.bham.repository.MoodJournalPageRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.MoodJournalPage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MoodJournalPageResource {

    private final Logger log = LoggerFactory.getLogger(MoodJournalPageResource.class);

    private static final String ENTITY_NAME = "moodJournalPage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MoodJournalPageRepository moodJournalPageRepository;

    public MoodJournalPageResource(MoodJournalPageRepository moodJournalPageRepository) {
        this.moodJournalPageRepository = moodJournalPageRepository;
    }

    /**
     * {@code POST  /mood-journal-pages} : Create a new moodJournalPage.
     *
     * @param moodJournalPage the moodJournalPage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new moodJournalPage, or with status {@code 400 (Bad Request)} if the moodJournalPage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mood-journal-pages")
    public ResponseEntity<MoodJournalPage> createMoodJournalPage(@RequestBody MoodJournalPage moodJournalPage) throws URISyntaxException {
        log.debug("REST request to save MoodJournalPage : {}", moodJournalPage);
        if (moodJournalPage.getId() != null) {
            throw new BadRequestAlertException("A new moodJournalPage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MoodJournalPage result = moodJournalPageRepository.save(moodJournalPage);
        return ResponseEntity
            .created(new URI("/api/mood-journal-pages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mood-journal-pages/:id} : Updates an existing moodJournalPage.
     *
     * @param id the id of the moodJournalPage to save.
     * @param moodJournalPage the moodJournalPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated moodJournalPage,
     * or with status {@code 400 (Bad Request)} if the moodJournalPage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the moodJournalPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mood-journal-pages/{id}")
    public ResponseEntity<MoodJournalPage> updateMoodJournalPage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MoodJournalPage moodJournalPage
    ) throws URISyntaxException {
        log.debug("REST request to update MoodJournalPage : {}, {}", id, moodJournalPage);
        if (moodJournalPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, moodJournalPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!moodJournalPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MoodJournalPage result = moodJournalPageRepository.save(moodJournalPage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, moodJournalPage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mood-journal-pages/:id} : Partial updates given fields of an existing moodJournalPage, field will ignore if it is null
     *
     * @param id the id of the moodJournalPage to save.
     * @param moodJournalPage the moodJournalPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated moodJournalPage,
     * or with status {@code 400 (Bad Request)} if the moodJournalPage is not valid,
     * or with status {@code 404 (Not Found)} if the moodJournalPage is not found,
     * or with status {@code 500 (Internal Server Error)} if the moodJournalPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mood-journal-pages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MoodJournalPage> partialUpdateMoodJournalPage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MoodJournalPage moodJournalPage
    ) throws URISyntaxException {
        log.debug("REST request to partial update MoodJournalPage partially : {}, {}", id, moodJournalPage);
        if (moodJournalPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, moodJournalPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!moodJournalPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MoodJournalPage> result = moodJournalPageRepository
            .findById(moodJournalPage.getId())
            .map(existingMoodJournalPage -> {
                if (moodJournalPage.getAllEntries() != null) {
                    existingMoodJournalPage.setAllEntries(moodJournalPage.getAllEntries());
                }
                if (moodJournalPage.getDate() != null) {
                    existingMoodJournalPage.setDate(moodJournalPage.getDate());
                }
                if (moodJournalPage.getCurrentTab() != null) {
                    existingMoodJournalPage.setCurrentTab(moodJournalPage.getCurrentTab());
                }

                return existingMoodJournalPage;
            })
            .map(moodJournalPageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, moodJournalPage.getId().toString())
        );
    }

    /**
     * {@code GET  /mood-journal-pages} : get all the moodJournalPages.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of moodJournalPages in body.
     */
    @GetMapping("/mood-journal-pages")
    public List<MoodJournalPage> getAllMoodJournalPages(@RequestParam(required = false) String filter) {
        if ("navigationportal-is-null".equals(filter)) {
            log.debug("REST request to get all MoodJournalPages where navigationPortal is null");
            return StreamSupport
                .stream(moodJournalPageRepository.findAll().spliterator(), false)
                .filter(moodJournalPage -> moodJournalPage.getNavigationPortal() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all MoodJournalPages");
        return moodJournalPageRepository.findAll();
    }

    /**
     * {@code GET  /mood-journal-pages/:id} : get the "id" moodJournalPage.
     *
     * @param id the id of the moodJournalPage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the moodJournalPage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mood-journal-pages/{id}")
    public ResponseEntity<MoodJournalPage> getMoodJournalPage(@PathVariable Long id) {
        log.debug("REST request to get MoodJournalPage : {}", id);
        Optional<MoodJournalPage> moodJournalPage = moodJournalPageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(moodJournalPage);
    }

    /**
     * {@code DELETE  /mood-journal-pages/:id} : delete the "id" moodJournalPage.
     *
     * @param id the id of the moodJournalPage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mood-journal-pages/{id}")
    public ResponseEntity<Void> deleteMoodJournalPage(@PathVariable Long id) {
        log.debug("REST request to delete MoodJournalPage : {}", id);
        moodJournalPageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
