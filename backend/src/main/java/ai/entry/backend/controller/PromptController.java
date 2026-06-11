package ai.entry.backend.controller;

import ai.entry.backend.model.dto.CategoryHierarchyDto;
import ai.entry.backend.model.entity.Category;
import ai.entry.backend.model.entity.Prompt;
import ai.entry.backend.model.entity.Subcategory;
import ai.entry.backend.repository.CategoryRepository;
import ai.entry.backend.repository.PromptRepository;
import ai.entry.backend.repository.SubcategoryRepository;
import ai.entry.backend.service.PromptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/prompts")
@CrossOrigin(origins = "*") // Mở CORS để Angular gọi không bị chặn
public class PromptController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private PromptService promptService;

    /**
     * API 1: Lấy toàn bộ cây danh mục (Category chứa Subcategory)
     * Dùng để render thanh Tab ngang và cột Sidebar dọc trên giao diện
     */
    @GetMapping("/hierarchy")
    public ResponseEntity<List<CategoryHierarchyDto>> getCategoryHierarchy() {
        // Lấy các danh mục lớn (type = prompt)
        List<Category> mainCategories = categoryRepository.findByTypeAndIsActiveTrueOrderBySortOrderAsc("prompt");

        List<CategoryHierarchyDto> hierarchy = mainCategories.stream().map(cat -> {
            // Lấy danh mục nhỏ tương ứng với danh mục lớn
            List<Subcategory> subs = subcategoryRepository.findByCategoryIdAndIsActiveTrueOrderBySortOrderAsc(cat.getId());

            // Map sang DTO con
            List<CategoryHierarchyDto.SubCategoryDto> subDtos = subs.stream()
                    .map(sub -> new CategoryHierarchyDto.SubCategoryDto(sub.getId(), sub.getNameVi(), sub.getSlug()))
                    .collect(Collectors.toList());

            // Map sang DTO cha
            return new CategoryHierarchyDto(cat.getId(), cat.getNameVi(), cat.getSlug(), cat.getIcon(), subDtos);
        }).collect(Collectors.toList());

        return ResponseEntity.ok(hierarchy);
    }

    /**
     * API 2: Lấy danh sách Prompt theo ID của Danh mục nhỏ (Subcategory)
     * Gọi khi người dùng click vào 1 mục ở Sidebar
     */
    @GetMapping("/subcategory/{subcategoryId}")
    public ResponseEntity<List<Prompt>> getPromptsBySubcategory(@PathVariable("subcategoryId") Long subcategoryId) {
        List<Prompt> prompts = promptService.getPromptsBySubcategory(subcategoryId);
        return ResponseEntity.ok(prompts);
    }

    /**
     * API 3: Lấy danh sách Prompt nổi bật (is_featured = true)
     */
    @GetMapping("/featured")
    public ResponseEntity<List<Prompt>> getFeaturedPrompts() {
        List<Prompt> featuredPrompts = promptService.getFeaturedPrompts();
        return ResponseEntity.ok(featuredPrompts);
    }
}