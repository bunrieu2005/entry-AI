package ai.entry.backend.service;

import ai.entry.backend.model.entity.VibeLesson;
import ai.entry.backend.repository.VibeLessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VibeLessonService {

    private final VibeLessonRepository vibeLessonRepository;

    public List<VibeLesson> getAllLessons() {
        return vibeLessonRepository.findAllByOrderByLessonNoAsc();
    }

    public VibeLesson getLessonByNo(Integer lessonNo) {
        return vibeLessonRepository.findByLessonNo(lessonNo)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài học số: " + lessonNo));
    }

    public List<VibeLesson> getLessonsByTrack(String slug) {
        return vibeLessonRepository.findByTrackSlugOrderByLessonNoAsc(slug);
    }
}