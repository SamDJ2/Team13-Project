package team.bham.service;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.EntriesFeature;
import team.bham.repository.EntriesFeatureRepository;

/**
 * Service Implementation for managing {@link EntriesFeature}.
 */
@Service
@Transactional
public class EntriesFeatureService {

    private final Logger log = LoggerFactory.getLogger(EntriesFeatureService.class);

    private final EntriesFeatureRepository entriesFeatureRepository;

    public EntriesFeatureService(EntriesFeatureRepository entriesFeatureRepository) {
        this.entriesFeatureRepository = entriesFeatureRepository;
    }

    /**
     * Save a entriesFeature.
     *
     * @param entriesFeature the entity to save.
     * @return the persisted entity.
     */
    public EntriesFeature save(EntriesFeature entriesFeature) {
        log.debug("Request to save EntriesFeature : {}", entriesFeature);
        return entriesFeatureRepository.save(entriesFeature);
    }

    /**
     * Update a entriesFeature.
     *
     * @param entriesFeature the entity to save.
     * @return the persisted entity.
     */
    public EntriesFeature update(EntriesFeature entriesFeature) {
        log.debug("Request to update EntriesFeature : {}", entriesFeature);
        return entriesFeatureRepository.save(entriesFeature);
    }

    /**
     * Partially update a entriesFeature.
     *
     * @param entriesFeature the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<EntriesFeature> partialUpdate(EntriesFeature entriesFeature) {
        log.debug("Request to partially update EntriesFeature : {}", entriesFeature);

        return entriesFeatureRepository
            .findById(entriesFeature.getId())
            .map(existingEntriesFeature -> {
                if (entriesFeature.getTitle() != null) {
                    existingEntriesFeature.setTitle(entriesFeature.getTitle());
                }
                if (entriesFeature.getContent() != null) {
                    existingEntriesFeature.setContent(entriesFeature.getContent());
                }
                if (entriesFeature.getDate() != null) {
                    existingEntriesFeature.setDate(entriesFeature.getDate());
                }

                return existingEntriesFeature;
            })
            .map(entriesFeatureRepository::save);
    }

    /**
     * Get all the entriesFeatures.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<EntriesFeature> findAll(Pageable pageable) {
        log.debug("Request to get all EntriesFeatures");
        return entriesFeatureRepository.findAll(pageable);
    }

    /**
     * Get one entriesFeature by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<EntriesFeature> findOne(Long id) {
        log.debug("Request to get EntriesFeature : {}", id);
        return entriesFeatureRepository.findById(id);
    }

    /**
     * Delete the entriesFeature by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete EntriesFeature : {}", id);
        entriesFeatureRepository.deleteById(id);
    }
}
