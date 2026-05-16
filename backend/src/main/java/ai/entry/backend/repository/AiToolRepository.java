package ai.entry.backend.repository;

import ai.entry.backend.model.entity.AiTool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiToolRepository extends JpaRepository<AiTool, Long> {

    // Lọc danh sách công cụ AI theo ID danh mục
    List<AiTool> findByCategoryId(Long categoryId);

    // Lấy danh sách công cụ nổi bật
    List<AiTool> findByIsFeaturedTrue();
}
