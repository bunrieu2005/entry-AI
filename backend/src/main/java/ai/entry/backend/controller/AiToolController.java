package ai.entry.backend.controller;

import ai.entry.backend.model.dto.GroupedAiToolDTO;
import ai.entry.backend.model.entity.AiTool;
import ai.entry.backend.service.AiToolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai-tools")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AiToolController {

    private final AiToolService aiToolService;

    @GetMapping
    public ResponseEntity<List<AiTool>> getAllTools() {
        return ResponseEntity.ok(aiToolService.getAllTools());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<AiTool>> getToolsByCategory(@PathVariable("categoryId") Long categoryId) {
        return ResponseEntity.ok(aiToolService.getToolsByCategory(categoryId));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<AiTool>> getFeaturedTools() {
        return ResponseEntity.ok(aiToolService.getFeaturedTools());
    }
    @GetMapping("/grouped")
    public ResponseEntity<List<GroupedAiToolDTO>> getGroupedTools() {
        return ResponseEntity.ok(aiToolService.getGroupedAiTools());
    }
}