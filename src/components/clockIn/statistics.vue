<template>
    <div class="wrap">
        <div class="navWrap">
            <p>
                <van-search :value="keyWord" placeholder="搜索" />
            </p>
            <!-- <p @click="getReport">报表</p> -->
        </div>
        <i-tabs :current="current" @change="handleChangeTabs" v-if="attendAdmin">
            <i-tab key="tab1" title="实时统计"></i-tab>
            <i-tab key="tab2" title="月统计"></i-tab>
            <i-tab key="tab3" title="我的"></i-tab>
        </i-tabs>
        <div class="currentOne" v-if="current=='tab1'&&attendAdmin">
            <div class="centerWrap">
                <picker mode="date" :value="date" @change="bindDateChange">
                    <h3>{{date}}<i-icon type="unfold" color="#3399ff" /></h3>
                </picker>
                <div class="circle">
                    <van-circle layer-color="#ececec" size="150" :value="value" stroke-width="6"  @click="getClockInDetail('tab1','Check')">
                        <div Slots="fill" class="fill">
                            <p>打卡人数/应到人数</p>
                            <p>{{info.Check}}/{{info.Total}}</p>
                            <p>打卡明细<i-icon type="enter" color="#3399ff" /></p>
                        </div>
                    </van-circle>
                </div>
                <div class="boxWrap">
                    <div class="box"  @click="getClockInDetail('tab2','Notcheck')">
                        <p class="num" :class="{'default':info.NotCheck==0}">{{info.NotCheck}}</p>
                        <p class="name" :class="{'default':info.NotCheck==0}">未打卡</p>
                    </div>
                    <div class="box" @click="getClockInDetail('tab1','Late')">
                        <p class="num" :class="{'default':info.Late==0}">{{info.Late}}</p>
                        <p class="name" :class="{'default':info.Late==0}">迟到</p>
                    </div>
                    <div class="box"  @click="getClockInDetail('tab1','Out')">
                        <p class="num" :class="{'default':info.Out==0}">{{info.Out}}</p>
                        <p class="name" :class="{'default':info.Out==0}">外勤</p>
                    </div>
                    <!-- <div class="box">
                        <p class="num">{{info.NotActive}}</p>
                        <p class="name">未激活</p>
                    </div> -->
                </div>
            </div>
            <div class="footerRow" @click="getReport">
                <p>
                    <i-icon type="shop_fill" size="20" color="#fc9f48" />
                </p>
                <p>
                    考勤报表
                </p>
                <p>
                    <i-icon type="enter" size="20" color="#cccccc" />
                </p>
            </div>
            <div class="footerRow">
                <p>
                    <i-icon type="shop_fill" size="20" color="#fc9f48" />
                </p>
                <p>
                    分类统计
                </p>
                <p>
                    <i-icon type="enter" size="20" color="#cccccc" />
                </p>
            </div>
        </div>
        <div class="monthWrap" v-if="current=='tab2'&&attendAdmin">
            <div class="head">
                <p>{{monthTotal}}人出勤</p>
                <p class="r">
                    <i-icon type="return" color="#cccccc" @click="getReduce" />
                    <span>{{monthTime}}</span>
                    <i-icon type="enter" color="#cccccc" @click="getAddTime" />
                </p>
            </div>
            <div class="vheight">
                <div class="row" v-for="(item,index) in monthList" :key="index" @click="getDetail(item)">
                    <p>{{item.Name}}</p>
                    <p :class="{'default':item.Value==0}">
                        {{item.Value}}
                        <i-icon type="enter" color="#cccccc" />
                    </p>
                </div>
                <div class="cent">
                    <p>本月考勤尚未结束</p>
                </div>
            </div>
        </div>
        <div class="currentMy" v-if="current=='tab3'">
            <!-- <h3 @click="changeMyDate">{{myDate}}<i-icon type="unfold" color="#526992" size="20" /></h3> -->
            <div class="head">
                <p>月度汇总</p>
                <p class="r">
                    <i-icon type="return" color="#cccccc" />
                    <span @click="changeMyDate">{{myDate}}</span>
                    <i-icon type="enter" color="#cccccc" />
                </p>
            </div>
            <div class="headers">
                <div class="nav">
                    <div class="radiusLeft">
                        <p>{{userInfo.fullName}}</p>
                    </div>
                    <div class="info">
                        <p class="name">{{userInfo.fullName}}</p>
                        <p class="group">考勤组：{{userInfo.deptName}}</p>
                    </div>
                    <!-- 第一版暂且不用 -->
                    <!-- <div class="time">
                        <p @click="getClockInMonthly">
                            <i-icon type="activity" size="20" />
                            打卡月历
                        </p>
                    </div> -->
                </div>
            </div>
            <div class="center">
                <van-collapse :value="activeNames" @change="changeCollapse">
                    <van-collapse-item :disabled="item.Attend==0?true:false" v-for="(item,index) in list" :key="index" :title="item.fieldName" :name="index">
                        <view slot="value"><span :class="{'active':item.Attend==0}">{{item.Attend}}次</span></view>
                        <div class="collapse" v-for="(v,i) in item.days" :key="i">
                            <p>{{v}}({{}})</p>
                            <p>1天</p>
                        </div>
                    </van-collapse-item>
                </van-collapse>
            </div>
        </div>
        <van-popup
            v-if="current=='tab3'"
            :show="myIsShow"
            :round="false"
            position="center"
            custom-style="width:80%;height: auto;border-radius:7rpx;"
            @close="onMyClose"
        >
            <div class="myPopup">
                <h3>月份</h3>
                <div class="content">
                    <div class="row">
                        <van-radio-group :value="radio" @change="changeRadioDate">
                            <van-radio :name="index" custom-class="radio" v-for="(item,index) in dataArr" :key="index">{{item}}</van-radio>
                        </van-radio-group>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
export default {
    name:'statistics',
    props:['attendAdmin'],
    data(){
        return {
            keyWord:"",
            current:"tab1",
            value:30,
            date:"",
            myDate:"",
            activeNames:[],
            list:[
                {
                    title:"出勤天数",
                    num:"20.5"
                },
                {
                    title:"缺勤天数",
                    num:"20.5"
                },
                {
                    title:"迟到",
                    num:"20.5"
                },
                {
                    title:"早退",
                    num:"20.5"
                },
                {
                    title:"缺卡",
                    num:"20.5"
                },
                {
                    title:"事假",
                    num:"20.5"
                },
                {
                    title:"病假",
                    num:"20.5"
                },
                {
                    title:"产假",
                    num:"20.5"
                },
                {
                    title:"婚假",
                    num:"20.5"
                },
                {
                    title:"探亲假",
                    num:"20.5"
                },
                {
                    title:"年假/公休",
                    num:"20.5"
                },
                {
                    title:"工伤假",
                    num:"20.5"
                },
                {
                    title:"丧假",
                    num:"20.5"
                },
                {
                    title:"其它",
                    num:"20.5"
                },
                {
                    title:"计生家",
                    num:"20.5"
                },
                {
                    title:"补卡申请",
                    num:"20.5"
                }
            ],
            myIsShow:false,
            radio:'',
            dataArr:[],
            info:{},
            userInfo:{},
            year:"",
            month:"",
            monthTime:"",
            lastYear:"",
            lastMonth:"",
            monthList:[],
            monthTotal:"",
            sessionkey:""
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        
    },
    mounted(){
        let myDate = new Date();
        let y = myDate.getFullYear();
        let m = myDate.getMonth()+1;
        let d = myDate.getDate();
        this.date = `${y}-${m}-${d}`;
        this.myDate = `${y}-${m}`;
        this.monthTime = `${y}-${this.checkMonth(m)}`;
        this.year = y;
        this.month = m;
        this.lastYear = y;
        this.lastMonth = m;
        this.queryAll();
        if(!this.attendAdmin){
            this.dataArr = this.getMonths();
            this.current = 'tab3';
            this.getUserInfo();
            this.myQuery();
        }else {
            this.current = 'tab1';
        }
    },
    computed:{
        currentTime(){
            let time = new Date().getTime();
            return time;
        }
    },
    methods:{
        getDetail(item){
            const url = '/pages/clockIn/monthTotalDetail/main?name='+item.Name+'&RuleCode='+item.RuleCode+'&year='+this.lastYear+'&month='+this.lastMonth;
            wx.navigateTo({url:url});
        },
        getReduce(){
            let currentDate = this.monthTime;
            currentDate = new Date(currentDate); 
            let lastDate = currentDate.setMonth(currentDate.getMonth() - 1); // 输出日期格式为毫秒形式1551398400000
            lastDate = new Date(lastDate);
            let lastYear = lastDate.getFullYear();
            let lastMonth = this.checkMonth(lastDate.getMonth() + 1); // 因日期中的月份表示为0-11，所以要显示正确的月份，需要 + 1
            lastDate = lastYear + '-' + lastMonth;
            this.lastYear = lastYear;
            this.lastMonth = lastMonth;
            // console.log(lastDate);
            this.monthTime = lastDate;
            this.getMonthTotal();
        },
        getAddTime(){
            let currentDate = this.monthTime;
            currentDate = new Date(currentDate); 
            let lastDate = currentDate.setMonth(currentDate.getMonth() + 1); // 输出日期格式为毫秒形式1551398400000
            lastDate = new Date(lastDate);
            let lastYear = lastDate.getFullYear();
            let lastMonth = this.checkMonth(lastDate.getMonth() + 1); // 因日期中的月份表示为0-11，所以要显示正确的月份，需要 + 1
            lastDate = lastYear + '-' + lastMonth;
            // console.log(lastDate);
            if(this.lastMonth<new Date().getMonth()+1){
                this.lastYear = lastYear;
                this.lastMonth = lastMonth;
                this.monthTime = lastDate;
                this.getMonthTotal();
            }else {
                wx.showToast({
                    title:'不能选择未来的日子',
                    icon:'none',
                    duration:2000
                })
            }
        },
        checkMonth (i) {
            if (i<10){
                i="0" + i;
            }
            return i;
        },
        getMonthTotal(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"hr.attendrpt.month.rulelist",
                    SessionKey:this.sessionkey,
                    year:this.lastYear,
                    month:this.lastMonth
                }
            }).then(res=>{
                console.log(res);
                this.monthList = res.data;
                this.monthTotal = res.total;
            })
        },
        getUserInfo(){
            return new Promise((resolve,reject)=>{
                this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"sys.userinfo.get",
                    SessionKey:this.sessionkey
                }
                }).then(res=>{
                    this.userInfo = res.data[0];
                    resolve();
                })
            })
        },
        queryAll(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"hr.attendrpt.day.get",
                    SessionKey:this.sessionkey,
                    date:this.date
                }
            }).then(res=>{
                console.log(res);
                this.info = res.data;
                this.value = Math.floor(this.GetPercent(this.info.Check,this.info.Total));
            })
        },
        GetPercent(num, total) {
            num = parseFloat(num);
            total = parseFloat(total);
            if (isNaN(num) || isNaN(total)) {
                return "-";
            }
            return total <= 0 ? "" : (Math.round(num / total * 10000) / 100.00)+"";
        },
        myQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"hr.attendrpt.search",
                    SessionKey:this.sessionkey,
                    AttendYear:this.year,
                    AttendMonth:this.month,
                    userId:""
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
                this.list.forEach(item=>{
                    if(item.days!=[]){
                        item.days.forEach(v=>{
                            console.log(v);
                            var weekDay = [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ];
                            var myDate = new Date( Date.parse( v ) );
                            console.log(weekDay[ myDate.getDay() ]);
                            // this.$set(v,'days', weekDay[ myDate.getDay() ] )
                        })
                    }
                })
            })
        },
        handleChangeTabs(e){
            console.log(e);
            this.current = e.mp.detail.key;
            if(this.current=='tab1'){
                this.queryAll();
            }else if(this.current=='tab2'){
                this.getMonthTotal();
            }else  if(this.current=='tab3'){
                this.dataArr = this.getMonths();
                this.getUserInfo();
                this.myQuery();
            }
        },
        bindDateChange(e){
            let value = e.mp.detail.value;
            if(new Date(value).getTime()<=this.currentTime){
                this.date = e.mp.detail.value;
                this.queryAll();
            }else {
                wx.showToast({
                    title:'不能选择未来的日子',
                    icon:'none',
                    duration:2000
                })
            }
            
        },
        changeMyDate(){
            this.myIsShow = true;
        },
        onMyClose(){
            this.myIsShow = false;
        },
        changeCollapse(e){
            this.activeNames = e.mp.detail;
        },
        changeRadioDate(e){
            console.log(e);
            this.radio = e.mp.detail;
            this.myDate = this.dataArr[this.radio];
            this.myIsShow = false;
            this.myQuery();
        },
        getMonths() {
            var dataArr = [];
            var data = new Date();
            var year = data.getFullYear();
            data.setMonth(data.getMonth() + 1, 1); //获取到当前月份,设置月份
            for (var i = 0; i < 12; i++) {
                data.setMonth(data.getMonth() - 1); //每次循环一次 月份值减1
                var m = data.getMonth() + 1;
                m = m < 10 ? "0" + m : m;
                dataArr.push(data.getFullYear() + "-" + m);
            }
            console.log(dataArr);
            return dataArr;
        },
        // 打卡明细
        getClockInDetail(tab,str){
            if(str=='Late'&&this.info.Late==0){
                wx.showToast({
                    title:"大家都很准时哦！",
                    icon:'none',
                    duration:2000
                })
                return false;
            }else if(str=='Out'&&this.info.Out==0){
                wx.showToast({
                    title:"没有人在考勤范围外打卡",
                    icon:'none',
                    duration:2000
                })
                return false;
            }else if(str=='Notcheck'&&this.info.NotCheck==0){
                wx.showToast({
                    title:"员工都已经打卡啦！",
                    icon:'none',
                    duration:2000
                })
                return false;
            }else {
                const url = '/pages/clockIn/detailed/main?date='+this.date+'&scope='+str+'&tab='+tab;
                wx.navigateTo({url:url});
            }
        },
        // 报表
        getReport(){
            const url = '/pages/clockIn/reportForm/main';
            wx.navigateTo({url:url});
        },
        // 打卡月历
        getClockInMonthly(){
            const url = '/pages/clockIn/monthly/main?name='+this.userInfo.fullName+'&deptName='+this.userInfo.deptName;
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        .navWrap{
            width: 100%;
            background: #fff;
            // display: flex;
            // p:nth-child(1){
            //     width: 85%;
            // }
            // p:nth-child(2){
            //     width: 15%;
            //     color: #3399ff;
            //     font-size: 28rpx;
            //     text-align: center;
            //     margin-top: 15px;
            // }
        }
        .currentOne{
            .centerWrap{
                background: #fff;
                h3{
                    color: #3399ff;
                    font-size: 24rpx;
                    padding: 31rpx 33rpx;
                }
                .circle{
                    display: flex;
                    justify-content: center;
                    .fill{
                        text-align: center;
                        p:nth-child(1){
                            font-size: 24rpx;
                            color: #666666;
                        }
                        p:nth-child(2){
                            font-size: 50rpx;
                            font-weight: bold;
                            color: #3399ff;
                        }
                        p:nth-child(3){
                            font-size: 24rpx;
                            color: #3399ff;
                        }
                    }
                }
                .boxWrap{
                    display: flex;
                    justify-content: space-around;
                    padding-bottom: 76rpx;
                    .box{
                        text-align: center;
                        .num{
                            font-size: 61rpx;
                            font-weight: bold;
                            color: #333333;
                        }
                        .name{
                            font-size: 24rpx;
                            color: #333333;
                        }
                        .default{
                            color: #999999;
                        }
                    }
                }
            }
            .footerRow{
                display: flex;
                background: #fff;
                margin-top: 35rpx;
                padding: 20rpx 33rpx;
                align-items: center;
                p:nth-child(2){
                    flex: 1;
                    font-size: 32rpx;
                    color: #666666;
                    margin-left: 20rpx;
                }
            }
        }
        .monthWrap{
            .head{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 33rpx;
                margin-bottom: 21rpx;
                p:nth-child(1){
                    font-size: 26rpx;
                    color: #666666;
                }
                .r{
                    span{
                        font-size: 30rpx;
                        color: #333333;
                        margin: 0 20rpx;
                    }
                }
            }
            .vheight{
                height: 100vh;
                background: #fff;
                .row:last-child{
                    border: none;
                }
                .row{
                    display: flex;
                    justify-content: space-between;
                    padding: 20rpx 33rpx;
                    background: #fff;
                    border-bottom: 2rpx solid #f1f1f1;
                    p:nth-child(1){
                        font-size: 32rpx;
                        color: #666666;
                    }
                    p:nth-child(2){
                        font-size: 31rpx;
                        color: #333333;
                    }
                    .default{
                        color: #e0e0e0 !important;
                    }
                }
                .cent{
                    width: 100%;
                    position: fixed;
                    bottom: 80px;
                    text-align: center;
                    font-size: 28rpx;
                    color: #999999;
                }
            }
        }
        .currentMy{
            // background: #fff;
            padding-bottom: 80px;
            .head{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 33rpx;
                p:nth-child(1){
                    font-size: 26rpx;
                    color: #666666;
                }
                .r{
                    span{
                        font-size: 30rpx;
                        color: #333333;
                        margin: 0 20rpx;
                    }
                }
            }
            h3{
                font-size: 40rpx;
                color: #526992;
                padding: 33rpx;
            }
            .headers{
                background: #fff;
                padding: 20rpx 0;
                border-bottom: 1rpx solid #eceeed;
                margin-top: 21rpx;
                .nav {
                    display: flex;
                    padding: 0 33rpx;
                    align-items: center;
                    background: #fff;
                    .radiusLeft {
                        width: 72rpx;
                        height: 72rpx;
                        line-height: 72rpx;
                        text-align: center;
                        border-radius: 50%;
                        font-size: 22rpx;
                        color: #fff;
                        background: #3399ff;
                    }
                    .info {
                        flex: 1;
                        margin-left: 20rpx;
                        .name {
                        color: #333333;
                        font-size: 33rpx;
                        }
                        .group {
                        color: #526992;
                        font-size: 28rpx;
                        }
                    }
                    .time {
                        color: #3399ff;
                        font-size: 28rpx;
                    }
                }
            }
            .center{
                .van-collapse-item__content{
                    background: #f8f8f8 !important;
                }
                span{
                    color: #333333;
                }
                span.active{
                    color: #e0e0e0;
                }
                .collapse{
                    display: flex;
                    justify-content: space-between;
                    padding: 20rpx 20rpx;
                    p:nth-child(1){
                        color: #666666;
                    }
                    p:nth-child(2){
                        color: #333333;
                    }
                }
            }
        }
        .myPopup{
            padding-bottom: 20rpx;
            h3{
                color: #999999;
                font-size: 23rpx;
                padding: 42rpx 29rpx;
            }
            .content{
                padding: 0 29rpx;
                .row{
                    color: #333333;
                    font-size: 33rpx;
                    .radio{
                        padding: 20rpx 0;
                    }
                }
            }
        }
    }
</style>