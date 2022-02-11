$(function () {
  const form = layui.form
  const layer = layui.layer

  form.verify({
    nickname: (value) => {
      if (value.length > 6) {
        return '昵称长度必须在 1 ~ 6 个字符之间'
      }
    },
  })

  // 调用
  initUserInfo()
  // 初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      url: '/my/userinfo',
      method: 'GET',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败！')
        }
        // 使用form.val()快速为表单赋值
        form.val('formUserInfo', res.data)
      },
    })
  }

  // 重置表单数据
  $('#btnReset').on('click', function (e) {
    // 阻止默认行为
    e.preventDefault()
    initUserInfo()
  })

  // 监听表单的提交事件
  $('.layui-form').on('submit', function (e) {
    // 阻止默认行为
    e.preventDefault()
    // 发起ajax请求 修改用户信息
    $.ajax({
      url: '/my/userinfo',
      method: 'POST',
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！')
        }
        layer.msg('更新用户信息成功！')
        // 调用父页面(index.html)中获取用户信息的方法 重新渲染页面的名称跟头像
        window.parent.getUserInfo()
      },
    })
  })
})
