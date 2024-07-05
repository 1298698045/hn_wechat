<template>
    <div class="wrap">
        <div class="header">
            <div class="row">
                <div class="avatar">
                    {{Survey.newName}}
                </div>
                <div class="info">
                    <p class="name">{{Survey.ModifiedByName}}</p>
                    <p class="time">
                        信息中心    {{Survey.ModifiedOn}}
                    </p>
                </div>
            </div>
            <div class="preview">
                <span @click="getPreview">查看人员</span>
            </div>
            <div class="title">
                {{Survey.Name}}
                
            </div>
            <div class="describe">
                {{Survey.Description}}
            </div>
            <div class="box">
                <p class="time">
                    <i class="iconfont icon-shijian-copy"></i>
                    {{Survey.mon}} {{Survey.weekName}} {{Survey.hourmin}} 截止</p>
                <p class="num">
                    <i class="iconfont icon-canyuren"></i>
                    <span class="active">{{Survey.NumOfResponses}}</span>
                    <span>&nbsp;/&nbsp;{{Survey.NumOfInvitationsSent}}</span>
                </p>
            </div>
        </div>
        <div class="center">
            <div class="content" v-for="(item,index) in Survey.Questions" :key="index">
                <p class="subject">{{index+1}}. {{item.Name}}</p>
                <div class="cont_box" v-if="item.QuestionType==1">
                    <van-radio-group :value="item.value">
                        <van-radio v-for="(v,i) in item.Options" :key="i" :name="v.AnswerOptionNumber" custom-class="radio">{{i+1}}.{{v.Name}}
                            <p class="progress">
                                <span :style="{width:v.PercentOfResponse+'%',background:colorList[i]}"></span>
                            </p>
                            <p style="padding-top:10rpx;">
                                {{v.PercentOfResponse}} / {{Survey.NumOfInvitationsSent}}
                            </p>
                        </van-radio>
                    </van-radio-group>
                </div>
                <div class="cont_box" v-else-if="item.QuestionType==2" >
                    <van-checkbox-group :value="item.value">
                        <van-checkbox v-for="(v,i) in item.Options" :key="i" shape="square" :name="v.AnswerOptionNumber" custom-class="checkbox" >{{i+1}}.{{v.Name}}
                            <p class="progress">
                                <span :style="{width:v.PercentOfResponse+'%',background:colorList[i]}"></span>
                            </p>
                        </van-checkbox>
                    </van-checkbox-group>
                </div>
                <div class="answer" v-if="item.QuestionType==5||item.QuestionType==52">
                    <p class="cont">{{item.ResponseText || ''}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {splitName} from '@/utils/splitName';
export default {
    data(){
        return {
            id:"",
            Survey:"",
            colorList:[
                '#3399ff',
                'red',
                'yellow',
                '#FF6666'
            ]
        }
    },
    computed:{
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        },
        userId(){
            return wx.getStorageSync('userId');
        }
    },
    onLoad(options){
        this.id = options.id;
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"survey.get",
                    SessionKey:this.sessionkey,
                    Id:this.id,
                    condid:this.userId
                }
            }).then(res=>{
                this.Survey = res.Survey;
                this.Survey.newName = splitName(this.Survey.ModifiedByName);
                let {mon,weekName,hourmin} = this.dateFun(this.Survey.EndDate);
                this.Survey.mon = mon;
                this.Survey.weekName = weekName;
                this.Survey.hourmin = hourmin;
                let arr = [];
                this.Survey.Questions.forEach((item,index)=>{
                    item.Options.forEach(v=>{
                        if(item.QuestionType==1&&v.IsSelected==1){
                            item.value = v.AnswerOptionNumber;
                        }else if(item.QuestionType==2&&v.IsSelected==1){
                            arr.push(v.AnswerOptionNumber);
                            item.value = arr;
                        }
                    })
                })
            })
        },
        dateFun(time){
            let week = ['周日','周一','周二','周三','周四','周五','周六']
            let date = new Date(time);
            let y = date.getFullYear();
            let m = this.formatStr(date.getMonth()+1);
            let d = this.formatStr(date.getDate());
            let h = this.formatStr(date.getHours());
            let min = this.formatStr(date.getMinutes());
            let day = date.getDay();
            let mon = `${m}月${d}日`;
            let weekName = week[day];
            let hourmin = `${h}:${min}`;
            return {
                mon,weekName,hourmin
            }
        },
        formatStr(str){
            return str < 10 ? '0'+str :str;
        },
        getPreview(){
            const url = '/pages/questionnaire/surveyPeople/main?id='+this.Survey.SurveyId;
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
@import '../../../../static/css/vote.css';
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .header{
            padding: 0 26rpx;
            background: #fff;
            .row{
                display: flex;
                padding: 26rpx 0;
                .avatar{
                    width: 75rpx;
                    height: 75rpx;
                    line-height: 75rpx;
                    text-align: center;
                    font-size: 24rpx;
                    color: #fff;
                    background: #3399ff;
                    border-radius: 50%;
                }
                .info{
                    flex: 1;
                    margin-left: 25rpx;
                    .name{
                        font-size: 28rpx;
                        color: #333333;
                    }
                    .time{
                        font-size: 22rpx;
                        color: #999999;
                    }
                }
            }
            .preview{
                span{
                    font-size: 28rpx;
                    color: #3399ff;
                    border-bottom: 1rpx solid #3399ff;
                }
            }
            .title{
                font-size: 39rpx;
                color: #3399ff;
                font-weight: bold;
                padding: 21rpx 0;
            }
            .describe{
                font-size: 31rpx;
                color: #666666;
            }
            .box{
                display: flex;
                padding: 28rpx 0;
                align-items: center;
                margin-top: 28rpx;
                justify-content: space-between;
                p{
                    font-size: 24rpx;
                    color: #999999;
                    display: flex;
                    align-items: center;
                    i{
                        margin-right: 10rpx;
                    }
                }
                .num{
                    display: flex;
                    margin-left: 20rpx;
                    align-items: center;
                    span{
                        font-size: 24rpx;
                        color: #999999;
                    }
                    .active{
                        font-size: 35rpx;
                        color: #3399ff;
                        font-weight: bold;
                    }
                }
            }
        }
        .center{
            padding: 0 26rpx;
            background: #fff;
            .content{
                padding-bottom: 33rpx;
                .subject{
                    font-size: 33rpx;
                    color: #333333;
                    font-weight: bold;
                }
                .cont_box{
                    background: #fff;
                    border-radius: 12rpx;
                    .radio{
                        padding: 20rpx 37rpx;
                        border-bottom: 1rpx solid #e2e3e5;
                        font-size: 32rpx;
                        color: #666666;
                        .progress{
                            width: 331rpx;
                            height: 21rpx;
                            background: #e5e5e5;
                            margin-top: 27rpx;
                            span{
                                display: block;
                                width: 30rpx;
                                height: 100%;
                                background: #ff6666;
                            }
                        }
                    }
                    .checkbox{
                        padding: 20rpx 37rpx !important;
                        border-bottom: 1rpx solid #e2e3e5;
                        font-size: 32rpx;
                        color: #666666;
                        display: flex!important;
                        align-items: center!important;
                        .progress{
                            width: 331rpx;
                            height: 21rpx;
                            background: #e5e5e5;
                            margin-top: 27rpx;
                            span{
                                display: block;
                                width: 30rpx;
                                height: 100%;
                                background: #ff6666;
                            }
                        }
                    }
                    .inp{
                        width: 100%;
                        height: 100rpx;
                        padding: 0 27rpx;
                    }
                    .textarea{
                        width: 100%;
                        height: 191rpx;
                        padding: 10rpx 27rpx;
                    }
                }
                .answer{
                    width: 100%;
                    background: #f8f8f8;
                    padding: 0 21rpx;
                    margin-top: 18rpx;
                    border-radius: 12rpx;
                    .cont{
                        font-size: 33rpx;
                        color: #333333;
                        padding: 37rpx 0;
                    }
                }
            }
        }
    }
</style>