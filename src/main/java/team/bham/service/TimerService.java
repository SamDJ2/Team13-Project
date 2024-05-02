package team.bham.service;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.Timer;
import team.bham.repository.TimerRepository;

/**
 * Service Implementation for managing {@link Timer}.
 */
@Service
@Transactional
public class TimerService {

    private final Logger log = LoggerFactory.getLogger(TimerService.class);

    private final TimerRepository timerRepository;

    public TimerService(TimerRepository timerRepository) {
        this.timerRepository = timerRepository;
    }

    /**
     * Save a timer.
     *
     * @param timer the entity to save.
     * @return the persisted entity.
     */
    public Timer save(Timer timer) {
        log.debug("Request to save Timer : {}", timer);
        return timerRepository.save(timer);
    }

    /**
     * Update a timer.
     *
     * @param timer the entity to save.
     * @return the persisted entity.
     */
    public Timer update(Timer timer) {
        log.debug("Request to update Timer : {}", timer);
        return timerRepository.save(timer);
    }

    /**
     * Partially update a timer.
     *
     * @param timer the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Timer> partialUpdate(Timer timer) {
        log.debug("Request to partially update Timer : {}", timer);

        return timerRepository
            .findById(timer.getId())
            .map(existingTimer -> {
                if (timer.getStartTime() != null) {
                    existingTimer.setStartTime(timer.getStartTime());
                }
                if (timer.getIsActive() != null) {
                    existingTimer.setIsActive(timer.getIsActive());
                }

                return existingTimer;
            })
            .map(timerRepository::save);
    }

    /**
     * Get all the timers.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Timer> findAll() {
        log.debug("Request to get all Timers");
        return timerRepository.findAll();
    }

    /**
     * Get one timer by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Timer> findOne(Long id) {
        log.debug("Request to get Timer : {}", id);
        return timerRepository.findById(id);
    }

    /**
     * Delete the timer by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Timer : {}", id);
        timerRepository.deleteById(id);
    }
}
