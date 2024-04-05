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
        // var storyId = $(this).attr('data-alt').replace('tab', '');
        var storyIdKo = $(this).data('story-id-ko');
        var storyIdCn = $(this).data('story-id-cn');
        $('#tab_story').show().empty(); 

        // fetchStoryData(storyId);
        // 한국어 버전 데이터 요청
        fetchStoryData(storyIdKo, 'ko');

        // 중국어 버전 데이터 요청
        fetchStoryData(storyIdCn, 'cn');
    });

    function fetchStoryData(storyId, preferredLanguage) {
        // var language = getCurrentLanguage(); // 현재 언어 설정을 가져옴
        $.ajax({
            url: `http://15.164.230.127:8080/story/${storyId}/${preferredLanguage}`,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                // 받아온 데이터를 캐시에 저장
                storyDataCache[preferredLanguage][storyId] = data;
                console.log(preferredLanguage + " version:", data);
    
                // 현재 언어 설정에 맞는 데이터만 화면에 표시
                if (preferredLanguage === getCurrentLanguage()) {
                    displayStory(data);
                }
            },
            error: function(error) {
                console.error('Error fetching story data:', error);
            }
        });
    }

    var isDisplayingStory = false;
    // function delay(ms) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    // }

    async function displayStory(data) {
        // displayStory 시작 시점에서 isDisplayingStory를 true로 설정합니다.
        isDisplayingStory = true;
        var tabContent = $('#tab_story');
        
        for (let arrayIndex = 0; arrayIndex < data.length; arrayIndex++) {
            const item = data[arrayIndex];
            for (let contentIndex = 0; contentIndex < item.storyContents.length; contentIndex++) {
                // 각 비동기 작업 시작 전에 isDisplayingStory 상태를 확인합니다.
                const content = item.storyContents[contentIndex];
                if (!isDisplayingStory) return;
                await delay(1000);
                
                // await delay 후에도 한 번 더 확인합니다.
                if (!isDisplayingStory) return;
    
                let messageClass = arrayIndex === 0 && contentIndex === 0 ? 'wen' : 'da';
                const message = $(`<p class="${messageClass}">${content}</p>`);
                tabContent.append(message);
                adjustScrollWithinContainerSmoothly(tabContent, 50);
            }
    
            for (let index = 0; index < item.storyImagesUrl.length; index++) {
                const imageUrl = item.storyImagesUrl[index];
                if (!isDisplayingStory) return;
                await delay(1000);
    
                if (!isDisplayingStory) return;
    
                const image = $(`<div class="story_img"><img src="${imageUrl}" alt="story image" style="width: 400px; height: 400px; float: left; margin-left: 25px; margin-top: 25px;"></div>`);
                tabContent.append(image);
                adjustScrollWithinContainerSmoothly(tabContent, 50);
            }
        }
    }
    
    
    function adjustScrollWithinContainerSmoothly(container, additionalPadding) {
        var totalHeight = container.prop("scrollHeight");
        var desiredScrollPosition = totalHeight + additionalPadding - container.height();
        // animate 메소드를 사용하여 scrollTop 속성을 부드럽게 변경
        container.animate({
            scrollTop: desiredScrollPosition
        }, 500); // 500ms 동안 스크롤 이동
    }

    // 지연 함수
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    window.loadStoryInNewLanguage = function(newLanguage) {
        isDisplayingStory = false;
    
        setTimeout(() => {
            $('#tab_story').empty();
            var activeLi = $('.select li.active');
            if (activeLi.length > 0) {
                var storyId = newLanguage === 'ko' ? activeLi.data('story-id-ko') : activeLi.data('story-id-cn');
                isDisplayingStory = true;
                fetchStoryData(storyId, newLanguage);
            }
        }, 100);
    };
});