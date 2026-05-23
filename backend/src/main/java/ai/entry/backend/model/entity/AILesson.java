package ai.entry.backend.model.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ai_lessons")
@Getter
@Setter
public class AILesson {
    @Id
    private String id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "target_prompt", columnDefinition = "LONGTEXT")
    private String targetPrompt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnore // Chặn vòng lặp vô hạn khi render JSON
    private AICategory category;
}