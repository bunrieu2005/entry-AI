package ai.entry.backend.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "guide_progress",
       uniqueConstraints = @UniqueConstraint(name = "uq_guide_progress", columnNames = {"session_id", "guide_id"}))
public class GuideProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false, length = 64)
    private String sessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guide_id", nullable = false)
    private Guide guide;

    @Column(name = "step_index", nullable = false)
    private Integer stepIndex;

    @Column(name = "xp_earned", nullable = false)
    private Integer xpEarned;

    @Column(name = "is_completed", nullable = false)
    private Boolean isCompleted;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
