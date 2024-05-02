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
import team.bham.domain.Challenges;
import team.bham.repository.ChallengesRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Challenges}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ChallengesResource {

    private final Logger log = LoggerFactory.getLogger(ChallengesResource.class);

    private static final String ENTITY_NAME = "challenges";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChallengesRepository challengesRepository;

    public ChallengesResource(ChallengesRepository challengesRepository) {
        this.challengesRepository = challengesRepository;
    }

    /**
     * {@code POST  /challenges} : Create a new challenges.
     *
     * @param challenges the challenges to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new challenges, or with status {@code 400 (Bad Request)} if the challenges has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/challenges")
    public ResponseEntity<Challenges> createChallenges(@RequestBody Challenges challenges) throws URISyntaxException {
        log.debug("REST request to save Challenges : {}", challenges);
        if (challenges.getId() != null) {
            throw new BadRequestAlertException("A new challenges cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Challenges result = challengesRepository.save(challenges);
        return ResponseEntity
            .created(new URI("/api/challenges/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /challenges/:id} : Updates an existing challenges.
     *
     * @param id the id of the challenges to save.
     * @param challenges the challenges to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated challenges,
     * or with status {@code 400 (Bad Request)} if the challenges is not valid,
     * or with status {@code 500 (Internal Server Error)} if the challenges couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/challenges/{id}")
    public ResponseEntity<Challenges> updateChallenges(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Challenges challenges
    ) throws URISyntaxException {
        log.debug("REST request to update Challenges : {}, {}", id, challenges);
        if (challenges.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, challenges.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!challengesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Challenges result = challengesRepository.save(challenges);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, challenges.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /challenges/:id} : Partial updates given fields of an existing challenges, field will ignore if it is null
     *
     * @param id the id of the challenges to save.
     * @param challenges the challenges to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated challenges,
     * or with status {@code 400 (Bad Request)} if the challenges is not valid,
     * or with status {@code 404 (Not Found)} if the challenges is not found,
     * or with status {@code 500 (Internal Server Error)} if the challenges couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/challenges/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Challenges> partialUpdateChallenges(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Challenges challenges
    ) throws URISyntaxException {
        log.debug("REST request to partial update Challenges partially : {}, {}", id, challenges);
        if (challenges.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, challenges.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!challengesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Challenges> result = challengesRepository
            .findById(challenges.getId())
            .map(existingChallenges -> {
                if (challenges.getSelectChallenge() != null) {
                    existingChallenges.setSelectChallenge(challenges.getSelectChallenge());
                }
                if (challenges.getAllChallenges() != null) {
                    existingChallenges.setAllChallenges(challenges.getAllChallenges());
                }

                return existingChallenges;
            })
            .map(challengesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, challenges.getId().toString())
        );
    }

    /**
     * {@code GET  /challenges} : get all the challenges.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of challenges in body.
     */
    @GetMapping("/challenges")
    public List<Challenges> getAllChallenges(
        @RequestParam(required = false) String filter,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        if ("navigationportal-is-null".equals(filter)) {
            log.debug("REST request to get all Challengess where navigationPortal is null");
            return StreamSupport
                .stream(challengesRepository.findAll().spliterator(), false)
                .filter(challenges -> challenges.getNavigationPortal() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Challenges");
        if (eagerload) {
            return challengesRepository.findAllWithEagerRelationships();
        } else {
            return challengesRepository.findAll();
        }
    }

    /**
     * {@code GET  /challenges/:id} : get the "id" challenges.
     *
     * @param id the id of the challenges to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the challenges, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/challenges/{id}")
    public ResponseEntity<Challenges> getChallenges(@PathVariable Long id) {
        log.debug("REST request to get Challenges : {}", id);
        Optional<Challenges> challenges = challengesRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(challenges);
    }

    /**
     * {@code DELETE  /challenges/:id} : delete the "id" challenges.
     *
     * @param id the id of the challenges to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/challenges/{id}")
    public ResponseEntity<Void> deleteChallenges(@PathVariable Long id) {
        log.debug("REST request to delete Challenges : {}", id);
        challengesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
