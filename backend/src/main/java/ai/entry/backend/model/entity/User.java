package ai.entry.backend.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "character_avatar")
    private String characterAvatar;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_favorite_prompts",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "prompt_id")
    )
    @JsonIgnore
    private Set<Prompt> favoritePrompts = new HashSet<>();

    // --- GETTERS & SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getCharacterAvatar() { return characterAvatar; }
    public void setCharacterAvatar(String characterAvatar) { this.characterAvatar = characterAvatar; }

    public Set<Prompt> getFavoritePrompts() { return favoritePrompts; }
    public void setFavoritePrompts(Set<Prompt> favoritePrompts) { this.favoritePrompts = favoritePrompts; }
}