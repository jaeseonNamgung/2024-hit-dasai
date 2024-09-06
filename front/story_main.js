
$(document).ready(function() {
    var currentTimeouts = []; // 현재 활성화된 타임아웃을 추적하기 위한 배열이 여기 정의됩니다.


    function getCurrentLanguage() {
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
        var isFirstItem = $(this).is('#story1'); // 첫 번째 항목인지 확인
        var storyId = $(this).data('story-id-' + getCurrentLanguage()); // 현재 언어에 맞는 storyId를 가져옴
        $('#tab_story').show().empty();

        clearStoryDisplay(); // 새 스토리 선택 시 이전 스토리와 타임아웃을 초기화

        fetchStoryData(storyId, getCurrentLanguage(), isFirstItem);
    });

    function fetchStoryData(storyId, preferredLanguage, isFirstItem) {
        var requestLanguage = getCurrentLanguage(); // 요청 시의 언어 설정 저장
        $.ajax({
            url: `http://localhost:8080/story/${storyId}/${preferredLanguage}`,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (requestLanguage !== getCurrentLanguage()) {
                    return; // 요청 시점과 현재 언어가 다르면 처리 중지
                }
                storyDataCache[preferredLanguage][storyId] = data; // 데이터 캐싱

                if (preferredLanguage === getCurrentLanguage()) {
                    displayStory(data, isFirstItem);
                }
                console.log(data);
            },
            error: function(error) {
                console.error('Error fetching story data:', error);
            }
        });
    };

    function displayStory(data, isFirstItem) {
        console.log("displayStory called")
        if (currentTimeouts.length > 0) {
            return; // 이전 타임아웃이 남아있다면, 현재 스토리 출력을 중단
        }

        var tabContent = $('#tab_story');
        let totalDelay = 0;
        let delayIncrement = isFirstItem ? 3000 : 2000;



        data.forEach((item, arrayIndex) => {
            item.storyImagesUrl.forEach((imageUrl, index) => {
                // 타임아웃을 설정하고 해당 ID를 currentTimeouts 배열에 저장
                var timeoutId = setTimeout(() => {
                    const image = $(`<div class="story-item"><div class="story_img"><img src="${imageUrl}" alt="story image"></div></div>`);
                    tabContent.append(image);
                    adjustScrollWithinContainerSmoothly(tabContent, 50);
                }, totalDelay);
                currentTimeouts.push(timeoutId);
                totalDelay += delayIncrement;
                console.log(delayIncrement);
            });



            item.storyContents.forEach((content, contentIndex) => {
                // 타임아웃을 설정하고 해당 ID를 currentTimeouts 배열에 저장
                var timeoutId = setTimeout(() => {
                    let messageClass = arrayIndex === 0 && contentIndex === 0 ? 'wen' : 'da';
                    const message = $(`<p class="${messageClass}">${content}</p>`);
                    tabContent.append(message);
                    adjustScrollWithinContainerSmoothly(tabContent, 50);
                }, totalDelay);
                currentTimeouts.push(timeoutId);
                totalDelay += delayIncrement;
                console.log(delayIncrement);
            });
        });
    }

    function clearStoryDisplay() {
        // 모든 예정된 타임아웃을 취소
        currentTimeouts.forEach(function(timeoutId) {
            clearTimeout(timeoutId);
        });
        currentTimeouts = []; // 배열 초기화

        $('#tab_story').empty(); // 스토리 컨테이너를 비움
    }

    window.loadStoryInNewLanguage = function(language) {
        clearStoryDisplay(); // 언어 변경 시 이전 스토리와 타임아웃을 초기화
        var isFirstItem = $('#story1').hasClass('active');
        $('.select li').each(function() {
            if ($(this).hasClass('active')) {
                var storyId = $(this).data('story-id-' + language); // 현재 선택된 언어에 맞는 storyId를 가져옵니다.
                fetchStoryData(storyId, language, isFirstItem);
                return false; // 반복 중단
            }
        });
    };

    function adjustScrollWithinContainerSmoothly(container, additionalPadding) {
        var totalHeight = container.prop("scrollHeight");
        var desiredScrollPosition = totalHeight + additionalPadding - container.height();
        container.animate({
            scrollTop: desiredScrollPosition
        }, 500);
    };
})

