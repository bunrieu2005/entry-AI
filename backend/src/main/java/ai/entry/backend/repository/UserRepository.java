package ai.entry.backend.repository;

import ai.entry.backend.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // (Dùng cho tính năng Login sau này)
    User findByUsername(String username);
}