<template>
    <div class="wrap">
        <div class="header">
            <div class="l">
                <p>{{name}}</p>
            </div>
            <div class="c">
                <p class="name">{{name}}</p>
                <p class="depart">考勤组：{{deptName}}</p>
            </div>
            <div class="r">
                <p>{{erveyDate}} {{day}}</p>
            </div>
        </div>
        <div class="calendar">
            <Calendar
                :value="date"
                lunar
                clean
                @select="select"
                ref="calendar"
            />
        </div>
        <h3>
            班次:默认班次 {{shifts}}
        </h3>
        <div class="center">
            <div class="row">
                <p>L</p>
                <p>今日打卡3次，计为1天出勤</p>
            </div>
            <div class="content">
                <div class="boxWrap" v-for="(item,index) in dataInfo.attendData" :key="index">
                    <div class="lBox">
                        <p>{{item.CheckType==0?'上':item.CheckType==1?'下':''}}</p>
                        <span></span>
                    </div>
                    <div class="rBox">
                        <p class="time">打卡时间 {{item.CheckTime==''?'无':item.CheckTime}} <span>({{item.CheckType==0?'上班时间':item.CheckType==1?'下班时间':''}} {{item.OnTime}})</span></p>
                        <p class="adress" v-if="item.Location!=''">
                            <i-icon type="coordinates" color="#999999;" />
                            {{item.Location}}
                        </p>
                        <p class="tag" :class="item.className">
                            {{item.AbnormalCode==1?'迟到':item.AbnormalCode==2?'早退':item.AbnormalCode==3?'缺卡':item.CheckType=='3'?'外勤':''}}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <p>
                <i-icon type="message" color="#3399ff" size="20" />
                联系张丽萍
            </p>
        </div>
    </div>
</template>
<script>
import Calendar from 'mpvue-calendar'
import 'mpvue-calendar/src/style.css';
export default {
    components:{
        Calendar
    },
    data(){
        return {
            date:"",
            erveyDate:"",
            day:"",
            name:"",
            deptName:"",
            SessionKey:"207A11C0-12E3-4F7E-8033-F61B6883FFD8",
            dataInfo:{},
            shifts:"",
        }
    },
    onLoad(options){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.SessionKey = sessionkey;
        this.name = options.name;
        this.deptName = options.deptName;
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth()+1;
        let d = date.getDate();
        this.erveyDate = `${y}-${m}-${d}`;
        var weekDay = [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ];
        var myDate = new Date( Date.parse( this.erveyDate ) );
        this.day = weekDay[ myDate.getDay() ];
        console.log(this.day);
        this.date = this.erveyDate.split('-');
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"hr.attend.empdaily.get",
                    SessionKey:this.SessionKey,
                    AttendDate:this.erveyDate
                }
            }).then(res=>{
                console.log(res);
                this.dataInfo = res.data;
                let  shiftsOne = this.dataInfo.userSettings.startTime1+'-'+this.dataInfo.userSettings.endTime1;
                let  shiftsTwo = this.dataInfo.userSettings.startTime2+'-'+this.dataInfo.userSettings.endTime2;
                let  shiftsThree = this.dataInfo.userSettings.startTime3+'-'+this.dataInfo.userSettings.endTime3;
                this.shifts = shiftsOne+'   '+shiftsTwo+'   '+shiftsThree;
                this.dataInfo.attendData.forEach(item=>{
                    let className = '';
                    if(item.AbnormalCode==1||item.AbnormalCode==2||item.AbnormalCode==3){
                        className = 'zaotui'
                        this.$set(item,'className',className);
                    }else if(item.CheckType==3){
                        className = 'waiqin'
                        this.$set(item,'className',className);
                    }else {
                        className = 'tag'
                        this.$set(item,'className',className);
                    }
                })
            })
        },
        select(val1,val2){
            console.log(val1,val2);
        }
    }
}
</script>
<style lang="scss">
@import '../../../../static/css/public.scss';
.calendar-tools{
    display: none !important;
}
.mpvue-calendar{
    background: #f8f8f8!important;
}
    .wrap{
        .header{
            display: flex;
            padding: 25rpx 33rpx;
            background: #fff;
            display: flex;
            align-items: center;
            .l{
                p{
                    width: 79rpx;
	                height: 79rpx;
                    line-height: 79rpx;
                    text-align: center;
                    border-radius: 50%;
                    background: #3399ff;
                    color: #fff;
                    font-size: 25rpx;
                }
            }
            .c{
                flex: 1;
                margin-left: 20rpx;
                .name{
                    font-size: 29rpx;
                    color: #333333;
                }
                .depart{
                    font-size: 25rpx;
                    color: #526992;
                }
            }
            .r{
                p{
                    font-size: 25rpx;
                    color: #333333;
                }
            }
        }
        .calendar{
            background: #f8f8f8;
        }
        h3{
            background: #f2f2f2;
            padding:0 33rpx 31rpx 33rpx;
            color: #999999;
            font-size: 26rpx;
        }
        .center{
            // padding: 0 33rpx;
            padding-bottom: 80px;
            background: #f8f8f8;
            .row{
                padding: 31rpx 33rpx;
                font-size: 29rpx;
                color: #333333;
                border-bottom: 1rpx solid #eaebeb;
                display: flex;
                align-items: center;
                p:nth-child(1){
                    width: 33rpx;
                    height: 33rpx;
                    line-height: 33rpx;
                    text-align: center;
                    border-radius: 50%;
                    color: #fff;
                    font-size: 10px;
                    background: #3399ff;
                }
                p:nth-child(2){
                    font-size: 29rpx;
                    color: #333333;
                    margin-left: 20rpx;
                }
            }
            .content{
                padding: 31rpx 33rpx;
                .boxWrap{
                    display: flex;
                    .lBox{
                        text-align: center;
                        p{
                            width: 33rpx;
                            height: 33rpx;
                            line-height: 33rpx;
                            text-align: center;
                            border-radius: 50%;
                            color: #fff;
                            font-size: 10px;
                            background: #b2b2b2;
                        }
                        span{
                            display: inline-block;
                            width: 2rpx;
                            height: 150rpx;
                            background: #e0e0e0;
                            text-align: center;
                        }
                    }
                    .rBox{
                        margin-left: 20rpx;
                        .time{
                            font-size: 29rpx;
                            color: #333333;
                            span{
                                color: #999999;
                            }
                        }
                        .adress{
                            font-size: 25rpx;
                            color: #999999;
                            margin-top: 10rpx;
                        }
                        .tag{
                            width: 83rpx;
                            height: 33rpx;
                            line-height: 33rpx;
                            text-align: center;
                            background: #3399ff;
                            font-size: 22rpx;
                            color: #fff;
                            border-radius: 19rpx;
                            margin: 20rpx 0 10rpx 0;
                        }
                        .tag.zaotui{
                            background: #ff9237;
                        }
                        .tag.waiqin{
                            background: #39c1b3;
                        }
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            p{
                text-align: center;
                color: #3399ff;
                font-size: 33rpx;
                padding: 37rpx 0;
            }
        }
    }
</style>