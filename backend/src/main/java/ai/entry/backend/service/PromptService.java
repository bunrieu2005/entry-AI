package ai.entry.backend.service;

import ai.entry.backend.model.entity.Prompt;
import ai.entry.backend.model.entity.PromptCopyLog;
import ai.entry.backend.model.enums.InputMethod;
import ai.entry.backend.repository.PromptCopyLogRepository;
import ai.entry.backend.repository.PromptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service

public class PromptService {

    private final PromptRepository promptRepository;
    private final PromptCopyLogRepository promptCopyLogRepository;

    // Nếu sếp dùng Lombok @RequiredArgsConstructor thì có thể bỏ constructor này
    public PromptService(PromptRepository promptRepository, PromptCopyLogRepository promptCopyLogRepository) {
        this.promptRepository = promptRepository;
        this.promptCopyLogRepository = promptCopyLogRepository;
    }

    // [CẬP NHẬT] Lấy prompt theo danh mục NHỎ (Dùng cho giao diện mới click ở Sidebar)
    @Transactional(readOnly = true)
    public List<Prompt> getPromptsBySubcategory(Long subcategoryId) {
        return promptRepository.findBySubcategoryId(subcategoryId);
    }

    // [GIỮ LẠI] Lấy toàn bộ prompt theo danh mục LỚN (Phòng trường hợp sếp cần hiện tất cả)
    @Transactional(readOnly = true)
    public List<Prompt> getPromptsByMainCategory(Long categoryId) {
        return promptRepository.findBySubcategoryId(categoryId);
    }

    // Lấy prompt nổi bật
    @Transactional(readOnly = true)
    public List<Prompt> getFeaturedPrompts() {
        return promptRepository.findByIsFeaturedTrue();
    }

    // Tăng lượt copy và ghi log
    @Transactional // Thêm Transactional để đảm bảo 2 hành động save() thực hiện đồng thời an toàn
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
