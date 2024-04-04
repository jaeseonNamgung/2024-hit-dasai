package com.example.xiyouji.language;


import com.example.xiyouji.type.Language;
import com.google.common.base.Optional;
import com.optimaize.langdetect.LanguageDetector;
import com.optimaize.langdetect.LanguageDetectorBuilder;
import com.optimaize.langdetect.ngram.NgramExtractors;
import com.optimaize.langdetect.profiles.LanguageProfile;
import com.optimaize.langdetect.profiles.LanguageProfileReader;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public class CommentLanguageDetector {

    private LanguageDetector languageDetector;

    @PostConstruct
    public void init() {
        try {
            List<LanguageProfile> languageProfiles = new LanguageProfileReader().readAllBuiltIn();
            this.languageDetector = LanguageDetectorBuilder.create(NgramExtractors.standard())
                    .withProfiles(languageProfiles)
                    .build();
        } catch (IOException e) {

            throw new RuntimeException("언어 프로파일 로딩 실패", e);
        }
    }

    public Language detectLanguage(String text) {
        // 텍스트의 언어 감지
        Optional<String> lang = languageDetector.detect(text).transform(result -> result.getLanguage());

        // 감지된 언어 반환 (감지되지 않은 경우 "unknown" 반환)
        return Language.detectLanguage(lang.or("en"));
    }

}
