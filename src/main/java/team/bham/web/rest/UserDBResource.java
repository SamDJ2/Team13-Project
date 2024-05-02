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
import team.bham.domain.UserDB;
import team.bham.repository.UserDBRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.UserDB}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserDBResource {

    private final Logger log = LoggerFactory.getLogger(UserDBResource.class);

    private static final String ENTITY_NAME = "userDB";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserDBRepository userDBRepository;

    public UserDBResource(UserDBRepository userDBRepository) {
        this.userDBRepository = userDBRepository;
    }

    /**
     * {@code POST  /user-dbs} : Create a new userDB.
     *
     * @param userDB the userDB to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userDB, or with status {@code 400 (Bad Request)} if the userDB has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-dbs")
    public ResponseEntity<UserDB> createUserDB(@RequestBody UserDB userDB) throws URISyntaxException {
        log.debug("REST request to save UserDB : {}", userDB);
        if (userDB.getId() != null) {
            throw new BadRequestAlertException("A new userDB cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserDB result = userDBRepository.save(userDB);
        return ResponseEntity
            .created(new URI("/api/user-dbs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-dbs/:id} : Updates an existing userDB.
     *
     * @param id the id of the userDB to save.
     * @param userDB the userDB to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userDB,
     * or with status {@code 400 (Bad Request)} if the userDB is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userDB couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-dbs/{id}")
    public ResponseEntity<UserDB> updateUserDB(@PathVariable(value = "id", required = false) final Long id, @RequestBody UserDB userDB)
        throws URISyntaxException {
        log.debug("REST request to update UserDB : {}, {}", id, userDB);
        if (userDB.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userDB.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userDBRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserDB result = userDBRepository.save(userDB);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userDB.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-dbs/:id} : Partial updates given fields of an existing userDB, field will ignore if it is null
     *
     * @param id the id of the userDB to save.
     * @param userDB the userDB to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userDB,
     * or with status {@code 400 (Bad Request)} if the userDB is not valid,
     * or with status {@code 404 (Not Found)} if the userDB is not found,
     * or with status {@code 500 (Internal Server Error)} if the userDB couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-dbs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserDB> partialUpdateUserDB(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserDB userDB
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserDB partially : {}, {}", id, userDB);
        if (userDB.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userDB.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userDBRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserDB> result = userDBRepository
            .findById(userDB.getId())
            .map(existingUserDB -> {
                if (userDB.getUserID() != null) {
                    existingUserDB.setUserID(userDB.getUserID());
                }
                if (userDB.getEmail() != null) {
                    existingUserDB.setEmail(userDB.getEmail());
                }
                if (userDB.getPassword() != null) {
                    existingUserDB.setPassword(userDB.getPassword());
                }
                if (userDB.getPhoneNumber() != null) {
                    existingUserDB.setPhoneNumber(userDB.getPhoneNumber());
                }
                if (userDB.getProfilePicture() != null) {
                    existingUserDB.setProfilePicture(userDB.getProfilePicture());
                }
                if (userDB.getProfilePictureContentType() != null) {
                    existingUserDB.setProfilePictureContentType(userDB.getProfilePictureContentType());
                }
                if (userDB.getUserName() != null) {
                    existingUserDB.setUserName(userDB.getUserName());
                }

                return existingUserDB;
            })
            .map(userDBRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userDB.getId().toString())
        );
    }

    /**
     * {@code GET  /user-dbs} : get all the userDBS.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userDBS in body.
     */
    @GetMapping("/user-dbs")
    public List<UserDB> getAllUserDBS() {
        log.debug("REST request to get all UserDBS");
        return userDBRepository.findAll();
    }

    /**
     * {@code GET  /user-dbs/:id} : get the "id" userDB.
     *
     * @param id the id of the userDB to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userDB, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-dbs/{id}")
    public ResponseEntity<UserDB> getUserDB(@PathVariable Long id) {
        log.debug("REST request to get UserDB : {}", id);
        Optional<UserDB> userDB = userDBRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userDB);
    }

    /**
     * {@code DELETE  /user-dbs/:id} : delete the "id" userDB.
     *
     * @param id the id of the userDB to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-dbs/{id}")
    public ResponseEntity<Void> deleteUserDB(@PathVariable Long id) {
        log.debug("REST request to delete UserDB : {}", id);
        userDBRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
