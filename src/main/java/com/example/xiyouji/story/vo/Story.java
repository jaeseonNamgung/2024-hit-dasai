package com.example.xiyouji.story.vo;


import com.example.xiyouji.story.dto.StoryDto;
import com.example.xiyouji.type.Characters;
import com.example.xiyouji.type.Language;
import io.lettuce.core.dynamic.annotation.CommandNaming;
import jakarta.persistence.*;
import lombok.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

@Entity
@Getter
@RequiredArgsConstructor
public class Story {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated
    private Characters characters;

    private String storyTitle;


    @OneToMany(mappedBy = "story" , orphanRemoval = true, cascade = CascadeType.ALL)
    private List<StoryContent> storyContent;

    @OneToMany(mappedBy = "story", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<StoryImage> storyImages;

    @Enumerated
    private Language language;

    private Integer paragraphMax;


    @Builder
    public Story(Long id, Characters characters, String storyTitle, List<StoryContent> storyContent, List<StoryImage> storyImages, Language language, Integer paragraphMax) {
        this.id = id;
        this.characters = characters;
        this.storyTitle = storyTitle;
        this.storyContent = storyContent;
        this.storyImages = storyImages;
        this.language = language;
        this.paragraphMax = paragraphMax;
    }




    public StoryDto.StoryResponseDto toStoryResponseDto() {
        return StoryDto.StoryResponseDto.builder()
                .storyContents(storyContent.stream()
                        .map(StoryContent::getContent)
                        .toList())
                .build();
    }

    public StoryDto.StoryResponseDto toStoryResponseDto(List<String> imageUrls) {
        return StoryDto.StoryResponseDto.builder()
                .storyImagesUrl(imageUrls)
                .storyContents(storyContent.stream()
                        .map(StoryContent::getContent)
                        .toList())
                .build();
    }

    public StoryDto.StoryResponseDto toStoryResponseDtoByNum(Integer num) {
        return StoryDto.StoryResponseDto.builder()
                .storyImagesUrl(Optional.ofNullable(storyImages)
                        .orElseGet(Collections::emptyList) // storyImages가 null이면 빈 리스트를 반환
                        .stream()
                        .filter(imageUrls -> imageUrls.getParagraphNum() == num + 1)
                        .map(StoryImage::getFullPath)
                        .toList())
                .storyContents(storyContent.stream()
                        .filter(storyContent -> storyContent.getParagraphNum() == num + 1)
                        .map(StoryContent::getContent)
                        .toList())
                .build();
    }

    public List<StoryDto.StoryResponseDto> toStoryResponseDtos() {
        return IntStream.range(0, paragraphMax)
                .mapToObj(this::toStoryResponseDtoByNum)
                .toList();
    }


}
