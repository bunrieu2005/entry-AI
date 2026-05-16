package ai.entry.backend.repository;

import ai.entry.backend.model.entity.Guide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuideRepository extends JpaRepository<Guide, Long> {

    // Lấy danh sách hướng dẫn đang hoạt động của một danh mục
    List<Guide> findByCategoryIdAndIsActiveTrue(Long categoryId);
}
