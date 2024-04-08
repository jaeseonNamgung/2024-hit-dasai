var nameMappingCN = {
    sunwukong: '孙悟空',
    samjang: '唐僧',
    shawujing: '沙悟净',
    zhubajie: '猪八戒',
    bailongma: '白龙马'
};
var nameMappingToCN = {
    손오공: '孙悟空',
    삼장법사: '唐僧',
    사오정: '沙悟净',
    저팔계: '猪八戒',
    백룡마: '白龙马'
};
var nameMappingKO = {
    sunwukong: '손오공',
    samjang: '삼장법사',
    shawujing: '사오정',
    zhubajie: '저팔계',
    bailongma: '백룡마'
};
var nameMappingToKO = {
    孙悟空: '손오공',
    唐僧: '삼장법사',
    沙悟净: '사오정',
    猪八戒: '저팔계',
    白龙马: '백룡마'
};
var imageMapping = {
    sunwukong: 'images/손.png',
    samjang: 'images/삼.png',
    shawujing: 'images/사.png',
    zhubajie: 'images/저.png',
    bailongma: 'images/.png', //추가해야 해요
    서유기: 'images/.png' //추가해야 해요
};

function characterResult(){
    var Characters = JSON.parse(localStorage.getItem('Characters'));
    console.log("캐릭터 결과" + Characters)

    console.log(Characters); //데이터 잘 넘겨왔나 확인
  
    if (!Characters) {
        Characters = []; 
    }

    var characterCounts = Characters.reduce((acc, character) => {
        acc[character] = (acc[character] || 0) + 1;
        return acc;
    }, {});

    // 출현 빈도가 높은 순으로 정렬
    var sortedCharacters = Object.entries(characterCounts).sort((a, b) => b[1] - a[1]);
    var highestFrequency = sortedCharacters[0][1];

    // 가장 높은 빈도를 가진 캐릭터가 여러 개인지 확인
    var mostFrequentCharacters = sortedCharacters.filter(character => character[1] === highestFrequency);
    var preferredLanguage = localStorage.getItem('preferredLanguage');
    var resultText, imagePath;
    if (preferredLanguage === 'cn') {
        // 중국어 선택 시 사용할 텍스트와 이미지 경로
        if (mostFrequentCharacters.length > 1) {
            resultText = "西游记大师"; // 중국어로 "서유기 마스터"
            imagePath = imageMapping['西游记']; // 중국어 동률인 경우 사용할 이미지
        } else {
            var characterKey = mostFrequentCharacters[0][0]; // 가장 많이 나온 캐릭터의 키
            resultText = mostFrequentCharacters.length > 0 ? nameMappingCN[characterKey] + "专家" : "无结果"; // 중국어로 "전문가", "결과 없음"
            imagePath = mostFrequentCharacters.length > 0 ? imageMapping[characterKey] : ""; // 해당 캐릭터의 이미지 경로
        }
    } else if(preferredLanguage === 'ko'){
        // 기존 로직(한국어 또는 기타 언어)
        if (mostFrequentCharacters.length > 1) {
            resultText = "서유기 마스터";
            imagePath = imageMapping['서유기']; // 동률인 경우 사용할 이미지
        } else {
            var characterKey = mostFrequentCharacters[0][0]; // 가장 많이 나온 캐릭터의 키
            resultText = mostFrequentCharacters.length > 0 ? nameMappingKO[characterKey] + " 전문가" : "결과 없음";
            imagePath = mostFrequentCharacters.length > 0 ? imageMapping[characterKey] : ""; // 해당 캐릭터의 이미지 경로
        }
    }

    // HTML 업데이트
    if (preferredLanguage === 'cn') {
        document.querySelector(".type").textContent = "你是" + resultText + "！";
    } else if(preferredLanguage === 'ko') {
        // 기존 한국어 또는 다른 언어 처리 로직
        document.querySelector(".type").textContent = "당신은 " + resultText + "입니다!";
    }
    
    if (imagePath) {
        document.querySelector(".character_image").setAttribute('src', imagePath);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    var rankingTopFive = JSON.parse(localStorage.getItem('rankingTopFive')) || [];
    var nickname = localStorage.getItem('currentNickname');
    var userRanking = JSON.parse(localStorage.getItem('userRanking')); // 현재 사용자의 순위 정보
    var isInTopFive = false;
    var userRankIndex = -1; // 사용자가 상위 5위 안에 있을 경우 그 위치를 저장
    var preferredLanguage = localStorage.getItem('preferredLanguage'); // 언어 설정 가져오기


    console.log("preferredLanguage", preferredLanguage);
    // 상위 5위 순위 표시 로직 및 사용자 위치 확인
    rankingTopFive.forEach(function(rank, index) {
        var rankElement = document.querySelector('.rank' + (index + 1));
        if (rankElement) {
            rankElement.querySelector('h1').textContent = index + 1; // 등수 표시
            rankElement.querySelector('.rank_name').textContent = rank.nickName; // 닉네임
            // 캐릭터 타입을 현재 언어 설정에 맞게 변환하여 표시
            if (rank.nickName === nickname) {
                isInTopFive = true;
                userRankIndex = index + 1; // 사용자의 순위 저장
                // 사용자가 상위 5위 안에 있을 경우, 해당 순위 요소에 특별한 스타일 적용
                rankElement.style.border = '2px solid #8d2b2b';
            }
            var typesText = rank.characters.map(function(character) {
                var characterName = character; // 기본값 설정
                if (preferredLanguage === 'cn') {
                    console.log('Mapping to CN for', character); // 중국어 매핑 로그
                    characterName = nameMappingToCN[character] || character;
                } else if (preferredLanguage === 'ko') {
                    console.log('Mapping to KO for', character); // 한국어 매핑 로그
                    characterName = nameMappingToKO[character] || character;
                }
                return characterName;
            }).join(', ');

            rankElement.querySelector('.types').textContent = typesText;
        }
    });

    let rank6Element = document.querySelector('.rank6'); // rank6 요소 선택

// 사용자가 상위 5위 안에 없고, userRanking 정보가 있는 경우
if (!isInTopFive && userRanking && userRanking.rankingCount) {
    rank6Element.style.display = 'flex'; // rank6 표시
    rank6Element.querySelector('h1').textContent = userRanking.rankingCount; // 사용자 순위
    rank6Element.querySelector('.rank_name').textContent = nickname; // 사용자 닉네임

    // 캐릭터 타입을 현재 언어 설정에 맞게 변환하여 표시
    var typesTextRank6 = userRanking.characters.map(function(character) {
        var characterName = character; // 기본값 설정
        if (preferredLanguage === 'cn') {
            console.log('Mapping to CN for rank6', character); // 중국어 매핑 로그
            characterName = nameMappingCN[character] || character;
        } else if (preferredLanguage === 'ko') {
            console.log('Mapping to KO for rank6', character); // 한국어 매핑 로그
            characterName = nameMappingKO[character] || character;
        }
        return characterName;
    }).join(', ');

    rank6Element.querySelector('.types').textContent = typesTextRank6;
} else {
    rank6Element.style.display = 'none'; // 사용자가 상위 5위 안에 있으면 rank6 숨김
}
});



$(document).ready(function() {
    loadComments(currentPage);
    setupPagination();
    characterResult();
    var userId = localStorage.getItem('currentUserId'); // userId 불러오기
    var Characters = JSON.parse(localStorage.getItem('Characters'));

    function applyFontStyle() {
        var language = localStorage.getItem('preferredLanguage');
        
        if(language === 'ko') {
            $('[data-ko]').each(function() {
                $(this).text($(this).data('ko'));
              });
              // 한국어 placeholder 설정
              $('[data-ko-placeholder]').each(function() {
                $(this).attr('placeholder', $(this).data('ko-placeholder'));
              });
              $('body').removeClass('noto-serif-sc-regular');
              $('body').attr('data-current-lang', 'ko');
        } else if(language === 'cn') {
            $('[data-cn]').each(function() {
                $(this).text($(this).data('cn'));
              });
              // 중국어 placeholder 설정
              $('[data-cn-placeholder]').each(function() {
                $(this).attr('placeholder', $(this).data('cn-placeholder'));
              });
              $('body').addClass('noto-serif-sc-regular');
        }
    }

    applyFontStyle();

    // "남기기" 버튼 클릭 이벤트 리스너
    $('.push').click(function() {
        // 사용자 입력 코멘트와 userId 가져오기
        var comment = $('#user_ment').val().trim();
        
        // 입력값 검증
        if (!comment) {
            alert('코멘트를 입력해주세요.');
            return;
        }

        var commentData = { comment: comment };
        // AJAX를 사용하여 서버에 POST 요청 보내기
        $.ajax({
            url: `http://15.164.230.127:8080/comment/${userId}`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(commentData),
            success: function(response) {
                // 서버 응답 처리
                alert('코멘트가 성공적으로 전송되었습니다.');
                $('#user_ment').val(''); // 입력 필드 초기화
                currentPage = 0; // 최신 댓글을 포함하여 첫 페이지를 다시 로드
                loadComments(currentPage);
            },
            error: function(xhr, status, error) {
                // 요청 실패 시 처리
                console.error("서버 응답 에러:", error);
                alert('코멘트 전송에 실패했습니다.');
            }
        });
    });

    var currentPage = 0; // 현재 페이지 번호, 0부터 시작
    
    function loadComments(page) {
        var size =  5 // 페이지 크기 (0 페이지에 받아올 content 수)

        $.ajax({
            // 페이지 값 전달 시 이렇게 전달하면 됩니다!
            url: `http://15.164.230.127:8080/comment?`+'page='+page+'&'+'size='+size,
            type: 'GET',
            success: function(response) {
                // 기존 댓글 목록을 비우기
                $(".reviews .users").empty();
                // 받은 댓글 데이터로부터 HTML 생성 및 추가
                response.content.forEach(function(comment, index) {
                    if (index < 5) { // 서버에서 더 많은 데이터를 반환하는 경우가 있어도 최대 5개만 표시
                        var commentHtml = `
                            <div class="user_list">
                                <p class="user_name"><i class="fa-solid fa-user"></i> ${comment.nickName} :</p>
                                <p class="ment">${comment.content}</p>
                                <a href="#"><i class="fa-solid fa-retweet"></i></a>
                            </div>`;
                        $(".reviews .users").append(commentHtml);
                    }
                });
            },
            error: function(xhr, status, error) {
                console.error("댓글 로딩 중 에러 발생", xhr, status, error);
            }
        });
    }

    function setupPagination() {
        var maxPages = 5; // 최대 페이지 수를 5로 설정
    
        $('.page-num').on('click', function() {
            var pageNum = $(this).text(); // 클릭된 페이지 번호 가져오기
            currentPage = parseInt(pageNum, 10) - 1; // 페이지 번호는 1부터 시작하지만, 인덱스는 0부터 시작
            loadComments(currentPage);
        });
    
        $('#prevPage').on('click', function() {
            if (currentPage > 0) {
                currentPage--;
                loadComments(currentPage);
            }
        });
    
        $('#nextPage').on('click', function() {
            if (currentPage < maxPages - 1) { // 최대 페이지 수를 초과하지 않도록 체크
                currentPage++;
                loadComments(currentPage);
            }
        });
    }

    $('.reviews').on('click', '.fa-retweet', function(event) {
        event.preventDefault(); // 기본 동작 방지
        console.log("번역 단추 클릭 실행");

        var that = this; // 클릭된 요소를 'that' 변수에 저장

        var comment = $(this).closest('.user_list').find('p.ment').text();
        console.log(comment); // 가져온 텍스트를 콘솔에 출력

        // AJAX 요청
        $.ajax({
            url: `http://15.164.230.127:8080/comment/translate`, // 요청을 보낼 서버의 URL 주소
            type: 'POST', // HTTP 요청 방식
            contentType: 'application/json', // 서버로 보낼 데이터의 MIME 타입
            data: JSON.stringify({ comment: comment}), // 서버로 보낼 데이터. comment 객체를 JSON 문자열로 변환
            success: function(response) {
                console.log(response);
                console.log(response.content);
                // 요청이 성공했을 때 실행할 함수.
                $(that).closest('.user_list').find('.ment').text(response.content);
            alert('번역 성공: ' + response.content);
            },
            error: function(xhr, status, error) {
                // 요청이 실패했을 때 실행할 함수
                alert('번역 실패: ' + error); // 실패 원인을 알림으로 표시
            }
        });
    });

});