const getOpenFiles = function(item, openImgs) {
    let imgs = JSON.parse(openImgs);
    let url = item.link;
    if (item.fileExtension == 'docx' || item.fileExtension == 'doc' || item.fileExtension == 'word' || item.fileExtension == 'pdf' || item.fileExtension.indexOf('xls') != -1 || item.fileExtension == 'xlsx'
    || item.fileExtension == '.docx' || item.fileExtension == '.doc' || item.fileExtension == '.word' || item.fileExtension == '.pdf' || item.fileExtension.indexOf('xls') != -1 || item.fileExtension == 'xlsx'
    ) {
        if(item.fileExtension.indexOf('.')!=-1){
            item.fileExtension = item.fileExtension.slice(1,item.fileExtension.length)
        }
        wx.showNavigationBarLoading()
        wx.showLoading({
            title: '加载中...',
        })
        wx.downloadFile({
            url: url,
            fileType: item.fileExtension,
            success(res) {
                debugger
                if (res.statusCode === 200) {
                    var filePath = res.tempFilePath
                }
                wx.openDocument({
                    filePath: filePath,
                    fileType: item.fileExtension,
                    success: function(res) {
                        console.log('打开文档成功')
                        wx.hideLoading()
                        wx.hideNavigationBarLoading()
                    }
                })
            },
            fail:err=>{
                wx.hideLoading()
                wx.hideNavigationBarLoading()
                wx.showToast({
                    title: err,
                    icon: 'error',
                    duration: 2000
                })
            }
        })
    } else if (item.fileExtension.indexOf('jpg') != -1 || item.fileExtension.indexOf('png') != -1 || item.fileExtension.indexOf('webp') != -1) {
        wx.previewImage({
            current: item.link, // 当前显示图片的http链接
            urls: imgs // 需要预览的图片http链接列表
        })
    }
}
export default getOpenFiles;
// module.exports = {
//     openFile: getOpenFiles
// }