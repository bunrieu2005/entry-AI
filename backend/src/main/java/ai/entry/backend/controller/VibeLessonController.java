package ai.entry.backend.controller;

import ai.entry.backend.model.entity.VibeLesson;
import ai.entry.backend.service.VibeLessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vibe-lessons")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class VibeLessonController {

    private final VibeLessonService vibeLessonService;

    @GetMapping
    public ResponseEntity<List<VibeLesson>> getAllLessons() {
        return ResponseEntity.ok(vibeLessonService.getAllLessons());
    }

    @GetMapping("/lesson/{lessonNo}")
    public ResponseEntity<VibeLesson> getLessonByNo(@PathVariable("lessonNo") Integer lessonNo) {
        return ResponseEntity.ok(vibeLessonService.getLessonByNo(lessonNo));
    }

    @GetMapping("/track/{slug}")
    public ResponseEntity<List<VibeLesson>> getLessonsByTrack(@PathVariable("slug") String slug) {
        return ResponseEntity.ok(vibeLessonService.getLessonsByTrack(slug));
    }

}