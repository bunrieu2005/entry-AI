package ai.entry.backend.controller;

import ai.entry.backend.model.entity.GlossaryTerm;
import ai.entry.backend.service.GlossaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/glossary")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class GlossaryController {

    private final GlossaryService glossaryService;

    @GetMapping
    public ResponseEntity<List<GlossaryTerm>> getAllTerms() {
        return ResponseEntity.ok(glossaryService.getAllTerms());
    }

    @GetMapping("/search")
    public ResponseEntity<List<GlossaryTerm>> searchTerms(@RequestParam String q) {
        return ResponseEntity.ok(glossaryService.searchTerms(q));
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterTerms(
            @RequestParam(name = "group", defaultValue = "all", required = false) String group) {
        try {
            if (group == null || group.isBlank()) {
                group = "all";
            }
            List<GlossaryTerm> terms = glossaryService.getTermsByGroup(group.trim());
            return ResponseEntity.ok(terms);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to fetch glossary terms", "detail", e.getMessage()));
        }
    }
}