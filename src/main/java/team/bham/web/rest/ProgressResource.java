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
import team.bham.domain.Progress;
import team.bham.repository.ProgressRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Progress}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProgressResource {

    private final Logger log = LoggerFactory.getLogger(ProgressResource.class);

    private static final String ENTITY_NAME = "progress";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProgressRepository progressRepository;

    public ProgressResource(ProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }

    /**
     * {@code POST  /progresses} : Create a new progress.
     *
     * @param progress the progress to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new progress, or with status {@code 400 (Bad Request)} if the progress has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/progresses")
    public ResponseEntity<Progress> createProgress(@RequestBody Progress progress) throws URISyntaxException {
        log.debug("REST request to save Progress : {}", progress);
        if (progress.getId() != null) {
            throw new BadRequestAlertException("A new progress cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Progress result = progressRepository.save(progress);
        return ResponseEntity
            .created(new URI("/api/progresses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /progresses/:id} : Updates an existing progress.
     *
     * @param id the id of the progress to save.
     * @param progress the progress to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated progress,
     * or with status {@code 400 (Bad Request)} if the progress is not valid,
     * or with status {@code 500 (Internal Server Error)} if the progress couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/progresses/{id}")
    public ResponseEntity<Progress> updateProgress(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Progress progress
    ) throws URISyntaxException {
        log.debug("REST request to update Progress : {}, {}", id, progress);
        if (progress.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, progress.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!progressRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Progress result = progressRepository.save(progress);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, progress.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /progresses/:id} : Partial updates given fields of an existing progress, field will ignore if it is null
     *
     * @param id the id of the progress to save.
     * @param progress the progress to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated progress,
     * or with status {@code 400 (Bad Request)} if the progress is not valid,
     * or with status {@code 404 (Not Found)} if the progress is not found,
     * or with status {@code 500 (Internal Server Error)} if the progress couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/progresses/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Progress> partialUpdateProgress(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Progress progress
    ) throws URISyntaxException {
        log.debug("REST request to partial update Progress partially : {}, {}", id, progress);
        if (progress.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, progress.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!progressRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Progress> result = progressRepository
            .findById(progress.getId())
            .map(existingProgress -> {
                if (progress.getDetoxProgress() != null) {
                    existingProgress.setDetoxProgress(progress.getDetoxProgress());
                }
                if (progress.getDetoxTotal() != null) {
                    existingProgress.setDetoxTotal(progress.getDetoxTotal());
                }
                if (progress.getChallengesInfo() != null) {
                    existingProgress.setChallengesInfo(progress.getChallengesInfo());
                }
                if (progress.getLeaderboardInfo() != null) {
                    existingProgress.setLeaderboardInfo(progress.getLeaderboardInfo());
                }

                return existingProgress;
            })
            .map(progressRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, progress.getId().toString())
        );
    }

    /**
     * {@code GET  /progresses} : get all the progresses.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of progresses in body.
     */
    @GetMapping("/progresses")
    public List<Progress> getAllProgresses(@RequestParam(required = false) String filter) {
        if ("challenges-is-null".equals(filter)) {
            log.debug("REST request to get all Progresss where challenges is null");
            return StreamSupport
                .stream(progressRepository.findAll().spliterator(), false)
                .filter(progress -> progress.getChallenges() == null)
                .collect(Collectors.toList());
        }

        if ("leaderboards-is-null".equals(filter)) {
            log.debug("REST request to get all Progresss where leaderBoards is null");
            return StreamSupport
                .stream(progressRepository.findAll().spliterator(), false)
                .filter(progress -> progress.getLeaderBoards() == null)
                .collect(Collectors.toList());
        }

        if ("userdb-is-null".equals(filter)) {
            log.debug("REST request to get all Progresss where userDB is null");
            return StreamSupport
                .stream(progressRepository.findAll().spliterator(), false)
                .filter(progress -> progress.getUserDB() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Progresses");
        return progressRepository.findAll();
    }

    /**
     * {@code GET  /progresses/:id} : get the "id" progress.
     *
     * @param id the id of the progress to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the progress, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/progresses/{id}")
    public ResponseEntity<Progress> getProgress(@PathVariable Long id) {
        log.debug("REST request to get Progress : {}", id);
        Optional<Progress> progress = progressRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(progress);
    }

    /**
     * {@code DELETE  /progresses/:id} : delete the "id" progress.
     *
     * @param id the id of the progress to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/progresses/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable Long id) {
        log.debug("REST request to delete Progress : {}", id);
        progressRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
