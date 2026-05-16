package ai.entry.backend.service;

import ai.entry.backend.model.entity.Prompt;
import ai.entry.backend.model.entity.PromptCopyLog;
import ai.entry.backend.model.enums.InputMethod;
import ai.entry.backend.repository.PromptCopyLogRepository;
import ai.entry.backend.repository.PromptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PromptService {

    private final PromptRepository promptRepository;
    private final PromptCopyLogRepository promptCopyLogRepository;

    // Lấy prompt theo danh mục
    public List<Prompt> getPromptsByCategory(Long categoryId) {
        return promptRepository.findByCategoryId(categoryId);
    }

    // Lấy prompt nổi bật
    public List<Prompt> getFeaturedPrompts() {
        return promptRepository.findByIsFeaturedTrue();
    }

    // Tăng lượt copy và ghi log
    public void incrementCopyCount(Long promptId, InputMethod method, String sessionId) {
        Prompt prompt = promptRepository.findById(promptId)
                .orElseThrow(() -> new RuntimeException("Prompt không tồn tại với id=" + promptId));

        Integer current = prompt.getCopyCount() == null ? 0 : prompt.getCopyCount();
        prompt.setCopyCount(current + 1);
        promptRepository.save(prompt);

        PromptCopyLog log = PromptCopyLog.builder()
                .prompt(prompt)
                .inputMethod(method)
                .sessionId(sessionId)
                .copiedAt(LocalDateTime.now())
                .build();
        promptCopyLogRepository.save(log);
    }
}
