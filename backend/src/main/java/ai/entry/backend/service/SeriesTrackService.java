package ai.entry.backend.service;

import ai.entry.backend.model.entity.SeriesTrack;
import ai.entry.backend.repository.SeriesTrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeriesTrackService {

    private final SeriesTrackRepository seriesTrackRepository;

    public List<SeriesTrack> getAllTracks() {
        return seriesTrackRepository.findAllByOrderBySortOrderAsc();
    }
}