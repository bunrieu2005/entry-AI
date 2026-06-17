package ai.entry.backend.controller;

import ai.entry.backend.model.entity.Guide;
import ai.entry.backend.model.entity.GuideProgress;
import ai.entry.backend.service.GuideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guides")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class GuideController {

    private final GuideService guideService;

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Guide>> getGuidesByCategory(@PathVariable("categoryId") Long categoryId) {
        return ResponseEntity.ok(guideService.getGuidesByCategory(categoryId));
    }

    @PostMapping("/progress")
    public ResponseEntity<GuideProgress> updateProgress(
            @RequestParam String sessionId,
            @RequestParam Long guideId,
            @RequestParam Integer stepIndex,
            @RequestParam Integer xpEarned,
            @RequestParam boolean isCompleted) {
        GuideProgress progress = guideService.updateProgress(sessionId, guideId, stepIndex, xpEarned, isCompleted);
        return ResponseEntity.ok(progress);
    }
}