package ai.entry.backend.controller;

import ai.entry.backend.model.entity.User;
import ai.entry.backend.repository.UserRepository;
import ai.entry.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Máy băm mật khẩu BCrypt

    @Autowired
    private JwtUtils jwtUtils; // Máy tạo Token

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User userRequest) {
        if (userRepository.findByUsername(userRequest.getUsername()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Tên đăng nhập đã tồn tại!");
        }

        // MÃ HÓA MẬT KHẨU BẰNG BCRYPT TRƯỚC KHI LƯU
        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        userRepository.save(userRequest);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());

        // KIỂM TRA MẬT KHẨU BCRYPT CÓ KHỚP VỚI MẬT KHẨU NGƯỜI DÙNG NHẬP KHÔNG
        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai tài khoản hoặc mật khẩu!");
        }

        // NẾU ĐÚNG -> TẠO JWT TOKEN
        String jwtToken = jwtUtils.generateJwtToken(user.getUsername());

        // Đóng gói dữ liệu trả về cho Frontend (Kèm Token)
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwtToken);
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("displayName", user.getDisplayName());
        response.put("characterAvatar", user.getCharacterAvatar());

        return ResponseEntity.ok(response);
    }
}