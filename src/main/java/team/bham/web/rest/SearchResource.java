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
import team.bham.domain.Search;
import team.bham.repository.SearchRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Search}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SearchResource {

    private final Logger log = LoggerFactory.getLogger(SearchResource.class);

    private static final String ENTITY_NAME = "search";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SearchRepository searchRepository;

    public SearchResource(SearchRepository searchRepository) {
        this.searchRepository = searchRepository;
    }

    /**
     * {@code POST  /searches} : Create a new search.
     *
     * @param search the search to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new search, or with status {@code 400 (Bad Request)} if the search has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/searches")
    public ResponseEntity<Search> createSearch(@RequestBody Search search) throws URISyntaxException {
        log.debug("REST request to save Search : {}", search);
        if (search.getId() != null) {
            throw new BadRequestAlertException("A new search cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Search result = searchRepository.save(search);
        return ResponseEntity
            .created(new URI("/api/searches/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /searches/:id} : Updates an existing search.
     *
     * @param id the id of the search to save.
     * @param search the search to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated search,
     * or with status {@code 400 (Bad Request)} if the search is not valid,
     * or with status {@code 500 (Internal Server Error)} if the search couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/searches/{id}")
    public ResponseEntity<Search> updateSearch(@PathVariable(value = "id", required = false) final Long id, @RequestBody Search search)
        throws URISyntaxException {
        log.debug("REST request to update Search : {}, {}", id, search);
        if (search.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, search.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!searchRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Search result = searchRepository.save(search);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, search.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /searches/:id} : Partial updates given fields of an existing search, field will ignore if it is null
     *
     * @param id the id of the search to save.
     * @param search the search to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated search,
     * or with status {@code 400 (Bad Request)} if the search is not valid,
     * or with status {@code 404 (Not Found)} if the search is not found,
     * or with status {@code 500 (Internal Server Error)} if the search couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/searches/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Search> partialUpdateSearch(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Search search
    ) throws URISyntaxException {
        log.debug("REST request to partial update Search partially : {}, {}", id, search);
        if (search.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, search.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!searchRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Search> result = searchRepository
            .findById(search.getId())
            .map(existingSearch -> {
                if (search.getSearch() != null) {
                    existingSearch.setSearch(search.getSearch());
                }
                if (search.getResults() != null) {
                    existingSearch.setResults(search.getResults());
                }

                return existingSearch;
            })
            .map(searchRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, search.getId().toString())
        );
    }

    /**
     * {@code GET  /searches} : get all the searches.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of searches in body.
     */
    @GetMapping("/searches")
    public List<Search> getAllSearches() {
        log.debug("REST request to get all Searches");
        return searchRepository.findAll();
    }

    /**
     * {@code GET  /searches/:id} : get the "id" search.
     *
     * @param id the id of the search to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the search, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/searches/{id}")
    public ResponseEntity<Search> getSearch(@PathVariable Long id) {
        log.debug("REST request to get Search : {}", id);
        Optional<Search> search = searchRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(search);
    }

    /**
     * {@code DELETE  /searches/:id} : delete the "id" search.
     *
     * @param id the id of the search to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/searches/{id}")
    public ResponseEntity<Void> deleteSearch(@PathVariable Long id) {
        log.debug("REST request to delete Search : {}", id);
        searchRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
