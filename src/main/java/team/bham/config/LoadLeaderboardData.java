package team.bham.config;

import java.util.Arrays;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import team.bham.domain.Grouping;
import team.bham.domain.Members;
import team.bham.domain.User;
import team.bham.domain.UserPoints;
import team.bham.repository.GroupingRepository;
import team.bham.repository.MembersRepository;
import team.bham.repository.UserPointsRepository;
import team.bham.repository.UserRepository;

@Configuration
public class LoadLeaderboardData {

    @Bean
    CommandLineRunner initDatabase(
        UserRepository userRepository,
        UserPointsRepository userPointsRepository,
        MembersRepository membersRepository,
        GroupingRepository groupingRepository
    ) {
        return args -> {
            if (!groupingRepository.existsByGroupingName("ADDGROUP")) {
                Grouping grouping = new Grouping();
                grouping.setGroupingName("ADDGROUP");
                grouping = groupingRepository.save(grouping);

                List<String> users = Arrays.asList("user1", "user2", "user3", "user4", "user5", "user6");
                int[] currentPoints = { 18, 16, 15, 14, 11, 9 };
                int[] previousPoints = { 15, 14, 13, 14, 12, 16 };
                int[] totalPoints = { 33, 30, 28, 28, 23, 25 };

                for (int i = 0; i < users.size(); i++) {
                    final String username = users.get(i);
                    final int index = i;
                    User user = userRepository
                        .findOneByLogin(username)
                        .orElseGet(() -> {
                            User newUser = new User();
                            newUser.setLogin(username);
                            newUser.setPassword("$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K");
                            newUser.setEmail(username + "@localhost.com");
                            newUser.setActivated(true);
                            newUser.setImageUrl(index % 2 == 0 ? "assets/images/Avatars/Avatar.png" : "assets/images/Avatars/Avatar2.png");

                            return userRepository.save(newUser);
                        });

                    UserPoints userPoints = new UserPoints();
                    userPoints.setUserID(user.getId());
                    userPoints.setCurrentPoints(currentPoints[index]);
                    userPoints.setPreviousPoints(previousPoints[index]);
                    userPoints.setTotalPoints(totalPoints[index]);
                    userPointsRepository.save(userPoints);

                    Members member = new Members();
                    member.setUserID(user.getId());
                    member.setGroupID(grouping.getId());
                    member.setLeader(false);
                    membersRepository.save(member);
                }
                UserPoints adminPoints = new UserPoints();
                adminPoints.setUserID(1L);
                adminPoints.setCurrentPoints(0);
                adminPoints.setPreviousPoints(0);
                adminPoints.setTotalPoints(0);
                userPointsRepository.save(adminPoints);

                UserPoints userPoints = new UserPoints();
                userPoints.setUserID(2L);
                userPoints.setCurrentPoints(0);
                userPoints.setPreviousPoints(0);
                userPoints.setTotalPoints(0);
                userPointsRepository.save(userPoints);
            } else {
                System.out.println("'ADDGROUP' group already exists. Skipping data initialization.");
            }
        };
    }
}
