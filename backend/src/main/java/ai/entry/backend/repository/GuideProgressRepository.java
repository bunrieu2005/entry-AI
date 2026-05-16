package ai.entry.backend.repository;

import ai.entry.backend.model.entity.GuideProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GuideProgressRepository extends JpaRepository<GuideProgress, Long> {

    // Tìm tiến độ theo sessionId và guideId
    Optional<GuideProgress> findBySessionIdAndGuideId(String sessionId, Long guideId);
}
