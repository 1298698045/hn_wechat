<template>
    <div class="wrap">
        <div class="content">
            <div class="header">
                <picker @change="PickerChangeFlexTime" range-key="str" :value="index" :range="FlexTime">
                    <div class="row">
                        <p class="label">
                            设置上班弹性时间
                        </p>
                        <p class="cont">
                            {{FlexTime[index]?FlexTime[index].str:''}}
                            <i-icon type="enter" color="#999999" />
                        </p>
                    </div>
                </picker>
                <picker @change="PickerChangeLateTime" range-key="str" :value="LateTimeIdx" :range="LateTime">
                    <div class="row">
                        <p class="label">
                            设置严重迟到
                        </p>
                        <p class="cont">
                            {{LateTime[LateTimeIdx]?LateTime[LateTimeIdx].str:''}}
                            <i-icon type="enter" color="#999999" />
                        </p>
                    </div>
                </picker>
                <picker @change="PickerChangeAbsenceTime" range-key="str" :value="AbsenceTimeIdx" :range="AbsenceTime">
                    <div class="row">
                        <p class="label">
                            设置矿工
                        </p>
                        <p class="cont">
                            {{AbsenceTime[AbsenceTimeIdx]?AbsenceTime[AbsenceTimeIdx].str:''}}
                            <i-icon type="enter" color="#999999" />
                        </p>
                    </div>
                </picker>
            </div>
            <div class="tips">
                <p>
                    上班后超过多久打卡分别计算为迟到、严重迟到和矿工。如
                    果班次已设置，以班次设置的优先。
                </p>
            </div>
            <div class="header mar">
                <picker @change="PickerChangeRemindCheckIn" range-key="str" :value="RemindCheckInIdx" :range="RemindCheckIn">
                    <div class="row">
                        <p class="label">
                            上班打卡提醒
                        </p>
                        <p class="cont">
                            {{RemindCheckIn[RemindCheckInIdx]?RemindCheckIn[RemindCheckInIdx].str:''}}
                            <i-icon type="enter" color="#999999" />
                        </p>
                    </div>
                </picker>
                <picker @change="PickerChangeRemindCheckOut" range-key="str" :value="RemindCheckOutIdx" :range="RemindCheckOut">
                    <div class="row">
                        <p class="label">
                            下班打卡提醒
                        </p>
                        <p class="cont">
                            {{RemindCheckOut[RemindCheckOutIdx]?RemindCheckOut[RemindCheckOutIdx].str:''}}
                            <i-icon type="enter" color="#999999" />
                        </p>
                    </div>
                </picker>
            </div>
            <div class="header">
                <picker @change="PickerChangeAdvancedCheckIn" range-key="str" :value="AdvancedCheckInIdx" :range="AdvancedCheckIn">
                    <div class="row">
                        <p class="label">
                            最早打卡时间
                        </p>
                        <p class="cont">
                            {{AdvancedCheckIn[AdvancedCheckInIdx]?AdvancedCheckIn[AdvancedCheckInIdx].str:''}}
                            <i-icon type="enter" color="#999999" />
                        </p>
                    </div>
                </picker>
                <picker @change="PickerChangeLateCheckOut" range-key="str" :value="LateCheckOutIdx" :range="LateCheckOut">
                    <div class="row">
                        <p class="label">
                            最晚打卡时间
                        </p>
                        <p class="cont">
                            {{LateCheckOut[LateCheckOutIdx]?LateCheckOut[LateCheckOutIdx].str:''}}
                            <i-icon type="enter" color="#999999" />
                        </p>
                    </div>
                </picker>
            </div>
            <div class="tips">
                <p>
                    上班时间前多少分钟允许打卡，下班打卡的最晚时间是下班
                    时间点后12小时。
                </p>
            </div>
            <div class="header">
                <div class="row">
                    <p class="label">
                        外勤打卡通知
                    </p>
                    <p class="cont">
                        <van-switch @change="getRemindLeaveWorkCheck" :checked="checked" size="24px" />
                    </p>
                </div>
            </div>
            <div class="tips">
                <p>
                    当员工有外勤打卡时，系统会提醒对应部分主管
                </p>
            </div>
            <div class="header">
                <div class="row">
                    <p class="label">
                        拍照打卡
                    </p>
                    <p class="cont">
                        <van-switch @change="getNeedPhoto" :checked="NeedPhoto" size="24px" />
                    </p>
                </div>
            </div>
            <div class="tips">
                <p>
                    员工上下班打卡时必须拍照
                </p>
            </div>
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box">
                <van-button type="primary" color="#3399ff" @click="getSubmit" block>保存</van-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            checked:false,
            NeedPhoto:false,
            FlexTime:[],
            index:0,
            LateTime:[],
            LateTimeIdx:0,
            AbsenceTime:[],
            AbsenceTimeIdx:0,
            RemindCheckIn:[
                {
                    str:"提前1小时",
                    num:60
                },
                {
                    str:"提前30分钟",
                    num:30
                },
                {
                    str:"提前15分钟",
                    num:15
                },
                {
                    str:"提前10分钟",
                    num:10
                },
                {
                    str:"提前5分钟",
                    num:5
                },
                {
                    str:"上班时间",
                    num:1
                },
                {
                    str:"关闭",
                    num:"false"
                }
            ],
            RemindCheckInIdx:6,
            RemindCheckOut:[
                {
                    str:"关闭",
                    num:"false"
                },
                {
                    str:"下班时间",
                    num:1
                },
                {
                    str:"延迟5分钟",
                    num:5
                },
                {
                    str:"延迟10分钟",
                    num:10
                },
                {
                    str:"延迟15分钟",
                    num:15
                },
                {
                    str:"延迟30分钟",
                    num:30
                },
                {
                    str:"延迟1小时",
                    num:60
                }
            ],
            RemindCheckOutIdx:0,
            AdvancedCheckIn:[
                {
                    str:"提前6小时",
                    num:360
                },
                {
                    str:"提前5小时",
                    num:300
                },
                {
                    str:"提前4小时",
                    num:240
                },
                {
                    str:"提前3小时",
                    num:180
                },
                {
                    str:"提前2小时",
                    num:120
                },
                {
                    str:"提前1小时",
                    num:60
                },
                {
                    str:"未设置",
                    num:"false"
                }
            ],
            AdvancedCheckInIdx:6,
            LateCheckOut:[
                {
                    str:"未设置",
                    num:"false"
                },
                {
                    str:"延迟1小时",
                    num:60
                },
                {
                    str:"延迟2小时",
                    num:120
                },
                {
                    str:"延迟3小时",
                    num:180
                },
                {
                    str:"延迟4小时",
                    num:240
                },
                {
                    str:"延迟5小时",
                    num:300
                },
                {
                    str:"延迟6小时",
                    num:360
                }
            ],
            LateCheckOutIdx:0,
            params:{
                FlexTime:"",
                LateTime:"",
                AbsenceTime:"",
                RemindCheckIn:"",
                RemindCheckOut:"",
                AdvancedCheckIn:"",
                LateCheckOut:""
            },
            sessionkey:""


        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.FlexTime = this.getTimeList();
        this.LateTime = this.getTimeList();
        this.AbsenceTime = this.getTimeList();
        this.params.FlexTime = this.FlexTime[this.index].num;
        this.params.LateTime = this.LateTime[this.LateTimeIdx].num;
        this.params.AbsenceTime = this.AbsenceTime[this.AbsenceTimeIdx].num;
        this.params.RemindCheckIn = this.RemindCheckIn[this.RemindCheckInIdx].num;
        this.params.RemindCheckOut = this.RemindCheckOut[this.RemindCheckOutIdx].num;
        this.params.AdvancedCheckIn = this.AdvancedCheckIn[this.AdvancedCheckInIdx].num;
        this.params.LateCheckOut = this.LateCheckOut[this.LateCheckOutIdx].num;
        this.getQuery();

    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    SessionKey:this.sessionkey,
                    method:"hr.attendsettings.get",
                    Date:""
                }
            }).then(res=>{
                console.log(res);
                let globalSettings = res.data.globalSettings;
                let FlexTimeIdx = this.FlexTime.findIndex((value)=>value.num==globalSettings.FlexTime);
                this.index = FlexTimeIdx;
                let LateTimeIdx = this.LateTime.findIndex((value)=>value.num==globalSettings.LateTime);
                this.LateTimeIdx = LateTimeIdx;
                let AbsenceTimeIdx = this.AbsenceTime.findIndex((value)=>value.num==globalSettings.AbsenceTime);
                this.AbsenceTimeIdx = AbsenceTimeIdx;
                let RemindCheckInIdx = this.RemindCheckIn.findIndex((value)=>value.num==globalSettings.RemindCheckIn);
                this.RemindCheckInIdx = RemindCheckInIdx;
                let RemindCheckOutIdx = this.RemindCheckOut.findIndex((value)=>value.num==globalSettings.RemindCheckOut);
                this.RemindCheckOutIdx = RemindCheckOutIdx;
                let AdvancedCheckInIdx = this.AdvancedCheckIn.findIndex((value)=>value.num==globalSettings.AdvancedCheckIn);
                this.AdvancedCheckInIdx = AdvancedCheckInIdx;
                let LateCheckOutIdx = this.LateCheckOut.findIndex((value)=>value.num==globalSettings.LateCheckOut);
                this.LateCheckOutIdx = LateCheckOutIdx;
                if(globalSettings.RemindLeaveWorkCheck=='true'){
                    this.checked = true;
                }else {
                    this.checked = false;
                }
                if(globalSettings.NeedPhoto=='true'){
                    this.NeedPhoto = true;
                }else {
                    this.NeedPhoto = false;
                }

                this.params.FlexTime = this.FlexTime[this.index].num;
                this.params.LateTime = this.LateTime[this.LateTimeIdx].num;
                this.params.AbsenceTime = this.AbsenceTime[this.AbsenceTimeIdx].num;
                this.params.RemindCheckIn = this.RemindCheckIn[this.RemindCheckInIdx].num;
                this.params.RemindCheckOut = this.RemindCheckOut[this.RemindCheckOutIdx].num;
                this.params.AdvancedCheckIn = this.AdvancedCheckIn[this.AdvancedCheckInIdx].num;
                this.params.LateCheckOut = this.LateCheckOut[this.LateCheckOutIdx].num;
            })
        },
        getTimeList(){
            let list = [];
            for(var i = 1; i < 361; i++){
                var str = i+'分钟';
                var num = i;
                list.push({
                    str:str,
                    num:num
                });
            }
            list.unshift({
                str:"关闭",
                num:false
            })
            return list;
        },
        PickerChangeFlexTime(e){
            this.index = e.mp.detail.value;
            this.params.FlexTime = this.FlexTime[this.index].num;
        },
        PickerChangeLateTime(e){
            this.LateTimeIdx = e.mp.detail.value;
            this.params.LateTime = this.LateTime[this.LateTimeIdx].num;
        },
        PickerChangeAbsenceTime(e){
            this.AbsenceTimeIdx = e.mp.detail.value;
            this.params.AbsenceTime = this.AbsenceTime[this.AbsenceTimeIdx].num;
        },
        PickerChangeRemindCheckIn(e){
            this.RemindCheckInIdx = e.mp.detail.value;
            this.params.RemindCheckIn = this.RemindCheckIn[this.RemindCheckInIdx].num;
        },
        PickerChangeRemindCheckOut(e){
            this.RemindCheckOutIdx = e.mp.detail.value;
            this.params.RemindCheckOut = this.RemindCheckOut[this.RemindCheckOutIdx].num;
        },
        PickerChangeAdvancedCheckIn(e){
            this.AdvancedCheckInIdx = e.mp.detail.value;
            this.params.AdvancedCheckIn = this.AdvancedCheckIn[this.AdvancedCheckInIdx].num;
        },
        PickerChangeLateCheckOut(e){
            this.LateCheckOutIdx = e.mp.detail.value;
            this.params.LateCheckOut = this.LateCheckOut[this.LateCheckOutIdx].num;
        },
        getRemindLeaveWorkCheck(e){
            this.checked = e.mp.detail;
        },
        getNeedPhoto(e){
            this.NeedPhoto = e.mp.detail;
        },
        getSubmit(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    SessionKey:this.sessionkey,
                    method:"hr.attendsettings.save",
                    FlexTime:this.params.FlexTime,
                    LateTime:this.params.LateTime,
                    AbsenceTime:this.params.AbsenceTime,
                    RemindCheckIn:this.params.RemindCheckIn,
                    RemindCheckOut:this.params.RemindCheckOut,
                    AdvancedCheckIn:this.params.AdvancedCheckIn,
                    LateCheckOut:this.params.LateCheckOut,
                    RemindLeaveWorkCheck:this.checked,
                    NeedPhoto:this.NeedPhoto

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
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .content{
            padding-bottom: 80px;
            .mar{
                margin-bottom: 35rpx;
            }
            .header{
                background: #fff;
                .row{
                    padding: 20rpx 33rpx;
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 2rpx solid #eaebeb;
                    align-items: center;
                    .label{
                        font-size: 34rpx;
                        color: #666666;
                    }
                    .cont{
                        font-size: 26rpx;
                        color: #999999;
                    }
                }
            }
            .tips{
                padding: 27rpx 33rpx;
                p{
                    font-size: 26rpx;
                    color: #999999;
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            z-index: 999;
            .box{
                padding: 20rpx 33rpx;
                font-size: 34rpx;
            }
        }
    }
</style>