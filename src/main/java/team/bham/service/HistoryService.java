package team.bham.service;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.History;
import team.bham.repository.HistoryRepository;

/**
 * Service Implementation for managing {@link History}.
 */
@Service
@Transactional
public class HistoryService {

    private final Logger log = LoggerFactory.getLogger(HistoryService.class);

    private final HistoryRepository historyRepository;

    public HistoryService(HistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    /**
     * Save a history.
     *
     * @param history the entity to save.
     * @return the persisted entity.
     */
    public History save(History history) {
        log.debug("Request to save History : {}", history);
        return historyRepository.save(history);
    }

    /**
     * Update a history.
     *
     * @param history the entity to save.
     * @return the persisted entity.
     */
    public History update(History history) {
        log.debug("Request to update History : {}", history);
        return historyRepository.save(history);
    }

    /**
     * Partially update a history.
     *
     * @param history the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<History> partialUpdate(History history) {
        log.debug("Request to partially update History : {}", history);

        return historyRepository
            .findById(history.getId())
            .map(existingHistory -> {
                if (history.getChallengeName() != null) {
                    existingHistory.setChallengeName(history.getChallengeName());
                }
                if (history.getChallengeLevel() != null) {
                    existingHistory.setChallengeLevel(history.getChallengeLevel());
                }
                if (history.getDateStarted() != null) {
                    existingHistory.setDateStarted(history.getDateStarted());
                }
                if (history.getUsername() != null) {
                    existingHistory.setUsername(history.getUsername());
                }

                return existingHistory;
            })
            .map(historyRepository::save);
    }

    /**
     * Get all the histories.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<History> findAll() {
        log.debug("Request to get all Histories");
        return historyRepository.findAll();
    }

    /**
     * Get one history by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<History> findOne(Long id) {
        log.debug("Request to get History : {}", id);
        return historyRepository.findById(id);
    }

    /**
     * Delete the history by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete History : {}", id);
        historyRepository.deleteById(id);
    }
}
