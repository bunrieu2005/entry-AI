package ai.entry.backend.controller;

import ai.entry.backend.model.entity.SeriesTrack;
import ai.entry.backend.service.SeriesTrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/series-tracks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class SeriesTrackController {

    private final SeriesTrackService seriesTrackService;

    //  GET http://localhost:8080/api/series-tracks
    @GetMapping
    public ResponseEntity<List<SeriesTrack>> getAllTracks() {
        return ResponseEntity.ok(seriesTrackService.getAllTracks());
    }
}