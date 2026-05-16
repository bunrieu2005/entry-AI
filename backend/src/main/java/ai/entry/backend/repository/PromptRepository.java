package ai.entry.backend.repository;

import ai.entry.backend.model.entity.Prompt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromptRepository extends JpaRepository<Prompt, Long> {

    // Lọc danh sách Prompt theo ID danh mục
    List<Prompt> findByCategoryId(Long categoryId);

    // Lấy danh sách Prompt nổi bật
    List<Prompt> findByIsFeaturedTrue();
}
