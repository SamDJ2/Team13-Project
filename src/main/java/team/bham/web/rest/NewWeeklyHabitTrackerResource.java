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
import team.bham.domain.NewWeeklyHabitTracker;
import team.bham.repository.NewWeeklyHabitTrackerRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.NewWeeklyHabitTracker}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class NewWeeklyHabitTrackerResource {

    private final Logger log = LoggerFactory.getLogger(NewWeeklyHabitTrackerResource.class);

    private static final String ENTITY_NAME = "newWeeklyHabitTracker";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NewWeeklyHabitTrackerRepository newWeeklyHabitTrackerRepository;

    public NewWeeklyHabitTrackerResource(NewWeeklyHabitTrackerRepository newWeeklyHabitTrackerRepository) {
        this.newWeeklyHabitTrackerRepository = newWeeklyHabitTrackerRepository;
    }

    /**
     * {@code POST  /new-weekly-habit-trackers} : Create a new newWeeklyHabitTracker.
     *
     * @param newWeeklyHabitTracker the newWeeklyHabitTracker to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new newWeeklyHabitTracker, or with status {@code 400 (Bad Request)} if the newWeeklyHabitTracker has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/new-weekly-habit-trackers")
    public ResponseEntity<NewWeeklyHabitTracker> createNewWeeklyHabitTracker(@RequestBody NewWeeklyHabitTracker newWeeklyHabitTracker)
        throws URISyntaxException {
        log.debug("REST request to save NewWeeklyHabitTracker : {}", newWeeklyHabitTracker);
        if (newWeeklyHabitTracker.getId() != null) {
            throw new BadRequestAlertException("A new newWeeklyHabitTracker cannot already have an ID", ENTITY_NAME, "idexists");
        }
        NewWeeklyHabitTracker result = newWeeklyHabitTrackerRepository.save(newWeeklyHabitTracker);
        return ResponseEntity
            .created(new URI("/api/new-weekly-habit-trackers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /new-weekly-habit-trackers/:id} : Updates an existing newWeeklyHabitTracker.
     *
     * @param id the id of the newWeeklyHabitTracker to save.
     * @param newWeeklyHabitTracker the newWeeklyHabitTracker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated newWeeklyHabitTracker,
     * or with status {@code 400 (Bad Request)} if the newWeeklyHabitTracker is not valid,
     * or with status {@code 500 (Internal Server Error)} if the newWeeklyHabitTracker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/new-weekly-habit-trackers/{id}")
    public ResponseEntity<NewWeeklyHabitTracker> updateNewWeeklyHabitTracker(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody NewWeeklyHabitTracker newWeeklyHabitTracker
    ) throws URISyntaxException {
        log.debug("REST request to update NewWeeklyHabitTracker : {}, {}", id, newWeeklyHabitTracker);
        if (newWeeklyHabitTracker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, newWeeklyHabitTracker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!newWeeklyHabitTrackerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        NewWeeklyHabitTracker result = newWeeklyHabitTrackerRepository.save(newWeeklyHabitTracker);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, newWeeklyHabitTracker.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /new-weekly-habit-trackers/:id} : Partial updates given fields of an existing newWeeklyHabitTracker, field will ignore if it is null
     *
     * @param id the id of the newWeeklyHabitTracker to save.
     * @param newWeeklyHabitTracker the newWeeklyHabitTracker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated newWeeklyHabitTracker,
     * or with status {@code 400 (Bad Request)} if the newWeeklyHabitTracker is not valid,
     * or with status {@code 404 (Not Found)} if the newWeeklyHabitTracker is not found,
     * or with status {@code 500 (Internal Server Error)} if the newWeeklyHabitTracker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/new-weekly-habit-trackers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<NewWeeklyHabitTracker> partialUpdateNewWeeklyHabitTracker(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody NewWeeklyHabitTracker newWeeklyHabitTracker
    ) throws URISyntaxException {
        log.debug("REST request to partial update NewWeeklyHabitTracker partially : {}, {}", id, newWeeklyHabitTracker);
        if (newWeeklyHabitTracker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, newWeeklyHabitTracker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!newWeeklyHabitTrackerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<NewWeeklyHabitTracker> result = newWeeklyHabitTrackerRepository
            .findById(newWeeklyHabitTracker.getId())
            .map(existingNewWeeklyHabitTracker -> {
                if (newWeeklyHabitTracker.getRecordID() != null) {
                    existingNewWeeklyHabitTracker.setRecordID(newWeeklyHabitTracker.getRecordID());
                }
                if (newWeeklyHabitTracker.getHabitCompletion() != null) {
                    existingNewWeeklyHabitTracker.setHabitCompletion(newWeeklyHabitTracker.getHabitCompletion());
                }
                if (newWeeklyHabitTracker.getDate() != null) {
                    existingNewWeeklyHabitTracker.setDate(newWeeklyHabitTracker.getDate());
                }

                return existingNewWeeklyHabitTracker;
            })
            .map(newWeeklyHabitTrackerRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, newWeeklyHabitTracker.getId().toString())
        );
    }

    /**
     * {@code GET  /new-weekly-habit-trackers} : get all the newWeeklyHabitTrackers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of newWeeklyHabitTrackers in body.
     */
    @GetMapping("/new-weekly-habit-trackers")
    public List<NewWeeklyHabitTracker> getAllNewWeeklyHabitTrackers() {
        log.debug("REST request to get all NewWeeklyHabitTrackers");
        return newWeeklyHabitTrackerRepository.findAll();
    }

    /**
     * {@code GET  /new-weekly-habit-trackers/:id} : get the "id" newWeeklyHabitTracker.
     *
     * @param id the id of the newWeeklyHabitTracker to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the newWeeklyHabitTracker, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/new-weekly-habit-trackers/{id}")
    public ResponseEntity<NewWeeklyHabitTracker> getNewWeeklyHabitTracker(@PathVariable Long id) {
        log.debug("REST request to get NewWeeklyHabitTracker : {}", id);
        Optional<NewWeeklyHabitTracker> newWeeklyHabitTracker = newWeeklyHabitTrackerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(newWeeklyHabitTracker);
    }

    /**
     * {@code DELETE  /new-weekly-habit-trackers/:id} : delete the "id" newWeeklyHabitTracker.
     *
     * @param id the id of the newWeeklyHabitTracker to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/new-weekly-habit-trackers/{id}")
    public ResponseEntity<Void> deleteNewWeeklyHabitTracker(@PathVariable Long id) {
        log.debug("REST request to delete NewWeeklyHabitTracker : {}", id);
        newWeeklyHabitTrackerRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
