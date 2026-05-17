package ai.entry.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonCardDTO {
    private String titleVi;
    private String slug;
    private Integer lessonNo;
    private String summaryVi;
    private Integer readTimeMin;

}