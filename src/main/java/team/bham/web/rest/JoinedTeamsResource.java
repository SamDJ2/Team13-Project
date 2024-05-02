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
import team.bham.domain.JoinedTeams;
import team.bham.repository.JoinedTeamsRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.JoinedTeams}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class JoinedTeamsResource {

    private final Logger log = LoggerFactory.getLogger(JoinedTeamsResource.class);

    private static final String ENTITY_NAME = "joinedTeams";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JoinedTeamsRepository joinedTeamsRepository;

    public JoinedTeamsResource(JoinedTeamsRepository joinedTeamsRepository) {
        this.joinedTeamsRepository = joinedTeamsRepository;
    }

    /**
     * {@code POST  /joined-teams} : Create a new joinedTeams.
     *
     * @param joinedTeams the joinedTeams to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new joinedTeams, or with status {@code 400 (Bad Request)} if the joinedTeams has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/joined-teams")
    public ResponseEntity<JoinedTeams> createJoinedTeams(@RequestBody JoinedTeams joinedTeams) throws URISyntaxException {
        log.debug("REST request to save JoinedTeams : {}", joinedTeams);
        if (joinedTeams.getId() != null) {
            throw new BadRequestAlertException("A new joinedTeams cannot already have an ID", ENTITY_NAME, "idexists");
        }
        JoinedTeams result = joinedTeamsRepository.save(joinedTeams);
        return ResponseEntity
            .created(new URI("/api/joined-teams/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /joined-teams/:id} : Updates an existing joinedTeams.
     *
     * @param id the id of the joinedTeams to save.
     * @param joinedTeams the joinedTeams to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated joinedTeams,
     * or with status {@code 400 (Bad Request)} if the joinedTeams is not valid,
     * or with status {@code 500 (Internal Server Error)} if the joinedTeams couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/joined-teams/{id}")
    public ResponseEntity<JoinedTeams> updateJoinedTeams(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody JoinedTeams joinedTeams
    ) throws URISyntaxException {
        log.debug("REST request to update JoinedTeams : {}, {}", id, joinedTeams);
        if (joinedTeams.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, joinedTeams.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!joinedTeamsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        JoinedTeams result = joinedTeamsRepository.save(joinedTeams);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, joinedTeams.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /joined-teams/:id} : Partial updates given fields of an existing joinedTeams, field will ignore if it is null
     *
     * @param id the id of the joinedTeams to save.
     * @param joinedTeams the joinedTeams to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated joinedTeams,
     * or with status {@code 400 (Bad Request)} if the joinedTeams is not valid,
     * or with status {@code 404 (Not Found)} if the joinedTeams is not found,
     * or with status {@code 500 (Internal Server Error)} if the joinedTeams couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/joined-teams/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<JoinedTeams> partialUpdateJoinedTeams(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody JoinedTeams joinedTeams
    ) throws URISyntaxException {
        log.debug("REST request to partial update JoinedTeams partially : {}, {}", id, joinedTeams);
        if (joinedTeams.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, joinedTeams.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!joinedTeamsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<JoinedTeams> result = joinedTeamsRepository
            .findById(joinedTeams.getId())
            .map(existingJoinedTeams -> {
                if (joinedTeams.getTeamID() != null) {
                    existingJoinedTeams.setTeamID(joinedTeams.getTeamID());
                }
                if (joinedTeams.getName() != null) {
                    existingJoinedTeams.setName(joinedTeams.getName());
                }
                if (joinedTeams.getDescription() != null) {
                    existingJoinedTeams.setDescription(joinedTeams.getDescription());
                }
                if (joinedTeams.getMemberSince() != null) {
                    existingJoinedTeams.setMemberSince(joinedTeams.getMemberSince());
                }

                return existingJoinedTeams;
            })
            .map(joinedTeamsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, joinedTeams.getId().toString())
        );
    }

    /**
     * {@code GET  /joined-teams} : get all the joinedTeams.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of joinedTeams in body.
     */
    @GetMapping("/joined-teams")
    public List<JoinedTeams> getAllJoinedTeams(@RequestParam(required = false) String filter) {
        if ("profilecustomization-is-null".equals(filter)) {
            log.debug("REST request to get all JoinedTeamss where profileCustomization is null");
            return StreamSupport
                .stream(joinedTeamsRepository.findAll().spliterator(), false)
                .filter(joinedTeams -> joinedTeams.getProfileCustomization() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all JoinedTeams");
        return joinedTeamsRepository.findAll();
    }

    /**
     * {@code GET  /joined-teams/:id} : get the "id" joinedTeams.
     *
     * @param id the id of the joinedTeams to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the joinedTeams, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/joined-teams/{id}")
    public ResponseEntity<JoinedTeams> getJoinedTeams(@PathVariable Long id) {
        log.debug("REST request to get JoinedTeams : {}", id);
        Optional<JoinedTeams> joinedTeams = joinedTeamsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(joinedTeams);
    }

    /**
     * {@code DELETE  /joined-teams/:id} : delete the "id" joinedTeams.
     *
     * @param id the id of the joinedTeams to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/joined-teams/{id}")
    public ResponseEntity<Void> deleteJoinedTeams(@PathVariable Long id) {
        log.debug("REST request to delete JoinedTeams : {}", id);
        joinedTeamsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
