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
import team.bham.domain.SocialMedia;
import team.bham.repository.SocialMediaRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.SocialMedia}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SocialMediaResource {

    private final Logger log = LoggerFactory.getLogger(SocialMediaResource.class);

    private static final String ENTITY_NAME = "socialMedia";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SocialMediaRepository socialMediaRepository;

    public SocialMediaResource(SocialMediaRepository socialMediaRepository) {
        this.socialMediaRepository = socialMediaRepository;
    }

    /**
     * {@code POST  /social-medias} : Create a new socialMedia.
     *
     * @param socialMedia the socialMedia to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new socialMedia, or with status {@code 400 (Bad Request)} if the socialMedia has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/social-medias")
    public ResponseEntity<SocialMedia> createSocialMedia(@RequestBody SocialMedia socialMedia) throws URISyntaxException {
        log.debug("REST request to save SocialMedia : {}", socialMedia);
        if (socialMedia.getId() != null) {
            throw new BadRequestAlertException("A new socialMedia cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SocialMedia result = socialMediaRepository.save(socialMedia);
        return ResponseEntity
            .created(new URI("/api/social-medias/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /social-medias/:id} : Updates an existing socialMedia.
     *
     * @param id the id of the socialMedia to save.
     * @param socialMedia the socialMedia to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated socialMedia,
     * or with status {@code 400 (Bad Request)} if the socialMedia is not valid,
     * or with status {@code 500 (Internal Server Error)} if the socialMedia couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/social-medias/{id}")
    public ResponseEntity<SocialMedia> updateSocialMedia(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SocialMedia socialMedia
    ) throws URISyntaxException {
        log.debug("REST request to update SocialMedia : {}, {}", id, socialMedia);
        if (socialMedia.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, socialMedia.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!socialMediaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SocialMedia result = socialMediaRepository.save(socialMedia);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, socialMedia.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /social-medias/:id} : Partial updates given fields of an existing socialMedia, field will ignore if it is null
     *
     * @param id the id of the socialMedia to save.
     * @param socialMedia the socialMedia to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated socialMedia,
     * or with status {@code 400 (Bad Request)} if the socialMedia is not valid,
     * or with status {@code 404 (Not Found)} if the socialMedia is not found,
     * or with status {@code 500 (Internal Server Error)} if the socialMedia couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/social-medias/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SocialMedia> partialUpdateSocialMedia(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SocialMedia socialMedia
    ) throws URISyntaxException {
        log.debug("REST request to partial update SocialMedia partially : {}, {}", id, socialMedia);
        if (socialMedia.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, socialMedia.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!socialMediaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SocialMedia> result = socialMediaRepository
            .findById(socialMedia.getId())
            .map(existingSocialMedia -> {
                if (socialMedia.getLevels() != null) {
                    existingSocialMedia.setLevels(socialMedia.getLevels());
                }
                if (socialMedia.getProgress() != null) {
                    existingSocialMedia.setProgress(socialMedia.getProgress());
                }
                if (socialMedia.getTimer() != null) {
                    existingSocialMedia.setTimer(socialMedia.getTimer());
                }

                return existingSocialMedia;
            })
            .map(socialMediaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, socialMedia.getId().toString())
        );
    }

    /**
     * {@code GET  /social-medias} : get all the socialMedias.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of socialMedias in body.
     */
    @GetMapping("/social-medias")
    public List<SocialMedia> getAllSocialMedias() {
        log.debug("REST request to get all SocialMedias");
        return socialMediaRepository.findAll();
    }

    /**
     * {@code GET  /social-medias/:id} : get the "id" socialMedia.
     *
     * @param id the id of the socialMedia to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the socialMedia, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/social-medias/{id}")
    public ResponseEntity<SocialMedia> getSocialMedia(@PathVariable Long id) {
        log.debug("REST request to get SocialMedia : {}", id);
        Optional<SocialMedia> socialMedia = socialMediaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(socialMedia);
    }

    /**
     * {@code DELETE  /social-medias/:id} : delete the "id" socialMedia.
     *
     * @param id the id of the socialMedia to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/social-medias/{id}")
    public ResponseEntity<Void> deleteSocialMedia(@PathVariable Long id) {
        log.debug("REST request to delete SocialMedia : {}", id);
        socialMediaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
