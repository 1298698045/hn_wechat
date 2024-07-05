const host = 'https://oawx.hnca.org.cn'
import {message} from './message';
// 外边的函数，要调取request函数的地方添加async
// async function getOneUrl() {
//     // 显示loading
//     const data  = await request(url1, 'GET', {})
//     // const data  = await request(url2, 'GET', {})
//     // data的数据是resolve的数据
//     // 关闭loading
// }
// let loadingNum = 0;
// export const message = {
//     startLoading: (v = "加载中") => {
//         if (loadingNum == 0) {
//             wx.showLoading({ title: v });
//         }
//         loadingNum++;
//     },
//     endLoading: () => {
//         if (loadingNum > 0) {
//             loadingNum--;
//         }
//         if (loadingNum == 0) {
//             wx.hideLoading();
//         }
//     },
// };
function request(url, method, data, header = {}, loadingOption = { loading: true, v: "加载中" }) {
    // wx.showLoading({
    //     title: '加载中' // 数据请求前loading
    // })
    if (!loadingOption.loading) {

    } else {
        message.startLoading(loadingOption.v);
    }
    if(JSON.stringify(header) == '{}'){
        header = {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
        }
    }
    return new Promise((resolve, reject) => {
        wx.request({
            url: host + url, // 仅为示例，并非真实的接口地址
            method: method,
            data: data,
            header: header,
            success: function (res) {
                // wx.hideLoading()
                message.endLoading();
                resolve(res.data)
            },
            fail: function (res) {
                wx.hideLoading();
                // message.endLoading();
                wx.showModal({
                    content: '服务器出现异常，请稍后尝试',
                    showCancel: false,
                    confirmText: '我知道了',
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
                // reject(false)
            },
            complete: function () {
                wx.hideLoading()
            }
        })
    })
}

function get(obj) {
    return request(obj.url, 'GET', obj.data, obj.header, {}, obj.loadingOption)
}

function post(obj) {
    return request(obj.url, 'POST', obj.data, obj.header)
}

export default {
    request,
    get,
    post,
    host
}