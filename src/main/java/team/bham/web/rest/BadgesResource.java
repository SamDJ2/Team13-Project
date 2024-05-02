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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.Badges;
import team.bham.repository.BadgesRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Badges}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BadgesResource {

    private final Logger log = LoggerFactory.getLogger(BadgesResource.class);

    private static final String ENTITY_NAME = "badges";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BadgesRepository badgesRepository;

    public BadgesResource(BadgesRepository badgesRepository) {
        this.badgesRepository = badgesRepository;
    }

    /**
     * {@code POST  /badges} : Create a new badges.
     *
     * @param badges the badges to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new badges, or with status {@code 400 (Bad Request)} if the badges has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/badges")
    public ResponseEntity<Badges> createBadges(@RequestBody Badges badges) throws URISyntaxException {
        log.debug("REST request to save Badges : {}", badges);
        if (badges.getId() != null) {
            throw new BadRequestAlertException("A new badges cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Badges result = badgesRepository.save(badges);
        return ResponseEntity
            .created(new URI("/api/badges/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /badges/:id} : Updates an existing badges.
     *
     * @param id the id of the badges to save.
     * @param badges the badges to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated badges,
     * or with status {@code 400 (Bad Request)} if the badges is not valid,
     * or with status {@code 500 (Internal Server Error)} if the badges couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/badges/{id}")
    public ResponseEntity<Badges> updateBadges(@PathVariable(value = "id", required = false) final Long id, @RequestBody Badges badges)
        throws URISyntaxException {
        log.debug("REST request to update Badges : {}, {}", id, badges);
        if (badges.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, badges.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!badgesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Badges result = badgesRepository.save(badges);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, badges.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /badges/:id} : Partial updates given fields of an existing badges, field will ignore if it is null
     *
     * @param id the id of the badges to save.
     * @param badges the badges to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated badges,
     * or with status {@code 400 (Bad Request)} if the badges is not valid,
     * or with status {@code 404 (Not Found)} if the badges is not found,
     * or with status {@code 500 (Internal Server Error)} if the badges couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/badges/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Badges> partialUpdateBadges(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Badges badges
    ) throws URISyntaxException {
        log.debug("REST request to partial update Badges partially : {}, {}", id, badges);
        if (badges.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, badges.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!badgesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Badges> result = badgesRepository
            .findById(badges.getId())
            .map(existingBadges -> {
                if (badges.getBadgeNo() != null) {
                    existingBadges.setBadgeNo(badges.getBadgeNo());
                }
                if (badges.getRequiredPoints() != null) {
                    existingBadges.setRequiredPoints(badges.getRequiredPoints());
                }
                if (badges.getBadge() != null) {
                    existingBadges.setBadge(badges.getBadge());
                }
                if (badges.getBadgeContentType() != null) {
                    existingBadges.setBadgeContentType(badges.getBadgeContentType());
                }

                return existingBadges;
            })
            .map(badgesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, badges.getId().toString())
        );
    }

    /**
     * {@code GET  /badges} : get all the badges.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of badges in body.
     */
    @GetMapping("/badges")
    public List<Badges> getAllBadges() {
        log.debug("REST request to get all Badges");
        return badgesRepository.findAll();
    }

    /**
     * {@code GET  /badges/:id} : get the "id" badges.
     *
     * @param id the id of the badges to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the badges, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/badges/{id}")
    public ResponseEntity<Badges> getBadges(@PathVariable Long id) {
        log.debug("REST request to get Badges : {}", id);
        Optional<Badges> badges = badgesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(badges);
    }

    /**
     * {@code DELETE  /badges/:id} : delete the "id" badges.
     *
     * @param id the id of the badges to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/badges/{id}")
    public ResponseEntity<Void> deleteBadges(@PathVariable Long id) {
        log.debug("REST request to delete Badges : {}", id);
        badgesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
