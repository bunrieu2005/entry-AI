package ai.entry.backend.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ai_tool_categories")
@Data // Tự sinh getter/setter nếu ông dùng Lombok
public class AiToolCategory {

    @Id
    private Integer id;

    private String name;

    private String icon;

    private String description;
}