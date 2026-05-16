package ai.entry.backend.repository;

import ai.entry.backend.model.entity.VibeLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VibeLessonRepository extends JpaRepository<VibeLesson, Long> {

    // Lấy danh sách bài học sắp xếp theo số thứ tự bài
    List<VibeLesson> findAllByOrderByLessonNoAsc();

    // Tìm bài học theo số thứ tự bài
    Optional<VibeLesson> findByLessonNo(Integer lessonNo);
}
