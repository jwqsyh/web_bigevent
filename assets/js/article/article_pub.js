$(function () {
  const layer = layui.layer
  const form = layui.form

  initCate()
  // 初始化富文本编辑器
  initEditor()

  // 加载文章类别
  function initCate() {
    $.ajax({
      url: '/my/article/cates',
      method: 'GET',
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg('获取文章类别失败')
        }
        const htmlStr = template('tem_cate', res)
        $('[name=cate_id]').html(htmlStr)

        form.render()
      },
    })
  }

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview',
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 为选择封面按钮绑定点击事件
  $('#btnChooseImg').on('click', function () {
    $('#coverImg').click()
  })

  // 监听 coverImg 的change事件 获取文件的选择列表
  $('#coverImg').on('change', function (e) {
    // 获取文件列表数组
    const files = e.target.files
    // 判断是否选择文件
    if (files.length === 0) {
      return
    }
    // 根据文件 创建对应的url地址
    const ImgUrl = URL.createObjectURL(files[0])
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', ImgUrl) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 定义文章的发布状态
  let art_state = '已发布'

  // 为存为草稿按钮绑定点击事件 并将art_state重新赋值为 “草稿”
  $('#btnDraft').on('click', function () {
    art_state = '草稿'
  })

  // 为表单绑定submit事件
  $('#form-pub').on('submit', function (e) {
    e.preventDefault()

    // 基于form表单 快速创建一个 FormData 对象
    const formData = new FormData($(this)[0])
    // 将文章的发布状态 存到formData中
    formData.append('state', art_state)

    // 将封面裁剪后的图片 输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作

        // 将文件对象 存储到formData中
        formData.append('cover_img', blob)

        // 发起 ajax 请求 发布文章
        publishArticle(formData)
      })
  })

  function publishArticle(formData) {
    $.ajax({
      url: '/my/article/add',
      method: 'POST',
      data: formData,
      // 向服务器提交 FormData 格式的数据 必须要配置两个配置项
      contentType: false,
      processData: false,
      success: (res) => {
        console.log(res)
        if (res.status !== 0) {
          return layer.msg('发布文章失败')
        }
        layer.msg('发布文章失败')
        // 发布成功 跳转到文章列表页面
        location.href = '/article/art_list.html'
      },
    })
  }
})
