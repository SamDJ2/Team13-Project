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
import team.bham.domain.Achievement;
import team.bham.repository.AchievementRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Achievement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AchievementResource {

    private final Logger log = LoggerFactory.getLogger(AchievementResource.class);

    private static final String ENTITY_NAME = "achievement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AchievementRepository achievementRepository;

    public AchievementResource(AchievementRepository achievementRepository) {
        this.achievementRepository = achievementRepository;
    }

    /**
     * {@code POST  /achievements} : Create a new achievement.
     *
     * @param achievement the achievement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new achievement, or with status {@code 400 (Bad Request)} if the achievement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/achievements")
    public ResponseEntity<Achievement> createAchievement(@RequestBody Achievement achievement) throws URISyntaxException {
        log.debug("REST request to save Achievement : {}", achievement);
        if (achievement.getId() != null) {
            throw new BadRequestAlertException("A new achievement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Achievement result = achievementRepository.save(achievement);
        return ResponseEntity
            .created(new URI("/api/achievements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /achievements/:id} : Updates an existing achievement.
     *
     * @param id the id of the achievement to save.
     * @param achievement the achievement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated achievement,
     * or with status {@code 400 (Bad Request)} if the achievement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the achievement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/achievements/{id}")
    public ResponseEntity<Achievement> updateAchievement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Achievement achievement
    ) throws URISyntaxException {
        log.debug("REST request to update Achievement : {}, {}", id, achievement);
        if (achievement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, achievement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!achievementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Achievement result = achievementRepository.save(achievement);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, achievement.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /achievements/:id} : Partial updates given fields of an existing achievement, field will ignore if it is null
     *
     * @param id the id of the achievement to save.
     * @param achievement the achievement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated achievement,
     * or with status {@code 400 (Bad Request)} if the achievement is not valid,
     * or with status {@code 404 (Not Found)} if the achievement is not found,
     * or with status {@code 500 (Internal Server Error)} if the achievement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/achievements/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Achievement> partialUpdateAchievement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Achievement achievement
    ) throws URISyntaxException {
        log.debug("REST request to partial update Achievement partially : {}, {}", id, achievement);
        if (achievement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, achievement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!achievementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Achievement> result = achievementRepository
            .findById(achievement.getId())
            .map(existingAchievement -> {
                if (achievement.getAchievementID() != null) {
                    existingAchievement.setAchievementID(achievement.getAchievementID());
                }
                if (achievement.getName() != null) {
                    existingAchievement.setName(achievement.getName());
                }
                if (achievement.getDescription() != null) {
                    existingAchievement.setDescription(achievement.getDescription());
                }
                if (achievement.getDateEarned() != null) {
                    existingAchievement.setDateEarned(achievement.getDateEarned());
                }
                if (achievement.getAchievementType() != null) {
                    existingAchievement.setAchievementType(achievement.getAchievementType());
                }

                return existingAchievement;
            })
            .map(achievementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, achievement.getId().toString())
        );
    }

    /**
     * {@code GET  /achievements} : get all the achievements.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of achievements in body.
     */
    @GetMapping("/achievements")
    public List<Achievement> getAllAchievements(@RequestParam(required = false) String filter) {
        if ("profilecustomization-is-null".equals(filter)) {
            log.debug("REST request to get all Achievements where profileCustomization is null");
            return StreamSupport
                .stream(achievementRepository.findAll().spliterator(), false)
                .filter(achievement -> achievement.getProfileCustomization() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Achievements");
        return achievementRepository.findAll();
    }

    /**
     * {@code GET  /achievements/:id} : get the "id" achievement.
     *
     * @param id the id of the achievement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the achievement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/achievements/{id}")
    public ResponseEntity<Achievement> getAchievement(@PathVariable Long id) {
        log.debug("REST request to get Achievement : {}", id);
        Optional<Achievement> achievement = achievementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(achievement);
    }

    /**
     * {@code DELETE  /achievements/:id} : delete the "id" achievement.
     *
     * @param id the id of the achievement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/achievements/{id}")
    public ResponseEntity<Void> deleteAchievement(@PathVariable Long id) {
        log.debug("REST request to delete Achievement : {}", id);
        achievementRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
