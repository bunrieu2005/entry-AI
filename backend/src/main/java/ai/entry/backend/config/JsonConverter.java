package ai.entry.backend.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Converter chung cho các trường JSON: lưu dưới dạng String trong DB và ánh xạ thành JsonNode trong Java.
 */
@Converter(autoApply = false)
public class JsonConverter implements AttributeConverter<JsonNode, String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(JsonNode attribute) {
        if (attribute == null) return null;
        try {
            return MAPPER.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Không thể serialize JSON field", e);
        }
    }

    @Override
    public JsonNode convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) return null;
        try {
            return MAPPER.readTree(dbData);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Không thể parse JSON từ DB", e);
        }
    }
}
