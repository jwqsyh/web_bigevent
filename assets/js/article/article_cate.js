$(function () {
  const layer = layui.layer
  const form = layui.form

  initArticle()

  // 获取文章类别信息
  function initArticle() {
    $.ajax({
      url: '/my/article/cates',
      method: 'GET',
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg('获取文章类别失败')
        }
        const htmlStr = template('tem_table', res)
        $('tbody').html(htmlStr)
      },
    })
  }
  // 给添加类别绑定点击事件
  let indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '添加文章类别',
      content: $('#dialog-add').html(),
    })
  })

  // 通过代理的方式为 form-add表单绑定 submit事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      url: '/my/article/addcates',
      method: 'POST',
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg('添加类别失败')
        }

        initArticle()
        layer.msg('添加类别成功')
        // 根据索引 关闭对应的弹出层
        layer.close(indexAdd)
      },
    })
  })

  // 通过代理的形式 为btn-edit按钮绑定点击事件
  let indexEdit = null
  $('tbody').on('click', '#btn-edit', function () {
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '编辑文章类别',
      content: $('#dialog-edit').html(),
    })

    const id = $(this).attr('data-id')
    $.ajax({
      url: '/my/article/cates/' + id,
      method: 'GET',
      success: (res) => {
        form.val('form-edit', res.data)
      },
    })
  })

  // 通过代理为 form-edit 绑定提交事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      url: '/my/article/updatecate',
      method: 'POST',
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg('编辑文章类别失败！')
        }
        layer.msg('编辑文章类别成功')
        layer.close(indexEdit)
        initArticle()
      },
    })
  })

  // 通过代理为 btn-del 绑定点击事件
  $('tbody').on('click', '#btn-del', function () {
    const id = $(this).attr('data-id')
    layer.confirm('确认要删除该类别吗？', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        url: '/my/article/deletecate/' + id,
        method: 'GET',
        success: (res) => {
          if (res.status !== 0) {
            return layer.msg('删除该类别失败')
          }
          layer.msg('删除该类别成功')
          layer.close(index)

          initArticle()
        },
      })
    })
  })
})
