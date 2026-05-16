package ai.entry.backend.model.entity;

import ai.entry.backend.config.JsonConverter;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "glossary_terms")
public class GlossaryTerm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "term", nullable = false, length = 150)
    private String term;

    @Column(name = "slug", nullable = false, length = 150, unique = true)
    private String slug;

    @Column(name = "short_def_vi", nullable = false, length = 300)
    private String shortDefVi;

    @Lob
    @Column(name = "definition_vi", nullable = false, columnDefinition = "TEXT")
    private String definitionVi;

    @Lob
    @Column(name = "example_vi", nullable = false, columnDefinition = "TEXT")
    private String exampleVi;

    @Convert(converter = JsonConverter.class)
    @Column(name = "related_terms", columnDefinition = "JSON")
    private JsonNode relatedTerms;

    @Column(name = "tags", length = 255)
    private String tags;

    @Column(name = "view_count", nullable = false)
    private Integer viewCount;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
