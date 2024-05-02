package team.bham.service;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.NewMoodPicker;
import team.bham.repository.NewMoodPickerRepository;

/**
 * Service Implementation for managing {@link NewMoodPicker}.
 */
@Service
@Transactional
public class NewMoodPickerService {

    private final Logger log = LoggerFactory.getLogger(NewMoodPickerService.class);

    private final NewMoodPickerRepository newMoodPickerRepository;

    public NewMoodPickerService(NewMoodPickerRepository newMoodPickerRepository) {
        this.newMoodPickerRepository = newMoodPickerRepository;
    }

    /**
     * Save a newMoodPicker.
     *
     * @param newMoodPicker the entity to save.
     * @return the persisted entity.
     */
    public NewMoodPicker save(NewMoodPicker newMoodPicker) {
        log.debug("Request to save NewMoodPicker : {}", newMoodPicker);
        return newMoodPickerRepository.save(newMoodPicker);
    }

    /**
     * Update a newMoodPicker.
     *
     * @param newMoodPicker the entity to save.
     * @return the persisted entity.
     */
    public NewMoodPicker update(NewMoodPicker newMoodPicker) {
        log.debug("Request to update NewMoodPicker : {}", newMoodPicker);
        return newMoodPickerRepository.save(newMoodPicker);
    }

    /**
     * Partially update a newMoodPicker.
     *
     * @param newMoodPicker the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<NewMoodPicker> partialUpdate(NewMoodPicker newMoodPicker) {
        log.debug("Request to partially update NewMoodPicker : {}", newMoodPicker);

        return newMoodPickerRepository
            .findById(newMoodPicker.getId())
            .map(existingNewMoodPicker -> {
                if (newMoodPicker.getUsername() != null) {
                    existingNewMoodPicker.setUsername(newMoodPicker.getUsername());
                }
                if (newMoodPicker.getMood() != null) {
                    existingNewMoodPicker.setMood(newMoodPicker.getMood());
                }

                return existingNewMoodPicker;
            })
            .map(newMoodPickerRepository::save);
    }

    /**
     * Get all the newMoodPickers.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<NewMoodPicker> findAll() {
        log.debug("Request to get all NewMoodPickers");
        return newMoodPickerRepository.findAll();
    }

    /**
     * Get one newMoodPicker by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<NewMoodPicker> findOne(Long id) {
        log.debug("Request to get NewMoodPicker : {}", id);
        return newMoodPickerRepository.findById(id);
    }

    /**
     * Delete the newMoodPicker by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete NewMoodPicker : {}", id);
        newMoodPickerRepository.deleteById(id);
    }
}
