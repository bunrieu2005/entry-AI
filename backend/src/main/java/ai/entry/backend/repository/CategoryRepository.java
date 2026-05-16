package ai.entry.backend.repository;

import ai.entry.backend.model.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Lấy danh sách các danh mục đang hoạt động và sắp xếp theo thứ tự hiển thị
    List<Category> findAllByIsActiveTrueOrderBySortOrderAsc();
}
