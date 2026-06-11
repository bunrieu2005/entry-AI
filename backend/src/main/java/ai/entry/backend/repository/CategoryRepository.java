package ai.entry.backend.repository;

import ai.entry.backend.model.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAllByIsActiveTrueOrderBySortOrderAsc();

    // (Nếu sếp có dùng thêm hàm lọc theo "type" thì khai báo thêm dòng này)
    List<Category> findByTypeAndIsActiveTrueOrderBySortOrderAsc(String type);

}
