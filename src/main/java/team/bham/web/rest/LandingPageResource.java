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
import team.bham.domain.LandingPage;
import team.bham.repository.LandingPageRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.LandingPage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LandingPageResource {

    private final Logger log = LoggerFactory.getLogger(LandingPageResource.class);

    private static final String ENTITY_NAME = "landingPage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LandingPageRepository landingPageRepository;

    public LandingPageResource(LandingPageRepository landingPageRepository) {
        this.landingPageRepository = landingPageRepository;
    }

    /**
     * {@code POST  /landing-pages} : Create a new landingPage.
     *
     * @param landingPage the landingPage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new landingPage, or with status {@code 400 (Bad Request)} if the landingPage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/landing-pages")
    public ResponseEntity<LandingPage> createLandingPage(@RequestBody LandingPage landingPage) throws URISyntaxException {
        log.debug("REST request to save LandingPage : {}", landingPage);
        if (landingPage.getId() != null) {
            throw new BadRequestAlertException("A new landingPage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LandingPage result = landingPageRepository.save(landingPage);
        return ResponseEntity
            .created(new URI("/api/landing-pages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /landing-pages/:id} : Updates an existing landingPage.
     *
     * @param id the id of the landingPage to save.
     * @param landingPage the landingPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated landingPage,
     * or with status {@code 400 (Bad Request)} if the landingPage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the landingPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/landing-pages/{id}")
    public ResponseEntity<LandingPage> updateLandingPage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LandingPage landingPage
    ) throws URISyntaxException {
        log.debug("REST request to update LandingPage : {}, {}", id, landingPage);
        if (landingPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, landingPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!landingPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LandingPage result = landingPageRepository.save(landingPage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, landingPage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /landing-pages/:id} : Partial updates given fields of an existing landingPage, field will ignore if it is null
     *
     * @param id the id of the landingPage to save.
     * @param landingPage the landingPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated landingPage,
     * or with status {@code 400 (Bad Request)} if the landingPage is not valid,
     * or with status {@code 404 (Not Found)} if the landingPage is not found,
     * or with status {@code 500 (Internal Server Error)} if the landingPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/landing-pages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LandingPage> partialUpdateLandingPage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LandingPage landingPage
    ) throws URISyntaxException {
        log.debug("REST request to partial update LandingPage partially : {}, {}", id, landingPage);
        if (landingPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, landingPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!landingPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LandingPage> result = landingPageRepository
            .findById(landingPage.getId())
            .map(existingLandingPage -> {
                if (landingPage.getGetStarted() != null) {
                    existingLandingPage.setGetStarted(landingPage.getGetStarted());
                }
                if (landingPage.getAbout() != null) {
                    existingLandingPage.setAbout(landingPage.getAbout());
                }
                if (landingPage.getTeam() != null) {
                    existingLandingPage.setTeam(landingPage.getTeam());
                }
                if (landingPage.getContact() != null) {
                    existingLandingPage.setContact(landingPage.getContact());
                }

                return existingLandingPage;
            })
            .map(landingPageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, landingPage.getId().toString())
        );
    }

    /**
     * {@code GET  /landing-pages} : get all the landingPages.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of landingPages in body.
     */
    @GetMapping("/landing-pages")
    public List<LandingPage> getAllLandingPages(@RequestParam(required = false) String filter) {
        if ("userdb-is-null".equals(filter)) {
            log.debug("REST request to get all LandingPages where userDB is null");
            return StreamSupport
                .stream(landingPageRepository.findAll().spliterator(), false)
                .filter(landingPage -> landingPage.getUserDB() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all LandingPages");
        return landingPageRepository.findAll();
    }

    /**
     * {@code GET  /landing-pages/:id} : get the "id" landingPage.
     *
     * @param id the id of the landingPage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the landingPage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/landing-pages/{id}")
    public ResponseEntity<LandingPage> getLandingPage(@PathVariable Long id) {
        log.debug("REST request to get LandingPage : {}", id);
        Optional<LandingPage> landingPage = landingPageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(landingPage);
    }

    /**
     * {@code DELETE  /landing-pages/:id} : delete the "id" landingPage.
     *
     * @param id the id of the landingPage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/landing-pages/{id}")
    public ResponseEntity<Void> deleteLandingPage(@PathVariable Long id) {
        log.debug("REST request to delete LandingPage : {}", id);
        landingPageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
