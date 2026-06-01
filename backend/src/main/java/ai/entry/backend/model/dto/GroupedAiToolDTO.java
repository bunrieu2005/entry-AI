package ai.entry.backend.model.dto;

import java.util.List;

import ai.entry.backend.model.entity.AiTool;
import ai.entry.backend.model.entity.AiToolCategory;
import lombok.Data;

@Data
public class GroupedAiToolDTO{
    private AiToolCategory category;
    private List<AiTool> tools;

    public GroupedAiToolDTO(AiToolCategory category, List<AiTool> tools) {
        this.category = category;
        this.tools = tools;
    }
}