package ai.entry.backend.repository;

import ai.entry.backend.model.entity.AICategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface AICategoryRepository extends JpaRepository<AICategory, String> {}