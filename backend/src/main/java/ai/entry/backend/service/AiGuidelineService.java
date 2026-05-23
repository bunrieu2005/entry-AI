package ai.entry.backend.service;

import ai.entry.backend.model.dto.AiCategoryMenuDTO;
import ai.entry.backend.model.dto.AiLessonItemDTO;
import ai.entry.backend.model.entity.AICategory;
import ai.entry.backend.model.entity.AILesson;
import ai.entry.backend.repository.AICategoryRepository;
import ai.entry.backend.repository.AILessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiGuidelineService {

    @Autowired
    private AICategoryRepository aiCategoryRepository;

    @Autowired
    private AILessonRepository aiLessonRepository;

    public List<AiCategoryMenuDTO> getAiGuidelineMenu() {
        List<AICategory> categories = aiCategoryRepository.findAll();

        return categories.stream().map(cat -> {
            List<AiLessonItemDTO> items = cat.getLessons().stream()
                    .map(lesson -> new AiLessonItemDTO(lesson.getId(), lesson.getTitle()))
                    .collect(Collectors.toList());

            return new AiCategoryMenuDTO(cat.getId(), cat.getName(), cat.getIcon(), items);
        }).collect(Collectors.toList());
    }

    public AILesson getLessonDetail(String id) {
        return aiLessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nội dung hướng dẫn AI với mã: " + id));
    }
}