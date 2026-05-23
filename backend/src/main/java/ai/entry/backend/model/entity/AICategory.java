package ai.entry.backend.model.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "ai_categories")
@Getter
@Setter
public class AICategory {
    @Id
    private String id;
    private String name;
    private String icon;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AILesson> lessons;
}