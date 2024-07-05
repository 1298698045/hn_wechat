<template>
    <div class="wrap">
        <div class="header">
            <p class="cancel" @click="getCancel">取消</p>
            <p class="submit" @click="getSubmit">完成</p>
        </div>
        <div class="container" v-if="!isShow">
            <div class="rowContent">
                <div class="row" v-for="(item,index) in list" :key="index" @click="getSelect(item,index)">
                    <p class="label" :class="{'active':num==index}">
                        {{item.name}}
                    </p>
                    <p v-if="num==index">
                        <i class="iconfont icon-dui"></i>
                        <!-- <i-icon type="right" color="#3399ff" size="20" /> -->
                    </p>
                </div>
            </div>
            <div class="selectWrap" v-if="num==1">
                <picker @change="pickerInterval" :value="intervalIdx" :range="currentDay">
                    <div class="row">
                        <p>
                            间隔
                        </p>
                        <p>
                            <span>{{currentDay[intervalIdx]}}</span>
                            <i-icon type="enter" color="#999999" size="20" />
                        </p>
                    </div>
                </picker>
                <div class="row" @click="getOpenChild">
                    <p>
                        直到
                    </p>
                    <p>
                        <span>{{date!=''?'直到'+date+'终止重复':'永远'}}</span>
                        <i-icon type="enter" color="#999999" size="20" />
                    </p>
                </div>
            </div>
            <div class="selectWrap" v-if="num==2">
                <picker @change="pickerEveryDay" :value="dayIdx" :range="everyDayList">
                    <div class="row">
                        <p>
                            间隔
                        </p>
                        <p>
                            <span>{{everyDayList[dayIdx]}}</span>
                            <i-icon type="enter" color="#999999" size="20" />
                        </p>
                    </div>
                </picker>
                <picker @change="pickerWeek" :value="weekDayIdx" :range="weekDay">
                    <div class="row">
                        <p>
                            天数
                        </p>
                        <p>
                            <span>{{weekDay[weekDayIdx]}}</span>
                            <i-icon type="enter" color="#999999" size="20" />
                        </p>
                    </div>
                </picker>
                <div class="row" @click="getOpenChild">
                    <p>
                        直到
                    </p>
                    <p>
                        <span>{{date!=''?'直到'+date+'终止重复':'永远'}}</span>
                        <i-icon type="enter" color="#999999" size="20" />
                    </p>
                </div>
            </div>
            <div class="selectWrap" v-if="num==3">
                <picker @change="pickerEveryMonth" :value="monthIdx" :range="everyMonthList">
                    <div class="row">
                        <p>
                            间隔
                        </p>
                        <p>
                            <span>{{everyMonthList[monthIdx]}}</span>
                            <i-icon type="enter" color="#999999" size="20" />
                        </p>
                    </div>
                </picker>
                <picker @change="pickerMonthDay" :value="monthDayIdx" :range="currenMonthDay">
                    <div class="row">
                        <p>
                            天数
                        </p>
                        <p>
                            <span>{{currenMonthDay[monthDayIdx]}}</span>
                            <i-icon type="enter" color="#999999" size="20" />
                        </p>
                    </div>
                </picker>
                <div class="row" @click="getOpenChild">
                    <p>
                        直到
                    </p>
                    <p>
                        <span>{{date!=''?'直到'+date+'终止重复':'永远'}}</span>
                        <i-icon type="enter" color="#999999" size="20" />
                    </p>
                </div>
            </div>
            <div class="selectWrap" v-if="num==4">
                <picker @change="pickerYear" :value="yearIdx" :range="everyYearList">
                    <div class="row">
                        <p>
                            间隔
                        </p>
                        <p>
                            <span>{{everyYearList[yearIdx]}}</span>
                            <i-icon type="enter" color="#999999" size="20" />
                        </p>
                    </div>
                </picker>
                <div class="row">
                    <p>
                        直到
                    </p>
                    <p>
                        <span>永远</span>
                        <i-icon type="enter" color="#999999" size="20" />
                    </p>
                </div>
            </div>
            <h3 v-if="num!=0">{{num==1?'每天重复':num==2?'每周重复':num==3?'每月':num==4?'每年':''}}</h3>
            <div class="footer">
                <div class="boxChild">
                    <van-button type="primary" color="#3399ff" @click="getSubmit" block>完成</van-button>
                </div>
            </div>
        </div>
        <selectCalendar v-if="isShow" @paramsChild="getParams" />
        <van-action-sheet
            :show="show"
            cancel-text="取消"
            @close="getClose"
            @cancel="getClose"
        >
            <div class="sheetWrap">
                <p @click="getForever">永远</p>
                <picker mode="date" :value="date"  @change="bindDateChange">
                    <p>特定日期</p>
                </picker>
            </div>
        </van-action-sheet>
    </div>
</template>
<script>
import selectCalendar from './selectCalendar';
export default {
    name:"repeat",
    components:{
        selectCalendar
    },
    props: ['RecurrenceType2'],
    data(){
        return {
            list:[
                {
                    name:"无",
                    tag:""
                },
                {
                    name:"每天",
                    tag:"ftd"
                },
                {
                    name:"每周",
                    tag:"ftw"
                },
                {
                    name:"每月",
                    tag:"ftm"
                }
            ],
            num:0,
            intervalIdx:0,
            dayIdx:0,
            monthIdx:0,
            weekDay:[
                '星期日',
                '星期一',
                '星期二',
                '星期三',
                '星期四',
                '星期五',
                '星期六'
            ],
            weekDayIdx:0,
            yearIdx:0,
            isShow:false,
            typeName:"",
            dTags:"",
            recurrenceType:"",
            show:false,
            date:"",
            monthDayIdx:0
        }
    },
    computed:{
        currentDay(){
            let temp = [];
            for(var i=1; i<=10; i++){
                let str = i+'天'
                temp.push(str)
            }
            return temp;
        },
        everyDayList(){
            let temp = [];
            for(var i=1; i<=10; i++){
                let str = i+'周'
                temp.push(str)
            }
            return temp;
        },
        everyMonthList(){
            let temp = [];
            for(var i=1; i<=10; i++){
                let str = i+'月'
                temp.push(str)
            }
            return temp;
        },
        currenMonthDay(){
            let temp = [];
            for(var i=1; i<=31; i++){
                let str = i;
                temp.push(str);
            }
            return temp;
        },
        everyYearList(){
            let temp = [];
            for(var i=1; i<=10; i++){
                let str = i+'年'
                temp.push(str)
            }
            return temp;
        },
        cSign(){
            return this.intervalIdx==0?'d0':'d1'+'|'+this.intervalDay;
        },
        intervalDay(){
            return Number(this.intervalIdx)+1;
        },
        weekSign(){
            return (Number(this.dayIdx)+1)+'|'+(Number(this.weekDayIdx));
        },
        monthSign(){
            return 'm0|'+(Number(this.monthIdx)+1)+'|' + (Number(this.monthDayIdx)+1);
        }
    },
    onLoad(){
        this.getRepeatData();
    },
    methods:{
        // 赋值
        getRepeatData(v){
            let temp = this.RecurrenceType2.split("|");
            console.log("temp", temp);
            if(temp && temp.length > 0){
                this.num = this.list.findIndex(item=>item.tag==temp[0]);
                this.dTags = this.list[this.num].tag+'|';
                if(temp[1] && this.num==1){
                    let arr = this.currentDay.map(item=>{
                        return item.split('天')[0];
                    });
                    if(temp[1] == 'd0'){
                        this.intervalIdx = 0;
                        if(temp[2]){
                            this.date = temp[2];
                        }else {
                            this.date =  '';
                        }
                    }else {
                        this.intervalIdx = arr.findIndex(item=>item==temp[2]);
                        if(temp[3]){
                            this.date = temp[3];
                        }else {
                            this.date =  '';
                        }
                    }
                }else if(temp[1] && this.num == 2){
                    let arr = this.everyDayList.map(item=>{
                        return item.split('周')[0];
                    });
                    this.dayIdx = arr.findIndex(item=>item==temp[1]);
                    var weekArr = [0, 1, 2, 3, 4, 5, 6];
                    this.weekDayIdx = weekArr.findIndex(item=>item==temp[2]);
                    if(temp[3]){
                        this.date = temp[3];
                    }else {
                        this.date =  '';
                    }
                }else if(temp[1] && this.num == 3){
                    let arr = this.everyMonthList.map(item=>{
                        return item.split('月')[0];
                    });
                    this.monthIdx = arr.findIndex(item=>item==temp[2]);
                    this.monthDayIdx = this.currenMonthDay.findIndex(item=>item==temp[3]);
                    if(temp[4]){
                        this.date = temp[4];
                    }else {
                        this.date =  '';
                    }
                }
            }
        },
        getParams(v){
            console.log(v,'child');
            this.typeName = v;
        },
        getSelect(item,index){
            if(index==2){
                this.weekDayIdx = new Date().getDay();
            }
            this.num = index;
            this.dTags = item.tag+'|';
            this.date = '';
        },
        pickerInterval(e){
            this.intervalIdx = e.mp.detail.value;
            console.log(this.intervalIdx);
        },
        pickerEveryDay(e){
            this.dayIdx = e.mp.detail.value;
            console.log(this.dayIdx);
        },
        pickerWeek(e){
            this.weekDayIdx = e.mp.detail.value;
        },
        pickerEveryMonth(e){
            this.monthIdx = e.mp.detail.value;
        },
        pickerYear(e){
            this.yearIdx = e.mp.detail.value;
        },
        pickerMonthDay(e){
            this.monthDayIdx = e.mp.detail.value;
        },
        getSubmit(){
            if(this.num==1){
                if(this.date!=''){
                    this.recurrenceType = this.dTags+this.cSign+'|'+this.date;
                }else {
                    this.recurrenceType = this.dTags+this.cSign;
                }
            }else if(this.num==2){
                if(this.date!=''){
                    this.recurrenceType = this.dTags+this.weekSign+'|'+this.date;
                }else {
                    this.recurrenceType = this.dTags+this.weekSign;
                }
            }else if(this.num==3){
                if(this.date!=''){
                    this.recurrenceType = this.dTags+this.monthSign+'|'+this.date;
                }else {
                    this.recurrenceType = this.dTags+this.monthSign;
                }
            }else {
                this.recurrenceType = '无';
            }
            console.log(this.recurrenceType,'this.dTags+this.cSign');
            this.$emit('childParams',this.recurrenceType)
            this.$parent.repeatShow = false;
        },
        getCancel(){
            this.$parent.repeatShow = false;
        },
        getOpenChild(){
            // this.isShow = true;
            this.show = true;
        },
        bindDateChange(e){
            this.date = e.mp.detail.value;
            this.show = false;
        },
        getForever(){
            this.date = '';
            this.show = false;
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../../static/css/schedule.css';
    .wrap{
        .header{
            display: flex;
            justify-content: space-between;
            background: #fff;
            padding: 32rpx 33rpx;
            width: 100%;
            position: fixed;
            top: 0;
            z-index: 99999;
            .cancel{
                font-size: 34rpx;
                color: #999999;
            }
            .submit{
                font-size: 34rpx;
                color: #3399ff;
            }
        }
        .container{
            margin-top: 65px;
            .rowContent{
                background: #fff;
                .row{
                    display: flex;
                    justify-content: space-between;
                    padding: 33rpx;
                    border-bottom: 2rpx solid #ebedec;
                    font-size: 33rpx;
                    .label.active{
                        color: #3399ff;
                    }
                    .label{
                        color: #333333;
                    }
                    .iconfont{
                        color: #3399ff;
                    }
                }
            }
            .selectWrap{
                background: #fff;
                margin-top: 35rpx;
                .row{
                    display: flex;
                    justify-content: space-between;
                    padding: 33rpx;
                    border-bottom: 2rpx solid #ebedec;
                    font-size: 33rpx;
                    span{
                        font-size: 31rpx;
                    }
                }
            }
            h3{
                font-size: 26rpx;
                color: #999999;
                padding: 10rpx 33rpx;
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            .boxChild{
                padding: 26rpx 24rpx;
            }
        }
        .sheetWrap{
            text-align: center;
            p{
                line-height: 112rpx;
                font-size: 36rpx;
                color: #333333;
                background: #fff;
            }
            p:nth-child(1){
                border-bottom: 1rpx solid #e2e3e5;
            }
        }
    }
</style>