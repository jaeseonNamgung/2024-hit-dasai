package com.example.xiyouji.story.service;

import com.example.xiyouji.exception.RestApiException;
import com.example.xiyouji.exception.impl.StoryErrorCode;

import com.example.xiyouji.story.dto.StoryDto;
import com.example.xiyouji.story.repository.StoryRepository;
import com.example.xiyouji.story.vo.Story;
import com.example.xiyouji.story.vo.StoryContent;
import com.example.xiyouji.story.vo.StoryImage;

import com.example.xiyouji.type.Characters;
import com.example.xiyouji.type.Language;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;



    public List<StoryDto.StoryResponseDto> getStory(StoryDto.StoryRequestDto storyRequestDto) {
        Story story = storyRepository.getStoryByIdAndLanguage(storyRequestDto.getStoryId(), storyRequestDto.getLanguage())
                .orElseThrow(() -> new RestApiException(StoryErrorCode.STORY_NOT_EXIST));

        return story.toStoryResponseDtos();
    }


    private List<String> getStoryImageUrls(Story story) {
        List<StoryImage> storyImages = story.getStoryImages();

        if (storyImages == null || storyImages.isEmpty()) {
            return Collections.emptyList();
        }

        return storyImages.stream()
                .map(StoryImage::getFilename)
                .toList();
    }

    public StoryDto.StoryResponseDto getCharacterStory(StoryDto.StoryRequestDto storyRequestDto) {
        Story story = storyRepository.getStoryByCharactersAndLanguage(storyRequestDto.getCharacter(), storyRequestDto.getLanguage())
                .orElseThrow(() -> new RestApiException(StoryErrorCode.STORY_NOT_EXIST));

        return story.toStoryResponseDto();
    }

}
