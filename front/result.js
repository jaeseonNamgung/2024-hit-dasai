function characterResult(){
    var Characters = JSON.parse(localStorage.getItem('Characters'));
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
        resultText = mostFrequentCharacters.length > 0 ? nameMapping[characterKey] + " 마스터" : "결과 없음";
        imagePath = mostFrequentCharacters.length > 0 ? imageMapping[characterKey] : ""; // 해당 캐릭터의 이미지 경로
    }

    // HTML 업데이트
    document.querySelector(".type").textContent = "당신은 " + resultText + "입니다!";
    
    if (imagePath) {
        document.querySelector(".character_image").setAttribute('src', imagePath);
    }
}



$(document).ready(function() {
    loadComments();
    characterResult();
    

    // "남기기" 버튼 클릭 이벤트 리스너
    $('.push').click(function() {
        // 사용자 입력 코멘트와 userId 가져오기
        var comment = $('#user_ment').val();
        var userId = localStorage.getItem('currentUserId'); // 이전 단계에서 저장한 userId
        
        // 입력값 검증
        if (!comment.trim()) {
            alert('코멘트를 입력해주세요.');
            return;
        }

        var commentData = { comment: comment };
        // AJAX를 사용하여 서버에 POST 요청 보내기
        $.ajax({
            url: `http://15.164.230.127:8080/comment/${userId}`,
            type: 'POST',
            contentType: 'application/json', // 서버가 JSON 형식의 데이터를 받는다고 가정
            data: JSON.stringify(commentData),
            success: function(response) {
                // 요청 성공 시, 실행될 함수
                console.log("서버 응답:", response);
                // 코멘트 성공적으로 전송되었음을 사용자에게 알림
                alert('코멘트가 성공적으로 전송되었습니다.');
                console.log(comment,userId);
                $('#user_ment').val(''); // 입력 필드 초기화
                response.content.forEach(function(comment) {
                    console.log(comment.content);
                    // var parsedContent = JSON.parse(response.comments.content[0].content); // content 필드의 JSON 문자열을 객체로 파싱
                    var commentHtml = `
                        <div class="user">
                            <p id="user_name"><i class="fa-solid fa-user"></i> ${comment.nickName} :</p>
                            <p id="ment">${comment.content}</p>
                        </div>`;
                    $(".reviews .users").append(commentHtml);
                });
            },
            error: function(xhr, status, error) {
                // 요청 실패 시, 실행될 함수
                console.error("서버 응답 에러:", error);
                // 실패 메시지 표시
                alert('코멘트 전송에 실패했습니다.');
            }
        });
    });


    function loadComments() {

        // 댓글 전체 조회시에는 id 필요없습니다!
        // var userId = localStorage.getItem('currentUserId');

        var page = 0 // 페이지 번호
        var size =  5 // 페이지 크기 (0 페이지에 받아올 content 수)

        $.ajax({
            // 페이지 값 전달 시 이렇게 전달하면 됩니다!
            url: `http://15.164.230.127:8080/comment?`+'page='+page+'&'+'size='+size,
            type: 'GET',
            success: function(response) {
                // 기존 댓글 목록을 비우기
                $(".reviews .users").empty();
                // 받은 댓글 데이터로부터 HTML 생성 및 추가
                response.content.forEach(function(comment) {
                console.log(comment.content); 
                // var parsedContent = JSON.parse(comment.content); // content 필드의 JSON 문자열을 객체로 파싱
                    var commentHtml = `
                        <div class="user">
                            <p id="user_name"><i class="fa-solid fa-user"></i> ${comment.nickName} :</p>
                            <p id="ment">${comment.content}</p>
                        </div>`;
                    $(".reviews .users").append(commentHtml);
                });
            },
            error: function(xhr, status, error) {
                console.error("댓글 로딩 중 에러 발생", xhr, status, error);
            }
        });
    }

});