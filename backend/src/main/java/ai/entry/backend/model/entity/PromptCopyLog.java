package ai.entry.backend.model.entity;

import ai.entry.backend.model.enums.InputMethod;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "prompt_copy_logs")
public class PromptCopyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prompt_id", nullable = false)
    private Prompt prompt;

    @Enumerated(EnumType.STRING)
    @Column(name = "input_method", nullable = false, length = 20)
    private InputMethod inputMethod;

    @Column(name = "session_id", nullable = false, length = 64)
    private String sessionId;

    @Column(name = "copied_at", nullable = false)
    private LocalDateTime copiedAt;
}
