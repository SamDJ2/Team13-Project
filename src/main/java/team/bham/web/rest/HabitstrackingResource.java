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
import team.bham.domain.Habitstracking;
import team.bham.repository.HabitstrackingRepository;
import team.bham.service.HabitstrackingService;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Habitstracking}.
 */
@RestController
@RequestMapping("/api")
public class HabitstrackingResource {

    private final Logger log = LoggerFactory.getLogger(HabitstrackingResource.class);

    private static final String ENTITY_NAME = "habitstracking";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HabitstrackingService habitstrackingService;

    private final HabitstrackingRepository habitstrackingRepository;

    public HabitstrackingResource(HabitstrackingService habitstrackingService, HabitstrackingRepository habitstrackingRepository) {
        this.habitstrackingService = habitstrackingService;
        this.habitstrackingRepository = habitstrackingRepository;
    }

    /**
     * {@code POST  /habitstrackings} : Create a new habitstracking.
     *
     * @param habitstracking the habitstracking to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new habitstracking, or with status {@code 400 (Bad Request)} if the habitstracking has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/habitstrackings")
    public ResponseEntity<Habitstracking> createHabitstracking(@RequestBody Habitstracking habitstracking) throws URISyntaxException {
        log.debug("REST request to save Habitstracking : {}", habitstracking);
        if (habitstracking.getId() != null) {
            throw new BadRequestAlertException("A new habitstracking cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Habitstracking result = habitstrackingService.save(habitstracking);
        return ResponseEntity
            .created(new URI("/api/habitstrackings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /habitstrackings/:id} : Updates an existing habitstracking.
     *
     * @param id the id of the habitstracking to save.
     * @param habitstracking the habitstracking to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated habitstracking,
     * or with status {@code 400 (Bad Request)} if the habitstracking is not valid,
     * or with status {@code 500 (Internal Server Error)} if the habitstracking couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/habitstrackings/{id}")
    public ResponseEntity<Habitstracking> updateHabitstracking(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Habitstracking habitstracking
    ) throws URISyntaxException {
        log.debug("REST request to update Habitstracking : {}, {}", id, habitstracking);
        if (habitstracking.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, habitstracking.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!habitstrackingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Habitstracking result = habitstrackingService.update(habitstracking);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, habitstracking.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /habitstrackings/:id} : Partial updates given fields of an existing habitstracking, field will ignore if it is null
     *
     * @param id the id of the habitstracking to save.
     * @param habitstracking the habitstracking to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated habitstracking,
     * or with status {@code 400 (Bad Request)} if the habitstracking is not valid,
     * or with status {@code 404 (Not Found)} if the habitstracking is not found,
     * or with status {@code 500 (Internal Server Error)} if the habitstracking couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/habitstrackings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Habitstracking> partialUpdateHabitstracking(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Habitstracking habitstracking
    ) throws URISyntaxException {
        log.debug("REST request to partial update Habitstracking partially : {}, {}", id, habitstracking);
        if (habitstracking.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, habitstracking.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!habitstrackingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Habitstracking> result = habitstrackingService.partialUpdate(habitstracking);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, habitstracking.getId().toString())
        );
    }

    /**
     * {@code GET  /habitstrackings} : get all the habitstrackings.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of habitstrackings in body.
     */
    @GetMapping("/habitstrackings")
    public List<Habitstracking> getAllHabitstrackings() {
        log.debug("REST request to get all Habitstrackings");
        return habitstrackingService.findAll();
    }

    /**
     * {@code GET  /habitstrackings/:id} : get the "id" habitstracking.
     *
     * @param id the id of the habitstracking to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the habitstracking, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/habitstrackings/{id}")
    public ResponseEntity<Habitstracking> getHabitstracking(@PathVariable Long id) {
        log.debug("REST request to get Habitstracking : {}", id);
        Optional<Habitstracking> habitstracking = habitstrackingService.findOne(id);
        return ResponseUtil.wrapOrNotFound(habitstracking);
    }

    /**
     * {@code GET  /habitstrackings/week/:weekOfHabit} : get all the habitstrackings by week number.
     *
     * @param weekOfHabit the week number of the habits to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of habitstrackings in body, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/habitstrackings/week/{weekOfHabit}")
    public ResponseEntity<List<Habitstracking>> getHabitstrackingsByWeek(@PathVariable Integer weekOfHabit) {
        log.debug("REST request to get Habitstrackings by week : {}", weekOfHabit);
        List<Habitstracking> list = habitstrackingService.findByWeekOfHabit(weekOfHabit);
        if (list.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(list);
    }

    /**
     * {@code DELETE  /habitstrackings/:id} : delete the "id" habitstracking.
     *
     * @param id the id of the habitstracking to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/habitstrackings/{id}")
    public ResponseEntity<Void> deleteHabitstracking(@PathVariable Long id) {
        log.debug("REST request to delete Habitstracking : {}", id);
        habitstrackingService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
