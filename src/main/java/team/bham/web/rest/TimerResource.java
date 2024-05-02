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
import org.springframework.web.bind.annotation.*;
import team.bham.domain.Timer;
import team.bham.repository.TimerRepository;
import team.bham.service.TimerQueryService;
import team.bham.service.TimerService;
import team.bham.service.criteria.TimerCriteria;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Timer}.
 */
@RestController
@RequestMapping("/api")
public class TimerResource {

    private final Logger log = LoggerFactory.getLogger(TimerResource.class);

    private static final String ENTITY_NAME = "timer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TimerService timerService;

    private final TimerRepository timerRepository;

    private final TimerQueryService timerQueryService;

    public TimerResource(TimerService timerService, TimerRepository timerRepository, TimerQueryService timerQueryService) {
        this.timerService = timerService;
        this.timerRepository = timerRepository;
        this.timerQueryService = timerQueryService;
    }

    /**
     * {@code POST  /timers} : Create a new timer.
     *
     * @param timer the timer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new timer, or with status {@code 400 (Bad Request)} if the timer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/timers")
    public ResponseEntity<Timer> createTimer(@RequestBody Timer timer) throws URISyntaxException {
        log.debug("REST request to save Timer : {}", timer);
        if (timer.getId() != null) {
            throw new BadRequestAlertException("A new timer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Timer result = timerService.save(timer);
        return ResponseEntity
            .created(new URI("/api/timers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /timers/:id} : Updates an existing timer.
     *
     * @param id the id of the timer to save.
     * @param timer the timer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated timer,
     * or with status {@code 400 (Bad Request)} if the timer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the timer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/timers/{id}")
    public ResponseEntity<Timer> updateTimer(@PathVariable(value = "id", required = false) final Long id, @RequestBody Timer timer)
        throws URISyntaxException {
        log.debug("REST request to update Timer : {}, {}", id, timer);
        if (timer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, timer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!timerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Timer result = timerService.update(timer);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, timer.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /timers/:id} : Partial updates given fields of an existing timer, field will ignore if it is null
     *
     * @param id the id of the timer to save.
     * @param timer the timer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated timer,
     * or with status {@code 400 (Bad Request)} if the timer is not valid,
     * or with status {@code 404 (Not Found)} if the timer is not found,
     * or with status {@code 500 (Internal Server Error)} if the timer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/timers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Timer> partialUpdateTimer(@PathVariable(value = "id", required = false) final Long id, @RequestBody Timer timer)
        throws URISyntaxException {
        log.debug("REST request to partial update Timer partially : {}, {}", id, timer);
        if (timer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, timer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!timerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Timer> result = timerService.partialUpdate(timer);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, timer.getId().toString())
        );
    }

    /**
     * {@code GET  /timers} : get all the timers.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of timers in body.
     */
    @GetMapping("/timers")
    public ResponseEntity<List<Timer>> getAllTimers(TimerCriteria criteria) {
        log.debug("REST request to get Timers by criteria: {}", criteria);
        List<Timer> entityList = timerQueryService.findByCriteria(criteria);
        return ResponseEntity.ok().body(entityList);
    }

    /**
     * {@code GET  /timers/count} : count all the timers.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/timers/count")
    public ResponseEntity<Long> countTimers(TimerCriteria criteria) {
        log.debug("REST request to count Timers by criteria: {}", criteria);
        return ResponseEntity.ok().body(timerQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /timers/:id} : get the "id" timer.
     *
     * @param id the id of the timer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the timer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/timers/{id}")
    public ResponseEntity<Timer> getTimer(@PathVariable Long id) {
        log.debug("REST request to get Timer : {}", id);
        Optional<Timer> timer = timerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(timer);
    }

    /**
     * {@code DELETE  /timers/:id} : delete the "id" timer.
     *
     * @param id the id of the timer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/timers/{id}")
    public ResponseEntity<Void> deleteTimer(@PathVariable Long id) {
        log.debug("REST request to delete Timer : {}", id);
        timerService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
