package ai.entry.backend.service;

import ai.entry.backend.model.entity.Prompt;
import ai.entry.backend.model.entity.User;
import ai.entry.backend.repository.PromptRepository;
import ai.entry.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class FavoriteService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PromptRepository promptRepository;

    @Transactional
    public boolean toggleFavorite(Long userId, Long promptId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User!"));
        Prompt prompt = promptRepository.findById(promptId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Prompt!"));

        boolean isFavorited = user.getFavoritePrompts().contains(prompt);

        if (isFavorited) {
            user.getFavoritePrompts().remove(prompt); // Xóa tim
        } else {
            user.getFavoritePrompts().add(prompt); // Thả tim
        }

        userRepository.save(user);
        return !isFavorited;
    }

    // Lấy toàn bộ Prompt mà User này đã thả tim
    public Set<Prompt> getUserFavorites(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User!"));
        return user.getFavoritePrompts();
    }
}