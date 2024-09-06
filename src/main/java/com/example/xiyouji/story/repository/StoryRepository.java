package com.example.xiyouji.story.repository;

import com.example.xiyouji.story.vo.Story;

import com.example.xiyouji.type.Characters;
import com.example.xiyouji.type.Language;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StoryRepository extends JpaRepository<Story, Long> {

    Optional<Story> getStoryByStoryTitleAndLanguage(String storyTitle, Language language);

    Optional<Story> getStoryByIdAndLanguage(Long storyId, Language language);

    Optional<Story> getStoryByCharactersAndLanguage(Characters character, Language language);

    Optional<Story> getStoryByStoryTitleAndCharactersAndLanguage(String title, Characters character, Language language);

}
