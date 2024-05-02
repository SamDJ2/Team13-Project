package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import team.bham.domain.Grouping;
import team.bham.repository.GroupingRepository;
import team.bham.repository.MembersRepository;
import team.bham.service.dto.GroupDTO;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Grouping}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GroupingResource {

    private final Logger log = LoggerFactory.getLogger(GroupingResource.class);

    private static final String ENTITY_NAME = "grouping";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GroupingRepository groupingRepository;

    private final MembersRepository membersRepository;

    public GroupingResource(GroupingRepository groupingRepository, MembersRepository membersRepository) {
        this.groupingRepository = groupingRepository;
        this.membersRepository = membersRepository;
    }

    /**
     * {@code POST  /groupings} : Create a new grouping.
     *
     * @param grouping the grouping to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new grouping, or with status {@code 400 (Bad Request)} if the grouping has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/groupings")
    public ResponseEntity<Grouping> createGrouping(@RequestBody GroupDTO groupDTO) {
        if (groupDTO.getGroupName() == null || groupDTO.getGroupName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Grouping newGrouping = new Grouping();
        newGrouping.setGroupingName(groupDTO.getGroupName());

        newGrouping = groupingRepository.save(newGrouping);

        return ResponseEntity.ok(newGrouping);
    }

    /**
     * {@code PUT  /groupings/:id} : Updates an existing grouping.
     *
     * @param id the id of the grouping to save.
     * @param grouping the grouping to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grouping,
     * or with status {@code 400 (Bad Request)} if the grouping is not valid,
     * or with status {@code 500 (Internal Server Error)} if the grouping couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/groupings/{id}")
    public ResponseEntity<Grouping> updateGrouping(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Grouping grouping
    ) throws URISyntaxException {
        log.debug("REST request to update Grouping : {}, {}", id, grouping);
        if (grouping.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grouping.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!groupingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Grouping result = groupingRepository.save(grouping);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, grouping.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /groupings/:id} : Partial updates given fields of an existing grouping, field will ignore if it is null
     *
     * @param id the id of the grouping to save.
     * @param grouping the grouping to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grouping,
     * or with status {@code 400 (Bad Request)} if the grouping is not valid,
     * or with status {@code 404 (Not Found)} if the grouping is not found,
     * or with status {@code 500 (Internal Server Error)} if the grouping couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/groupings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Grouping> partialUpdateGrouping(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Grouping grouping
    ) throws URISyntaxException {
        log.debug("REST request to partial update Grouping partially : {}, {}", id, grouping);
        if (grouping.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grouping.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!groupingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Grouping> result = groupingRepository
            .findById(grouping.getId())
            .map(existingGrouping -> {
                if (grouping.getiD() != null) {
                    existingGrouping.setiD(grouping.getiD());
                }
                if (grouping.getGroupingName() != null) {
                    existingGrouping.setGroupingName(grouping.getGroupingName());
                }
                if (grouping.getGroupingPoints() != null) {
                    existingGrouping.setGroupingPoints(grouping.getGroupingPoints());
                }
                if (grouping.getRemainingTime() != null) {
                    existingGrouping.setRemainingTime(grouping.getRemainingTime());
                }
                if (grouping.getCurrentDate() != null) {
                    existingGrouping.setCurrentDate(grouping.getCurrentDate());
                }

                return existingGrouping;
            })
            .map(groupingRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, grouping.getId().toString())
        );
    }

    /**
     * {@code GET  /groupings} : get all the groupings.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of groupings in body.
     */
    @GetMapping("/groupings")
    public List<Grouping> getAllGroupings(@RequestParam(required = false) String filter) {
        if ("leaderboards-is-null".equals(filter)) {
            log.debug("REST request to get all Groupings where leaderBoards is null");
            return StreamSupport
                .stream(groupingRepository.findAll().spliterator(), false)
                .filter(grouping -> grouping.getLeaderBoards() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Groupings");
        return groupingRepository.findAll();
    }

    /**
     * {@code GET  /groupings/:id} : get the "id" grouping.
     *
     * @param id the id of the grouping to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the grouping, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/groupings/{id}")
    public ResponseEntity<Grouping> getGrouping(@PathVariable Long id) {
        log.debug("REST request to get Grouping : {}", id);
        Optional<Grouping> grouping = groupingRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(grouping);
    }

    /**
     * {@code DELETE  /groupings/:id} : delete the "id" grouping.
     *
     * @param id the id of the grouping to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/groupings/{id}")
    public ResponseEntity<Void> deleteGrouping(@PathVariable Long id) {
        log.debug("REST request to delete Grouping : {}", id);
        groupingRepository.deleteById(id);
        long GroupID = id;
        membersRepository.deleteAllByGroupID(GroupID);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/groupings/by-name/{groupingName}")
    public ResponseEntity<Grouping> getGroupingByName(@PathVariable String groupingName) {
        log.debug("REST request to get Grouping by name: {}", groupingName);
        Optional<Grouping> grouping = groupingRepository.findOneByGroupingName(groupingName);
        return ResponseUtil.wrapOrNotFound(grouping);
    }
}
