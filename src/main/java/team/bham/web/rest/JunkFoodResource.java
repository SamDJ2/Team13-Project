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
import team.bham.domain.JunkFood;
import team.bham.repository.JunkFoodRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.JunkFood}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class JunkFoodResource {

    private final Logger log = LoggerFactory.getLogger(JunkFoodResource.class);

    private static final String ENTITY_NAME = "junkFood";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JunkFoodRepository junkFoodRepository;

    public JunkFoodResource(JunkFoodRepository junkFoodRepository) {
        this.junkFoodRepository = junkFoodRepository;
    }

    /**
     * {@code POST  /junk-foods} : Create a new junkFood.
     *
     * @param junkFood the junkFood to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new junkFood, or with status {@code 400 (Bad Request)} if the junkFood has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/junk-foods")
    public ResponseEntity<JunkFood> createJunkFood(@RequestBody JunkFood junkFood) throws URISyntaxException {
        log.debug("REST request to save JunkFood : {}", junkFood);
        if (junkFood.getId() != null) {
            throw new BadRequestAlertException("A new junkFood cannot already have an ID", ENTITY_NAME, "idexists");
        }
        JunkFood result = junkFoodRepository.save(junkFood);
        return ResponseEntity
            .created(new URI("/api/junk-foods/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /junk-foods/:id} : Updates an existing junkFood.
     *
     * @param id the id of the junkFood to save.
     * @param junkFood the junkFood to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated junkFood,
     * or with status {@code 400 (Bad Request)} if the junkFood is not valid,
     * or with status {@code 500 (Internal Server Error)} if the junkFood couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/junk-foods/{id}")
    public ResponseEntity<JunkFood> updateJunkFood(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody JunkFood junkFood
    ) throws URISyntaxException {
        log.debug("REST request to update JunkFood : {}, {}", id, junkFood);
        if (junkFood.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, junkFood.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!junkFoodRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        JunkFood result = junkFoodRepository.save(junkFood);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, junkFood.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /junk-foods/:id} : Partial updates given fields of an existing junkFood, field will ignore if it is null
     *
     * @param id the id of the junkFood to save.
     * @param junkFood the junkFood to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated junkFood,
     * or with status {@code 400 (Bad Request)} if the junkFood is not valid,
     * or with status {@code 404 (Not Found)} if the junkFood is not found,
     * or with status {@code 500 (Internal Server Error)} if the junkFood couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/junk-foods/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<JunkFood> partialUpdateJunkFood(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody JunkFood junkFood
    ) throws URISyntaxException {
        log.debug("REST request to partial update JunkFood partially : {}, {}", id, junkFood);
        if (junkFood.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, junkFood.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!junkFoodRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<JunkFood> result = junkFoodRepository
            .findById(junkFood.getId())
            .map(existingJunkFood -> {
                if (junkFood.getLevels() != null) {
                    existingJunkFood.setLevels(junkFood.getLevels());
                }
                if (junkFood.getProgress() != null) {
                    existingJunkFood.setProgress(junkFood.getProgress());
                }
                if (junkFood.getTimer() != null) {
                    existingJunkFood.setTimer(junkFood.getTimer());
                }

                return existingJunkFood;
            })
            .map(junkFoodRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, junkFood.getId().toString())
        );
    }

    /**
     * {@code GET  /junk-foods} : get all the junkFoods.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of junkFoods in body.
     */
    @GetMapping("/junk-foods")
    public List<JunkFood> getAllJunkFoods() {
        log.debug("REST request to get all JunkFoods");
        return junkFoodRepository.findAll();
    }

    /**
     * {@code GET  /junk-foods/:id} : get the "id" junkFood.
     *
     * @param id the id of the junkFood to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the junkFood, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/junk-foods/{id}")
    public ResponseEntity<JunkFood> getJunkFood(@PathVariable Long id) {
        log.debug("REST request to get JunkFood : {}", id);
        Optional<JunkFood> junkFood = junkFoodRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(junkFood);
    }

    /**
     * {@code DELETE  /junk-foods/:id} : delete the "id" junkFood.
     *
     * @param id the id of the junkFood to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/junk-foods/{id}")
    public ResponseEntity<Void> deleteJunkFood(@PathVariable Long id) {
        log.debug("REST request to delete JunkFood : {}", id);
        junkFoodRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
