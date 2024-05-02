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
import org.springframework.web.bind.annotation.*;
import team.bham.domain.NewMoodPicker;
import team.bham.repository.NewMoodPickerRepository;
import team.bham.service.NewMoodPickerService;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.NewMoodPicker}.
 */
@RestController
@RequestMapping("/api")
public class NewMoodPickerResource {

    private final Logger log = LoggerFactory.getLogger(NewMoodPickerResource.class);

    private static final String ENTITY_NAME = "newMoodPicker";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NewMoodPickerService newMoodPickerService;

    private final NewMoodPickerRepository newMoodPickerRepository;

    public NewMoodPickerResource(NewMoodPickerService newMoodPickerService, NewMoodPickerRepository newMoodPickerRepository) {
        this.newMoodPickerService = newMoodPickerService;
        this.newMoodPickerRepository = newMoodPickerRepository;
    }

    /**
     * {@code POST  /new-mood-pickers} : Create a new newMoodPicker.
     *
     * @param newMoodPicker the newMoodPicker to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new newMoodPicker, or with status {@code 400 (Bad Request)} if the newMoodPicker has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/new-mood-pickers")
    public ResponseEntity<NewMoodPicker> createNewMoodPicker(@RequestBody NewMoodPicker newMoodPicker) throws URISyntaxException {
        log.debug("REST request to save NewMoodPicker : {}", newMoodPicker);
        if (newMoodPicker.getId() != null) {
            throw new BadRequestAlertException("A new newMoodPicker cannot already have an ID", ENTITY_NAME, "idexists");
        }
        NewMoodPicker result = newMoodPickerService.save(newMoodPicker);
        return ResponseEntity
            .created(new URI("/api/new-mood-pickers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /new-mood-pickers/:id} : Updates an existing newMoodPicker.
     *
     * @param id the id of the newMoodPicker to save.
     * @param newMoodPicker the newMoodPicker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated newMoodPicker,
     * or with status {@code 400 (Bad Request)} if the newMoodPicker is not valid,
     * or with status {@code 500 (Internal Server Error)} if the newMoodPicker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/new-mood-pickers/{id}")
    public ResponseEntity<NewMoodPicker> updateNewMoodPicker(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody NewMoodPicker newMoodPicker
    ) throws URISyntaxException {
        log.debug("REST request to update NewMoodPicker : {}, {}", id, newMoodPicker);
        if (newMoodPicker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, newMoodPicker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!newMoodPickerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        NewMoodPicker result = newMoodPickerService.update(newMoodPicker);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, newMoodPicker.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /new-mood-pickers/:id} : Partial updates given fields of an existing newMoodPicker, field will ignore if it is null
     *
     * @param id the id of the newMoodPicker to save.
     * @param newMoodPicker the newMoodPicker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated newMoodPicker,
     * or with status {@code 400 (Bad Request)} if the newMoodPicker is not valid,
     * or with status {@code 404 (Not Found)} if the newMoodPicker is not found,
     * or with status {@code 500 (Internal Server Error)} if the newMoodPicker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/new-mood-pickers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<NewMoodPicker> partialUpdateNewMoodPicker(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody NewMoodPicker newMoodPicker
    ) throws URISyntaxException {
        log.debug("REST request to partial update NewMoodPicker partially : {}, {}", id, newMoodPicker);
        if (newMoodPicker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, newMoodPicker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!newMoodPickerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<NewMoodPicker> result = newMoodPickerService.partialUpdate(newMoodPicker);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, newMoodPicker.getId().toString())
        );
    }

    /**
     * {@code GET  /new-mood-pickers} : get all the newMoodPickers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of newMoodPickers in body.
     */
    @GetMapping("/new-mood-pickers")
    public List<NewMoodPicker> getAllNewMoodPickers() {
        log.debug("REST request to get all NewMoodPickers");
        return newMoodPickerService.findAll();
    }

    /**
     * {@code GET  /new-mood-pickers/:id} : get the "id" newMoodPicker.
     *
     * @param id the id of the newMoodPicker to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the newMoodPicker, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/new-mood-pickers/{id}")
    public ResponseEntity<NewMoodPicker> getNewMoodPicker(@PathVariable Long id) {
        log.debug("REST request to get NewMoodPicker : {}", id);
        Optional<NewMoodPicker> newMoodPicker = newMoodPickerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(newMoodPicker);
    }

    /**
     * {@code DELETE  /new-mood-pickers/:id} : delete the "id" newMoodPicker.
     *
     * @param id the id of the newMoodPicker to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/new-mood-pickers/{id}")
    public ResponseEntity<Void> deleteNewMoodPicker(@PathVariable Long id) {
        log.debug("REST request to delete NewMoodPicker : {}", id);
        newMoodPickerService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
