package ai.entry.backend.model.dto;
import java.util.List;

public class CategoryHierarchyDto {
    private Long id;
    private String name;
    private String slug;
    private String icon;
    private List<SubCategoryDto> subs;

    public CategoryHierarchyDto(Long id, String name, String slug, String icon, List<SubCategoryDto> subs) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.icon = icon;
        this.subs = subs;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getSlug() { return slug; }
    public String getIcon() { return icon; }
    public List<SubCategoryDto> getSubs() { return subs; }

    // DTO con cho Subcategory
    public static class SubCategoryDto {
        private Long id;
        private String name;
        private String slug;

        public SubCategoryDto(Long id, String name, String slug) {
            this.id = id;
            this.name = name;
            this.slug = slug;
        }

        // Getters
        public Long getId() { return id; }
        public String getName() { return name; }
        public String getSlug() { return slug; }
    }
}