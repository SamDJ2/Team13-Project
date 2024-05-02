package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import team.bham.domain.EntriesFeature;
import team.bham.repository.EntriesFeatureRepository;
import team.bham.service.EntriesFeatureService;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.EntriesFeature}.
 */
@RestController
@RequestMapping("/api")
public class EntriesFeatureResource {

    private final Logger log = LoggerFactory.getLogger(EntriesFeatureResource.class);

    private static final String ENTITY_NAME = "entriesFeature";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EntriesFeatureService entriesFeatureService;

    private final EntriesFeatureRepository entriesFeatureRepository;

    public EntriesFeatureResource(EntriesFeatureService entriesFeatureService, EntriesFeatureRepository entriesFeatureRepository) {
        this.entriesFeatureService = entriesFeatureService;
        this.entriesFeatureRepository = entriesFeatureRepository;
    }

    /**
     * {@code POST  /entries-features} : Create a new entriesFeature.
     *
     * @param entriesFeature the entriesFeature to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new entriesFeature, or with status {@code 400 (Bad Request)} if the entriesFeature has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/entries-features")
    public ResponseEntity<EntriesFeature> createEntriesFeature(@RequestBody EntriesFeature entriesFeature) throws URISyntaxException {
        log.debug("REST request to save EntriesFeature : {}", entriesFeature);
        if (entriesFeature.getId() != null) {
            throw new BadRequestAlertException("A new entriesFeature cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EntriesFeature result = entriesFeatureService.save(entriesFeature);
        return ResponseEntity
            .created(new URI("/api/entries-features/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /entries-features/:id} : Updates an existing entriesFeature.
     *
     * @param id the id of the entriesFeature to save.
     * @param entriesFeature the entriesFeature to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated entriesFeature,
     * or with status {@code 400 (Bad Request)} if the entriesFeature is not valid,
     * or with status {@code 500 (Internal Server Error)} if the entriesFeature couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/entries-features/{id}")
    public ResponseEntity<EntriesFeature> updateEntriesFeature(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EntriesFeature entriesFeature
    ) throws URISyntaxException {
        log.debug("REST request to update EntriesFeature : {}, {}", id, entriesFeature);
        if (entriesFeature.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, entriesFeature.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!entriesFeatureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EntriesFeature result = entriesFeatureService.update(entriesFeature);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, entriesFeature.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /entries-features/:id} : Partial updates given fields of an existing entriesFeature, field will ignore if it is null
     *
     * @param id the id of the entriesFeature to save.
     * @param entriesFeature the entriesFeature to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated entriesFeature,
     * or with status {@code 400 (Bad Request)} if the entriesFeature is not valid,
     * or with status {@code 404 (Not Found)} if the entriesFeature is not found,
     * or with status {@code 500 (Internal Server Error)} if the entriesFeature couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/entries-features/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EntriesFeature> partialUpdateEntriesFeature(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EntriesFeature entriesFeature
    ) throws URISyntaxException {
        log.debug("REST request to partial update EntriesFeature partially : {}, {}", id, entriesFeature);
        if (entriesFeature.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, entriesFeature.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!entriesFeatureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EntriesFeature> result = entriesFeatureService.partialUpdate(entriesFeature);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, entriesFeature.getId().toString())
        );
    }

    /**
     * {@code GET  /entries-features} : get all the entriesFeatures.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of entriesFeatures in body.
     */
    @GetMapping("/entries-features")
    public ResponseEntity<List<EntriesFeature>> getAllEntriesFeatures(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of EntriesFeatures");
        Page<EntriesFeature> page = entriesFeatureService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /entries-features/:id} : get the "id" entriesFeature.
     *
     * @param id the id of the entriesFeature to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the entriesFeature, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/entries-features/{id}")
    public ResponseEntity<EntriesFeature> getEntriesFeature(@PathVariable Long id) {
        log.debug("REST request to get EntriesFeature : {}", id);
        Optional<EntriesFeature> entriesFeature = entriesFeatureService.findOne(id);
        return ResponseUtil.wrapOrNotFound(entriesFeature);
    }

    /**
     * {@code DELETE  /entries-features/:id} : delete the "id" entriesFeature.
     *
     * @param id the id of the entriesFeature to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/entries-features/{id}")
    public ResponseEntity<Void> deleteEntriesFeature(@PathVariable Long id) {
        log.debug("REST request to delete EntriesFeature : {}", id);
        entriesFeatureService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
