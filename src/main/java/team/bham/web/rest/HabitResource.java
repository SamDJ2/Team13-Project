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
import team.bham.domain.Habit;
import team.bham.repository.HabitRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Habit}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class HabitResource {

    private final Logger log = LoggerFactory.getLogger(HabitResource.class);

    private static final String ENTITY_NAME = "habit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HabitRepository habitRepository;

    public HabitResource(HabitRepository habitRepository) {
        this.habitRepository = habitRepository;
    }

    /**
     * {@code POST  /habits} : Create a new habit.
     *
     * @param habit the habit to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new habit, or with status {@code 400 (Bad Request)} if the habit has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/habits")
    public ResponseEntity<Habit> createHabit(@RequestBody Habit habit) throws URISyntaxException {
        log.debug("REST request to save Habit : {}", habit);
        if (habit.getId() != null) {
            throw new BadRequestAlertException("A new habit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Habit result = habitRepository.save(habit);
        return ResponseEntity
            .created(new URI("/api/habits/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /habits/:id} : Updates an existing habit.
     *
     * @param id the id of the habit to save.
     * @param habit the habit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated habit,
     * or with status {@code 400 (Bad Request)} if the habit is not valid,
     * or with status {@code 500 (Internal Server Error)} if the habit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/habits/{id}")
    public ResponseEntity<Habit> updateHabit(@PathVariable(value = "id", required = false) final Long id, @RequestBody Habit habit)
        throws URISyntaxException {
        log.debug("REST request to update Habit : {}, {}", id, habit);
        if (habit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, habit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!habitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Habit result = habitRepository.save(habit);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, habit.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /habits/:id} : Partial updates given fields of an existing habit, field will ignore if it is null
     *
     * @param id the id of the habit to save.
     * @param habit the habit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated habit,
     * or with status {@code 400 (Bad Request)} if the habit is not valid,
     * or with status {@code 404 (Not Found)} if the habit is not found,
     * or with status {@code 500 (Internal Server Error)} if the habit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/habits/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Habit> partialUpdateHabit(@PathVariable(value = "id", required = false) final Long id, @RequestBody Habit habit)
        throws URISyntaxException {
        log.debug("REST request to partial update Habit partially : {}, {}", id, habit);
        if (habit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, habit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!habitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Habit> result = habitRepository
            .findById(habit.getId())
            .map(existingHabit -> {
                if (habit.getHabitID() != null) {
                    existingHabit.setHabitID(habit.getHabitID());
                }
                if (habit.getHabitName() != null) {
                    existingHabit.setHabitName(habit.getHabitName());
                }

                return existingHabit;
            })
            .map(habitRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, habit.getId().toString())
        );
    }

    /**
     * {@code GET  /habits} : get all the habits.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of habits in body.
     */
    @GetMapping("/habits")
    public List<Habit> getAllHabits(@RequestParam(required = false) String filter) {
        if ("navigationportal-is-null".equals(filter)) {
            log.debug("REST request to get all Habits where navigationPortal is null");
            return StreamSupport
                .stream(habitRepository.findAll().spliterator(), false)
                .filter(habit -> habit.getNavigationPortal() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Habits");
        return habitRepository.findAll();
    }

    /**
     * {@code GET  /habits/:id} : get the "id" habit.
     *
     * @param id the id of the habit to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the habit, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/habits/{id}")
    public ResponseEntity<Habit> getHabit(@PathVariable Long id) {
        log.debug("REST request to get Habit : {}", id);
        Optional<Habit> habit = habitRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(habit);
    }

    /**
     * {@code DELETE  /habits/:id} : delete the "id" habit.
     *
     * @param id the id of the habit to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/habits/{id}")
    public ResponseEntity<Void> deleteHabit(@PathVariable Long id) {
        log.debug("REST request to delete Habit : {}", id);
        habitRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
