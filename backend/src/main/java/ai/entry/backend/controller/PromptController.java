package ai.entry.backend.controller;

import ai.entry.backend.model.entity.Prompt;
import ai.entry.backend.repository.PromptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prompts")
@CrossOrigin(origins = "http://localhost:4200")
public class PromptController {

    @Autowired
    private PromptRepository promptRepository;

    @GetMapping
    public ResponseEntity<List<Prompt>> getAllPrompts() {
        return ResponseEntity.ok(promptRepository.findAll());
    }


    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Prompt>> getPromptsByCategory(@PathVariable("categoryId") Long categoryId) {
        List<Prompt> prompts = promptRepository.findByCategoryId(categoryId);
        return ResponseEntity.ok(prompts);
    }
}