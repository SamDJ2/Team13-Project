package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.Grouping;
import team.bham.domain.Members;
import team.bham.repository.MembersRepository;
import team.bham.service.MembersService;
import team.bham.service.dto.CreateDTO;
import team.bham.service.dto.PointsDTO;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Members}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MembersResource {

    private final Logger log = LoggerFactory.getLogger(MembersResource.class);

    private static final String ENTITY_NAME = "members";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MembersRepository membersRepository;

    private final MembersService membersService;

    public MembersResource(MembersRepository membersRepository, MembersService membersService) {
        this.membersRepository = membersRepository;
        this.membersService = membersService;
    }

    /**
     * {@code POST  /members} : Create a new members.
     *
     * @param members the members to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new members, or with status {@code 400 (Bad Request)} if the members has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/members")
    public ResponseEntity<?> createMembers(@RequestBody CreateDTO createDTO) throws URISyntaxException {
        log.debug("REST request to save Members");

        Long currentUserId = membersService.findCurrentUserid();

        boolean isMember = membersRepository.existsByUserIDAndGroupID(currentUserId, createDTO.getid());
        if (isMember) {
            return ResponseEntity.badRequest().body("User is already a member of this group");
        }

        Members members = new Members();
        members.setUserID(currentUserId);
        members.setGroupID(createDTO.getid());
        members.setLeader(createDTO.isLeader());

        Members result = membersRepository.save(members);

        return ResponseEntity.ok(members);
    }

    /**
     * {@code PUT  /members/:id} : Updates an existing members.
     *
     * @param id the id of the members to save.
     * @param members the members to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated members,
     * or with status {@code 400 (Bad Request)} if the members is not valid,
     * or with status {@code 500 (Internal Server Error)} if the members couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/members/{id}")
    public ResponseEntity<Members> updateMembers(@PathVariable(value = "id", required = false) final Long id, @RequestBody Members members)
        throws URISyntaxException {
        log.debug("REST request to update Members : {}, {}", id, members);
        if (members.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, members.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!membersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Members result = membersRepository.save(members);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, members.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /members/:id} : Partial updates given fields of an existing members, field will ignore if it is null
     *
     * @param id the id of the members to save.
     * @param members the members to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated members,
     * or with status {@code 400 (Bad Request)} if the members is not valid,
     * or with status {@code 404 (Not Found)} if the members is not found,
     * or with status {@code 500 (Internal Server Error)} if the members couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/members/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Members> partialUpdateMembers(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Members members
    ) throws URISyntaxException {
        log.debug("REST request to partial update Members partially : {}, {}", id, members);
        if (members.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, members.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!membersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Members> result = membersRepository
            .findById(members.getId())
            .map(existingMembers -> {
                if (members.getGroupID() != null) {
                    existingMembers.setGroupID(members.getGroupID());
                }
                if (members.getUserID() != null) {
                    existingMembers.setUserID(members.getUserID());
                }
                if (members.getLeader() != null) {
                    existingMembers.setLeader(members.getLeader());
                }

                return existingMembers;
            })
            .map(membersRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, members.getId().toString())
        );
    }

    /**
     * {@code GET  /members} : get all the members.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of members in body.
     */
    @GetMapping("/members")
    public List<Members> getAllMembers() {
        log.debug("REST request to get all Members");
        return membersRepository.findAll();
    }

    /**
     * {@code GET  /members/:id} : get the "id" members.
     *
     * @param id the id of the members to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the members, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/members/{id}")
    public ResponseEntity<Members> getMembers(@PathVariable Long id) {
        log.debug("REST request to get Members : {}", id);
        Optional<Members> members = membersRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(members);
    }

    /**
     * {@code DELETE  /members/:groupID} : delete the "id" members.
     *
     * @param id the id of the members to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/members/{groupID}")
    public ResponseEntity<Void> deleteMembers(@PathVariable Long groupID) {
        log.debug("REST request to delete Members : {}", groupID);
        membersService.deleteByCurrentUserAndGroupId(groupID);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, groupID.toString()))
            .build();
    }

    /**
     * {@code GET  /members/group/{groupID}/points} : get the current points for users in a specific group.
     *
     * @param groupID the id of the group.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of PointsDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/members/group/{groupID}/points")
    public ResponseEntity<List<PointsDTO>> getPointsByGroupID(@PathVariable Long groupID) {
        log.debug("REST request to get points by group ID : {}", groupID);
        List<PointsDTO> points = membersService.getPointsByGroupID(groupID);
        if (points.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(points);
    }

    /**
     * {@code GET  /members/groups} : get the current points for users in a specific group.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Groups, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/members/groups")
    public ResponseEntity<List<Members>> getCurrentUserGroups() {
        log.debug("REST request to get Groups by Current Users : {}");
        List<Members> groups = membersService.findGroupsForCurrentUser();
        if (groups.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(groups);
    }
}
