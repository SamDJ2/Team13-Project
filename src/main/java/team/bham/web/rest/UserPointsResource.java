package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.UserPoints;
import team.bham.repository.UserPointsRepository;
import team.bham.service.UserPointsService;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.UserPoints}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserPointsResource {

    private final Logger log = LoggerFactory.getLogger(UserPointsResource.class);

    private static final String ENTITY_NAME = "userPoints";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserPointsRepository userPointsRepository;

    private UserPointsService userPointsService;

    public UserPointsResource(UserPointsRepository userPointsRepository, UserPointsService userPointsService) {
        this.userPointsRepository = userPointsRepository;
        this.userPointsService = userPointsService;
    }

    /**
     * {@code POST  /user-points} : Create a new userPoints.
     *
     * @param userPoints the userPoints to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userPoints, or with status {@code 400 (Bad Request)} if the userPoints has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-points")
    public ResponseEntity<UserPoints> createUserPoints(@RequestBody UserPoints userPoints) throws URISyntaxException {
        log.debug("REST request to save UserPoints : {}", userPoints);
        if (userPoints.getId() != null) {
            throw new BadRequestAlertException("A new userPoints cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserPoints result = userPointsRepository.save(userPoints);
        return ResponseEntity
            .created(new URI("/api/user-points/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-points/:id} : Updates an existing userPoints.
     *
     * @param id the id of the userPoints to save.
     * @param userPoints the userPoints to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userPoints,
     * or with status {@code 400 (Bad Request)} if the userPoints is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userPoints couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-points/{id}")
    public ResponseEntity<UserPoints> updateUserPoints(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserPoints userPoints
    ) throws URISyntaxException {
        log.debug("REST request to update UserPoints : {}, {}", id, userPoints);
        if (userPoints.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userPoints.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userPointsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserPoints result = userPointsRepository.save(userPoints);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userPoints.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-points/:id} : Partial updates given fields of an existing userPoints, field will ignore if it is null
     *
     * @param id the id of the userPoints to save.
     * @param userPoints the userPoints to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userPoints,
     * or with status {@code 400 (Bad Request)} if the userPoints is not valid,
     * or with status {@code 404 (Not Found)} if the userPoints is not found,
     * or with status {@code 500 (Internal Server Error)} if the userPoints couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-points/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserPoints> partialUpdateUserPoints(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserPoints userPoints
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserPoints partially : {}, {}", id, userPoints);
        if (userPoints.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userPoints.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userPointsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserPoints> result = userPointsRepository
            .findById(userPoints.getId())
            .map(existingUserPoints -> {
                if (userPoints.getUserID() != null) {
                    existingUserPoints.setUserID(userPoints.getUserID());
                }
                if (userPoints.getCurrentPoints() != null) {
                    existingUserPoints.setCurrentPoints(userPoints.getCurrentPoints());
                }
                if (userPoints.getPreviousPoints() != null) {
                    existingUserPoints.setPreviousPoints(userPoints.getPreviousPoints());
                }
                if (userPoints.getTotalPoints() != null) {
                    existingUserPoints.setTotalPoints(userPoints.getTotalPoints());
                }

                return existingUserPoints;
            })
            .map(userPointsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userPoints.getId().toString())
        );
    }

    /**
     * {@code GET  /user-points} : get all the userPoints.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userPoints in body.
     */
    @GetMapping("/user-points")
    public List<UserPoints> getAllUserPoints() {
        log.debug("REST request to get all UserPoints");
        return userPointsRepository.findAll();
    }

    /**
     * {@code GET  /user-points/:id} : get the "id" userPoints.
     *
     * @param id the id of the userPoints to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userPoints, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-points/{id}")
    public ResponseEntity<UserPoints> getUserPoints(@PathVariable Long id) {
        log.debug("REST request to get UserPoints : {}", id);
        Optional<UserPoints> userPoints = userPointsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userPoints);
    }

    /**
     * {@code DELETE  /user-points/:id} : delete the "id" userPoints.
     *
     * @param id the id of the userPoints to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-points/{id}")
    public ResponseEntity<Void> deleteUserPoints(@PathVariable Long id) {
        log.debug("REST request to delete UserPoints : {}", id);
        userPointsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/user-points/updatePoints")
    public String triggerUpdatePoints() {
        userPointsService.updatePoints();
        return "Points update triggered";
    }

    @GetMapping("/user-points/nextResetTime")
    public ResponseEntity<Map<String, Object>> getNextResetTime() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextReset = now.with(TemporalAdjusters.next(DayOfWeek.MONDAY)).withHour(0).withMinute(0).withSecond(0).withNano(0);

        Duration duration = Duration.between(now, nextReset);

        Map<String, Object> response = new HashMap<>();
        response.put("days", duration.toDays());
        response.put("hours", duration.toHours() % 24);
        response.put("minutes", duration.toMinutes() % 60);
        response.put("seconds", duration.getSeconds() % 60);

        return ResponseEntity.ok(response);
    }
}
