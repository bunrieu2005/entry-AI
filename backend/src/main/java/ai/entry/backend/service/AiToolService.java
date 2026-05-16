package ai.entry.backend.service;

import ai.entry.backend.model.entity.AiTool;
import ai.entry.backend.repository.AiToolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

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
}