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
import team.bham.domain.EntriesPage;
import team.bham.repository.EntriesPageRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.EntriesPage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EntriesPageResource {

    private final Logger log = LoggerFactory.getLogger(EntriesPageResource.class);

    private static final String ENTITY_NAME = "entriesPage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EntriesPageRepository entriesPageRepository;

    public EntriesPageResource(EntriesPageRepository entriesPageRepository) {
        this.entriesPageRepository = entriesPageRepository;
    }

    /**
     * {@code POST  /entries-pages} : Create a new entriesPage.
     *
     * @param entriesPage the entriesPage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new entriesPage, or with status {@code 400 (Bad Request)} if the entriesPage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/entries-pages")
    public ResponseEntity<EntriesPage> createEntriesPage(@RequestBody EntriesPage entriesPage) throws URISyntaxException {
        log.debug("REST request to save EntriesPage : {}", entriesPage);
        if (entriesPage.getId() != null) {
            throw new BadRequestAlertException("A new entriesPage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EntriesPage result = entriesPageRepository.save(entriesPage);
        return ResponseEntity
            .created(new URI("/api/entries-pages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /entries-pages/:id} : Updates an existing entriesPage.
     *
     * @param id the id of the entriesPage to save.
     * @param entriesPage the entriesPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated entriesPage,
     * or with status {@code 400 (Bad Request)} if the entriesPage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the entriesPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/entries-pages/{id}")
    public ResponseEntity<EntriesPage> updateEntriesPage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EntriesPage entriesPage
    ) throws URISyntaxException {
        log.debug("REST request to update EntriesPage : {}, {}", id, entriesPage);
        if (entriesPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, entriesPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!entriesPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EntriesPage result = entriesPageRepository.save(entriesPage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, entriesPage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /entries-pages/:id} : Partial updates given fields of an existing entriesPage, field will ignore if it is null
     *
     * @param id the id of the entriesPage to save.
     * @param entriesPage the entriesPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated entriesPage,
     * or with status {@code 400 (Bad Request)} if the entriesPage is not valid,
     * or with status {@code 404 (Not Found)} if the entriesPage is not found,
     * or with status {@code 500 (Internal Server Error)} if the entriesPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/entries-pages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EntriesPage> partialUpdateEntriesPage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EntriesPage entriesPage
    ) throws URISyntaxException {
        log.debug("REST request to partial update EntriesPage partially : {}, {}", id, entriesPage);
        if (entriesPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, entriesPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!entriesPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EntriesPage> result = entriesPageRepository
            .findById(entriesPage.getId())
            .map(existingEntriesPage -> {
                if (entriesPage.getNormalEntries() != null) {
                    existingEntriesPage.setNormalEntries(entriesPage.getNormalEntries());
                }
                if (entriesPage.getDate() != null) {
                    existingEntriesPage.setDate(entriesPage.getDate());
                }
                if (entriesPage.getCurrentTab() != null) {
                    existingEntriesPage.setCurrentTab(entriesPage.getCurrentTab());
                }

                return existingEntriesPage;
            })
            .map(entriesPageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, entriesPage.getId().toString())
        );
    }

    /**
     * {@code GET  /entries-pages} : get all the entriesPages.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of entriesPages in body.
     */
    @GetMapping("/entries-pages")
    public List<EntriesPage> getAllEntriesPages() {
        log.debug("REST request to get all EntriesPages");
        return entriesPageRepository.findAll();
    }

    /**
     * {@code GET  /entries-pages/:id} : get the "id" entriesPage.
     *
     * @param id the id of the entriesPage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the entriesPage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/entries-pages/{id}")
    public ResponseEntity<EntriesPage> getEntriesPage(@PathVariable Long id) {
        log.debug("REST request to get EntriesPage : {}", id);
        Optional<EntriesPage> entriesPage = entriesPageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(entriesPage);
    }

    /**
     * {@code DELETE  /entries-pages/:id} : delete the "id" entriesPage.
     *
     * @param id the id of the entriesPage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/entries-pages/{id}")
    public ResponseEntity<Void> deleteEntriesPage(@PathVariable Long id) {
        log.debug("REST request to delete EntriesPage : {}", id);
        entriesPageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
