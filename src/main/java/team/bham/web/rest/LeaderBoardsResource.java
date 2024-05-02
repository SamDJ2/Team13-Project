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
import team.bham.domain.LeaderBoards;
import team.bham.repository.LeaderBoardsRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.LeaderBoards}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LeaderBoardsResource {

    private final Logger log = LoggerFactory.getLogger(LeaderBoardsResource.class);

    private static final String ENTITY_NAME = "leaderBoards";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LeaderBoardsRepository leaderBoardsRepository;

    public LeaderBoardsResource(LeaderBoardsRepository leaderBoardsRepository) {
        this.leaderBoardsRepository = leaderBoardsRepository;
    }

    /**
     * {@code POST  /leader-boards} : Create a new leaderBoards.
     *
     * @param leaderBoards the leaderBoards to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new leaderBoards, or with status {@code 400 (Bad Request)} if the leaderBoards has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/leader-boards")
    public ResponseEntity<LeaderBoards> createLeaderBoards(@RequestBody LeaderBoards leaderBoards) throws URISyntaxException {
        log.debug("REST request to save LeaderBoards : {}", leaderBoards);
        if (leaderBoards.getId() != null) {
            throw new BadRequestAlertException("A new leaderBoards cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LeaderBoards result = leaderBoardsRepository.save(leaderBoards);
        return ResponseEntity
            .created(new URI("/api/leader-boards/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /leader-boards/:id} : Updates an existing leaderBoards.
     *
     * @param id the id of the leaderBoards to save.
     * @param leaderBoards the leaderBoards to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated leaderBoards,
     * or with status {@code 400 (Bad Request)} if the leaderBoards is not valid,
     * or with status {@code 500 (Internal Server Error)} if the leaderBoards couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/leader-boards/{id}")
    public ResponseEntity<LeaderBoards> updateLeaderBoards(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LeaderBoards leaderBoards
    ) throws URISyntaxException {
        log.debug("REST request to update LeaderBoards : {}, {}", id, leaderBoards);
        if (leaderBoards.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, leaderBoards.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!leaderBoardsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LeaderBoards result = leaderBoardsRepository.save(leaderBoards);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, leaderBoards.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /leader-boards/:id} : Partial updates given fields of an existing leaderBoards, field will ignore if it is null
     *
     * @param id the id of the leaderBoards to save.
     * @param leaderBoards the leaderBoards to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated leaderBoards,
     * or with status {@code 400 (Bad Request)} if the leaderBoards is not valid,
     * or with status {@code 404 (Not Found)} if the leaderBoards is not found,
     * or with status {@code 500 (Internal Server Error)} if the leaderBoards couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/leader-boards/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LeaderBoards> partialUpdateLeaderBoards(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LeaderBoards leaderBoards
    ) throws URISyntaxException {
        log.debug("REST request to partial update LeaderBoards partially : {}, {}", id, leaderBoards);
        if (leaderBoards.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, leaderBoards.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!leaderBoardsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LeaderBoards> result = leaderBoardsRepository
            .findById(leaderBoards.getId())
            .map(existingLeaderBoards -> {
                if (leaderBoards.getStandings() != null) {
                    existingLeaderBoards.setStandings(leaderBoards.getStandings());
                }

                return existingLeaderBoards;
            })
            .map(leaderBoardsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, leaderBoards.getId().toString())
        );
    }

    /**
     * {@code GET  /leader-boards} : get all the leaderBoards.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of leaderBoards in body.
     */
    @GetMapping("/leader-boards")
    public List<LeaderBoards> getAllLeaderBoards(@RequestParam(required = false) String filter) {
        if ("navigationportal-is-null".equals(filter)) {
            log.debug("REST request to get all LeaderBoardss where navigationPortal is null");
            return StreamSupport
                .stream(leaderBoardsRepository.findAll().spliterator(), false)
                .filter(leaderBoards -> leaderBoards.getNavigationPortal() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all LeaderBoards");
        return leaderBoardsRepository.findAll();
    }

    /**
     * {@code GET  /leader-boards/:id} : get the "id" leaderBoards.
     *
     * @param id the id of the leaderBoards to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the leaderBoards, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/leader-boards/{id}")
    public ResponseEntity<LeaderBoards> getLeaderBoards(@PathVariable Long id) {
        log.debug("REST request to get LeaderBoards : {}", id);
        Optional<LeaderBoards> leaderBoards = leaderBoardsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(leaderBoards);
    }

    /**
     * {@code DELETE  /leader-boards/:id} : delete the "id" leaderBoards.
     *
     * @param id the id of the leaderBoards to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/leader-boards/{id}")
    public ResponseEntity<Void> deleteLeaderBoards(@PathVariable Long id) {
        log.debug("REST request to delete LeaderBoards : {}", id);
        leaderBoardsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
