package ai.entry.backend.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "ai_tools")
public class AiTool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slug", nullable = false, length = 120, unique = true)
    private String slug;

    @Column(name = "name", nullable = false, length = 120)
    private String name;

    @Column(name = "tagline_vi", nullable = false, length = 200)
    private String taglineVi;

    @Lob
    @Column(name = "description_vi", nullable = false, columnDefinition = "TEXT")
    private String descriptionVi;

    @Column(name = "logo_url", length = 300)
    private String logoUrl;

    @Column(name = "website_url", length = 300)
    private String websiteUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // THÊM CHÍNH XÁC DÒNG NÀY
    private Category category;

    @Column(name = "use_case_tag", nullable = false, length = 120)
    private String useCaseTag;

    @Column(name = "is_free", nullable = false)
    private Boolean isFree;

    @Column(name = "is_featured", nullable = false)
    private Boolean isFeatured;

    @Column(name = "view_count", nullable = false)
    private Integer viewCount;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
