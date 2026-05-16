package ai.entry.backend.repository;

import ai.entry.backend.model.entity.PromptCopyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromptCopyLogRepository extends JpaRepository<PromptCopyLog, Long> {
}
