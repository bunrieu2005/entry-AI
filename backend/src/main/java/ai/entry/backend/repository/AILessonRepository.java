package ai.entry.backend.repository;

import ai.entry.backend.model.entity.AILesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AILessonRepository extends JpaRepository<AILesson, String> {
    List<AILesson> findByCategoryId(String categoryId);
}