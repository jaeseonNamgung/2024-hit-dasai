$(function() {
    function getCurrentLanguage() {
        // translate.js의 localStorage 사용과 일치하게 언어 선호도를 매칭합니다.
        var preferredLanguage = localStorage.getItem('preferredLanguage');
        return preferredLanguage === 'ko' ? 'ko' : 'cn';
    }

    // 캐릭터에 마우스를 올렸을 때
    $('.character').mouseenter(function() {
        // 팝업 표시
        var $this = $(this); // 현재 마우스가 올라간 캐릭터 요소
        // introduce 클래스를 가진 요소들의 텍스트를 빈 문자열로 초기화
        $(".introduce").text("");

        var characterName = $(this).attr("character-name");
        var language = getCurrentLanguage(); 

        console.log(characterName);
        console.log("준비 완료");
        $.ajax({
            url: `http://15.164.230.127:8080/character/${characterName}/${language}`, // 언어 변수를 동적으로 사용
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                console.log(response);
                $this.find(".introduce").each(function(index) {
                    if (response.storyContents && response.storyContents[index]) {
                        $(this).text(response.storyContents[index]);
                    }
                });
            },
            error: function(error) {
                console.error('Error fetching character info:', error);
                $("#characterInfo").html('<p>캐릭터 정보를 불러오는 데 실패했습니다.</p>');
            }
        });
    });

    // 캐릭터에서 마우스를 뗐을 때
    // $('.character').mouseleave(function() {
    //     // 팝업 숨기기

    //     // introduce 클래스를 가진 요소들의 텍스트를 비움
    //     $(".introduce").text("");
    // });
});