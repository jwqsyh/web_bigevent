$(function () {
  // 调用getUserInfo() 获取用户基本信息
  getUserInfo()

  const layer = layui.layer

  // 点击退出按钮，实现用户退出
  $('#btnLogOut').on('click', function () {
    // 提示用户是否退出
    layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
      // 清空本地token
      localStorage.removeItem('token')
      // 跳转到登录页面
      location.href = '/login.html'

      // 关闭layer提示框
      layer.close(index)
    })
  })
})

// 获取用户基本信息
function getUserInfo() {
  // 从本地存储中 获取 token信息
  // const token = localStorage.getItem('token')
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // // 请求头的配置对象
    // headers: {
    //   Authorization: token || '',
    // },

    success: (res) => {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败')
      }
      // 调用readerAvatar() 渲染用户信息
      readerAvatar(res.data)
    },

    //  已被全局挂载
    // complete: (res) => {
    //   // console.log('执行了complete')
    //   // console.log(res)
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     // 清除token
    //     localStorage.removeItem('token')
    //     // 跳转到登录页
    //     location.href = '/login.html'
    //   }
    // },
  })
}

function readerAvatar(user) {
  // 有昵称就渲染 没昵称就渲染用户名
  const name = user.nickname || user.username
  // 渲染用户名称
  $('.userinfo #welcome').html(`欢迎&nbsp;&nbsp;${name}`)
  // 渲染用户头像
  if (user.user_pic !== null) {
    // 渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    // 渲染文本头像
    const textname = user.username[0].toUpperCase() // 用户名称首字符大写
    $('.layui-nav-img').hide()
    $('.text-avatar').html(textname).show()
  }
}
