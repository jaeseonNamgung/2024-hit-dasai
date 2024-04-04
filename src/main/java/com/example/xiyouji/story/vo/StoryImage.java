package com.example.xiyouji.story.vo;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Entity
@Getter
@RequiredArgsConstructor
public class StoryImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Story story;

    private String filename;

    private Integer paragraphNum;

    @Builder
    public StoryImage(Long id, Story story, String filename, Integer paragraphNum) {
        this.id = id;
        this.story = story;
        this.filename = filename;
        this.paragraphNum = paragraphNum;
    }

    public String getFullPath() { return "/front/images/" + filename; }
}
