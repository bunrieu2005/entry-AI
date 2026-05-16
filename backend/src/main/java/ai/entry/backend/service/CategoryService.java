package ai.entry.backend.service;

import ai.entry.backend.model.entity.Category;
import ai.entry.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // Hàm lấy tất cả danh mục đang hoạt động để làm Sidebar
    public List<Category> getActiveCategories() {
        return categoryRepository.findAllByIsActiveTrueOrderBySortOrderAsc();
    }
}
