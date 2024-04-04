package com.example.xiyouji.type;

import com.example.xiyouji.exception.RestApiException;
import com.example.xiyouji.exception.impl.EnumErrorCode;

public enum Language {
    KR("kr", "KR", "kor", "ko"),
    CN("cn","CN", "zh", "zh"),

    EN("en","EN", "en", "en"),
    ;

    private final String value;
    private final String value2;

    private final String value_baidu;

    private final String value_detector;

    Language(String value, String value2, String value_baidu, String value_detector) {
        this.value = value;
        this.value2 = value2;
        this.value_baidu = value_baidu;
        this.value_detector = value_detector;
    }

    public String getValue_upper() {
        return value2;
    }

    public String getValue_low() {
        return value;
    }

    public String getValue_baidu() {
        return value_baidu;
    }

    public String getValue_detector() {
        return value_detector;
    }

    public static Language fromString(String value) {
        for (Language language : Language.values()) {
            if (language.getValue_low().equalsIgnoreCase(value)) {
                return language;
            }
        }
        for (Language language : Language.values()) {
            if (language.getValue_upper().equalsIgnoreCase(value)) {
                return language;
            }
        }
        for (Language language : Language.values()) {
            if (language.getValue_detector().equalsIgnoreCase(value)) {
                return language;
            }
        }
        throw new RestApiException(EnumErrorCode.ENUM_NOT_FOUNDED);
        // 또는 null 반환을 원하면 return null; 사용
    }

    public static Language detectLanguage(String value) {
        for (Language language : Language.values()) {
            if (language.getValue_detector().equalsIgnoreCase(value)) {
                return language;
            }
        }
        return Language.EN;
        // 또는 null 반환을 원하면 return null; 사용
    }
}
