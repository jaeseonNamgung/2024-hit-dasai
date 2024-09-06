$(document).ready(function () {
  // 저장된 닉네임 로드
  var nickname = localStorage.getItem("currentNickname");
  // 닉네임을 기반으로 퀴즈 데이터 로드
  var userId = localStorage.getItem("currentUserId"); // userId 불러오기
  var quizData = JSON.parse(localStorage.getItem("quizData" + nickname));
  var currentQuizIndex = 0;
  var score = 0;
  var correctCharacterTypes = []; // 맞춘 문제의 캐릭터 유형을 저장할 배열

  function getCurrentLanguage() {
    // translate.js의 localStorage 사용과 일치하게 언어 선호도를 매칭합니다.
    var preferredLanguage = localStorage.getItem("preferredLanguage");
    return preferredLanguage === "ko" ? "ko" : "cn";
  }

  function applyFontStyle() {
    var language = getCurrentLanguage();
    console.log("문제 푸는 과정에서의 언어", language);
    if (language === "ko") {
      $("body").removeClass("noto-serif-sc-regular");
    } else if (language === "cn") {
      $("body").addClass("noto-serif-sc-regular");
    }
  }

  applyFontStyle();

  function displayQuiz() {
    if (currentQuizIndex < quizData.length) {
      var currentQuiz = quizData[currentQuizIndex];

      // 문제와 옵션 업데이트
      $(".number").text("Q" + (currentQuizIndex + 1));
      $(".question").text(currentQuiz.quizContent);
      $(".answer div").each(function (index) {
        $(this).find('input[type="radio"]').prop("checked", false);
        $(this).find(".radio_label").text(currentQuiz.options[index]);
      });

      // 답변 확인 섹션 숨기기 및 문제 섹션 표시
      $(".an").hide();
      $("main").show();

      // 마지막 문제이면 버튼의 텍스트와 이벤트 변경
      if (currentQuizIndex === quizData.length - 1) {
        $("#next_btn")
          .text("결과 보러 가기")
          .off("click")
          .on("click", function () {
            displayResults(); // 결과 표시 함수 호출
          });
      } else {
        // 마지막 문제가 아니면 기본 텍스트와 이벤트 유지
        $("#next_btn")
          .text("다음 문제")
          .off("click")
          .on("click", function () {
            currentQuizIndex++;
            displayQuiz();
          });
      }
    } else {
      // 모든 퀴즈 완료 시 결과 표시
      displayResults();
    }
  }

  function checkAnswer() {
    var selectedAnswer = $('input[name="answer_1"]:checked').val();
    var correctAnswer = 5;

    if (selectedAnswer === correctAnswer) {
      score++;
      $(".ox").text("O");
      correctCharacterTypes.push(quizData[currentQuizIndex].characterType);
    } else {
      $(".ox").text("X");
    }
    $(".content p").html(quizData[currentQuizIndex].answerDescription);

    // 답변 확인 섹션 표시 및 문제 섹션 숨기기
    $("main").hide();
    $(".an").show();
  }

  function sendQuizResults() {
    var Characters = correctCharacterTypes;
    var language = getCurrentLanguage();
    $.ajax({
      url: `http://localhost:8080/quiz/result/${userId}`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(Characters),
      success: function (response) {
        console.log("AJAX 요청 성공. 응답 데이터:", response);
        var rankingTopFive = response.rankingTopFive;
        var userRanking = response.userRanking;
        console.log(
          "localStorage에 저장하기 전 rankingTopFive:",
          rankingTopFive
        );
        localStorage.setItem("Characters", JSON.stringify(Characters));
        localStorage.setItem("rankingTopFive", JSON.stringify(rankingTopFive));
        localStorage.setItem("userRanking", JSON.stringify(userRanking));
        localStorage.setItem("preferredLanguage", language);

        // 페이지 이동 전 확인 로그
        console.log(rankingTopFive);
        window.location.href = "result.html";
      },
      error: function (xhr, status, error) {
        console.error("결과 전송 실패:", error);
      },
    });
  }

  function displayResults() {
    sendQuizResults(); // 서버에 결과 데이터 전송
  }

  // 옵션 선택 시 정답 확인
  $('.answer input[type="radio"]').on("change", function () {
    checkAnswer();
  });

  // 첫 번째 문제 표시
  displayQuiz();
});
