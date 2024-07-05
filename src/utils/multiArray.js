export const newMultiArray = () => {
    let array = [];
    const date = new Date();
    const years = [];
    const months = [];
    const days = [];
    const hours = [];
    const minutes = [];
    var d = new Date();
    var y = d.getFullYear();
    for (let i = y; i <= date.getFullYear() + 10; i++) {
        years.push("" + i + '年');
    }
    array.push(years);
    for (let i = 1; i <= 12; i++) {
        if (i < 10) {
            i = "0" + i;
        }
        months.push("" + i + '月');
    }
    array.push(months);
    for (let i = 1; i <= 31; i++) {
        if (i < 10) {
            i = "0" + i;
        }
        days.push("" + i + '日');
    }
    array.push(days);
    for (let i = 0; i < 24; i++) {
        if (i < 10) {
            i = "0" + i;
        }
        hours.push("" + i + '时');
    }
    array.push(hours);
    for (let i = 0; i < 60; i++) {
        if (i < 10) {
            i = "0" + i;
        }
        minutes.push("" + i + '分');
    }
    array.push(minutes);
    return array;
}