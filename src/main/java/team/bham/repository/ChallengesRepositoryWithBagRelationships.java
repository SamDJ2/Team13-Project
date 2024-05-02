package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import team.bham.domain.Challenges;

public interface ChallengesRepositoryWithBagRelationships {
    Optional<Challenges> fetchBagRelationships(Optional<Challenges> challenges);

    List<Challenges> fetchBagRelationships(List<Challenges> challenges);

    Page<Challenges> fetchBagRelationships(Page<Challenges> challenges);
}
