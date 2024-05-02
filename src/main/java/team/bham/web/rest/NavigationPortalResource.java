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
import team.bham.domain.NavigationPortal;
import team.bham.repository.NavigationPortalRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.NavigationPortal}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class NavigationPortalResource {

    private final Logger log = LoggerFactory.getLogger(NavigationPortalResource.class);

    private static final String ENTITY_NAME = "navigationPortal";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NavigationPortalRepository navigationPortalRepository;

    public NavigationPortalResource(NavigationPortalRepository navigationPortalRepository) {
        this.navigationPortalRepository = navigationPortalRepository;
    }

    /**
     * {@code POST  /navigation-portals} : Create a new navigationPortal.
     *
     * @param navigationPortal the navigationPortal to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new navigationPortal, or with status {@code 400 (Bad Request)} if the navigationPortal has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/navigation-portals")
    public ResponseEntity<NavigationPortal> createNavigationPortal(@RequestBody NavigationPortal navigationPortal)
        throws URISyntaxException {
        log.debug("REST request to save NavigationPortal : {}", navigationPortal);
        if (navigationPortal.getId() != null) {
            throw new BadRequestAlertException("A new navigationPortal cannot already have an ID", ENTITY_NAME, "idexists");
        }
        NavigationPortal result = navigationPortalRepository.save(navigationPortal);
        return ResponseEntity
            .created(new URI("/api/navigation-portals/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /navigation-portals/:id} : Updates an existing navigationPortal.
     *
     * @param id the id of the navigationPortal to save.
     * @param navigationPortal the navigationPortal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated navigationPortal,
     * or with status {@code 400 (Bad Request)} if the navigationPortal is not valid,
     * or with status {@code 500 (Internal Server Error)} if the navigationPortal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/navigation-portals/{id}")
    public ResponseEntity<NavigationPortal> updateNavigationPortal(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody NavigationPortal navigationPortal
    ) throws URISyntaxException {
        log.debug("REST request to update NavigationPortal : {}, {}", id, navigationPortal);
        if (navigationPortal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, navigationPortal.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!navigationPortalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        NavigationPortal result = navigationPortalRepository.save(navigationPortal);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, navigationPortal.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /navigation-portals/:id} : Partial updates given fields of an existing navigationPortal, field will ignore if it is null
     *
     * @param id the id of the navigationPortal to save.
     * @param navigationPortal the navigationPortal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated navigationPortal,
     * or with status {@code 400 (Bad Request)} if the navigationPortal is not valid,
     * or with status {@code 404 (Not Found)} if the navigationPortal is not found,
     * or with status {@code 500 (Internal Server Error)} if the navigationPortal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/navigation-portals/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<NavigationPortal> partialUpdateNavigationPortal(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody NavigationPortal navigationPortal
    ) throws URISyntaxException {
        log.debug("REST request to partial update NavigationPortal partially : {}, {}", id, navigationPortal);
        if (navigationPortal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, navigationPortal.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!navigationPortalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<NavigationPortal> result = navigationPortalRepository
            .findById(navigationPortal.getId())
            .map(existingNavigationPortal -> {
                if (navigationPortal.getFeatures() != null) {
                    existingNavigationPortal.setFeatures(navigationPortal.getFeatures());
                }
                if (navigationPortal.getSelectedFeature() != null) {
                    existingNavigationPortal.setSelectedFeature(navigationPortal.getSelectedFeature());
                }

                return existingNavigationPortal;
            })
            .map(navigationPortalRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, navigationPortal.getId().toString())
        );
    }

    /**
     * {@code GET  /navigation-portals} : get all the navigationPortals.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of navigationPortals in body.
     */
    @GetMapping("/navigation-portals")
    public List<NavigationPortal> getAllNavigationPortals(@RequestParam(required = false) String filter) {
        if ("moodpicker-is-null".equals(filter)) {
            log.debug("REST request to get all NavigationPortals where moodPicker is null");
            return StreamSupport
                .stream(navigationPortalRepository.findAll().spliterator(), false)
                .filter(navigationPortal -> navigationPortal.getMoodPicker() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all NavigationPortals");
        return navigationPortalRepository.findAll();
    }

    /**
     * {@code GET  /navigation-portals/:id} : get the "id" navigationPortal.
     *
     * @param id the id of the navigationPortal to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the navigationPortal, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/navigation-portals/{id}")
    public ResponseEntity<NavigationPortal> getNavigationPortal(@PathVariable Long id) {
        log.debug("REST request to get NavigationPortal : {}", id);
        Optional<NavigationPortal> navigationPortal = navigationPortalRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(navigationPortal);
    }

    /**
     * {@code DELETE  /navigation-portals/:id} : delete the "id" navigationPortal.
     *
     * @param id the id of the navigationPortal to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/navigation-portals/{id}")
    public ResponseEntity<Void> deleteNavigationPortal(@PathVariable Long id) {
        log.debug("REST request to delete NavigationPortal : {}", id);
        navigationPortalRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
