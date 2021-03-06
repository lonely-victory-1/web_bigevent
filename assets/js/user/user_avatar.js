$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);
    $('#btnOpen').click(function () {
        $('#file').click()
    });
    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择照片')
        };
        // 拿到用户选择的照片
        var file = e.target.files[0];
        // 将文件转化为路径
        var imgURL = URL.createObjectURL(file);
        // 初始化裁剪区域
        $image.cropper('destroy').attr('src', imgURL).cropper(options)
    });
    $('#btnUpload').click(function () {

        // 拿到用户裁剪之后的照片
        var dataURL = $image.cropper('getCroppedCanvas', {
            // 创建一个Canvas画布
            width: 100,
            height: 100
        }).toDataURL('image/png');
        // 将Canvas画布上的内容,转化为base64格式的字符串
        // 调用接口,把头像上传 到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败!')
                };
                layer.msg('更换头像成功!')
                window.parent.getUserInfo()
            }
        })
    })
})