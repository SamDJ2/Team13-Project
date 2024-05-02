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
import team.bham.domain.Movies;
import team.bham.repository.MoviesRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Movies}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MoviesResource {

    private final Logger log = LoggerFactory.getLogger(MoviesResource.class);

    private static final String ENTITY_NAME = "movies";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MoviesRepository moviesRepository;

    public MoviesResource(MoviesRepository moviesRepository) {
        this.moviesRepository = moviesRepository;
    }

    /**
     * {@code POST  /movies} : Create a new movies.
     *
     * @param movies the movies to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new movies, or with status {@code 400 (Bad Request)} if the movies has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/movies")
    public ResponseEntity<Movies> createMovies(@RequestBody Movies movies) throws URISyntaxException {
        log.debug("REST request to save Movies : {}", movies);
        if (movies.getId() != null) {
            throw new BadRequestAlertException("A new movies cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Movies result = moviesRepository.save(movies);
        return ResponseEntity
            .created(new URI("/api/movies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /movies/:id} : Updates an existing movies.
     *
     * @param id the id of the movies to save.
     * @param movies the movies to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated movies,
     * or with status {@code 400 (Bad Request)} if the movies is not valid,
     * or with status {@code 500 (Internal Server Error)} if the movies couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/movies/{id}")
    public ResponseEntity<Movies> updateMovies(@PathVariable(value = "id", required = false) final Long id, @RequestBody Movies movies)
        throws URISyntaxException {
        log.debug("REST request to update Movies : {}, {}", id, movies);
        if (movies.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, movies.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!moviesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Movies result = moviesRepository.save(movies);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, movies.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /movies/:id} : Partial updates given fields of an existing movies, field will ignore if it is null
     *
     * @param id the id of the movies to save.
     * @param movies the movies to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated movies,
     * or with status {@code 400 (Bad Request)} if the movies is not valid,
     * or with status {@code 404 (Not Found)} if the movies is not found,
     * or with status {@code 500 (Internal Server Error)} if the movies couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/movies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Movies> partialUpdateMovies(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Movies movies
    ) throws URISyntaxException {
        log.debug("REST request to partial update Movies partially : {}, {}", id, movies);
        if (movies.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, movies.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!moviesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Movies> result = moviesRepository
            .findById(movies.getId())
            .map(existingMovies -> {
                if (movies.getLevels() != null) {
                    existingMovies.setLevels(movies.getLevels());
                }
                if (movies.getProgress() != null) {
                    existingMovies.setProgress(movies.getProgress());
                }
                if (movies.getTimer() != null) {
                    existingMovies.setTimer(movies.getTimer());
                }

                return existingMovies;
            })
            .map(moviesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, movies.getId().toString())
        );
    }

    /**
     * {@code GET  /movies} : get all the movies.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of movies in body.
     */
    @GetMapping("/movies")
    public List<Movies> getAllMovies() {
        log.debug("REST request to get all Movies");
        return moviesRepository.findAll();
    }

    /**
     * {@code GET  /movies/:id} : get the "id" movies.
     *
     * @param id the id of the movies to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the movies, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/movies/{id}")
    public ResponseEntity<Movies> getMovies(@PathVariable Long id) {
        log.debug("REST request to get Movies : {}", id);
        Optional<Movies> movies = moviesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(movies);
    }

    /**
     * {@code DELETE  /movies/:id} : delete the "id" movies.
     *
     * @param id the id of the movies to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/movies/{id}")
    public ResponseEntity<Void> deleteMovies(@PathVariable Long id) {
        log.debug("REST request to delete Movies : {}", id);
        moviesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
