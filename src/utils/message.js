let loadingNum = 0;
export const message = {
    startLoading: (v = "加载中") => {
        wx.showLoading({ title: v });
        loadingNum++;
    },
    endLoading: () => {
        if (loadingNum > 0) {
            loadingNum--;
        }
        if (loadingNum == 0) {
            wx.hideLoading();
        }
    },
    toast: (
        toastOption = {},
    ) => {
        let duration, icon, success, fail, delta, deltaTime;
        // 设置默认值
        delta = toastOption.delta || 0;
        icon = toastOption.icon || "none";
        success = toastOption.success;
        fail = toastOption.fail;
        duration = toastOption.duration || 3000;
        deltaTime = toastOption.deltaTime || 2;
        const navigateBack = () => {
            if (delta && delta > 0) {
                setTimeout(() => {
                    wx.navigateBack({ delta: delta });
                }, deltaTime * 1000)
            }
        }
        wx.showToast({
            ...toastOption,
            icon: icon || "none",
            duration: duration || 3000,
            success: () => {
                success && success();
                navigateBack()
            },
            fail: () => {
                fail && fail();
                navigateBack()
            },
        });
    }
};