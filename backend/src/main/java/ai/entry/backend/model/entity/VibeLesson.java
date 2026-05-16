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
@Table(name = "vibe_lessons")
public class VibeLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lesson_no", nullable = false)
    private Integer lessonNo;

    @Column(name = "slug", nullable = false, length = 220, unique = true)
    private String slug;

    @Column(name = "title_vi", nullable = false, length = 220)
    private String titleVi;

    @Column(name = "summary_vi", nullable = false, length = 400)
    private String summaryVi;

    @Lob
    @Column(name = "body_html", nullable = false, columnDefinition = "LONGTEXT")
    private String bodyHtml;

    @Lob
    @Column(name = "prompt_example", nullable = false, columnDefinition = "TEXT")
    private String promptExample;

    @Convert(converter = JsonConverter.class)
    @Column(name = "tool_suggestions", nullable = false, columnDefinition = "JSON")
    private JsonNode toolSuggestions;

    @Column(name = "read_time_min", nullable = false)
    private Integer readTimeMin;

    @Column(name = "is_published", nullable = false)
    private Boolean isPublished;

    @Column(name = "view_count", nullable = false)
    private Integer viewCount;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
