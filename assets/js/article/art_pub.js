$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    // 初始化富文本编辑器
    initEditor()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败!')
                };
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render()
            }
        })
    };
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);
    $('#btnChooseImage').on('click', function () {
        console.log(123);
        $('#coverFile').click()
    });
    $('#coverFile').on('change', function (e) {
        var files = e.target.files;
        if (files.length === 0) {
            return
        };
        var newImg = URL.createObjectURL(files[0]);
        $image.cropper('destroy').attr('src', newImg).cropper(options)
    });
    var art_state = '已发布';
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    });
    $('#form-pub').on('click', function (e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append('state', art_state);
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(function (blob) {
            fd.append('cover_img', blob)
        });
        publishArticle(fd)
    });

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!')
                };
                layer.msg('发布文章成功!');
                location.href = '/article/art_list.html'
            }
        })
    }
})