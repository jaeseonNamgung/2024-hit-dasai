$(document).ready(function() {
    function getCurrentLanguage() {
        // translate.js의 localStorage 사용과 일치하게 언어 선호도를 매칭합니다.
        var preferredLanguage = localStorage.getItem('preferredLanguage');
        return preferredLanguage === 'ko' ? 'ko' : 'cn';
    }

    var storyDataCache = {
        ko: {},
        cn: {}
    };
    $('.select li').click(function() {
        $('.box').hide();
        $(this).addClass('active').siblings().removeClass('active');
        var isFirstItem = $(this).is(':first-child'); // 첫 번째 항목인지 확인
        var storyIdKo = $(this).data('story-id-ko');
        var storyIdCn = $(this).data('story-id-cn');
        $('#tab_story').show().empty(); 

        // 한국어 버전 데이터 요청
        fetchStoryData(storyIdKo, 'ko', isFirstItem);

        // 중국어 버전 데이터 요청
        fetchStoryData(storyIdCn, 'cn', isFirstItem);
    });

    function fetchStoryData(storyId, preferredLanguage, isFirstItem) {
        var language = getCurrentLanguage(); // 현재 언어 설정을 가져옴
        $.ajax({
            url: `http://15.164.230.127:8080/story/${storyId}/${preferredLanguage}`,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                // 가져온 데이터를 언어별로 캐싱
                storyDataCache[preferredLanguage][storyId] = data;
                console.log(preferredLanguage + " version:", data);
    
                // 현재 언어 설정에 맞는 데이터만 화면에 표시
                if (preferredLanguage === getCurrentLanguage()) {
                    displayStory(data, isFirstItem); // isFirstItem 인자 추가
                }
            },
            error: function(error) {
                console.error('Error fetching story data:', error);
            }
        });
    }

    function displayStory(data, isFirstItem) {
        var tabContent = $('#tab_story'); // 스토리 내용이 추가되는 컨테이너
        let totalDelay = 0;
        let delayIncrement = isFirstItem ? 3000 : 2000;

        console.log("현재 지연 시간 증가량:", delayIncrement);
    
        data.forEach((item, arrayIndex) => {
            item.storyImagesUrl.forEach((imageUrl, index) => {
                setTimeout(() => {
                    const image = $(`<div class="story-item"><div class="story_img"><img src="${imageUrl}" alt="story image"></div></div>`);
                    tabContent.append(image);
                    // 이미지 추가 후 스크롤 조정
                    adjustScrollWithinContainerSmoothly(tabContent, 50);
                }, totalDelay);
                totalDelay += delayIncrement; // 다음 이미지를 위한 지연 시간
            });

            
            item.storyContents.forEach((content, contentIndex) => {
                setTimeout(() => {
                    let messageClass = arrayIndex === 0 && contentIndex === 0 ? 'wen' : 'da';
                    const message = $(`<p class="${messageClass}">${content}</p>`);
                    tabContent.append(message);
                    // 메시지 추가 후 스크롤 조정
                    adjustScrollWithinContainerSmoothly(tabContent, 50);
                }, totalDelay);
                totalDelay += delayIncrement; // 다음 메시지를 위한 지연 시간
            });
        });
    }

    window.loadStoryInNewLanguage = function(language) {
        var activeStoryId = $('.select li.active').attr('id'); // 현재 활성화된 스토리의 ID를 가져옵니다.
        if(activeStoryId) {
            $('#' + activeStoryId).click(); // 언어 변경 후, 해당 스토리를 자동으로 다시 클릭(로드)합니다.
        }
    };
    
    function adjustScrollWithinContainerSmoothly(container, additionalPadding) {
        var totalHeight = container.prop("scrollHeight");
        var desiredScrollPosition = totalHeight + additionalPadding - container.height();
        // animate 메소드를 사용하여 scrollTop 속성을 부드럽게 변경
        container.animate({
            scrollTop: desiredScrollPosition
        }, 500); // 500ms 동안 스크롤 이동
    }
});