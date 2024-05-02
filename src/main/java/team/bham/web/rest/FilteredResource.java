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
import team.bham.domain.Filtered;
import team.bham.repository.FilteredRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Filtered}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FilteredResource {

    private final Logger log = LoggerFactory.getLogger(FilteredResource.class);

    private static final String ENTITY_NAME = "filtered";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FilteredRepository filteredRepository;

    public FilteredResource(FilteredRepository filteredRepository) {
        this.filteredRepository = filteredRepository;
    }

    /**
     * {@code POST  /filtereds} : Create a new filtered.
     *
     * @param filtered the filtered to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new filtered, or with status {@code 400 (Bad Request)} if the filtered has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/filtereds")
    public ResponseEntity<Filtered> createFiltered(@RequestBody Filtered filtered) throws URISyntaxException {
        log.debug("REST request to save Filtered : {}", filtered);
        if (filtered.getId() != null) {
            throw new BadRequestAlertException("A new filtered cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Filtered result = filteredRepository.save(filtered);
        return ResponseEntity
            .created(new URI("/api/filtereds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /filtereds/:id} : Updates an existing filtered.
     *
     * @param id the id of the filtered to save.
     * @param filtered the filtered to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated filtered,
     * or with status {@code 400 (Bad Request)} if the filtered is not valid,
     * or with status {@code 500 (Internal Server Error)} if the filtered couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/filtereds/{id}")
    public ResponseEntity<Filtered> updateFiltered(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Filtered filtered
    ) throws URISyntaxException {
        log.debug("REST request to update Filtered : {}, {}", id, filtered);
        if (filtered.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, filtered.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!filteredRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Filtered result = filteredRepository.save(filtered);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, filtered.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /filtereds/:id} : Partial updates given fields of an existing filtered, field will ignore if it is null
     *
     * @param id the id of the filtered to save.
     * @param filtered the filtered to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated filtered,
     * or with status {@code 400 (Bad Request)} if the filtered is not valid,
     * or with status {@code 404 (Not Found)} if the filtered is not found,
     * or with status {@code 500 (Internal Server Error)} if the filtered couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/filtereds/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Filtered> partialUpdateFiltered(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Filtered filtered
    ) throws URISyntaxException {
        log.debug("REST request to partial update Filtered partially : {}, {}", id, filtered);
        if (filtered.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, filtered.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!filteredRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Filtered> result = filteredRepository
            .findById(filtered.getId())
            .map(existingFiltered -> {
                if (filtered.getSearch() != null) {
                    existingFiltered.setSearch(filtered.getSearch());
                }
                if (filtered.getResults() != null) {
                    existingFiltered.setResults(filtered.getResults());
                }
                if (filtered.getFiltering() != null) {
                    existingFiltered.setFiltering(filtered.getFiltering());
                }

                return existingFiltered;
            })
            .map(filteredRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, filtered.getId().toString())
        );
    }

    /**
     * {@code GET  /filtereds} : get all the filtereds.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of filtereds in body.
     */
    @GetMapping("/filtereds")
    public List<Filtered> getAllFiltereds() {
        log.debug("REST request to get all Filtereds");
        return filteredRepository.findAll();
    }

    /**
     * {@code GET  /filtereds/:id} : get the "id" filtered.
     *
     * @param id the id of the filtered to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the filtered, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/filtereds/{id}")
    public ResponseEntity<Filtered> getFiltered(@PathVariable Long id) {
        log.debug("REST request to get Filtered : {}", id);
        Optional<Filtered> filtered = filteredRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(filtered);
    }

    /**
     * {@code DELETE  /filtereds/:id} : delete the "id" filtered.
     *
     * @param id the id of the filtered to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/filtereds/{id}")
    public ResponseEntity<Void> deleteFiltered(@PathVariable Long id) {
        log.debug("REST request to delete Filtered : {}", id);
        filteredRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
