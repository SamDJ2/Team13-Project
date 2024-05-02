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
import team.bham.domain.Alcohol;
import team.bham.repository.AlcoholRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Alcohol}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AlcoholResource {

    private final Logger log = LoggerFactory.getLogger(AlcoholResource.class);

    private static final String ENTITY_NAME = "alcohol";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AlcoholRepository alcoholRepository;

    public AlcoholResource(AlcoholRepository alcoholRepository) {
        this.alcoholRepository = alcoholRepository;
    }

    /**
     * {@code POST  /alcohol} : Create a new alcohol.
     *
     * @param alcohol the alcohol to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new alcohol, or with status {@code 400 (Bad Request)} if the alcohol has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/alcohol")
    public ResponseEntity<Alcohol> createAlcohol(@RequestBody Alcohol alcohol) throws URISyntaxException {
        log.debug("REST request to save Alcohol : {}", alcohol);
        if (alcohol.getId() != null) {
            throw new BadRequestAlertException("A new alcohol cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Alcohol result = alcoholRepository.save(alcohol);
        return ResponseEntity
            .created(new URI("/api/alcohol/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /alcohol/:id} : Updates an existing alcohol.
     *
     * @param id the id of the alcohol to save.
     * @param alcohol the alcohol to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated alcohol,
     * or with status {@code 400 (Bad Request)} if the alcohol is not valid,
     * or with status {@code 500 (Internal Server Error)} if the alcohol couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/alcohol/{id}")
    public ResponseEntity<Alcohol> updateAlcohol(@PathVariable(value = "id", required = false) final Long id, @RequestBody Alcohol alcohol)
        throws URISyntaxException {
        log.debug("REST request to update Alcohol : {}, {}", id, alcohol);
        if (alcohol.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, alcohol.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!alcoholRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Alcohol result = alcoholRepository.save(alcohol);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, alcohol.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /alcohol/:id} : Partial updates given fields of an existing alcohol, field will ignore if it is null
     *
     * @param id the id of the alcohol to save.
     * @param alcohol the alcohol to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated alcohol,
     * or with status {@code 400 (Bad Request)} if the alcohol is not valid,
     * or with status {@code 404 (Not Found)} if the alcohol is not found,
     * or with status {@code 500 (Internal Server Error)} if the alcohol couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/alcohol/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Alcohol> partialUpdateAlcohol(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Alcohol alcohol
    ) throws URISyntaxException {
        log.debug("REST request to partial update Alcohol partially : {}, {}", id, alcohol);
        if (alcohol.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, alcohol.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!alcoholRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Alcohol> result = alcoholRepository
            .findById(alcohol.getId())
            .map(existingAlcohol -> {
                if (alcohol.getLevels() != null) {
                    existingAlcohol.setLevels(alcohol.getLevels());
                }
                if (alcohol.getProgress() != null) {
                    existingAlcohol.setProgress(alcohol.getProgress());
                }
                if (alcohol.getTimer() != null) {
                    existingAlcohol.setTimer(alcohol.getTimer());
                }

                return existingAlcohol;
            })
            .map(alcoholRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, alcohol.getId().toString())
        );
    }

    /**
     * {@code GET  /alcohol} : get all the alcohol.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of alcohol in body.
     */
    @GetMapping("/alcohol")
    public List<Alcohol> getAllAlcohol() {
        log.debug("REST request to get all Alcohol");
        return alcoholRepository.findAll();
    }

    /**
     * {@code GET  /alcohol/:id} : get the "id" alcohol.
     *
     * @param id the id of the alcohol to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the alcohol, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/alcohol/{id}")
    public ResponseEntity<Alcohol> getAlcohol(@PathVariable Long id) {
        log.debug("REST request to get Alcohol : {}", id);
        Optional<Alcohol> alcohol = alcoholRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(alcohol);
    }

    /**
     * {@code DELETE  /alcohol/:id} : delete the "id" alcohol.
     *
     * @param id the id of the alcohol to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/alcohol/{id}")
    public ResponseEntity<Void> deleteAlcohol(@PathVariable Long id) {
        log.debug("REST request to delete Alcohol : {}", id);
        alcoholRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
