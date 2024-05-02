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
import team.bham.domain.Smoking;
import team.bham.repository.SmokingRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Smoking}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SmokingResource {

    private final Logger log = LoggerFactory.getLogger(SmokingResource.class);

    private static final String ENTITY_NAME = "smoking";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SmokingRepository smokingRepository;

    public SmokingResource(SmokingRepository smokingRepository) {
        this.smokingRepository = smokingRepository;
    }

    /**
     * {@code POST  /smokings} : Create a new smoking.
     *
     * @param smoking the smoking to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new smoking, or with status {@code 400 (Bad Request)} if the smoking has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/smokings")
    public ResponseEntity<Smoking> createSmoking(@RequestBody Smoking smoking) throws URISyntaxException {
        log.debug("REST request to save Smoking : {}", smoking);
        if (smoking.getId() != null) {
            throw new BadRequestAlertException("A new smoking cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Smoking result = smokingRepository.save(smoking);
        return ResponseEntity
            .created(new URI("/api/smokings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /smokings/:id} : Updates an existing smoking.
     *
     * @param id the id of the smoking to save.
     * @param smoking the smoking to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated smoking,
     * or with status {@code 400 (Bad Request)} if the smoking is not valid,
     * or with status {@code 500 (Internal Server Error)} if the smoking couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/smokings/{id}")
    public ResponseEntity<Smoking> updateSmoking(@PathVariable(value = "id", required = false) final Long id, @RequestBody Smoking smoking)
        throws URISyntaxException {
        log.debug("REST request to update Smoking : {}, {}", id, smoking);
        if (smoking.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, smoking.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!smokingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Smoking result = smokingRepository.save(smoking);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, smoking.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /smokings/:id} : Partial updates given fields of an existing smoking, field will ignore if it is null
     *
     * @param id the id of the smoking to save.
     * @param smoking the smoking to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated smoking,
     * or with status {@code 400 (Bad Request)} if the smoking is not valid,
     * or with status {@code 404 (Not Found)} if the smoking is not found,
     * or with status {@code 500 (Internal Server Error)} if the smoking couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/smokings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Smoking> partialUpdateSmoking(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Smoking smoking
    ) throws URISyntaxException {
        log.debug("REST request to partial update Smoking partially : {}, {}", id, smoking);
        if (smoking.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, smoking.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!smokingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Smoking> result = smokingRepository
            .findById(smoking.getId())
            .map(existingSmoking -> {
                if (smoking.getLevels() != null) {
                    existingSmoking.setLevels(smoking.getLevels());
                }
                if (smoking.getProgress() != null) {
                    existingSmoking.setProgress(smoking.getProgress());
                }
                if (smoking.getTimer() != null) {
                    existingSmoking.setTimer(smoking.getTimer());
                }

                return existingSmoking;
            })
            .map(smokingRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, smoking.getId().toString())
        );
    }

    /**
     * {@code GET  /smokings} : get all the smokings.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of smokings in body.
     */
    @GetMapping("/smokings")
    public List<Smoking> getAllSmokings() {
        log.debug("REST request to get all Smokings");
        return smokingRepository.findAll();
    }

    /**
     * {@code GET  /smokings/:id} : get the "id" smoking.
     *
     * @param id the id of the smoking to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the smoking, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/smokings/{id}")
    public ResponseEntity<Smoking> getSmoking(@PathVariable Long id) {
        log.debug("REST request to get Smoking : {}", id);
        Optional<Smoking> smoking = smokingRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(smoking);
    }

    /**
     * {@code DELETE  /smokings/:id} : delete the "id" smoking.
     *
     * @param id the id of the smoking to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/smokings/{id}")
    public ResponseEntity<Void> deleteSmoking(@PathVariable Long id) {
        log.debug("REST request to delete Smoking : {}", id);
        smokingRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
