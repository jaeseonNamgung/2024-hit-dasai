package com.example.xiyouji.language;

import com.example.xiyouji.type.Language;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.assertThat;
@SpringBootTest
class CommentLanguageDetectorTest {
    @Autowired
    private CommentLanguageDetector commentLanguageDetector;

    @Test
    public void whenDetectKorean_thenCorrect() {
        Language detectedLanguage = commentLanguageDetector.detectLanguage("안녕하세요. 이 문장은 한국어로 작성되었습니다.");
        assertThat(detectedLanguage).isEqualTo(Language.KR);
    }

    @Test
    public void whenDetectKoreanAndMixSomeEnglish_thenCorrect() {
        Language detectedLanguage = commentLanguageDetector.detectLanguage("안녕하세요. 이 문장은 korean 으로 marer 작성되었습니다.");
        assertThat(detectedLanguage).isEqualTo(Language.KR);
    }

    @Test
    public void whenDetectChinese_thenCorrect() {
        Language detectedLanguage = commentLanguageDetector.detectLanguage("你好，这个句子用中文写的");
        assertThat(detectedLanguage).isEqualTo(Language.CN);
    }

    @Test
    public void whenDetectEnglish_thenCorrect() {
        Language detectedLanguage = commentLanguageDetector.detectLanguage("hello, this sentence write by english");
        assertThat(detectedLanguage).isEqualTo(Language.EN);
    }

}