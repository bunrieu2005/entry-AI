package ai.entry.backend.repository;

import ai.entry.backend.model.entity.SeriesTrack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeriesTrackRepository extends JpaRepository<SeriesTrack, Integer> {
    // Lấy danh sách các Tab sắp xếp theo thứ tự hiển thị
    List<SeriesTrack> findAllByOrderBySortOrderAsc();
}