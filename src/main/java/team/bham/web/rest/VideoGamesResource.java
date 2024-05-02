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
import team.bham.domain.VideoGames;
import team.bham.repository.VideoGamesRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.VideoGames}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VideoGamesResource {

    private final Logger log = LoggerFactory.getLogger(VideoGamesResource.class);

    private static final String ENTITY_NAME = "videoGames";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VideoGamesRepository videoGamesRepository;

    public VideoGamesResource(VideoGamesRepository videoGamesRepository) {
        this.videoGamesRepository = videoGamesRepository;
    }

    /**
     * {@code POST  /video-games} : Create a new videoGames.
     *
     * @param videoGames the videoGames to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new videoGames, or with status {@code 400 (Bad Request)} if the videoGames has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/video-games")
    public ResponseEntity<VideoGames> createVideoGames(@RequestBody VideoGames videoGames) throws URISyntaxException {
        log.debug("REST request to save VideoGames : {}", videoGames);
        if (videoGames.getId() != null) {
            throw new BadRequestAlertException("A new videoGames cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VideoGames result = videoGamesRepository.save(videoGames);
        return ResponseEntity
            .created(new URI("/api/video-games/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /video-games/:id} : Updates an existing videoGames.
     *
     * @param id the id of the videoGames to save.
     * @param videoGames the videoGames to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated videoGames,
     * or with status {@code 400 (Bad Request)} if the videoGames is not valid,
     * or with status {@code 500 (Internal Server Error)} if the videoGames couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/video-games/{id}")
    public ResponseEntity<VideoGames> updateVideoGames(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VideoGames videoGames
    ) throws URISyntaxException {
        log.debug("REST request to update VideoGames : {}, {}", id, videoGames);
        if (videoGames.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, videoGames.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!videoGamesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        VideoGames result = videoGamesRepository.save(videoGames);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, videoGames.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /video-games/:id} : Partial updates given fields of an existing videoGames, field will ignore if it is null
     *
     * @param id the id of the videoGames to save.
     * @param videoGames the videoGames to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated videoGames,
     * or with status {@code 400 (Bad Request)} if the videoGames is not valid,
     * or with status {@code 404 (Not Found)} if the videoGames is not found,
     * or with status {@code 500 (Internal Server Error)} if the videoGames couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/video-games/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VideoGames> partialUpdateVideoGames(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VideoGames videoGames
    ) throws URISyntaxException {
        log.debug("REST request to partial update VideoGames partially : {}, {}", id, videoGames);
        if (videoGames.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, videoGames.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!videoGamesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VideoGames> result = videoGamesRepository
            .findById(videoGames.getId())
            .map(existingVideoGames -> {
                if (videoGames.getLevels() != null) {
                    existingVideoGames.setLevels(videoGames.getLevels());
                }
                if (videoGames.getProgress() != null) {
                    existingVideoGames.setProgress(videoGames.getProgress());
                }
                if (videoGames.getTimer() != null) {
                    existingVideoGames.setTimer(videoGames.getTimer());
                }

                return existingVideoGames;
            })
            .map(videoGamesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, videoGames.getId().toString())
        );
    }

    /**
     * {@code GET  /video-games} : get all the videoGames.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of videoGames in body.
     */
    @GetMapping("/video-games")
    public List<VideoGames> getAllVideoGames() {
        log.debug("REST request to get all VideoGames");
        return videoGamesRepository.findAll();
    }

    /**
     * {@code GET  /video-games/:id} : get the "id" videoGames.
     *
     * @param id the id of the videoGames to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the videoGames, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/video-games/{id}")
    public ResponseEntity<VideoGames> getVideoGames(@PathVariable Long id) {
        log.debug("REST request to get VideoGames : {}", id);
        Optional<VideoGames> videoGames = videoGamesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(videoGames);
    }

    /**
     * {@code DELETE  /video-games/:id} : delete the "id" videoGames.
     *
     * @param id the id of the videoGames to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/video-games/{id}")
    public ResponseEntity<Void> deleteVideoGames(@PathVariable Long id) {
        log.debug("REST request to delete VideoGames : {}", id);
        videoGamesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
