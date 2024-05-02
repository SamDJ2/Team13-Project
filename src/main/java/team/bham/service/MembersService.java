package team.bham.service;

import java.util.*;
import java.util.List;
import java.util.stream.*;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.Grouping;
import team.bham.domain.Members;
import team.bham.domain.User;
import team.bham.repository.MembersRepository;
import team.bham.repository.UserRepository;
import team.bham.security.SecurityUtils;
import team.bham.service.dto.PointsDTO;

@Service
@Transactional
public class MembersService {

    private final UserRepository userRepository;

    private final MembersRepository membersRepository;

    public MembersService(UserRepository userRepository, MembersRepository membersRepository) {
        this.membersRepository = membersRepository;
        this.userRepository = userRepository;
    }

    public Members save(Members member) {
        return membersRepository.save(member);
    }

    @Transactional(readOnly = true)
    public List<Members> findAll() {
        return membersRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Members findOne(Long id) {
        return membersRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        membersRepository.deleteById(id);
    }

    public List<Members> findGroupsForCurrentUser() {
        Optional<String> login = SecurityUtils.getCurrentUserLogin();
        List<Members> groups = new ArrayList<>();

        if (login.isPresent()) {
            User user = userRepository.findOneByLogin(login.get()).orElse(null);

            if (user != null) {
                groups = membersRepository.findByUserID(user.getId());
            }
        }
        return groups;
    }

    public Long findCurrentUserid() {
        Optional<String> login = SecurityUtils.getCurrentUserLogin();
        if (login.isPresent()) {
            User user = userRepository.findOneByLogin(login.get()).orElse(null);
            return user.getId();
        }
        return 0L;
    }

    @Transactional(readOnly = true)
    public List<PointsDTO> getPointsByGroupID(Long groupId) {
        return membersRepository.findPointsByGroupID(groupId);
    }

    public void deleteByCurrentUserAndGroupId(Long groupID) {
        Optional<String> login = SecurityUtils.getCurrentUserLogin();
        if (login.isPresent()) {
            Optional<User> userOptional = userRepository.findOneByLogin(login.get());
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Members member = membersRepository.findMemberByGroupIDAndUserID(groupID, user.getId());
                Long ID = member.getId();
                membersRepository.deleteById(ID);
            }
        }
    }
}
