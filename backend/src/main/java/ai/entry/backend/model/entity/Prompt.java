package ai.entry.backend.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "prompts")
@Data
public class Prompt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "subcategory_id")
    private Long subcategoryId;
    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "title_vi", nullable = false)
    private String titleVi;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "copy_count")
    private Integer copyCount = 0;


    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "compatible_tools")
    private List<String> compatibleTools;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Category category;
    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @ManyToMany(mappedBy = "favoritePrompts", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<User> usersWhoFavorited = new HashSet<>();


    public Set<User> getUsersWhoFavorited() { return usersWhoFavorited; }
    public void setUsersWhoFavorited(Set<User> usersWhoFavorited) { this.usersWhoFavorited = usersWhoFavorited; }
}