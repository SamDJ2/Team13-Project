package team.bham.service;

import java.util.List;
import java.util.Optional;
import javax.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.User;
import team.bham.domain.UserPoints;
import team.bham.repository.UserPointsRepository;
import team.bham.repository.UserRepository;
import team.bham.security.SecurityUtils;

/**
 * Service Implementation for managing {@link Points}.
 */
@Service
@Transactional
public class PointsService {

    private final Logger log = LoggerFactory.getLogger(PointsService.class);

    private final UserPointsRepository userPointsRepository;
    private final UserRepository userRepository;

    @Autowired
    public PointsService(UserPointsRepository userPointsRepository, UserRepository userRepository) {
        this.userPointsRepository = userPointsRepository;
        this.userRepository = userRepository;
    }

    public UserPoints addPoints(String username, int pointsToAdd) {
        User user = userRepository.findOneByLogin(username).orElse(null);
        Long ID = user.getId();

        UserPoints points = userPointsRepository
            .findByUserID(ID)
            .orElseGet(() -> {
                UserPoints newPoints = new UserPoints();
                newPoints.setUserID(ID); // Set username
                newPoints.setCurrentPoints(0); // Initialize current points
                newPoints.setTotalPoints(0); // Initialize total points
                newPoints.setPreviousPoints(0); //Initialize previous points.
                return newPoints;
            });

        points.setCurrentPoints(points.getCurrentPoints() + pointsToAdd); // Overwrite current points
        points.setTotalPoints(points.getTotalPoints() + pointsToAdd); // Increment total points
        return userPointsRepository.save(points);
    }

    public UserPoints deductPoints(String username, int pointsToDeduct) {
        User user = userRepository.findOneByLogin(username).orElse(null);
        Long ID = user.getId();

        UserPoints points = userPointsRepository.findByUserID(ID).orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Calculate new current points ensuring it doesn't go below 0
        int newCurrentPoints = Math.max(0, points.getCurrentPoints() - pointsToDeduct);

        // Calculate new total points ensuring it doesn't go below 0
        int newTotalPoints = Math.max(0, points.getTotalPoints() - pointsToDeduct);

        points.setCurrentPoints(newCurrentPoints);
        points.setTotalPoints(newTotalPoints);

        return userPointsRepository.save(points);
    }

    /**
     * Save a points.
     *
     * @param points the entity to save.
     * @return the persisted entity.
     */
    public UserPoints save(UserPoints points) {
        log.debug("Request to save Points : {}", points);
        return userPointsRepository.save(points);
    }

    /**
     * Update a points.
     *
     * @param points the entity to save.
     * @return the persisted entity.
     */
    public UserPoints update(UserPoints points) {
        log.debug("Request to update Points : {}", points);
        return userPointsRepository.save(points);
    }

    /**
     * Partially update a points.
     *
     * @param points the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<UserPoints> partialUpdate(UserPoints points) {
        log.debug("Request to partially update Points : {}", points);

        return userPointsRepository
            .findById(points.getId())
            .map(existingPoints -> {
                if (points.getUserID() != null) {
                    existingPoints.setUserID(points.getUserID());
                }
                if (points.getCurrentPoints() != null) {
                    existingPoints.setCurrentPoints(points.getCurrentPoints());
                }
                if (points.getPreviousPoints() != null) {
                    existingPoints.setPreviousPoints(points.getPreviousPoints());
                }
                if (points.getTotalPoints() != null) {
                    existingPoints.setTotalPoints(points.getTotalPoints());
                }

                return existingPoints;
            })
            .map(userPointsRepository::save);
    }

    /**
     * Get all the points.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<UserPoints> findAll() {
        log.debug("Request to get all Points");
        return userPointsRepository.findAll();
    }

    /**
     * Get one points by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<UserPoints> findOne(Long id) {
        log.debug("Request to get Points : {}", id);
        return userPointsRepository.findById(id);
    }

    /**
     * Delete the points by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Points : {}", id);
        userPointsRepository.deleteById(id);
    }
}
