$(function () {
  const form = layui.form
  const layer = layui.layer

  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6-12位，且不能出现空格'],
    samePwd: (value) => {
      if (value === $('[name=oldPwd]').val()) {
        return '新密码与旧密码不能相同'
      }
    },
    rePwd: (value) => {
      if (value !== $('[name=newPwd]').val()) {
        return '两次密码输入不一致'
      }
    },
  })

  // 重置密码
  $('.layui-form').on('submit', function (e) {
    // 阻止默认行为
    e.preventDefault()
    // 发送ajax请求 修改密码
    $.ajax({
      url: '/my/updatepwd',
      method: 'POST',
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('更新密码成功！')
        // 重置表单信息
        // 通过[0] 将jQuery对象转换为DOM对象 使用reset()方法进行重置
        $('.layui-form')[0].reset()
        localStorage.removeItem('token')
        window.parent.location.href = '/login.html'
      },
    })
  })
})
