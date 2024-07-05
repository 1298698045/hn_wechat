<template>
    <div class="wrap">
        <div class="boxWrap" v-if="!isShow&&!repeatShow">
            <p class="icon">
                <i class="iconfont icon-richeng1"></i>
                <!-- <i-icon type="activity" color="#3c3c3c" size="20" /> -->
            </p>
            <p class="cont">
                <textarea v-model="title" name="" id="" cols="30" rows="10" placeholder="添加日程、会议、活动等标题"></textarea>
            </p>
        </div>
        <div class="center"  v-if="!isShow&&!repeatShow">
           <picker @change="pickerSchedule" :value="index" :range="array">
                <div class="row">
                    <p class="icon">
                        <span></span>
                        <!-- <i class="iconfont icon-shijian1"></i> -->
                    </p>
                    <p class="cont">{{array[index]}}</p>
                    <p>
                        <i-icon type="enter" size="20" color="#666666" />
                    </p>
                </div>
           </picker>
            <div class="row">
                <p class="icon">
                    <i class="iconfont icon-shijian1"></i>
                </p>
                <p class="cont">全天</p>
                <p>
                    <van-switch :checked="checked" @change="changeSwitch" size="24px" />
                </p>
            </div>
            <div class="timeWrap">
                    <picker class="picker" mode="multiSelector" :value="multiIndex" @change="bindMultiPickerChange"
								:range="newMultiArray">
                        <input type="text" v-if="month==''" placeholder="开始时间" disabled>
                        <div class="box">
                            <p>{{month}}{{day}} {{week}}</p>
                            <p>{{hours}}</p>
                        </div>
                    </picker>
                <div class="imgBox">
                    <img src="https://oawx.hnca.org.cn/img/wechat/2845.png" alt="">
                </div>
                <picker class="picker" mode="multiSelector" :value="endmultiIndex" @change="endbindMultiPickerChange" :range="newMultiArray">
                    <input type="text" v-if="endMonth==''" placeholder="结束时间" disabled>                    
                    <div class="box">
                        <p>{{endMonth}}{{endDay}} {{endWeek}}</p>
                        <p>{{endHours}}</p>
                    </div>
                </picker>
            </div>
            <div class="row" @click="getRepeat">
                <p class="icon">
                    <i class="iconfont icon-zhongfu1"></i>
                </p>
                <p class="cont">每天重复</p>
                <p>
                    <i-icon type="close" size="20" color="#666666" />
                </p>
            </div>
            <picker @change="pickerCalendar" :value="calendarIdx" :range="calendarList">
                <div class="row">
                    <p class="icon">
                        <i class="iconfont icon-type"></i>
                    </p>
                    <p class="cont">日历：{{calendarList[calendarIdx]}}</p>
                    <p>
                        <i-icon type="enter" size="20" color="#666666" />
                    </p>
                </div>
            </picker>
            <picker @change="pickerShow" :value="showIdx" :range="showList">
                <div class="row">
                    <p class="icon">
                        <i class="iconfont icon-gongzuozhuangtai"></i>
                    </p>
                    <p class="cont">显示为：{{showList[showIdx]}}</p>
                    <p>
                        <i-icon type="enter" size="20" color="#666666" />
                    </p>
                </div>
            </picker>
            <div class="row">
                <p class="icon">
                    <i class="iconfont icon-shiliangzhinengduixiang"></i>
                </p>
                <p class="cont">
                    <input type="text" v-model="location" placeholder="输入地点">
                </p>
                <p>
                    <i-icon type="coordinates" @click="getOpenLocation" size="20" color="#666666" />
                </p>
            </div>
            <div class="row">
                <p class="icon">
                    <i class="iconfont icon-zuzhiren"></i>
                </p>
                <p class="cont">
                    <input type="text" :disabled="true" placeholder="邀请参与人">
                </p>
                <p>
                    <i-icon type="enter" size="20" color="#666666" />
                </p>
            </div>
            <div class="row">
                <p class="icon">
                    <i class="iconfont icon-tixing1"></i>
                </p>
                <p class="cont">15分钟前，应用内提醒</p>
                <p>
                    <i-icon type="enter" size="20" color="#666666" />
                </p>
            </div>
            <div class="row">
                <p class="icon">
                    <i class="iconfont icon-shanguangdeng"></i>
                </p>
                <p class="cont">通知</p>
                <div class="btn">
                    <p>
                        <span class="l">应用内</span>
                        <span class="r">短信</span>
                        <i-icon type="close" color="#666666" size="20" @click="getDelNotice" />
                    </p>
                </div>
            </div>
            <div class="row">
                <p class="icon">
                    <i class="iconfont icon-beizhu"></i>
                </p>
                <p class="cont">
                    <van-field
                        :value="description"
                        type="textarea"
                        placeholder="请输入描述"
                        autosize
                        :border="false"
                        @change="changeDescription"
                    />
                </p>
                <p>
                    <i-icon type="close" size="20" color="#666666" />
                </p>
            </div>
            <div class="row">
                <p class="icon">
                    <i class="iconfont icon-fujian"></i>
                </p>
                <p class="cont">附件</p>
                <p>
                    <i class="iconfont icon-add" style="color:#3399ff;"></i>
                </p>
            </div>
            <div class="enclosure">
                <div class="rows">
                    <p></p>
                    <p>骨密度测量学的基础知识与仪...</p>
                    <p>
                        <i-icon type="close" size="20" color="#666666" />
                    </p>
                </div>
            </div>
            <div class="iconRow">
                <div class="box">
                    <p>
                        <i class="iconfont icon-shiliangzhinengduixiang"></i>
                    </p>
                    <p class="name">地点</p>
                </div>
                <div class="box">
                    <p>
                        <i class="iconfont icon-huiyishi"></i>
                    </p>
                    <p class="name">会议室</p>
                </div>
                <div class="box">
                    <p>
                        <i class="iconfont icon-shanguangdeng"></i>
                    </p>
                    <p class="name">通知</p>
                </div>
                <div class="box">
                    <p>
                        <i class="iconfont icon-zhongfu1"></i>
                    </p>
                    <p class="name">重复</p>
                </div>
                <div class="box">
                    <p>
                        <i class="iconfont  icon-fujian"></i>
                    </p>
                    <p class="name">附件</p>
                </div>
                <div class="box">
                    <p>
                        <i class="iconfont  icon-beizhu"></i>
                    </p>
                    <p class="name">描述</p>
                </div>
            </div>
        </div>
        <div class="footer"  v-if="!isShow&&!repeatShow">
            <div class="btnWrap">
                <van-button type="primary" @click="getSubmit" color="#3399ff" block>完成</van-button>
            </div>
        </div>
        <mapList @childFn="getChildFn" @cancel="getCancelChild" v-if="isShow" /> 
        <repeat v-if="repeatShow" />       
    </div>
</template>
<script>
import mapList from '../../../components/mapList';
import repeat from '../../../components/schedule/repeat';
export default {
    components:{
        mapList,
        repeat
    },
    data(){
        return {
            title:"",
            checked:false,
            // isAllDayEvent:0,
            description:"",
            index:0,
            array:[
                '我的日程',
                '我的会议'
            ],
            calendarIdx:0,
            calendarList:[
                '工作',
                '个人'
            ],
            showIdx:0,
            showList:[
                '正忙',
                '空闲'
            ],
            location:"",
            isShow:false,
            Latitude:"",
            Longitude:"",
            multiIndex: [ 0, 0, 0, 0, 0 ],
            endmultiIndex: [ 0, 0, 0, 0, 0 ],
            month:"",
            day:"",
            hours:"",
            endMonth:"",
            endDay:"",
            endHours:"",
            time:"",
            endTime:"",
            repeatShow:false,
            sessionkey:"",
            calendarType:"工作",
            displayStatus:"正忙",
            startTime:"2020-06-03 04:00",
            endTime:"2020-06-03 05:00",
            week:"",
            endWeek:"",
            id:""
        }
    },
    computed:{
        isAllDayEvent(){
            return this.checked==true?1:0;
        },
        newMultiArray: () => {
            let array = [];
            const date = new Date();
            const years = [];
            const months = [];
            const days = [];
            const hours = [];
            const minutes = [];
            var d = new Date();
            var y = d.getFullYear();
            for ( let i = y; i <= date.getFullYear() + 10; i++ ) {
                years.push( "" + i+'年' );
            }
            array.push( years );
            for ( let i = 1; i <= 12; i++ ) {
                if ( i < 10 ) {
                    i = "0" + i;
                }
                months.push( "" + i+'月' );
            }
            array.push( months );
            for ( let i = 1; i <= 31; i++ ) {
                if ( i < 10 ) {
                    i = "0" + i;
                }
                days.push( "" + i+'日' );
            }
            array.push( days );
            for ( let i = 0; i < 24; i++ ) {
                if ( i < 10 ) {
                    i = "0" + i;
                }
                hours.push( "" + i+'时' );
            }
            array.push( hours );
            for ( let i = 0; i < 60; i++ ) {
                if ( i < 10 ) {
                    i = "0" + i;
                }
                minutes.push( "" + i+'分' );
            }
            array.push( minutes );
            return array;
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
    },
    methods:{
        getChildFn(val,isBook){
            this.location = val.Name;
            this.isShow = isBook;
            this.Latitude = val.Latitude;
            this.Longitude = val.Longitude;
        },
        getCancelChild(val){
            this.isShow = val;
        },
        pickerSchedule(e){
            this.index = e.mp.detail.value;
        },
        pickerShow(e){
            this.showIdx = e.mp.detail.value;
            this.displayStatus = this.showList[this.showIdx];
        },
        pickerCalendar(e){
            this.calendarIdx = e.mp.detail.value;
            this.calendarType = this.calendarList[this.calendarIdx];
        },
        changeSwitch(e){
            this.checked = e.mp.detail;
            if(this.checked){
                this.isAllDayEvent = 1;
            }else {
                this.isAllDayEvent = 0;
            }
        },
        changeDescription(e){
            this.description = e.mp.detail;
        },
        getOpenLocation(){
            this.isShow = true;
        },
        //获取时间日期
        bindMultiPickerChange( e ) {
            this.multiIndex = e.target.value;
            console.log( "当前选择的时间", this.multiIndex );
            const index = this.multiIndex;
            const year = this.newMultiArray[ 0 ][ index[ 0 ] ];
            const month = this.newMultiArray[ 1 ][ index[ 1 ] ];
            const day = this.newMultiArray[ 2 ][ index[ 2 ] ];
            const hour = this.newMultiArray[ 3 ][ index[ 3 ] ];
            const minute = this.newMultiArray[ 4 ][ index[ 4 ] ];
            this.time = year + "-" + month + "-" + day + " " + hour + ":" + minute;
            this.month = month;
            this.day = day;
            this.hours = hour + ":" + minute;
            this.time = this.RemoveChinese(this.time);
            this.startTime = this.RemoveChinese(this.time);
            // console.log('this.time',this.time);
        },
        endbindMultiPickerChange(e){
            this.endmultiIndex = e.target.value;
				// console.log( "当前选择的时间", this.multiIndex );
				const index = this.endmultiIndex;
				const year = this.newMultiArray[ 0 ][ index[ 0 ] ];
				const month = this.newMultiArray[ 1 ][ index[ 1 ] ];
				const day = this.newMultiArray[ 2 ][ index[ 2 ] ];
				const hour = this.newMultiArray[ 3 ][ index[ 3 ] ];
				const minute = this.newMultiArray[ 4 ][ index[ 4 ] ];
                this.endTime = year + "-" + month + "-" + day + " " + hour + ":" + minute;
                this.endMonth = month;
                this.endDay = day;
                this.endHours = hour + ":" + minute;
				this.endTime = this.RemoveChinese(this.endTime);
				// console.log(this.endTime,this.time);
        },
        RemoveChinese(strValue) {  
            if(strValue!= null && strValue != ""){  
                var reg = /[\u4e00-\u9fa5]/g;   
               return strValue.replace(reg, "");   
            }  
            else  
                return "";  
        },
        getRepeat(){
            this.repeatShow = true;
        },
        getSubmit(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"activity.event.create",
                    SessionKey:this.sessionkey,
                    id:this.id,
                    subject:this.title,
                    ScheduledStart:this.startTime,
                    ScheduledEnd:this.endTime,
                    isAllDayEvent:this.isAllDayEvent,
                    Location:this.location,
                    description:this.description,
                    calendarType:this.calendarType,
                    displayStatus:this.displayStatus,
                    reminderTime:15,
                    invtee:""
                }
            }).then(res=>{
                console.log(res);
                wx.navigateBack({
                    delta: 1
                })
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../../../static/css/schedule.css';
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .boxWrap{
            display: flex;
            padding: 33rpx;
            background: #fff;
            margin-top: 35rpx;
            .icon{
                margin-top: 10rpx;
            }
            .cont{
                flex: 1;
                width: 100%;
                margin-left: 20rpx;
                textarea{
                    width: 100%;
                    height: 100rpx;
                }
            }
        }
        .center{
            padding-bottom: 80px;
            .row{
                display: flex;
                padding: 33rpx;
                background: #fff;
                margin-top: 24rpx;
                align-items: center;
                .icon{
                    span{
                        width: 20rpx;
                        height: 20rpx;
                        line-height: 20rpx;
                        text-align: center;
                        background: #52b55e;
                        display:inline-block;
                        border-radius: 50%;
                    }
                }
                .cont{
                    flex: 1;
                    margin-left: 20rpx;
                    font-size: 34rpx;
                    color: #333333;
                }
                .btn{
                    p{
                        span{
                            display: inline-block;
                            width: 124rpx;
                            height: 58rpx;
                            line-height: 58rpx;
                            text-align: center;
                            font-size: 28rpx;
                            color: #fff;
                            background: #3399ff;
                            border: 1rpx solid #3399ff;
                        }
                        .l{
                            border-top-left-radius: 5rpx;
                            border-bottom-left-radius: 5rpx;
                            border-right: none;
                        }
                        .r{
                            border-top-right-radius: 5rpx;
                            border-bottom-right-radius: 5rpx;
                            background: #fff;
                            color: #3399ff;
                            border-left: none;
                            margin-right: 20rpx;
                        }
                    }
                }
            }
            .timeWrap{
                display: flex;
                padding: 10rpx 33rpx;
                background: #fff;
                border-top: 2rpx solid #e3e3e3;
                // justify-content: space-around;
                input{
                    text-align: center;
                    margin-top: 20rpx;
                }
                .picker{
                    width: 45%;
                }
                .box{
                    font-size: 30rpx;
                    color: #333333;
                    // width: 45%;
                    // height: 92rpx;
                    text-align: left;
                    p:nth-child(2){
                        margin-top: 10rpx;
                    }
                }
                .imgBox{
                    width: 14rpx;
                    height: 92rpx;
                    img{
                        width: 100%;
                        height: 100%;
                        vertical-align: middle;
                    }
                }
            }
            .enclosure{
                background: #fff;
                .rows{
                    display: flex;
                    padding: 33rpx;
                    align-items: center;
                    p:nth-child(1){
                        width: 96rpx;
                        height: 96rpx;
                        background: #e5e5e5;
                        border-radius: 12rpx;
                    }
                    p:nth-child(2){
                        flex: 1;
                        margin-left: 20rpx;
                        font-size: 34rpx;
                        color: #333333;
                    }
                }
            }
            .iconRow{
                display: flex;
                padding: 10rpx 20rpx;
                background: #fff;
                margin-top: 35rpx;
                align-items: center;
                .box{
                    width: 25%;
                    text-align: center;
                    .name{
                        font-size: 19rpx;
                        color: #666666;
                    }
                }
            }
        }
        .footer {
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            z-index: 999;
            background: #fff;
            .btnWrap{
                padding: 26rpx 24rpx;
            }
        }
    }
</style>