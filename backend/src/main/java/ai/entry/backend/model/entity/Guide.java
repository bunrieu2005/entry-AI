package ai.entry.backend.model.entity;

import ai.entry.backend.config.JsonConverter;
import ai.entry.backend.model.enums.DifficultyLevel;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "guides")
public class Guide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slug", nullable = false, length = 220, unique = true)
    private String slug;

    @Column(name = "title_vi", nullable = false, length = 220)
    private String titleVi;

    @Column(name = "summary_vi", nullable = false, length = 400)
    private String summaryVi;

    @Convert(converter = JsonConverter.class)
    @Column(name = "step_data", nullable = false, columnDefinition = "JSON")
    private JsonNode stepData;

    @Column(name = "total_xp", nullable = false)
    private Integer totalXp;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", nullable = false, length = 20)
    private DifficultyLevel difficulty;

    // MySQL SET: lưu dưới dạng chuỗi comma-separated để tối giản ánh xạ
    @Column(name = "input_type", nullable = false, length = 100)
    private String inputType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "view_count", nullable = false)
    private Integer viewCount;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
