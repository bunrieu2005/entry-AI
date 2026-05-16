package ai.entry.backend.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.List;

@Entity
@Table(name = "prompts")
@Data
public class Prompt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "title_vi", nullable = false)
    private String titleVi;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "copy_count")
    private Integer copyCount = 0;

    // Map cột JSON thành List<String> trong Java
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "compatible_tools")
    private List<String> compatibleTools;

    // Mối quan hệ với bảng danh mục
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Category category;
    @Column(name = "is_featured")
    private Boolean isFeatured = false;
}