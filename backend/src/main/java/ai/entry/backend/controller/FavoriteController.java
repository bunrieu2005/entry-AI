package ai.entry.backend.controller;

import ai.entry.backend.model.entity.Prompt;
import ai.entry.backend.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    /**
     POST /api/favorites/1/5
     */
    @PostMapping("/{userId}/{promptId}")
    public ResponseEntity<Boolean> toggleFavorite(@PathVariable Long userId, @PathVariable Long promptId) {
        boolean currentStatus = favoriteService.toggleFavorite(userId, promptId);
        return ResponseEntity.ok(currentStatus);
    }

    /**
     * URL: GET /api/favorites/1
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Set<Prompt>> getFavorites(@PathVariable Long userId) {
        Set<Prompt> favorites = favoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(favorites);
    }
}