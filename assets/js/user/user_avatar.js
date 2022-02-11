$(function () {
  const layer = layui.layer

  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview',
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 为上传按钮绑定点击事件
  $('#btnChooseImg').on('click', function () {
    $('#file').click()
  })

  // 根据选择图片 替换裁剪区域的图片
  // 为文件选择绑定 change 事件
  $('#file').on('change', function (e) {
    // 获取用户选择的文件
    let file = e.target.files
    if (file.length === 0) {
      return layer.msg('请选择一张图片')
    }

    // 将文件转化为路径
    let imgURL = URL.createObjectURL(file[0])
    // 重新初始化裁剪区域
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 将选择的头像上传至服务器
  // 为确定按钮 绑定点击事件
  $('#btnUpload').on('click', function () {
    // 获取裁剪之后的头像
    var dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
      .toDataURL('image/png')

    // 调用接口
    $.ajax({
      url: '/my/update/avatar',
      method: 'POST',
      data: {
        avatar: dataURL,
      },
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg('更换头像失败！')
        }
        layer.msg('更换头像成功！')
        window.parent.getUserInfo()
      },
    })
  })
})
