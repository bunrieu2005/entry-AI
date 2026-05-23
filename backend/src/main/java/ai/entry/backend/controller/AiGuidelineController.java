package ai.entry.backend.controller;

import ai.entry.backend.model.dto.AiCategoryMenuDTO;
import ai.entry.backend.model.entity.AILesson;
import ai.entry.backend.repository.AILessonRepository;
import ai.entry.backend.service.AiGuidelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai-guidelines")
@CrossOrigin(origins = "*")
public class AiGuidelineController {

    @Autowired
    private AILessonRepository lessonRepository;

    // 1. Chỉ định rõ ("category") ở đây
    @GetMapping("/{category}")
    public ResponseEntity<List<AILesson>> getLessonsByCat(@PathVariable("category") String category) {
        return ResponseEntity.ok(lessonRepository.findByCategoryId(category));
    }

    // 2. Chỉ định rõ ("category") và ("lessonNo") ở đây
    @GetMapping("/{category}/{lessonNo}")
    public ResponseEntity<AILesson> getDetail(
            @PathVariable("category") String category,
            @PathVariable("lessonNo") String lessonNo) {

        String targetId = category + "-" + lessonNo;
        return lessonRepository.findById(targetId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}