$(document).ready(function() {
  function updateLanguageAndStyle() {
    var isKorean = $('#swich').is(":checked");
    if(isKorean) {
      // 체크박스가 체크되어 있으면 한국어로 설정
      $('[data-ko]').each(function() {
        $(this).text($(this).data('ko'));
      });
      // 한국어 placeholder 설정
      $('[data-ko-placeholder]').each(function() {
        $(this).attr('placeholder', $(this).data('ko-placeholder'));
      });
      $('body').removeClass('noto-serif-sc-regular');
      $('input').removeClass('noto-serif-sc-regular');
      $('body').css('background-color', '#f3f3f3');//배경 바뀌는 부분
      $('body').css('background', 'none'); 
      // $('body, a').css('color', '#000'); //글자 색
    } else {
      // 체크박스가 해제되어 있으면 기본으로 중국어로 설정
      $('[data-cn]').each(function() {
        $(this).text($(this).data('cn'));
      });
      // 중국어 placeholder 설정
      $('[data-cn-placeholder]').each(function() {
        $(this).attr('placeholder', $(this).data('cn-placeholder'));
      });
      $('body').addClass('noto-serif-sc-regular');
      $('input').addClass('noto-serif-sc-regular');
      $('body').css('background', 'linear-gradient(to top, #862929 30%, #000 100%)');
      // $('body, a').css('color', '#fff'); //글자 색
      // $('.card_wrapper').css('color', '#000'); //예외
    }
  }

  // 언어 설정 불러오기
  function loadLanguageSetting() {
    var preferredLanguage = localStorage.getItem('preferredLanguage');
    if(preferredLanguage === 'ko') {
      $('#swich').prop('checked', true);
    } else {
      $('#swich').prop('checked', false);
    }
    updateLanguageAndStyle();
  }

  // 체크박스 상태 변경 시 언어와 스타일 업데이트 및 저장
  $('#swich').change(function() {
    updateLanguageAndStyle();
    var language = $(this).is(":checked") ? 'ko' : 'cn';
    localStorage.setItem('preferredLanguage', language);

    window.loadStoryInNewLanguage(language); //수정
  });

  // 페이지 로드 시 언어 설정 적용
  loadLanguageSetting();

  function loadLanguageSetting() {
    var preferredLanguage = localStorage.getItem('preferredLanguage');
    $('#swich').prop('checked', preferredLanguage === 'ko');
    updateLanguageAndStyle();
  }
});