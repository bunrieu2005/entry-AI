package ai.entry.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class AiCategoryMenuDTO {
    private String id;
    private String name;
    private String icon;
    private List<AiLessonItemDTO> lessons;
}