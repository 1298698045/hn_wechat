/**
 * 获取日历header内容 格式为：****年 **月
 * @param {*} date
 */
export const getHeaderContent = function (date) {
    let _date = new Date(date)
    return dateFormat(_date, 'yyyy年 MM月');
}