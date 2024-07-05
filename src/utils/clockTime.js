export const timing = (that) => {
    var time = setTimeout(function () {
    if( (that.data.second + 1) > 59){
        that.minute = that.data.minute + 1;
        that.second = 0;
    }else {
        that.second = that.data.second + 1;
    }
        that.timing(that);
    }, 1000)
}