package team.bham.service;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import team.bham.domain.UserPoints;
import team.bham.repository.UserPointsRepository;

@Service
public class UserPointsService {

    @Autowired
    private UserPointsRepository userPointsRepository;

    @Scheduled(cron = "0 0 0 * * MON")
    @Transactional
    public void updatePoints() {
        List<Long> exemptUserIds = userPointsRepository.findUserIdsByGroupName("ADDGROUP");
        List<UserPoints> allUserPoints = userPointsRepository.findAll();

        List<UserPoints> filteredUserPoints = allUserPoints
            .stream()
            .filter(userPoints -> !exemptUserIds.contains(userPoints.getUserID()))
            .collect(Collectors.toList());

        for (UserPoints userPoints : filteredUserPoints) {
            userPoints.setPreviousPoints(userPoints.getCurrentPoints());
            userPoints.setCurrentPoints(0);
        }
        userPointsRepository.saveAll(allUserPoints);
        System.out.println("User points updated");
    }
}
