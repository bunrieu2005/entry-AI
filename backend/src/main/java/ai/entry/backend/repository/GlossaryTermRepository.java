package ai.entry.backend.repository;

import ai.entry.backend.model.entity.GlossaryTerm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GlossaryTermRepository extends JpaRepository<GlossaryTerm, Long> {

    // Tìm kiếm thuật ngữ theo từ khóa gần đúng (không phân biệt hoa thường)
    List<GlossaryTerm> findByTermContainingIgnoreCase(String term);
}
