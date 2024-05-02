package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import team.bham.domain.PromptsFeature;
import team.bham.repository.PromptsFeatureRepository;
import team.bham.service.PromptsFeatureService;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.PromptsFeature}.
 */
@RestController
@RequestMapping("/api")
public class PromptsFeatureResource {

    private final Logger log = LoggerFactory.getLogger(PromptsFeatureResource.class);

    private static final String ENTITY_NAME = "promptsFeature";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PromptsFeatureService promptsFeatureService;

    private final PromptsFeatureRepository promptsFeatureRepository;

    public PromptsFeatureResource(PromptsFeatureService promptsFeatureService, PromptsFeatureRepository promptsFeatureRepository) {
        this.promptsFeatureService = promptsFeatureService;
        this.promptsFeatureRepository = promptsFeatureRepository;
    }

    /**
     * {@code POST  /prompts-features} : Create a new promptsFeature.
     *
     * @param promptsFeature the promptsFeature to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new promptsFeature, or with status {@code 400 (Bad Request)} if the promptsFeature has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/prompts-features")
    public ResponseEntity<PromptsFeature> createPromptsFeature(@RequestBody PromptsFeature promptsFeature) throws URISyntaxException {
        log.debug("REST request to save PromptsFeature : {}", promptsFeature);
        if (promptsFeature.getId() != null) {
            throw new BadRequestAlertException("A new promptsFeature cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PromptsFeature result = promptsFeatureService.save(promptsFeature);
        return ResponseEntity
            .created(new URI("/api/prompts-features/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /prompts-features/:id} : Updates an existing promptsFeature.
     *
     * @param id the id of the promptsFeature to save.
     * @param promptsFeature the promptsFeature to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated promptsFeature,
     * or with status {@code 400 (Bad Request)} if the promptsFeature is not valid,
     * or with status {@code 500 (Internal Server Error)} if the promptsFeature couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/prompts-features/{id}")
    public ResponseEntity<PromptsFeature> updatePromptsFeature(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PromptsFeature promptsFeature
    ) throws URISyntaxException {
        log.debug("REST request to update PromptsFeature : {}, {}", id, promptsFeature);
        if (promptsFeature.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, promptsFeature.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!promptsFeatureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PromptsFeature result = promptsFeatureService.update(promptsFeature);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, promptsFeature.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /prompts-features/:id} : Partial updates given fields of an existing promptsFeature, field will ignore if it is null
     *
     * @param id the id of the promptsFeature to save.
     * @param promptsFeature the promptsFeature to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated promptsFeature,
     * or with status {@code 400 (Bad Request)} if the promptsFeature is not valid,
     * or with status {@code 404 (Not Found)} if the promptsFeature is not found,
     * or with status {@code 500 (Internal Server Error)} if the promptsFeature couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/prompts-features/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PromptsFeature> partialUpdatePromptsFeature(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PromptsFeature promptsFeature
    ) throws URISyntaxException {
        log.debug("REST request to partial update PromptsFeature partially : {}, {}", id, promptsFeature);
        if (promptsFeature.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, promptsFeature.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!promptsFeatureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PromptsFeature> result = promptsFeatureService.partialUpdate(promptsFeature);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, promptsFeature.getId().toString())
        );
    }

    /**
     * {@code GET  /prompts-features} : get all the promptsFeatures.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of promptsFeatures in body.
     */
    @GetMapping("/prompts-features")
    public ResponseEntity<List<PromptsFeature>> getAllPromptsFeatures(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of PromptsFeatures");
        Page<PromptsFeature> page = promptsFeatureService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /prompts-features/:id} : get the "id" promptsFeature.
     *
     * @param id the id of the promptsFeature to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the promptsFeature, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/prompts-features/{id}")
    public ResponseEntity<PromptsFeature> getPromptsFeature(@PathVariable Long id) {
        log.debug("REST request to get PromptsFeature : {}", id);
        Optional<PromptsFeature> promptsFeature = promptsFeatureService.findOne(id);
        return ResponseUtil.wrapOrNotFound(promptsFeature);
    }

    /**
     * {@code DELETE  /prompts-features/:id} : delete the "id" promptsFeature.
     *
     * @param id the id of the promptsFeature to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/prompts-features/{id}")
    public ResponseEntity<Void> deletePromptsFeature(@PathVariable Long id) {
        log.debug("REST request to delete PromptsFeature : {}", id);
        promptsFeatureService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
