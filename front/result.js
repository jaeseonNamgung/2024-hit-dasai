function characterResult(){
    var Characters = JSON.parse(localStorage.getItem('Characters'));
    console.log("캐릭터 결과" + Characters)
    var nameMapping = {
        sunwukong: '손오공',
        samjang: '삼장법사',
        shawujing: '사오정',
        zhubajie: '저팔계'
    };
    var imageMapping = {
        sunwukong: 'images/손.png',
        samjang: 'images/삼.png',
        shawujing: 'images/사.png',
        zhubajie: 'images/저.png',
        서유기: 'images/.png' // 동률인 경우 표시할 이미지
    };

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

    var resultText, imagePath;
    if (mostFrequentCharacters.length > 1) {
        resultText = "서유기 마스터";
        imagePath = imageMapping['서유기']; // 동률인 경우 사용할 이미지
    } else {
        var characterKey = mostFrequentCharacters[0][0]; // 가장 많이 나온 캐릭터의 키
        resultText = mostFrequentCharacters.length > 0 ? nameMapping[characterKey] + " 전문가" : "결과 없음";
        imagePath = mostFrequentCharacters.length > 0 ? imageMapping[characterKey] : ""; // 해당 캐릭터의 이미지 경로
    }

    // HTML 업데이트
    document.querySelector(".type").textContent = "당신은 " + resultText + "입니다!";
    
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

    // 상위 5위 순위 표시 로직 및 사용자 위치 확인
    rankingTopFive.forEach(function(rank, index) {
        var rankElement = document.querySelector('.rank' + (index + 1));
        if (rankElement) {
            rankElement.querySelector('h1').textContent = index + 1; // 등수 표시
            rankElement.querySelector('.rank_name').textContent = rank.nickName; // 닉네임
            rankElement.querySelector('.types').textContent = rank.characters.join(', '); // 캐릭터 타입

            // 현재 순위의 닉네임이 사용자의 닉네임과 일치하는지 확인
            if (rank.nickName === nickname) {
                isInTopFive = true;
                userRankIndex = index + 1; // 사용자의 순위 저장
                // 사용자가 상위 5위 안에 있을 경우, 해당 순위 요소에 특별한 스타일 적용
                rankElement.style.border = '2px solid #f86551';
            }
        }
    });

    let rank6Element = document.querySelector('.rank6'); // rank6 요소 선택

    // 사용자가 상위 5위 안에 없고, userRanking 정보가 있는 경우
    if (!isInTopFive && userRanking && userRanking.rankingCount) {
        rank6Element.style.display = 'flex'; // rank6 표시
        rank6Element.querySelector('h1').textContent = userRanking.rankingCount; // 사용자 순위
        rank6Element.querySelector('.rank_name').textContent = nickname; // 사용자 닉네임
        rank6Element.querySelector('.types').textContent = userRanking.characters.join(', '); // 사용자 캐릭터 타입
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
                            <div class="user">
                                <p id="user_name"><i class="fa-solid fa-user"></i> ${comment.nickName} :</p>
                                <p id="ment">${comment.content}</p>
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

});