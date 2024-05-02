package team.bham.service;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.PromptsFeature;
import team.bham.repository.PromptsFeatureRepository;

/**
 * Service Implementation for managing {@link PromptsFeature}.
 */
@Service
@Transactional
public class PromptsFeatureService {

    private final Logger log = LoggerFactory.getLogger(PromptsFeatureService.class);

    private final PromptsFeatureRepository promptsFeatureRepository;

    public PromptsFeatureService(PromptsFeatureRepository promptsFeatureRepository) {
        this.promptsFeatureRepository = promptsFeatureRepository;
    }

    /**
     * Save a promptsFeature.
     *
     * @param promptsFeature the entity to save.
     * @return the persisted entity.
     */
    public PromptsFeature save(PromptsFeature promptsFeature) {
        log.debug("Request to save PromptsFeature : {}", promptsFeature);
        return promptsFeatureRepository.save(promptsFeature);
    }

    /**
     * Update a promptsFeature.
     *
     * @param promptsFeature the entity to save.
     * @return the persisted entity.
     */
    public PromptsFeature update(PromptsFeature promptsFeature) {
        log.debug("Request to update PromptsFeature : {}", promptsFeature);
        return promptsFeatureRepository.save(promptsFeature);
    }

    /**
     * Partially update a promptsFeature.
     *
     * @param promptsFeature the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<PromptsFeature> partialUpdate(PromptsFeature promptsFeature) {
        log.debug("Request to partially update PromptsFeature : {}", promptsFeature);

        return promptsFeatureRepository
            .findById(promptsFeature.getId())
            .map(existingPromptsFeature -> {
                if (promptsFeature.getTitle() != null) {
                    existingPromptsFeature.setTitle(promptsFeature.getTitle());
                }
                if (promptsFeature.getPrompt() != null) {
                    existingPromptsFeature.setPrompt(promptsFeature.getPrompt());
                }
                if (promptsFeature.getContent() != null) {
                    existingPromptsFeature.setContent(promptsFeature.getContent());
                }
                if (promptsFeature.getDate() != null) {
                    existingPromptsFeature.setDate(promptsFeature.getDate());
                }

                return existingPromptsFeature;
            })
            .map(promptsFeatureRepository::save);
    }

    /**
     * Get all the promptsFeatures.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<PromptsFeature> findAll(Pageable pageable) {
        log.debug("Request to get all PromptsFeatures");
        return promptsFeatureRepository.findAll(pageable);
    }

    /**
     * Get one promptsFeature by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PromptsFeature> findOne(Long id) {
        log.debug("Request to get PromptsFeature : {}", id);
        return promptsFeatureRepository.findById(id);
    }

    /**
     * Delete the promptsFeature by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete PromptsFeature : {}", id);
        promptsFeatureRepository.deleteById(id);
    }
}
