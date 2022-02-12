$(function () {
  const layer = layui.layer
  const form = layui.form
  const laypage = layui.laypage

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    const y = dt.getFullYear()
    const m = padZero(dt.getMonth() + 1)
    const d = padZero(dt.getDate())

    const hh = padZero(dt.getHours())
    const mm = padZero(dt.getMinutes())
    const ss = padZero(dt.getSeconds())

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }

  // 定义补零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 定义查询参数对象
  const paramsInfo = {
    pagenum: 1, // 页码值
    pagesize: 5, // 每页显示的条数
    cate_id: '', // 文章分类的id
    state: '', // 文章发布的状态
  }

  inieArticle()
  inieCate()

  // 初始化文章列表
  function inieArticle() {
    $.ajax({
      url: '/my/article/list',
      method: 'GET',
      data: paramsInfo,
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败')
        }

        // 使用模板引擎渲染页面的数据
        const htmlStr = template('tem-table', res)
        $('tbody').html(htmlStr)

        // 调用渲染分页的方法 将总条数传过去
        renderPage(res.total)
      },
    })
  }

  // 初始化文章类别
  function inieCate() {
    $.ajax({
      url: '/my/article/cates',
      method: 'GET',
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg('获取文章类别失败')
        }

        // 调用模板引擎渲染分类的选项
        const htmlStr = template('tem-cate', res)
        $('#sel_cate').html(htmlStr)

        // 通知 layui 重新渲染表单区域的 UI结构
        form.render()
      },
    })
  }

  // 为筛选按钮绑定 点击事件
  $('#form-search').on('click', function (e) {
    e.preventDefault()

    // 获取表单中选项的值
    const cate_id = $('[name=cate_id]').val()
    const state = $('[name=state]').val()

    paramsInfo.cate_id = cate_id
    paramsInfo.state = state

    // 根据最新的数据 重新渲染表格数据
    inieArticle()
  })

  // 渲染分页
  function renderPage(total) {
    // 调用 laypage.render() 方法渲染分页结构
    laypage.render({
      elem: 'pageBox', // 分页容器的 Id
      count: total, // 总条数
      limit: paramsInfo.pagesize, // 每页显示条数
      curr: paramsInfo.pagenum, // 设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [5, 10, 15, 20],
      // 在分页发生切换时 触发jump回调
      jump: (obj, first) => {
        // 将最新的页码值赋值到 paramsInfo.pagenum 中
        paramsInfo.pagenum = obj.curr
        // 将最新的条数赋值到 paramsInfo.pagesize 中
        paramsInfo.pagesize = obj.limit

        if (!first) {
          inieArticle()
        }
      },
    })
  }

  // 通过代理 为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-del', function () {
    // 获取删除按钮的个数
    let delNum = $('.btn-del').length
    console.log(delNum)
    // 获取文章的 id值
    const id = $(this).attr('data-id')
    layer.confirm('确认要删除该文章？', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        url: '/my/article/delete/' + id,
        method: 'GET',
        success: (res) => {
          if (res.status !== 0) {
            return layer.msg('删除文章失败')
          }

          layer.msg('删除文章成功')

          // 当数据删除完成后 判断当前页是否还有剩余的数据
          // 没有数据后 就让当前页码值-1
          if (delNum === 1) {
            // 如果delNum等于1，证明删除完毕之后 当前页就没有数据了
            // 页码值最小必须是1
            paramsInfo.pagenum = paramsInfo.pagenum === 1 ? 1 : paramsInfo.pagenum - 1
          }

          inieArticle()
        },
      })

      layer.close(index)
    })
  })
})
