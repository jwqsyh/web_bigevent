$(function () {
  // 点击 “去注册账号”
  $('#link-login').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  // 点击 “去注册” 账号
  $('#link-reg').on('click', function () {
    $('.reg-box').hide()
    $('.login-box').show()
  })

  // 从layui中获取form对象
  const form = layui.form
  const layer = layui.layer
  // 通过form.verify()函数自定义校验规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6-12位，且不能出现空格'],
    // 校验两次密码是否输入一致
    repwd: (value) => {
      // 获取注册表单中密码框中的值
      let pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码输入不一致，请重新输入'
      }
    },
  })

  // 监听注册事件
  $('#reg-form').on('submit', function (e) {
    // 阻止默认行为
    e.preventDefault()
    // 获取表单信息
    const username = $('#reg-form [name=username]').val()
    const password = $('#reg-form [name=password]').val()

    //发送Ajax POST请求 注册账户
    $.post(
      '/api/reguser',
      {
        username: username,
        password: password,
      },
      function (res) {
        if (res.status !== 0) {
          // return console.log(res.message)
          return layer.msg(res.message)
        }
        // console.log('注册成功')
        layer.msg('注册成功')
        // 注册成功后 跳到登录界面
        $('#link-reg').click()
      }
    )
  })

  // 监听登录事件
  $('#login-form').on('submit', function (e) {
    // 阻止默认行为
    e.preventDefault()

    // 发起Ajax POST请求 登录
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // 将得到的token存储到localStorage中
        localStorage.setItem('token', res.token)
        // 跳转到后台首页
        location.href = '/index.html'
      },
    })
  })
})
