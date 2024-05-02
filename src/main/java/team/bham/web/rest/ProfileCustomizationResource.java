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
import team.bham.domain.ProfileCustomization;
import team.bham.repository.ProfileCustomizationRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ProfileCustomization}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProfileCustomizationResource {

    private final Logger log = LoggerFactory.getLogger(ProfileCustomizationResource.class);

    private static final String ENTITY_NAME = "profileCustomization";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProfileCustomizationRepository profileCustomizationRepository;

    public ProfileCustomizationResource(ProfileCustomizationRepository profileCustomizationRepository) {
        this.profileCustomizationRepository = profileCustomizationRepository;
    }

    /**
     * {@code POST  /profile-customizations} : Create a new profileCustomization.
     *
     * @param profileCustomization the profileCustomization to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new profileCustomization, or with status {@code 400 (Bad Request)} if the profileCustomization has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/profile-customizations")
    public ResponseEntity<ProfileCustomization> createProfileCustomization(@RequestBody ProfileCustomization profileCustomization)
        throws URISyntaxException {
        log.debug("REST request to save ProfileCustomization : {}", profileCustomization);
        if (profileCustomization.getId() != null) {
            throw new BadRequestAlertException("A new profileCustomization cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProfileCustomization result = profileCustomizationRepository.save(profileCustomization);
        return ResponseEntity
            .created(new URI("/api/profile-customizations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /profile-customizations/:id} : Updates an existing profileCustomization.
     *
     * @param id the id of the profileCustomization to save.
     * @param profileCustomization the profileCustomization to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated profileCustomization,
     * or with status {@code 400 (Bad Request)} if the profileCustomization is not valid,
     * or with status {@code 500 (Internal Server Error)} if the profileCustomization couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/profile-customizations/{id}")
    public ResponseEntity<ProfileCustomization> updateProfileCustomization(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProfileCustomization profileCustomization
    ) throws URISyntaxException {
        log.debug("REST request to update ProfileCustomization : {}, {}", id, profileCustomization);
        if (profileCustomization.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, profileCustomization.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!profileCustomizationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProfileCustomization result = profileCustomizationRepository.save(profileCustomization);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, profileCustomization.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /profile-customizations/:id} : Partial updates given fields of an existing profileCustomization, field will ignore if it is null
     *
     * @param id the id of the profileCustomization to save.
     * @param profileCustomization the profileCustomization to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated profileCustomization,
     * or with status {@code 400 (Bad Request)} if the profileCustomization is not valid,
     * or with status {@code 404 (Not Found)} if the profileCustomization is not found,
     * or with status {@code 500 (Internal Server Error)} if the profileCustomization couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/profile-customizations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProfileCustomization> partialUpdateProfileCustomization(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProfileCustomization profileCustomization
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProfileCustomization partially : {}, {}", id, profileCustomization);
        if (profileCustomization.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, profileCustomization.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!profileCustomizationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProfileCustomization> result = profileCustomizationRepository
            .findById(profileCustomization.getId())
            .map(existingProfileCustomization -> {
                if (profileCustomization.getPreferences() != null) {
                    existingProfileCustomization.setPreferences(profileCustomization.getPreferences());
                }
                if (profileCustomization.getPrivacySettings() != null) {
                    existingProfileCustomization.setPrivacySettings(profileCustomization.getPrivacySettings());
                }
                if (profileCustomization.getAccountHistory() != null) {
                    existingProfileCustomization.setAccountHistory(profileCustomization.getAccountHistory());
                }
                if (profileCustomization.getBioDescription() != null) {
                    existingProfileCustomization.setBioDescription(profileCustomization.getBioDescription());
                }

                return existingProfileCustomization;
            })
            .map(profileCustomizationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, profileCustomization.getId().toString())
        );
    }

    /**
     * {@code GET  /profile-customizations} : get all the profileCustomizations.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of profileCustomizations in body.
     */
    @GetMapping("/profile-customizations")
    public List<ProfileCustomization> getAllProfileCustomizations(@RequestParam(required = false) String filter) {
        if ("navigationportal-is-null".equals(filter)) {
            log.debug("REST request to get all ProfileCustomizations where navigationPortal is null");
            return StreamSupport
                .stream(profileCustomizationRepository.findAll().spliterator(), false)
                .filter(profileCustomization -> profileCustomization.getNavigationPortal() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all ProfileCustomizations");
        return profileCustomizationRepository.findAll();
    }

    /**
     * {@code GET  /profile-customizations/:id} : get the "id" profileCustomization.
     *
     * @param id the id of the profileCustomization to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the profileCustomization, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/profile-customizations/{id}")
    public ResponseEntity<ProfileCustomization> getProfileCustomization(@PathVariable Long id) {
        log.debug("REST request to get ProfileCustomization : {}", id);
        Optional<ProfileCustomization> profileCustomization = profileCustomizationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(profileCustomization);
    }

    /**
     * {@code DELETE  /profile-customizations/:id} : delete the "id" profileCustomization.
     *
     * @param id the id of the profileCustomization to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/profile-customizations/{id}")
    public ResponseEntity<Void> deleteProfileCustomization(@PathVariable Long id) {
        log.debug("REST request to delete ProfileCustomization : {}", id);
        profileCustomizationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
