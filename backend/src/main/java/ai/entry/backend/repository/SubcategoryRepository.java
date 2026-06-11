package ai.entry.backend.repository;



import ai.entry.backend.model.entity.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {
    // Lấy subcategory dựa theo category_id cha
    List<Subcategory> findByCategoryIdAndIsActiveTrueOrderBySortOrderAsc(Long categoryId);
}