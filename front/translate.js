$(document).ready(function() {
  function updateLanguageAndStyle() {
    var isKorean = $('#swich').is(":checked");
    if(isKorean) {
      // 한국어로 설정 시
      $('[data-ko]').each(function() {
        $(this).text($(this).data('ko'));
      });
      $('[data-ko-placeholder]').each(function() {
        $(this).attr('placeholder', $(this).data('ko-placeholder'));
      });
      // 중국어 폰트 클래스 제거
      $('body').removeClass('noto-serif-sc-regular');
    } else {
      // 중국어로 설정 시
      $('[data-zh]').each(function() {
        $(this).text($(this).data('zh'));
      });
      $('[data-zh-placeholder]').each(function() {
        $(this).attr('placeholder', $(this).data('zh-placeholder'));
      });
      // 중국어 폰트 클래스 추가
      $('body').addClass('noto-serif-sc-regular');
    }
  }

  $('#swich').change(function() {
    updateLanguageAndStyle();
    var language = $(this).is(":checked") ? 'ko' : 'zh';
    localStorage.setItem('preferredLanguage', language);
  });

  // 페이지 로드 시 언어 설정 적용
  loadLanguageSetting();
  
  function loadLanguageSetting() {
    var preferredLanguage = localStorage.getItem('preferredLanguage');
    $('#swich').prop('checked', preferredLanguage === 'ko');
    updateLanguageAndStyle();
  }
});