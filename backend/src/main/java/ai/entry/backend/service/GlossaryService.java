package ai.entry.backend.service;

import ai.entry.backend.model.entity.GlossaryTerm;
import ai.entry.backend.repository.GlossaryTermRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GlossaryService {

    private final GlossaryTermRepository glossaryTermRepository;

    public List<GlossaryTerm> getAllTerms() {
        return glossaryTermRepository.findAll();
    }

    public List<GlossaryTerm> searchTerms(String query) {
        return glossaryTermRepository.findByTermContainingIgnoreCase(query);
    }
}