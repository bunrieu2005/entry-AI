package ai.entry.backend.model.entity;

import ai.entry.backend.model.entity.VibeLesson;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "series_tracks")
public class SeriesTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE"; // ACTIVE, COMING_SOON, INACTIVE

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;


    @OneToMany(mappedBy = "track", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<VibeLesson> lessons;


    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}