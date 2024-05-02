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
import team.bham.domain.MoodPicker;
import team.bham.repository.MoodPickerRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.MoodPicker}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MoodPickerResource {

    private final Logger log = LoggerFactory.getLogger(MoodPickerResource.class);

    private static final String ENTITY_NAME = "moodPicker";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MoodPickerRepository moodPickerRepository;

    public MoodPickerResource(MoodPickerRepository moodPickerRepository) {
        this.moodPickerRepository = moodPickerRepository;
    }

    /**
     * {@code POST  /mood-pickers} : Create a new moodPicker.
     *
     * @param moodPicker the moodPicker to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new moodPicker, or with status {@code 400 (Bad Request)} if the moodPicker has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mood-pickers")
    public ResponseEntity<MoodPicker> createMoodPicker(@RequestBody MoodPicker moodPicker) throws URISyntaxException {
        log.debug("REST request to save MoodPicker : {}", moodPicker);
        if (moodPicker.getId() != null) {
            throw new BadRequestAlertException("A new moodPicker cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MoodPicker result = moodPickerRepository.save(moodPicker);
        return ResponseEntity
            .created(new URI("/api/mood-pickers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mood-pickers/:id} : Updates an existing moodPicker.
     *
     * @param id the id of the moodPicker to save.
     * @param moodPicker the moodPicker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated moodPicker,
     * or with status {@code 400 (Bad Request)} if the moodPicker is not valid,
     * or with status {@code 500 (Internal Server Error)} if the moodPicker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mood-pickers/{id}")
    public ResponseEntity<MoodPicker> updateMoodPicker(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MoodPicker moodPicker
    ) throws URISyntaxException {
        log.debug("REST request to update MoodPicker : {}, {}", id, moodPicker);
        if (moodPicker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, moodPicker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!moodPickerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MoodPicker result = moodPickerRepository.save(moodPicker);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, moodPicker.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mood-pickers/:id} : Partial updates given fields of an existing moodPicker, field will ignore if it is null
     *
     * @param id the id of the moodPicker to save.
     * @param moodPicker the moodPicker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated moodPicker,
     * or with status {@code 400 (Bad Request)} if the moodPicker is not valid,
     * or with status {@code 404 (Not Found)} if the moodPicker is not found,
     * or with status {@code 500 (Internal Server Error)} if the moodPicker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mood-pickers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MoodPicker> partialUpdateMoodPicker(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MoodPicker moodPicker
    ) throws URISyntaxException {
        log.debug("REST request to partial update MoodPicker partially : {}, {}", id, moodPicker);
        if (moodPicker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, moodPicker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!moodPickerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MoodPicker> result = moodPickerRepository
            .findById(moodPicker.getId())
            .map(existingMoodPicker -> {
                if (moodPicker.getMoodPickerID() != null) {
                    existingMoodPicker.setMoodPickerID(moodPicker.getMoodPickerID());
                }
                if (moodPicker.getMood() != null) {
                    existingMoodPicker.setMood(moodPicker.getMood());
                }

                return existingMoodPicker;
            })
            .map(moodPickerRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, moodPicker.getId().toString())
        );
    }

    /**
     * {@code GET  /mood-pickers} : get all the moodPickers.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of moodPickers in body.
     */
    @GetMapping("/mood-pickers")
    public List<MoodPicker> getAllMoodPickers(@RequestParam(required = false) String filter) {
        if ("promptspage-is-null".equals(filter)) {
            log.debug("REST request to get all MoodPickers where promptsPage is null");
            return StreamSupport
                .stream(moodPickerRepository.findAll().spliterator(), false)
                .filter(moodPicker -> moodPicker.getPromptsPage() == null)
                .collect(Collectors.toList());
        }

        if ("emotionpage-is-null".equals(filter)) {
            log.debug("REST request to get all MoodPickers where emotionPage is null");
            return StreamSupport
                .stream(moodPickerRepository.findAll().spliterator(), false)
                .filter(moodPicker -> moodPicker.getEmotionPage() == null)
                .collect(Collectors.toList());
        }

        if ("landingpage-is-null".equals(filter)) {
            log.debug("REST request to get all MoodPickers where landingPage is null");
            return StreamSupport
                .stream(moodPickerRepository.findAll().spliterator(), false)
                .filter(moodPicker -> moodPicker.getLandingPage() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all MoodPickers");
        return moodPickerRepository.findAll();
    }

    /**
     * {@code GET  /mood-pickers/:id} : get the "id" moodPicker.
     *
     * @param id the id of the moodPicker to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the moodPicker, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mood-pickers/{id}")
    public ResponseEntity<MoodPicker> getMoodPicker(@PathVariable Long id) {
        log.debug("REST request to get MoodPicker : {}", id);
        Optional<MoodPicker> moodPicker = moodPickerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(moodPicker);
    }

    /**
     * {@code DELETE  /mood-pickers/:id} : delete the "id" moodPicker.
     *
     * @param id the id of the moodPicker to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mood-pickers/{id}")
    public ResponseEntity<Void> deleteMoodPicker(@PathVariable Long id) {
        log.debug("REST request to delete MoodPicker : {}", id);
        moodPickerRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
