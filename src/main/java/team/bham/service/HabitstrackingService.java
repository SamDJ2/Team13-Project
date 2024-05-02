package team.bham.service;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.Habitstracking;
import team.bham.repository.HabitstrackingRepository;

/**
 * Service Implementation for managing {@link Habitstracking}.
 */
@Service
@Transactional
public class HabitstrackingService {

    private final Logger log = LoggerFactory.getLogger(HabitstrackingService.class);
    private final HabitstrackingRepository habitstrackingRepository;

    public HabitstrackingService(HabitstrackingRepository habitstrackingRepository) {
        this.habitstrackingRepository = habitstrackingRepository;
    }

    /**
     * Save a habitstracking.
     *
     * @param habitstracking the entity to save.
     * @return the persisted entity.
     */
    public Habitstracking save(Habitstracking habitstracking) {
        log.debug("Request to save Habitstracking : {}", habitstracking);
        return habitstrackingRepository.save(habitstracking);
    }

    /**
     * Update a habitstracking.
     *
     * @param habitstracking the entity to save.
     * @return the persisted entity.
     */
    public Habitstracking update(Habitstracking habitstracking) {
        log.debug("Request to update Habitstracking : {}", habitstracking);
        return habitstrackingRepository.save(habitstracking);
    }

    /**
     * Partially update a habitstracking.
     *
     * @param habitstracking the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Habitstracking> partialUpdate(Habitstracking habitstracking) {
        log.debug("Request to partially update Habitstracking : {}", habitstracking);

        return habitstrackingRepository
            .findById(habitstracking.getId())
            .map(existingHabitstracking -> {
                if (habitstracking.getNameOfHabit() != null) {
                    existingHabitstracking.setNameOfHabit(habitstracking.getNameOfHabit());
                }
                if (habitstracking.getDayOfHabit() != null) {
                    existingHabitstracking.setDayOfHabit(habitstracking.getDayOfHabit());
                }
                if (habitstracking.getWeekOfHabit() != null) {
                    existingHabitstracking.setWeekOfHabit(habitstracking.getWeekOfHabit());
                }
                if (habitstracking.getCompletedHabit() != null) {
                    existingHabitstracking.setCompletedHabit(habitstracking.getCompletedHabit());
                }
                if (habitstracking.getUsernameHabit() != null) {
                    existingHabitstracking.setUsernameHabit(habitstracking.getUsernameHabit());
                }
                if (habitstracking.getHabitIDEN() != null) {
                    existingHabitstracking.setHabitIDEN(habitstracking.getHabitIDEN());
                }
                if (habitstracking.getSummary() != null) {
                    existingHabitstracking.setSummary(habitstracking.getSummary());
                }

                return existingHabitstracking;
            })
            .map(habitstrackingRepository::save);
    }

    /**
     * Get all the habitstrackings.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Habitstracking> findAll() {
        log.debug("Request to get all Habitstrackings");
        return habitstrackingRepository.findAll();
    }

    /**
     * Get one habitstracking by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Habitstracking> findOne(Long id) {
        log.debug("Request to get Habitstracking : {}", id);
        return habitstrackingRepository.findById(id);
    }

    /**
     * Get all habitstrackings by week number.
     *
     * @param weekOfHabit the week number of the entity.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Habitstracking> findByWeekOfHabit(Integer weekOfHabit) {
        log.debug("Request to get all Habitstrackings for week : {}", weekOfHabit);
        return habitstrackingRepository.findByWeekOfHabit(weekOfHabit);
    }

    /**
     * Delete the habitstracking by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Habitstracking : {}", id);
        habitstrackingRepository.deleteById(id);
    }
}
