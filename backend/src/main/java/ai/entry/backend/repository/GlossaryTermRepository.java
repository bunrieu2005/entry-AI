package ai.entry.backend.repository;

import ai.entry.backend.model.entity.GlossaryTerm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GlossaryTermRepository extends JpaRepository<GlossaryTerm, Long> {

    List<GlossaryTerm> findByTermContainingIgnoreCase(String term);

    @Query(value = "SELECT * FROM glossary_terms WHERE tags LIKE %:tag%", nativeQuery = true)
    List<GlossaryTerm> findByTagContaining(@Param("tag") String tag);

    @Query(value = "SELECT * FROM glossary_terms WHERE tags LIKE %:tag1% OR tags LIKE %:tag2% OR tags LIKE %:tag3%", nativeQuery = true)
    List<GlossaryTerm> findByHotTags(@Param("tag1") String tag1, @Param("tag2") String tag2, @Param("tag3") String tag3);
}
