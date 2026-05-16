package ai.entry.backend.service;

import ai.entry.backend.model.entity.Guide;
import ai.entry.backend.model.entity.GuideProgress;
import ai.entry.backend.repository.GuideRepository;
import ai.entry.backend.repository.GuideProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GuideService {

    private final GuideRepository guideRepository;
    private final GuideProgressRepository guideProgressRepository;

    public List<Guide> getGuidesByCategory(Long categoryId) {
        return guideRepository.findByCategoryIdAndIsActiveTrue(categoryId);
    }

    @Transactional
    public GuideProgress updateProgress(String sessionId, Long guideId, Integer stepIndex, Integer xpEarned, boolean isCompleted) {
        Guide guide = guideRepository.findById(guideId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài hướng dẫn với ID: " + guideId));

        // Tìm tiến độ cũ, nếu chưa có thì khởi tạo mới (Dành cho Guest Session)
        GuideProgress progress = guideProgressRepository.findBySessionIdAndGuideId(sessionId, guideId)
                .orElse(GuideProgress.builder()
                        .sessionId(sessionId)
                        .guide(guide)
                        .stepIndex(0)
                        .xpEarned(0)
                        .isCompleted(false)
                        .startedAt(LocalDateTime.now())
                        .build());

        progress.setStepIndex(stepIndex);
        progress.setXpEarned(progress.getXpEarned() + xpEarned);

        if (isCompleted) {
            progress.setIsCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
        }

        return guideProgressRepository.save(progress);
    }
}