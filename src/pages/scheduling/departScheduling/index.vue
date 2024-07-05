<template>
    <div class="wrap" @click="cancelMore">
        <div class="header">
            <div class="year">&nbsp;&nbsp;</div>
            <div class="andTime">
                <div class="leftIcon" @click="getPrevTime">
                    <i-icon type="return" size="20" />
                </div>
                <div class="cont">
                    <span class="start_time">{{timeList[0].time}}</span>
                    至
                    <span class="end_time">{{timeList[6].time}}</span>
                </div>
                <div class="rightIcon" @click="getNextTime">
                    <i-icon type="enter" size="20" />
                </div>
            </div>
            <p class="release">
                发布
            </p>
        </div>
        <div class="table">
            <div class="tr tr_head">
                <div class="td td_name">
                    姓名
                </div>
                <div class="td">
                    <p class="day">一</p>
                    <p class="time">
                        {{timeList[0].date}}
                    </p>
                </div>
                <div class="td">
                    <p class="day">二</p>
                    <p class="time">
                        {{timeList[1].date}}
                    </p>
                </div>
                <div class="td">
                    <p class="day">三</p>
                    <p class="time">
                        {{timeList[2].date}}
                    </p>
                </div>
                <div class="td">
                    <p class="day">四</p>
                    <p class="time">
                        {{timeList[3].date}}
                    </p>
                </div>
                <div class="td">
                    <p class="day">五</p>
                    <p class="time">
                        {{timeList[4].date}}
                    </p>
                </div>
                <div class="td">
                    <p class="day">六</p>
                    <p class="time">
                        {{timeList[5].date}}
                    </p>
                </div>
                <div class="td">
                    <p class="day">日</p>
                    <p class="time">
                        {{timeList[6].date}}
                    </p>
                </div>
            </div>
            <div class="tbody">
                <div class="tr tr_cont" id="table_tr" v-for="(item,index) in list" :key="index">
                    <div class="td td_name_cont" :style="{'height':tdHeight+'px','line-height':tdHeight+'px'}" @click="getCheck(1)">
                        {{item.Name}}
                    </div>
                    <div class="td tds" :class="{'active':idx==activeIdx&&index==activeIndex}" v-for="(v,idx) in item.AttendData" :key="idx" :style="{'height':tdHeight+'px'}" @click="setShift(v,index, idx)">
                        <p>
                            <span v-for="(self,i) in v.Shifts" :key="i">{{self.WorkShiftIdName}}</span>
                        </p>
                    </div>
                    <!--
                        <div class="td" :style="{'height':tdHeight+'px'}"></div>
                        <div class="td" :style="{'height':tdHeight+'px'}"></div>
                        <div class="td" :style="{'height':tdHeight+'px'}"></div>
                        <div class="td" :style="{'height':tdHeight+'px'}"></div>
                        <div class="td" :style="{'height':tdHeight+'px'}"></div>
                        <div class="td" :style="{'height':tdHeight+'px'}"></div>
                        <div class="td" :style="{'height':tdHeight+'px'}"></div>
                    -->
                </div>
            </div>
        </div>
        <div class="operation">
            <p class="add" @click="addPeople">添加人员</p>
            <p class="del" @click="delPeople">删除人员</p>
        </div>
        <div class="remarks">
            <p class="label">排版备注</p>
            <!-- <van-field
                :value="remarks"
                type="textarea"
                placeholder="点击输入排班备注"
                autosize
                :border="false"
            /> -->
            <textarea v-model="remarks" placeholder="点击输入排班备注" name="" id="" cols="30" rows="10"></textarea>
        </div>
        <van-popup
            :show="isShift"
            position="bottom"
            @close="closeShift"
            :overlay="false"

        >
            <div class="popup">
                <div class="column">
                    <div class="item">
                        <p class="icon">
                            <van-icon name="like-o" />
                        </p>
                        <p class="name">期望排版</p>
                    </div>
                    <div class="item">
                        <p class="icon">
                            <van-icon name="like-o" />
                        </p>
                        <p class="name">自动排班</p>
                    </div>
                    <div class="item">
                        <p class="icon">
                            <van-icon name="like-o" />
                        </p>
                        <p class="name">排班检查</p>
                    </div>
                    <div class="item">
                        <p class="icon">
                            <van-icon name="like-o" />
                        </p>
                        <p class="name">轮班设置</p>
                    </div>
                    <div class="item">
                        <div @click.stop="handleMore">
                            <p class="icon">
                                <van-icon name="like-o" />
                            </p>
                            <p class="name">更多</p>
                        </div>
                        <div class="select" v-if="isMore">
                            <p class="option" @click="clearSchedule">清空排班表</p>
                            <p class="icon"></p>
                        </div>
                    </div>
                    <div class="item" @click="closeShift">
                        <p class="icon">
                            <van-icon name="arrow-down" />
                        </p>
                    </div>
                </div>
                <div class="shift_bd">
                    <div class="left">
                        <div class="item" @click="clearShift">
                            <p class="icon">
                                <i-icon type="trash" size=20 />
                            </p>
                            删除
                        </div>
                    </div>
                    <div class="right">
                        <swiper
                            :current="current"
                            @change="getCurrent"
                            slidesPerView="1"
                            :autoplay="false"
                            class="swiper_wrap"
                            :indicator-dots="true"
                            indicator-color="#f4f4f4"
                            indicator-active-color="#3399ff"

                        >
                            <swiper-item class="swiper_item" v-for="(self,idx) in shiftList" :key="idx">
                                <div class="bd">
                                    <p class="tag" :class="{active:item.Id==shiftId}" v-for="item in self" :key="item.Id" @click="handleChoice(item)">{{item.Name}}</p>
                                    <p class="tag tag_add" v-if="self.length<8" @click="handleAddShift">
                                        <i-icon type="add" size=20 color="#3399ff" />
                                    </p>
                                    <p class="fack_item"></p>
                                    <p class="fack_item"></p>
                                </div>
                            </swiper-item>
                        </swiper>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
    data(){
        return {
            tdHeight:"",
            currentList:[],
            activeIdx:0,
            list:[
                {
                    AttendDate:[]
                }
            ],
            isShift: true,
            activeIdx: -1,
            activeIndex: -1,
            shiftList: [
                {
                    id:1,
                    name: '白班'
                },
                {
                    id:2,
                    name: '中班'
                },
                {
                    id:3,
                    name: '晚班'
                },
                {
                    id:4,
                    name: '夜班'
                },
                {
                    id:5,
                    name: '行政'
                },
                {
                    id:6,
                    name: '休息'
                },
                {
                    id:1,
                    name: '白班'
                },
                {
                    id:2,
                    name: '中班'
                },
                {
                    id:3,
                    name: '晚班'
                },
                {
                    id:4,
                    name: '夜班'
                },
                {
                    id:5,
                    name: '行政'
                },
                {
                    id:6,
                    name: '休息'
                }
            ],
            current: 0,
            isMore: false,
            unitId:'',
            shiftId: '',
            departId:''
        }
    },
    computed:{
        timeList(){
            let temp = [];
            this.currentList.forEach(item=>{
                let newDate = new Date(item.replace(/-/g,'/'));
                const time = newDate.getDate() >= 10 ? newDate.getDate() : '0'+newDate.getDate();
                temp.push({
                    time:item,
                    date:time
                })
            })
            return temp;
        },
        sessionkey(){
            return wx.getStorageSync('sessionkey')
        },
        unitId(){
            return wx.getStorageSync('businessUnitId');
        },
        startTime(){
            return this.startTime = this.currentList[0];
        },
        endTime(){
            return this.startTime = this.currentList[this.currentList.length-1];
        },
        ...mapState({
            selectListName: (state) => {
                return state.mailList.selectListName;
            }
        })
    },
    onLoad(){
        wx.createSelectorQuery().select('.td').boundingClientRect(rect=>{
          this.tdHeight = rect.width;
        }).exec();
        let date = new Date();
        let currentTime = date.getTime();
        this.currentList = this.getDates(currentTime);
        this.getQuery();
        // this.startTime = this.
        // this.currentList.forEach(item=>{
        //     let newDate = new Date(item.replace(/-/g,'/'));
        //     const time = newDate.getDate() >= 10 ? newDate.getDate() : '0'+newDate.getDate();
        //     this.timeList.push({
        //         time:item,
        //         date:time
        //     })
        // })
    },
    onShow(){
        // 选择的人
        console.log('selectListName:', this.selectListName)
        let ids = this.selectListName.map(item=> item.id).join(',')
        if(this.selectListName.length>0){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method: this.$api.scheduling.add_employee,
                    SessionKey: this.sessionkey,
                    unitId:this.unitId,
                    startDate: this.timeList[0].time,
                    endDate: this.timeList[6].time,
                    employeeId: ids
                }
            }).then(res=>{
                console.log(res);
            })
            this.getQuery();
        }
    },
    onUnload(){
        this.getClear([]);
    },
    methods:{
        ...mapMutations(['getClear']),
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    SessionKey:this.sessionkey,
                    method:this.$api.scheduling.departQuery,
                    // unitId:this.unitId,
                    startDate:this.startTime,
                    endDate:this.endTime,
                    unitType:10,
                    viewMode:2,
                    calendar:1,
                    md0: 0,
                    md1: 0
                }
            }).then(res=>{
                this.list = res.listData;
                this.shiftList = res.AttendTypes;
                let result = []
                for(var i=0;i<this.shiftList.length;i+=8){
                    result.push(this.shiftList.slice(i,i+8))
                }
                this.shiftList = result;
                this.departId = res.Units[0].businessUnitId;
                this.unitId = res.UnitId;
                console.log(result)
            })
        },
        getDates(currentTime) {//JS获取当前周从星期一到星期天的日期
            var currentDate = new Date(currentTime)
            var timesStamp = currentDate.getTime();
            var currenDay = currentDate.getDay();
            var dates = [];
            for (var i = 0; i < 7; i++) {
                dates.push(new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7)).toLocaleDateString().replace(/\//g, '-'));
            }
            return dates
        },
        // 上一周
        getPrevTime(){
            let startTime = new Date(this.timeList[0].time.replace(/-/g,'/')).getTime() - 7 * 24 * 60 * 60 * 1000;
            this.currentList = this.getDates(startTime);
            this.getQuery();
        },
        // 下一周
        getNextTime(){
            let startTime = new Date(this.timeList[0].time.replace(/-/g,'/')).getTime() + 7 * 24 * 60 * 60 * 1000;
            this.currentList = this.getDates(startTime);
            this.getQuery();
        },
        getCheck(index){
            this.num = index;
        },
        closeShift(){
            this.isShift = false;
        },
        setShift(v,index, idx){
            console.log(v)
            this.activeIndex = index
            this.activeIdx = idx
                // console.log(this.list[index].Name,this.timeList[idx].time)
            if(v.ShiftSymbol==""&&this.shiftId){
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method: this.$api.scheduling.set_shift,
                        SessionKey:this.sessionkey,
                        day: this.timeList[idx].time,
                        objectTypeCode: 10,
                        UnitId: this.unitId,
                        deptId: this.departId,
                        workshiftId: this.shiftId,
                        employeeId: this.list[index].EmployeeId
                    }
                }).then(res=>{
                    console.log(res);
                    this.isShift = true
                    
                })
            }else {
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method: this.$api.scheduling.del_shift,
                        SessionKey:this.sessionkey,
                        objectTypeCode: 10,
                        deptId: this.departId,
                        employeeId: this.list[index].EmployeeId,
                        id: v.Shifts[0].EmpWorkShiftId
                    }
                }).then(res=>{
                    console.log(res);
                    this.isShift = true
                    
                })
            }
            this.getQuery();
            
        },
        // 选择班次
        handleChoice(item){
            this.shiftId = item.Id;
            item.id = item.Id;
            item.name = item.Name;
            // if(this.activeIdx>=0){
            //     let isContain = this.list[this.activeIndex].AttendData[this.activeIdx].Shifts.some(self=>self.id==item.id);
            //     if(!isContain){
            //         this.list[this.activeIndex].AttendData[this.activeIdx].Shifts.push({
            //             id: item.id,
            //             WorkShiftIdName: item.name
            //         })
            //         if(this.list[this.activeIndex].AttendData[this.activeIdx].Shifts!=''){
            //             this.activeIdx < 6 ? this.activeIdx++ : (this.activeIndex<this.list.length-1 ? (this.activeIndex++,this.activeIdx=0):this.activeIdx)
            //             console.log(this.activeIndex,'activeIndex')
            //         }
            //     }
            // }
        },
        // 清空班次
        clearShift(){
            if(this.activeIdx>=0){
                this.list[this.activeIndex].AttendData[this.activeIdx].Shifts = [];
            }
        },
        handleMore(){
            this.isMore = !this.isMore;
        },
        cancelMore(){
            this.isMore = false
        },
        // 清空排班表
        clearSchedule(){
            this.list.forEach(item=>{
                item.AttendData.forEach(self=>{
                    self.Shifts = []
                })
            })
            this.isMore = false
        },
        // 添加人员
        addPeople(){
            const url = '/pages/publics/mailList/main';
            wx.navigateTo({url:url});
        },
        delPeople(){
            let startTime = this.timeList[0].time;
            let endTime = this.timeList[6].time;
            const url = '/pages/scheduling/departScheduling/delMailList/main?startTime='+startTime+'&endTime='+endTime+'&unitId='+this.unitId;
            wx.navigateTo({url:url})
        },
        handleAddShift(){
            const url = '/pages/scheduling/shift/add_shift/main';
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
page{
    height: auto;
    background: #f6f7fb;
}
    .wrap{
        width: 100%;
        min-height: 100vh;
        height: 100%;
        .header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fff;
            padding: 20rpx 0;
            border-bottom: 1rpx solid #e2e3e5;
            .andTime{
                display: flex;
                align-items: center;
                .cont{
                    padding: 0 20rpx;
                    font-size: 28rpx;
                }
            }
            .release{
                font-size: 24rpx;
                width: 100rpx;
                height: 60rpx;
                line-height: 60rpx;
                border-top-left-radius: 30rpx;
                border-bottom-left-radius: 30rpx;
                color: #fff;
                background: #3399ff;
                text-align: center;
            }
        }
        .table{
            width: 100%;
            height: 600rpx;
            overflow-y: auto;
            font-size: 28rpx;
            .tr{
                display: flex;
                align-items: center;
                border-bottom: 2rpx solid #e2e3e5;
                .td_name{
                    background: #ccc;
                }
                .td{
                    flex: 1;
                    text-align: center;
                }
            }
            .tr_head{
                width: 100%;
                position: fixed;
                height: 130rpx;
                z-index: 999;
                background: #fff;
                .td_name{
                    line-height: 130rpx;
                }
                .td{
                    .time{
                        margin-top: 25rpx;
                    }
                }
            }
            .tbody{
                margin-top: 130rpx;
            }
            .tr_cont{
                .td{
                    box-sizing: border-box;
                    border-right: 1rpx solid #e2e3e5;
                    font-size: 22rpx;
                }
                .td:nth-child(8){
                    border: none;
                }
                .tds{
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    background: #fff;
                    span{
                        font-size:20rpx;
                        display:block;
                    }
                }
                .tds.active{
                    border: 2rpx solid #3399ff;
                    box-sizing: border-box;
                }
                // .td.active_td{
                //     border: 1px solid #333333;
                // }
            }
        }
        .operation{
            background: #fff;
            display: flex;
            margin: 20rpx 0;
            p{
                flex: 1;
                text-align: center;
                font-size: 24rpx;
                color: #3399ff;
                padding: 20rpx 0;
                box-sizing: border-box;
            }
        }
        .remarks{
            margin-bottom: 20rpx;
            background: #fff;
            padding: 20rpx;
            box-sizing: border-box;
            .label{
                font-size: 28rpx;
                color: #333;
            }
            textarea{
                padding: 10rpx 0;
                font-size: 24rpx;
                width: 100%;
                height: 100rpx !important;
                min-height: 100rpx;
            }
        }
        .van-popup{
            overflow-y: initial !important;
        }
        .popup{
            box-shadow: 0px 0px 23px 0px rgba(0, 0, 0, 0.2);
            .column{
                display: flex;
                align-items: center;
                // padding: 20rpx 0;
                border-bottom: 1rpx solid #e2e3e5;
                .item{
                    flex: 1;
                    text-align: center;
                    position: relative;
                    padding: 20rpx 0;
                    .name{
                        font-size: 20rpx;
                    }
                    .select{
                        position: absolute;
                        width: 200rpx;
                        // height: 100rpx;
                        background: #fff;
                        bottom: 100%;
                        left: -35rpx;
                        margin-bottom: 10rpx;
                        .option{
                            height: 60rpx;
                            line-height: 60rpx;
                            font-size: 26rpx;
                            text-align: center;
                            border-bottom: 1rpx solid #e2e3e5;
                        }
                        .icon{
                            position: absolute;
                            bottom: -8rpx;
                            left: calc(50% - 20rpx);
                            width: 0px;
                            height: 0px;
                            border-top: 20rpx solid #fff;
                            border-left: 20rpx solid transparent;
                            border-right: 20rpx solid transparent;
                        }
                    }
                }
                .item:last-child{
                    border-left: 1rpx solid #e2e3e5;
                }
            }
            .shift_bd{
                display: flex;
                .left{
                    width: 125rpx;
                    min-height: 180rpx;
                    background: #f4f4f4;
                    border-right: 1px solid #e2e3e5;
                    .item{
                        text-align: center;
                        vertical-align: middle;
                        font-size: 20rpx;
                        margin-top: 30rpx;
                    }
                }
                .right{
                    flex: 1;
                    .swiper_wrap{
                        height: 106px;
                    }
                    .bd{
                        padding: 0 20rpx 20rpx;
                        box-sizing: border-box;
                        font-size: 20rpx;
                        font-weight: bold;
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                        .tag{
                            width: 130rpx;
                            height: 60rpx;
                            line-height: 60rpx;
                            margin-top: 20rpx;
                            border-radius: 10rpx;
                            text-align: center;
                            border: 1rpx solid #e2e3e5;
                        }
                        .tag.active{
                            background: #3399ff;
                            color: #fff;
                        }
                        .fack_item{
                            flex: 0 0 130rpx;
                            height: 0;
                        }
                    }
                }
            }
        }
    }
</style>