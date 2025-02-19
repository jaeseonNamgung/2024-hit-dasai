package com.example.xiyouji.result_rank_comment.dto;

import org.springframework.data.domain.Page;

import java.util.List;

public record RankingQuizCommentResponse(

        List<RankingDto> rankingTopFive,
        UserRankingResponse userRanking,
        Page<CommentResponse> comments

) {

    public static RankingQuizCommentResponse of(
            List<RankingDto> rankingTopTen,
            UserRankingResponse userRanking,
            Page<CommentResponse> comments
    ){
        return new RankingQuizCommentResponse(rankingTopTen, userRanking, comments);
    }
}
