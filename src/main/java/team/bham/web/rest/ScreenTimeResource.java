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
import team.bham.domain.ScreenTime;
import team.bham.repository.ScreenTimeRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ScreenTime}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ScreenTimeResource {

    private final Logger log = LoggerFactory.getLogger(ScreenTimeResource.class);

    private static final String ENTITY_NAME = "screenTime";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ScreenTimeRepository screenTimeRepository;

    public ScreenTimeResource(ScreenTimeRepository screenTimeRepository) {
        this.screenTimeRepository = screenTimeRepository;
    }

    /**
     * {@code POST  /screen-times} : Create a new screenTime.
     *
     * @param screenTime the screenTime to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new screenTime, or with status {@code 400 (Bad Request)} if the screenTime has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/screen-times")
    public ResponseEntity<ScreenTime> createScreenTime(@RequestBody ScreenTime screenTime) throws URISyntaxException {
        log.debug("REST request to save ScreenTime : {}", screenTime);
        if (screenTime.getId() != null) {
            throw new BadRequestAlertException("A new screenTime cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ScreenTime result = screenTimeRepository.save(screenTime);
        return ResponseEntity
            .created(new URI("/api/screen-times/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /screen-times/:id} : Updates an existing screenTime.
     *
     * @param id the id of the screenTime to save.
     * @param screenTime the screenTime to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated screenTime,
     * or with status {@code 400 (Bad Request)} if the screenTime is not valid,
     * or with status {@code 500 (Internal Server Error)} if the screenTime couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/screen-times/{id}")
    public ResponseEntity<ScreenTime> updateScreenTime(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ScreenTime screenTime
    ) throws URISyntaxException {
        log.debug("REST request to update ScreenTime : {}, {}", id, screenTime);
        if (screenTime.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, screenTime.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!screenTimeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ScreenTime result = screenTimeRepository.save(screenTime);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, screenTime.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /screen-times/:id} : Partial updates given fields of an existing screenTime, field will ignore if it is null
     *
     * @param id the id of the screenTime to save.
     * @param screenTime the screenTime to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated screenTime,
     * or with status {@code 400 (Bad Request)} if the screenTime is not valid,
     * or with status {@code 404 (Not Found)} if the screenTime is not found,
     * or with status {@code 500 (Internal Server Error)} if the screenTime couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/screen-times/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ScreenTime> partialUpdateScreenTime(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ScreenTime screenTime
    ) throws URISyntaxException {
        log.debug("REST request to partial update ScreenTime partially : {}, {}", id, screenTime);
        if (screenTime.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, screenTime.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!screenTimeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ScreenTime> result = screenTimeRepository
            .findById(screenTime.getId())
            .map(existingScreenTime -> {
                if (screenTime.getSelectCategory() != null) {
                    existingScreenTime.setSelectCategory(screenTime.getSelectCategory());
                }

                return existingScreenTime;
            })
            .map(screenTimeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, screenTime.getId().toString())
        );
    }

    /**
     * {@code GET  /screen-times} : get all the screenTimes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of screenTimes in body.
     */
    @GetMapping("/screen-times")
    public List<ScreenTime> getAllScreenTimes() {
        log.debug("REST request to get all ScreenTimes");
        return screenTimeRepository.findAll();
    }

    /**
     * {@code GET  /screen-times/:id} : get the "id" screenTime.
     *
     * @param id the id of the screenTime to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the screenTime, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/screen-times/{id}")
    public ResponseEntity<ScreenTime> getScreenTime(@PathVariable Long id) {
        log.debug("REST request to get ScreenTime : {}", id);
        Optional<ScreenTime> screenTime = screenTimeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(screenTime);
    }

    /**
     * {@code DELETE  /screen-times/:id} : delete the "id" screenTime.
     *
     * @param id the id of the screenTime to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/screen-times/{id}")
    public ResponseEntity<Void> deleteScreenTime(@PathVariable Long id) {
        log.debug("REST request to delete ScreenTime : {}", id);
        screenTimeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
