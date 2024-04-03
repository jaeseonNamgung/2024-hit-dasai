$('.select li').removeClass('active')
$('.select li').click(function(){
  $('.box').hide()
  $(this).addClass('active')
  $(this).siblings().removeClass('active')
  $('.tabs > div').removeClass('active')
  var tab = $(this).attr('data-alt')
  $('#' + tab).addClass('active')  
})