package ai.entry.backend.repository;

import ai.entry.backend.model.entity.Prompt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromptRepository extends JpaRepository<Prompt, Long> {
    // Lấy các prompt được đánh dấu nổi bật
    List<Prompt> findByIsFeaturedTrue();

    List<Prompt> findBySubcategoryId(Long subcategoryId);
}
