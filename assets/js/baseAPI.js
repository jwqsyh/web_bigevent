//  每次调用$.get(), $.post(), $.ajax()前都会先调用 ajaxPrefilter
//  这个函数 在该函数中可以获取给Ajax提供的配置对象

$.ajaxPrefilter(function (options) {
  options.url = 'http://www.liulongbin.top:3007' + options.url

  // 为有权限的接口设置 headers请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || '',
    }
  }

  // 全局挂载 complete 回调函数
  options.complete = (res) => {
    // console.log('执行了complete')
    // console.log(res)
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 清除token
      localStorage.removeItem('token')
      // 跳转到登录页
      location.href = '/login.html'
    }
  }
})
