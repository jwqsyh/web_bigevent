//  每次调用$.get(), $.post(), $.ajax()前都会先调用 ajaxPrefilter
//  这个函数 在该函数中可以获取给Ajax提供的配置对象

$.ajaxPrefilter(function (options) {
  options.url = 'http://www.liulongbin.top:3007' + options.url
  console.log(options.url)
})
