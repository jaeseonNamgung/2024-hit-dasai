$(document).ready(function() {

    $("#go_quiz").click(function() {
        var nickname = $("#id").val(); // 'id'는 닉네임 입력 필드의 ID
        if (!nickname) {
            alert("닉네임을 입력해주세요.");
        } else if (nickname.length > 12) {
            alert("닉네임은 12글자 이하여야 합니다.");
        } else {
            fetchQuizData(nickname);
        }
    });

    function fetchQuizData(nickname) {
        console.log("준비 완료");
        // var encodedNickname = encodeURIComponent(nickname); // 닉네임 인코딩
        
        $.ajax({
            url: `http://15.164.230.127:8080/quiz/start/${nickname}/kr`,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log(nickname);
                if(data.length > 0 && data[0].hasOwnProperty('userId')) {
                    localStorage.setItem('currentUserId', data[0].userId.toString());
                }
    
                localStorage.setItem('currentNickname', nickname);
                // 전체 퀴즈 데이터 저장
                localStorage.setItem('quizData'+nickname, JSON.stringify(data));
                console.log(localStorage.getItem('quizData'+nickname));
                console.log(localStorage.getItem('currentUserId'));
                window.location.href = "test_real.html"; // 페이지 이동
            },
            error: function(error) {
                console.log('Error:', error);
            }
        });
    }
});