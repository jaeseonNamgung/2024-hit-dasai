
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
            url: `http://15.164.230.127:8080/story/${storyId}/${preferredLanguage}`,
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

// $(document).ready(function() {
//     function getCurrentLanguage() {
//         var preferredLanguage = localStorage.getItem('preferredLanguage');
//         return preferredLanguage === 'ko' ? 'ko' : 'cn';
//     }

//     var storyDataCache = {
//         ko: {},
//         cn: {}
//     };

//     $('.select li').click(function() {
//         $('.box').hide();
//         $(this).addClass('active').siblings().removeClass('active');
//         var isFirstItem = $(this).is(':first-child'); // 첫 번째 항목인지 확인
//         var storyIdKo = $(this).data('story-id-ko');
//         var storyIdCn = $(this).data('story-id-cn');
//         $('#tab_story').show().empty(); 

//         // 한국어 버전 데이터 요청
//         fetchStoryData(storyIdKo, 'ko', isFirstItem);

//         // 중국어 버전 데이터 요청
//         fetchStoryData(storyIdCn, 'cn', isFirstItem);
//     });

//     function fetchStoryData(storyId, preferredLanguage, isFirstItem) {
//         ; var language = getCurrentLanguage(); // 현재 언어 설정을 가져옴
//         $.ajax({
//             url: `http://15.164.230.127:8080/story/${storyId}/${preferredLanguage}`,
//             type: 'GET',
//             dataType: 'json',
//             success: function(data) {
//                 // 가져온 데이터를 언어별로 캐싱
//                 storyDataCache[preferredLanguage][storyId] = data;
//                 console.log(preferredLanguage + " version:", data);
    
//                 // 현재 언어 설정에 맞는 데이터만 화면에 표시
//                 if (preferredLanguage === getCurrentLanguage()) {
//                     displayStory(data, isFirstItem); // isFirstItem 인자 추가
//                 }
//             },
//             error: function(error) {
//                 console.error('Error fetching story data:', error);
//             }
//         });
//     }

//     function displayStory(data, isFirstItem) {
//         var tabContent = $('#tab_story'); // 스토리 내용이 추가되는 컨테이너
//         let totalDelay = 0;
//         let delayIncrement = isFirstItem ? 3000 : 2000;

//         console.log("현재 지연 시간 증가량:", delayIncrement);

//         data.forEach((item, arrayIndex) => {
//             item.storyContents.forEach((content, contentIndex) => {
//                 setTimeout(() => {
//                     let messageClass = arrayIndex === 0 && contentIndex === 0 ? 'wen' : 'da';
//                     const message = $(`<p class="${messageClass}">${content}</p>`);
//                     tabContent.append(message);
//                     // 메시지 추가 후 스크롤 조정
//                     adjustScrollWithinContainerSmoothly(tabContent, 50);
//                 }, totalDelay);
//                 totalDelay += delayIncrement; // 다음 메시지를 위한 지연 시간
//             });
    
//             item.storyImagesUrl.forEach((imageUrl, index) => {
//                 setTimeout(() => {
//                     const image = $(`<div class="story_img"><img src="${imageUrl}" alt="story image" style="width: 400px; height: 400px; float: left; margin-left: 25px; margin-top: 25px;"></div>`);
//                     tabContent.append(image);
//                     // 이미지 추가 후 스크롤 조정
//                     adjustScrollWithinContainerSmoothly(tabContent, 50);
//                 }, totalDelay);
//                 totalDelay += delayIncrement; // 다음 이미지를 위한 지연 시간
//             });
//         });
//     }

//     window.loadStoryInNewLanguage = function(language) {
//         var activeStoryId = $('.select li.active').attr('id'); // 현재 활성화된 스토리의 ID를 가져옵니다.
//         if(activeStoryId) {
//             $('#' + activeStoryId).click(); // 언어 변경 후, 해당 스토리를 자동으로 다시 클릭(로드)합니다.
//         }
//     };
    
//     function adjustScrollWithinContainerSmoothly(container, additionalPadding) {
//         var totalHeight = container.prop("scrollHeight");
//         var desiredScrollPosition = totalHeight + additionalPadding - container.height();
//         // animate 메소드를 사용하여 scrollTop 속성을 부드럽게 변경
//         container.animate({
//             scrollTop: desiredScrollPosition
//         }, 500); // 500ms 동안 스크롤 이동
//     }
// });