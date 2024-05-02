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
import team.bham.domain.Music;
import team.bham.repository.MusicRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Music}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MusicResource {

    private final Logger log = LoggerFactory.getLogger(MusicResource.class);

    private static final String ENTITY_NAME = "music";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MusicRepository musicRepository;

    public MusicResource(MusicRepository musicRepository) {
        this.musicRepository = musicRepository;
    }

    /**
     * {@code POST  /music} : Create a new music.
     *
     * @param music the music to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new music, or with status {@code 400 (Bad Request)} if the music has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/music")
    public ResponseEntity<Music> createMusic(@RequestBody Music music) throws URISyntaxException {
        log.debug("REST request to save Music : {}", music);
        if (music.getId() != null) {
            throw new BadRequestAlertException("A new music cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Music result = musicRepository.save(music);
        return ResponseEntity
            .created(new URI("/api/music/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /music/:id} : Updates an existing music.
     *
     * @param id the id of the music to save.
     * @param music the music to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated music,
     * or with status {@code 400 (Bad Request)} if the music is not valid,
     * or with status {@code 500 (Internal Server Error)} if the music couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/music/{id}")
    public ResponseEntity<Music> updateMusic(@PathVariable(value = "id", required = false) final Long id, @RequestBody Music music)
        throws URISyntaxException {
        log.debug("REST request to update Music : {}, {}", id, music);
        if (music.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, music.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!musicRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Music result = musicRepository.save(music);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, music.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /music/:id} : Partial updates given fields of an existing music, field will ignore if it is null
     *
     * @param id the id of the music to save.
     * @param music the music to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated music,
     * or with status {@code 400 (Bad Request)} if the music is not valid,
     * or with status {@code 404 (Not Found)} if the music is not found,
     * or with status {@code 500 (Internal Server Error)} if the music couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/music/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Music> partialUpdateMusic(@PathVariable(value = "id", required = false) final Long id, @RequestBody Music music)
        throws URISyntaxException {
        log.debug("REST request to partial update Music partially : {}, {}", id, music);
        if (music.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, music.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!musicRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Music> result = musicRepository
            .findById(music.getId())
            .map(existingMusic -> {
                if (music.getLevels() != null) {
                    existingMusic.setLevels(music.getLevels());
                }
                if (music.getProgress() != null) {
                    existingMusic.setProgress(music.getProgress());
                }
                if (music.getTimer() != null) {
                    existingMusic.setTimer(music.getTimer());
                }

                return existingMusic;
            })
            .map(musicRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, music.getId().toString())
        );
    }

    /**
     * {@code GET  /music} : get all the music.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of music in body.
     */
    @GetMapping("/music")
    public List<Music> getAllMusic() {
        log.debug("REST request to get all Music");
        return musicRepository.findAll();
    }

    /**
     * {@code GET  /music/:id} : get the "id" music.
     *
     * @param id the id of the music to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the music, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/music/{id}")
    public ResponseEntity<Music> getMusic(@PathVariable Long id) {
        log.debug("REST request to get Music : {}", id);
        Optional<Music> music = musicRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(music);
    }

    /**
     * {@code DELETE  /music/:id} : delete the "id" music.
     *
     * @param id the id of the music to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/music/{id}")
    public ResponseEntity<Void> deleteMusic(@PathVariable Long id) {
        log.debug("REST request to delete Music : {}", id);
        musicRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
