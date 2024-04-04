$(document).ready(function() {
  function getCurrentLanguage() {
    // 체크박스가 체크되어 있으면 'kr', 그렇지 않으면 'zh' 반환
    return $('.btn input[type="checkbox"]').is(":checked") ? 'kr' : 'cn';
  }

  var language = getCurrentLanguage(); 


    $('.select li').click(function() {
        $('.box').hide();
        $(this).addClass('active').siblings().removeClass('active');
        var storyId = $(this).attr('data-alt').replace('tab', '');

        $('#tab_story').show().empty(); 

        fetchStoryData(storyId);
    });

    function fetchStoryData(storyId) {
        var currentLanguage = getCurrentLanguage(); // 현재 언어 설정을 가져옴
        $.ajax({
            url: `http://15.164.230.127:8080/story/${storyId}/${currentLanguage}`,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log(data);
                console.log(language);
                displayStory(data);
            },
            error: function(error) {
                console.error('Error fetching story data:', error);
            }
        });
    }

    function displayStory(data) {
        var tabContent = $('#tab_story'); // 스토리 내용이 추가되는 컨테이너
        let totalDelay = 0;
    
        data.forEach((item, arrayIndex) => {
            item.storyContents.forEach((content, contentIndex) => {
                setTimeout(() => {
                    let messageClass = arrayIndex === 0 && contentIndex === 0 ? 'wen' : 'da';
                    const message = $(`<p class="${messageClass}">${content}</p>`);
                    tabContent.append(message);
                    // 메시지 추가 후 스크롤 조정
                    adjustScrollWithinContainerSmoothly(tabContent, 50);
                }, totalDelay);
                totalDelay += 2000; // 다음 메시지를 위한 지연 시간
            });
    
            item.storyImagesUrl.forEach((imageUrl, index) => {
                setTimeout(() => {
                    const image = $(`<div class="story_img"><img src="${imageUrl}" alt="story image" style="width: 400px; height: 400px; float: left; margin-left: 25px; margin-top: 25px;"></div>`);
                    tabContent.append(image);
                    // 이미지 추가 후 스크롤 조정
                    adjustScrollWithinContainerSmoothly(tabContent, 50);
                }, totalDelay);
                totalDelay += 2000; // 다음 이미지를 위한 지연 시간
            });
        });
    }
    
    function adjustScrollWithinContainerSmoothly(container, additionalPadding) {
        var totalHeight = container.prop("scrollHeight");
        var desiredScrollPosition = totalHeight + additionalPadding - container.height();
        // animate 메소드를 사용하여 scrollTop 속성을 부드럽게 변경
        container.animate({
            scrollTop: desiredScrollPosition
        }, 500); // 500ms 동안 스크롤 이동
    }
});