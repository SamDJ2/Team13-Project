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
import team.bham.domain.WeeklySummary;
import team.bham.repository.WeeklySummaryRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.WeeklySummary}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class WeeklySummaryResource {

    private final Logger log = LoggerFactory.getLogger(WeeklySummaryResource.class);

    private static final String ENTITY_NAME = "weeklySummary";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WeeklySummaryRepository weeklySummaryRepository;

    public WeeklySummaryResource(WeeklySummaryRepository weeklySummaryRepository) {
        this.weeklySummaryRepository = weeklySummaryRepository;
    }

    /**
     * {@code POST  /weekly-summaries} : Create a new weeklySummary.
     *
     * @param weeklySummary the weeklySummary to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new weeklySummary, or with status {@code 400 (Bad Request)} if the weeklySummary has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/weekly-summaries")
    public ResponseEntity<WeeklySummary> createWeeklySummary(@RequestBody WeeklySummary weeklySummary) throws URISyntaxException {
        log.debug("REST request to save WeeklySummary : {}", weeklySummary);
        if (weeklySummary.getId() != null) {
            throw new BadRequestAlertException("A new weeklySummary cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WeeklySummary result = weeklySummaryRepository.save(weeklySummary);
        return ResponseEntity
            .created(new URI("/api/weekly-summaries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /weekly-summaries/:id} : Updates an existing weeklySummary.
     *
     * @param id the id of the weeklySummary to save.
     * @param weeklySummary the weeklySummary to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated weeklySummary,
     * or with status {@code 400 (Bad Request)} if the weeklySummary is not valid,
     * or with status {@code 500 (Internal Server Error)} if the weeklySummary couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/weekly-summaries/{id}")
    public ResponseEntity<WeeklySummary> updateWeeklySummary(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody WeeklySummary weeklySummary
    ) throws URISyntaxException {
        log.debug("REST request to update WeeklySummary : {}, {}", id, weeklySummary);
        if (weeklySummary.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, weeklySummary.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!weeklySummaryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        WeeklySummary result = weeklySummaryRepository.save(weeklySummary);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, weeklySummary.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /weekly-summaries/:id} : Partial updates given fields of an existing weeklySummary, field will ignore if it is null
     *
     * @param id the id of the weeklySummary to save.
     * @param weeklySummary the weeklySummary to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated weeklySummary,
     * or with status {@code 400 (Bad Request)} if the weeklySummary is not valid,
     * or with status {@code 404 (Not Found)} if the weeklySummary is not found,
     * or with status {@code 500 (Internal Server Error)} if the weeklySummary couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/weekly-summaries/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<WeeklySummary> partialUpdateWeeklySummary(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody WeeklySummary weeklySummary
    ) throws URISyntaxException {
        log.debug("REST request to partial update WeeklySummary partially : {}, {}", id, weeklySummary);
        if (weeklySummary.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, weeklySummary.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!weeklySummaryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<WeeklySummary> result = weeklySummaryRepository
            .findById(weeklySummary.getId())
            .map(existingWeeklySummary -> {
                if (weeklySummary.getSummaryID() != null) {
                    existingWeeklySummary.setSummaryID(weeklySummary.getSummaryID());
                }
                if (weeklySummary.getSummaryText() != null) {
                    existingWeeklySummary.setSummaryText(weeklySummary.getSummaryText());
                }

                return existingWeeklySummary;
            })
            .map(weeklySummaryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, weeklySummary.getId().toString())
        );
    }

    /**
     * {@code GET  /weekly-summaries} : get all the weeklySummaries.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of weeklySummaries in body.
     */
    @GetMapping("/weekly-summaries")
    public List<WeeklySummary> getAllWeeklySummaries(@RequestParam(required = false) String filter) {
        if ("newweeklyhabittracker-is-null".equals(filter)) {
            log.debug("REST request to get all WeeklySummarys where newWeeklyHabitTracker is null");
            return StreamSupport
                .stream(weeklySummaryRepository.findAll().spliterator(), false)
                .filter(weeklySummary -> weeklySummary.getNewWeeklyHabitTracker() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all WeeklySummaries");
        return weeklySummaryRepository.findAll();
    }

    /**
     * {@code GET  /weekly-summaries/:id} : get the "id" weeklySummary.
     *
     * @param id the id of the weeklySummary to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the weeklySummary, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/weekly-summaries/{id}")
    public ResponseEntity<WeeklySummary> getWeeklySummary(@PathVariable Long id) {
        log.debug("REST request to get WeeklySummary : {}", id);
        Optional<WeeklySummary> weeklySummary = weeklySummaryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(weeklySummary);
    }

    /**
     * {@code DELETE  /weekly-summaries/:id} : delete the "id" weeklySummary.
     *
     * @param id the id of the weeklySummary to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/weekly-summaries/{id}")
    public ResponseEntity<Void> deleteWeeklySummary(@PathVariable Long id) {
        log.debug("REST request to delete WeeklySummary : {}", id);
        weeklySummaryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
