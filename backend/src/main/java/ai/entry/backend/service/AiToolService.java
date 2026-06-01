package ai.entry.backend.service;

import ai.entry.backend.model.dto.GroupedAiToolDTO;
import ai.entry.backend.model.dto.GroupedAiToolDTO; // Import DTO vừa tạo
import ai.entry.backend.model.entity.AiTool;
import ai.entry.backend.model.entity.AiToolCategory;
import ai.entry.backend.repository.AiToolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiToolService {

    private final AiToolRepository aiToolRepository;

    public List<AiTool> getAllTools() {
        return aiToolRepository.findAll();
    }

    public List<AiTool> getToolsByCategory(Long categoryId) {
        return aiToolRepository.findByCategoryId(categoryId);
    }

    public List<AiTool> getFeaturedTools() {
        return aiToolRepository.findByIsFeaturedTrue();
    }

    // THÊM MỚI: Hàm lấy toàn bộ Tool và gom nhóm theo Category
    public List<GroupedAiToolDTO> getGroupedAiTools() {
        // Lấy tất cả công cụ
        List<AiTool> allTools = aiToolRepository.findAll();

        // Gom nhóm (Group By) các công cụ dựa trên Category của chúng
        Map<AiToolCategory, List<AiTool>> groupedMap = allTools.stream()
                .filter(tool -> tool.getCategory() != null) // Lọc bỏ các tool chưa có danh mục để tránh lỗi
                .collect(Collectors.groupingBy(AiTool::getCategory));

        // Chuyển đổi từ dạng Map sang dạng List DTO để trả về Frontend dễ đọc hơn
        return groupedMap.entrySet().stream()
                .map(entry -> new GroupedAiToolDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }
}