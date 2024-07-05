let timer = null;
//分割字符方法，
export const timestr = ()=>{
    // var that = this;
    var date = new Date();
    var yearTime = date.getFullYear(); //年
    var monthTime =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1; //月
    var dayTime = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(); //日
    var hoursTima =
      date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); //时
    var minvteTime =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(); //分
    var secondTime =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); //秒
    // console.log("当前时间："+ yearTime+'-'+monthTime+'-'+dayTime+'--'+hoursTima+":"+minvteTime+":"+ secondTime);
    var nowdatassss =
      yearTime +
      "-" +
      monthTime +
      "-" +
      dayTime +
      "--" +
      hoursTima +
      ":" +
      minvteTime +
      ":" +
      secondTime;
    // if (hoursTima > 12 && hoursTima < 20) {
    //     that.am = "下午";
    // } else if (hoursTima > 20 && hoursTima < 24) {
    //     that.am = "晚上";
    // } else if (hoursTima > 0 && hoursTima < 6) {
    //     that.am = "半夜";
    // } else if (hoursTima > 6 && hoursTima < 12) {
    //     that.am = "上午";
    // }
    nowdatassss = nowdatassss;
    // 以下的数字，都要先将他们转化成字符串，不然，for循环的时候，他会按照数字去循环
    // 将时间拆开，这样写的原因是，时分秒之间得有分隔符，这样写的话好处理
    yearTime = yearTime.toString();//年
    monthTime = monthTime.toString();
    dayTime = dayTime.toString();
    hoursTima = hoursTima.toString();
    minvteTime = minvteTime.toString();
    secondTime = secondTime.toString();
    // console.log(that.yearTime,that.monthTime,that.dayTime,that.hoursTima,that.minvteTime,that.secondTime);
    let time = `${hoursTima}:${minvteTime}:${secondTime}`;
    // console.log(time);
    return time;
    
  }

//   // 计时器的方法
//  export const numtap = ()=> {
//     // var that = this;
//     timestr();
//     timer = setInterval(function() {
//       timestr();
//     }, 1000);
// }