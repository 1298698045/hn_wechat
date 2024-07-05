<template>
    <div class="wrap">
        <div class="tabs" v-if="sign!='add'">
            <i-tabs :current="current"  @change="handleChangeTabs">
                <i-tab key="tab1" title="预约会议室"></i-tab>
                <i-tab key="tab2" title="我的预约"></i-tab>
                <i-tab key="tab3" title="我的审批"></i-tab>
                <i-tab key="tab4" title="会议室管理"></i-tab>
            </i-tabs>
        </div>
        <div class="container" v-if="current=='tab1'">
            <div class="header" v-if="sign!='add'">
                <picker mode="date" fields="month" @change="bindDateChange">
                    <div class="lBox">
                        <div>
                            <p class="month">{{month}}月</p>
                            <p class="year">{{year}}年</p>
                        </div>
                    </div>
                </picker>
                <div class="rBox">
                    <scroll-view class="scroll-view-list" :scroll-left="scrollLeft" scroll-with-animation="true" @scrolltoupper="getScrolltoupper"	 @scrolltolower="getScrolltolower" scroll-x="true" style="width: 100%">
                        <view class="swiper-item" v-for="(item,index) in everyDay" :key="index" @click="getSwitchDay(item,index)" >
                            <div class="box">
                                <div>
                                    <p class="week">{{item.weekDay}}</p>
                                    <p class="day" :class="{active:dayIdx==index}">{{item.day}}</p>
                                </div>
                            </div>
                        </view>
                    </scroll-view>
                </div>
            </div>
            <div class="center" :class="{'active':sign=='add'}">
                <div class="content" v-for="(v,i) in list" :key="i">
                    <h3 @click="getDetail(v)">{{v.Name}}</h3>
                    <div class="tagWrap">
                        <p class="rowText" v-for="(item,index) in v.tag" :key="index">
                            {{item}}<span v-if="index+1<v.tag.length">/</span>
                            <!-- 投影<span>/</span>
                            话筒<span>/</span>
                            电脑<span>/</span>
                            电子屏<span>/</span>
                            其他 -->
                        </p>
                    </div>
                    <p class="icon">
                        <i class="iconfont icon-canyuren-copy"></i>
                        <span>可容纳{{v.Capacity}}人</span>
                    </p>
                    <div class="scrollWrap">
                        <scroll-view class="scroll-view-list" scroll-with-animation="true" :scroll-left="statusIdx" scroll-x="true" style="width: 100%">
                            <view class="swiper-item" :class="{'success':item.code==1&&item.status!=1,'overdue':item.status==1&&!item.code||item.status==1&&item.code==1,'active':item.check==true}" v-for="(item,index) in v.listTime" :key="index" @click="getSelectTime(item,v,i,index)">
                                <div class="box">
                                    <p class="time">{{item.startTime}}</p>
                                    <p class="time">{{item.endTime}}</p>
                                    <p class="min">
                                        {{item.code==1?'已被我预订':item.status==1&&!item.code?'已过期':'未预定'}}
                                    </p>
                                </div>
                                <p class="radius" v-if="item.check">
                                    <i-icon type="right" color="#fff" size="20" />
                                </p>
                            </view>
                        </scroll-view>
                    </div>
                </div>
            </div>
            <div class="bottoms" @click="getAddCreate">
                <i class="iconfont icon-add"></i>
                <p>添加会议室</p>
            </div>
            <div class="footer"  :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
                <div class="box">
                    <van-button custom-class="btn" :disabled="paramsList!=''?false:true" type="primary" color="#3399ff" block @click="getAppointment">立即预约</van-button>
                </div>
            </div>
        </div>
        <div class="currentWrap" v-if="current=='tab2'">
            <h3>已预订</h3>
            <div class="content" v-for="(item,index) in myAppointmentList" :key="index">
                <div class="cont">
                    <div class="row">
                        <p>{{item.Room.Name}}</p>
                        <p class="tag" :class="item.StateCode==0?'active':item.StateCode==2?'refuse':''">{{item.StateCode==0?'审批中':item.StateCode==1?'审批通过':item.StateCode==2?'审批拒绝':''}}</p>
                    </div>
                    <p class="rowText">时间：{{item.ScheduledStartDate}} {{item.ScheduledStartTime}}-{{item.ScheduledEndTime}}</p>
                    <p class="rowText">地址：{{item.Room.Location}}</p>
                </div>
                <div class="bottomA" v-if="item.StateCode==0">
                    <p @click="getCancel(item)">取消预约</p>
                    <p @click="getApprovalDetail(item)">审批详情</p>
                </div>
                 <div class="bottomA" v-if="item.StateCode==1||item.StateCode==2">
                    <p @click="getApprovalDetail(item)">审批详情</p>
                </div>
            </div>
            <!-- 已结束 -->
            <h3>已结束</h3>
            <div class="content" v-for="(item,index) in finishedList" :key="index">
                <div class="cont">
                    <div class="row">
                        <p>{{item.Room.Name}}</p>
                        <p class="tag" :class="item.StateCode==0?'active':item.StateCode==2?'refuse':''">{{item.StateCode==0?'审批中':item.StateCode==1?'审批通过':item.StateCode==2?'审批拒绝':''}}</p>
                    </div>
                    <p class="rowText">时间：{{item.ScheduledStartDate}} {{item.ScheduledStartTime}}-{{item.ScheduledEndTime}}</p>
                    <p class="rowText">地址：{{item.Room.Location}}</p>
                </div>
                <div class="bottomA" v-if="item.StateCode==0">
                    <p @click="getCancel(item)">取消预约</p>
                    <p @click="getApprovalDetail(item)">审批详情</p>
                </div>
                 <div class="bottomA" v-if="item.StateCode==1||item.StateCode==2">
                    <p @click="getApprovalDetail(item)">审批详情</p>
                </div>
            </div>
            <van-popup
                :show="showModal"
                position="center"
                custom-style="width:80%;height: auto;border-radius:7rpx;"
                @close="onClose"
            >
                <div class="showModal">
                    <div class="cont">
                        <p class="cancel">取消预订</p>
                        <p class="text cen">会议室：{{roomName}}</p>
                        <p class="text">时间：{{roomTime}}</p>
                    </div>
                    <div class="btn">
                        <p class="no" @click="getNo">暂不</p>
                        <p @click="getCancelAppointment">确定</p>
                    </div>
                </div>
            </van-popup>
        </div>
        <!-- 我的审批 -->
        <div class="myApproval" v-if="current=='tab3'">
            <picker @change="bindPickerChange" :value="index" :range="array">
                <div class="nav">
                    {{array[index]}}
                    <i-icon type="unfold" color="#333333" size="20" />
                </div>
            </picker>
            <div class="mycontent" v-for="(item,idx) in myApprovalList" :key="idx">
                <div class="lBox">
                    <p>{{item.OwningUserName}}</p>
                </div>
                <div class="rBox" v-if="index==0">
                    <div class="row">
                        <p>{{item.OwningUserName}}提交的会议室申请</p>
                        <p class="apply">待审批</p>
                    </div>
                    <div class="cont">
                        <div class="rowText">
                            <p>会议标题：</p>
                            <p>{{item.Subject}}</p>
                        </div>
                        <div class="rowText">
                            <p>会议室：</p>
                            <p>{{item.Room.Name}}</p>
                        </div>
                        <div class="rowText">
                            <p>会议时间：</p>
                            <p>{{item.ScheduledStartDate}}  {{item.ScheduledStartTime}}～{{item.ScheduledEndTime}}</p>
                        </div>
                        <div class="rowText">
                            <p>预约人：</p>
                            <p>{{item.OwningUserName}}</p>
                        </div>
                        <div class="rowText">
                            <p>联系电话：</p>
                            <p>{{item.TelePhone}}</p>
                        </div>
                        <div class="rowText">
                            <p>参与人数：</p>
                            <p>20</p>
                        </div>
                        <div class="rowText">
                            <p>所需设备：</p>
                            <p>{{item.Attachs}}</p>
                        </div>
                        <div class="rowText">
                            <p>备注：</p>
                            <p>{{item.Description}}</p>
                        </div>
                        <div class="rowText">
                            <p>创建时间：</p>
                            <p>{{item.CreatedOn}}</p>
                        </div>
                    </div>
                    <div class="bottomB">
                        <span @click="getRefuse(item)">拒绝</span><span @click="getAgree(item)">同意</span>
                    </div>
                </div>
                <div class="rBox" v-if="index!=0">
                    <div class="row">
                        <p>{{item.OwningUserName}}提交的会议室申请</p>
                        <p class="time">08:30</p>
                    </div>
                    <div class="cont">
                        <p class="text">会议标题:绍兴第二医院会议</p>
                        <p class="text">会议室:3号楼阶梯教室</p>
                        <p class="text">开始时间:{{item.ScheduledStartDate}}  {{item.ScheduledStartTime}}</p>
                        <p class="text">结束时间:{{item.ScheduledEndDate}}  {{item.ScheduledEndTime}}</p>
                        <p class="status" :class="index==1?'status':'refuse'">
                            {{index==1?'审批通过':'审批拒绝'}}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 会议室管理 -->
        <div class="conferenceRoom" v-if="current=='tab4'">
            <div class="nav" @click="getAddConferenceRoom">
                <i class="iconfont icon-add"></i>
                <!-- <i-icon type="add" i-class="icon" size="20" color="#3399ff" /> -->
                <span>
                    添加会议室
                </span>
            </div>
            <div class="containerWrap">
                <div class="content" v-for="(item,index) in adminList" :key="index" @click="getEditConference(item)">
                    <div class="heads">
                        <p class="label">{{item.Name}}</p>
                        <!-- <p class="tag">需审批</p> -->
                    </div>
                    <div class="cont">
                        <div class="lBox">
                            <p>容纳人数 : {{item.Capacity}}</p>
                            <p>关联设备 : {{item.AttachInfo}}</p>
                            <p>办公地址 : {{item.Location}}</p>
                        </div>
                        <div class="rBox">
                            <div class="imgs">
                                <img class="nullImg" v-if="item.link==''" :src="imgUrl+'03.3.1conference.png'" alt="">
                                <!-- <image  v-else class="img" :src="item.link"></image> -->
                                <img class="img" v-else :src="item.link" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex';
export default {
    data(){
        return {
            current:'tab1',
            dayIdx:0,
            listData:[],
            num:0,
            list:[],
            showModal:false,
            index:0,
            array:[
                '待审批',
                '审批通过',
                '审批拒绝'
            ],
            year:"",
            month:"",
            day:"",
            currentMonth:"",
            lastDay:"",
            month: "",
            everyDay: [],
            scrollLeft:0,
            listTime:[],
            list:[],
            myAppointmentList:[],
            adminList:[],
            appointmentId:"",
            ResourceId:"",
            ScheduledStart:"",
            ScheduledEnd:"",
            name:"",
            myApprovalList:[],
            paramsList:[],
            timestamp:"",
            currenDayNow:"",
            className:"",
            roomName:"",
            roomTime:"",
            sessionkey:"",
            statusIdx:"",
            sign:"",
            finishedList:[],
            startTime:""
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        imgUrl(){
            return this.$api.photo.url;
        }
    },
    onShow(){
        this.scrollLeft = this.day * 50;
        let date = new Date(this.startTime.replace(/-/g,'/')), month = date.getMonth()+1;
        this.getEveryDay(date, month);
        this.getQuery();
        this.getConferenceAdmin();
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        this.startTime = options.startTime || this.getCurrenTime();
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.sign = options.sign;
        this.timestamp = Date.parse(new Date(this.startTime.replace(/-/g,'/')));
        var currenMyDate = new Date(this.startTime.replace(/-/g,'/'));     //获取当前年份(2位)
        var currenYear=currenMyDate.getFullYear();    //获取完整的年份(4位,1970-????)
        var currenMonth=currenMyDate.getMonth();       //获取当前月份(0-11,0代表1月)
        var currenDay=currenMyDate.getDate();        //获取当前日(1-31)
        this.currenDayNow=currenYear+'-'+(currenMonth+1)+"-"+currenDay;
        let myDate = new Date(this.startTime.replace(/-/g,'/'));
        this.year = myDate.getFullYear();
        this.month = myDate.getMonth()+1;
        this.day = myDate.getDate();
        this.currentMonth = myDate.getMonth()+1;
        this.scrollLeft = this.day * 50;
        let date = new Date(), month = date.getMonth()+1;
        this.getEveryDay(date, month);
        this.getQuery();
    },
    methods:{
        getCurrenTime(){
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth()+1;
            const day = date.getDate();
            const hour = date.getHours();
            const min = date.getMinutes();
            const currenTime = `${year}-${month}-${day} ${hour}:${min}`
            return currenTime;
        },
        getSelectTime(item,v,i,index){
            if(item.status==0){
                if(this.ResourceId==''){
                    // console.log(111);
                    this.ResourceId = v.ResourceId;
                    this.$set(item,'check',!item.check);
                    this.name = v.Name;
                    if(item.check){
                        this.paramsList.push({
                            id:item.id,
                            startTime:item.startTime,
                            endTime:item.endTime
                        })
                    }else {
                        this.paramsList.splice(index,1);
                    }
                    // this.ScheduledStart = item.startTime;
                    // this.ScheduledEnd = item.endTime;
                }else {
                    let id = v.ResourceId;
                    if(this.ResourceId==id){
                        // console.log(222);
                        this.$set(item,'check',!item.check);
                        if(item.check){
                            this.paramsList.push({
                                id:item.id,
                                startTime:item.startTime,
                                endTime:item.endTime
                            })
                        }else {
                            // console.log(333,'---',index);
                            const index = this.paramsList.findIndex(v=>item.id===v.id);
                            // console.log(index,'9999');
                            this.paramsList.splice(index,1);
                        }
                        // this.ScheduledStart = item.startTime;
                        // this.ScheduledEnd = item.endTime;
                        // this.list[i].listTime[index].check = !item.check;
                    }
                }
                // console.log(this.paramsList);

                if(this.paramsList==''){
                    this.ResourceId = '';
                }else {
                    console.log(this.paramsList,'已选中');
                    let maxIndex = 0;
                    for(var i = 0; i < this.paramsList.length; i++){
                        let id = this.paramsList[i].id;
                        if(id>maxIndex){
                            maxIndex = id;
                        }
                    }
                    const minId = Math.min.apply(Math, this.paramsList.map(item => item.id))
                    let min = this.paramsList.find((item)=>item.id==minId);
                    this.ScheduledStart = min.startTime;
                    let max = this.paramsList.find((item)=>item.id==maxIndex);
                    this.ScheduledEnd = max.endTime;
                    console.log(this.ScheduledStart,this.ScheduledEnd);
                }
            }else {
                wx.showToast({
                    title:"不可选",
                    icon:"none",
                    duration:2000
                })
            }
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meetingroom.reservation.getlist",
                    SessionKey:this.sessionkey,
                    // startTime:"2020-05-20",
                    startTime:`${this.year}-${this.month}-${this.day}`

                }
            }).then(res=>{
                this.list = res.listData;
                let temp = [];
                this.list.forEach(item=>{
                    this.$set(item,'listTime',this.getCountDate());
                    // this.$set(item,'tag',item.AttachInfo.replace(/,/g,'/'));
                    this.$set(item,'tag',item.AttachInfo.split(','));
                    item.Reserves.forEach(v=>{
                        temp.push({
                            ScheduledStartDate:v.ScheduledStartDate,
                            ScheduledEndDate:v.ScheduledEndDate,
                            ScheduledStartTime:v.ScheduledStartTime,
                            ScheduledEndTime:v.ScheduledEndTime
                        })
                    })
                })
                this.list.forEach(item=>{
                    item.Reserves.forEach(v=>{
                        let startIdx = '';
                        let endIdx = '';
                        item.listTime.forEach((v1,index)=>{
                            if(v.ScheduledStartTime==v1.startTime){
                                startIdx = index;
                                this.$set(v1,'code',1);
                                this.$set(v1,'status',2)
                            }
                            if(v.ScheduledEndTime==v1.endTime){
                                endIdx = index;
                                // console.log(v1,'--------');
                                this.$set(v1,'code',1);
                                this.$set(v1,'status',2)
                            }
                        })
                        console.log(startIdx,endIdx,'123123123123');
                       let arr = item.listTime.slice(startIdx,endIdx);
                       arr.forEach(item=>{
                            this.$set(item,'code',1);
                            this.$set(item,'status',2)
                       })
                        console.log(arr);
                    })

                })
                let date = `${this.year}-${this.month}-${this.day}`;
                if(this.currenDayNow==`${this.year}-${this.month}-${this.day}`){
                    this.list.forEach(v=>{
                        v.listTime.forEach(item=>{
                            let time = date + ' '+ item.endTime+':00';
                            // console.log(time);
                            let timestamp = this.getTargetTime(time);
                            if(timestamp<this.timestamp){
                                this.$set(item,'status',1);
                            }
                        })
                    })
                }
                console.log(this.list);
                let statusIdx = [];
                this.list[0].listTime.forEach((item,idx)=>{
                    if(item.status==1){
                        statusIdx.push(idx);
                    }
                })
                this.statusIdx = statusIdx.pop()*65;
                console.log(statusIdx,'statusIdx');
            })
        },
        getTargetTime(t){
            var d = t.split(" ")[0],
                h = t.split(" ")[1],
                date = new Date()

            date.setYear(d.split("-")[0])
            date.setMonth(d.split("-")[1] - 1)
            date.setDate(d.split("-")[2])

            date.setHours(h.split(":")[0])
            date.setMinutes(h.split(":")[1])
            date.setSeconds(h.split(":")[2])
            return date.getTime()    
        },
        // 我的预约列表
        getMyAppointment(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meetingroom.userreserve.getlist",
                    SessionKey:this.sessionkey,
                    // userId:this.sessionkey,
                    pageNumber:1,
                    pageSize:50

                }
            }).then(res=>{
                console.log(res);
                // this.myAppointmentList = res.listData;
                this.myAppointmentList = res.Reserved;
                this.finishedList = res.Cancelled;
            })
        },
        // 我的审批
        getMyApproval(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meetingroom.approvetask.getlist",
                    SessionKey:this.sessionkey,
                    stateCode:this.index,
                    pageNumber:1,
                    pageSize:50
                }
            }).then(res=>{
                console.log(res);
                this.myApprovalList = res.listData;
            })
        },
        getRefuse(item){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meetingroom.reservation.approve",
                    SessionKey:this.sessionkey,
                    Id:item.Id,
                    status:2
                }
            }).then(res=>{
                console.log(res);
                this.getMyApproval();
            })
        },
        getAgree(item){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meetingroom.reservation.approve",
                    SessionKey:this.sessionkey,
                    Id:item.Id,
                    status:1
                }
            }).then(res=>{
                console.log(res);
                this.getMyApproval();
            })
        },
        // 会议室管理
        getConferenceAdmin(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"resource.room.getlist",
                    SessionKey:this.sessionkey,
                }
            }).then(res=>{
                console.log(res);
                this.adminList = res.listData;
            })
        },
        // 我的预约-取消预约 
        getCancelAppointment(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"resource.roomorder.delete",
                    SessionKey:this.sessionkey,
                    Id:this.appointmentId
                }
            }).then(res=>{
                console.log(res);
                this.showModal = false;
                this.getMyAppointment();
            })
        },
        getCountDate(){
            let total = 24;
            let temp = [];
            let arr = [];
            for (let i = 1; i < 23; i++){
                let hour = i;
                if(i<10){
                   hour= '0'+i;
                }else {
                    hour = i;
                }

                let curr = `${hour}:00`;
                let half = `${hour}:30`;
                let next = ''
                if(i<9){
                    next = `0${i+1}:00`
                }else {
                    next = `${i+1}:00`
                }
                // let next = `${hour+1}:00`;
                // console.log(`${curr}-${half}`);
                // console.log(`${half}-${next}`);
                arr.push(`${curr}-${half}`,`${half}-${next}`);
            }
            let id = 0;
            arr.forEach(item=>{
                let time = item.split('-');
                let startTime = time[0];
                let endTime = time[1];
                id++;
                temp.push({
                    id:id,
                    startTime:startTime,
                    endTime:endTime,
                    status:0,
                    check:false
                })
            })
            // console.log(temp)
            return temp;
        },
        bindDateChange(e){
            let value = e.mp.detail.value;
            let val = value.split('-');
            this.year = val[0];
            this.month = val[1].replace(/^0/, '');
            let date = new Date(this.year);
            this.getEveryDay(date, this.month);
        },
        monthChange(date) {
            this.getEveryDay(date, date.getMonth());
        },
        getEveryDay(date, month) {
            //设置月份
            date.setMonth(month);
            //设置一个月的某一天-这里设置为零则取到的日期中的天就会是当月的最后一天（比如，二月份就是28或29，其他月份就是30或31），方便下边的循环
            date.setDate(0);
            let dayArry = [];
            //获取月份的某一天
            let day = date.getDate();

            for (let i = 1; i <= day; i++) {
                date.setDate(i);   //如果只获取当前选择月份的每一天，则不需要date.setDate(i)只需dayArry.push(i)即可，其中date.setDate(i)是设置当前月份的每一天
                // dayArry.push(i + ' ' + this.getWeekday(date.getDay()));   //选中月份的每一天和当天是星期几

                dayArry.push({
                    day:i,
                    weekDay:this.getWeekday(date.getDay())
                })
            }
            this.everyDay = dayArry;
            console.log(this.month,month);
            if(this.currentMonth==month){
                let index = this.everyDay.findIndex((item)=>item.day===this.day);
                console.log(index);
                this.dayIdx = index;
                this.scrollLeft = index * 50;
            }else {
                this.dayIdx = 0;
                this.scrollLeft = 0;
            }
            console.log(this.everyDay,this.scrollLeft,'day');
        },
        getWeekday(day){
            return ["日", "一", "二", "三", "四", "五", "六"][day];
        },
        getSwitchDay(item,index){
            console.log(item);
            let currenDay = new Date().getDate();
            if(item.day<currenDay){
                wx.showToast({
                    title:'过去日期不可选',
                    icon:'none',
                    duration:2000
                })
            }else {
                this.day = item.day;
                this.dayIdx = index;
                this.getQuery();
            }
        },
        handleChangeTabs(e){
            this.current = e.mp.detail.key;
            if(this.current=='tab1'){
                this.getQuery();
            }else if(this.current=='tab2'){
                this.getMyAppointment();
            }else if(this.current=='tab3'){
                this.index = 0;
                this.getMyApproval();
            }else if(this.current=='tab4'){
                this.getConferenceAdmin();
            }
        },
        getScrolltoupper(e){
            console.log(e);
        },
        getScrolltolower(e){
            console.log(e);
            // if(this.month<12){
            //     this.month++;
            // }else {
            //     this.year++;
            //     this.month = 1;
            // }
            // let date = new Date(this.year);
            // this.getEveryDay(date, this.month);
        },
        getDetail(item){
            let date = `${this.year}-${this.month}-${this.day}`;
            const url = '/pages/conferenceRoom/detail/main?id='+item.ResourceId+'&date='+date+'&name='+item.Name;
            wx.navigateTo({url:url});
        },
        ...mapMutations([
            'getConferenceName',
            'getLink'
        ]),
        getAppointment(){
            if(this.paramsList==''){
                wx.showToast({
                    title:"请选择时间段",
                    icon:"none",
                    duration:2000
                })
            }else {
                if(this.sign=='add'){
                    this.getConferenceName({
                        name:this.name,
                        id:this.ResourceId,
                        startTime:`${this.year}-${this.month}-${this.day} ${this.ScheduledStart}`,
                        endTime:`${this.year}-${this.month}-${this.day} ${this.ScheduledEnd}`
                    });
                    wx.navigateBack({
                        delta: 1
                    })
                }else {
                    let date = `${this.year}-${this.month}-${this.day}`;
                    const url = '/pages/conferenceRoom/appointment/main?date='+date+'&ResourceId='+this.ResourceId+'&ScheduledStart='+this.ScheduledStart+'&ScheduledEnd='+this.ScheduledEnd+'&name='+this.name;
                    wx.navigateTo({url:url});
                }
            }
        },
        getAddCreate(){
            const url = '/pages/conferenceRoom/create/main'
            wx.navigateTo({url:url});
        },
        getCancel(item){
            this.appointmentId = item.Id;
            this.roomName = item.Room.Name;
            this.roomTime = item.ScheduledStartDate +'  '+item.ScheduledStartTime+'-'+item.ScheduledEndTime;
            this.showModal = true;
        },
        onClose(){
            this.showModal = false;
        },
        getNo(){
            this.showModal = false;
        },
        // 我的预约审批详情
        getApprovalDetail(item){
            const url = '/pages/conferenceRoom/approvalDetail/main?id='+item.Id;
            wx.navigateTo({url:url});
        },
        bindPickerChange(e){
            this.index = e.mp.detail.value;
            this.getMyApproval();
        },
        // 添加会议室
        getAddConferenceRoom(){
            const url = '/pages/conferenceRoom/create/main';
            wx.navigateTo({url:url});
        },
        // 编辑会议室
        getEditConference(item){
            this.getLink(item.link);
            const url = '/pages/conferenceRoom/create/main?id='+item.ResourceOrgId;
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
@import '../../../static/css/icon.css';
@import '../../../static/css/conference.css';
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .tabs{
            width: 100%;
            position: fixed;
            top: 0; 
            background: #fff;
            z-index: 999;
        }
        .container{
            .header{
                width: 100%;
                display: flex;
                background: #fff;
                border-bottom: 2rpx solid #ebedec;
                z-index: 999;
                position: fixed;
                top: 84rpx;

                .lBox{
                    width: 106rpx;
                    height: 153rpx;
                    text-align: center;
                    background: #f3f3f3;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .month{
                        font-size: 36rpx;
                        color: #3399ff;
                        font-weight: bold;
                        padding-bottom: 10rpx;
                    }
                    .year{
                        font-size: 19rpx;
                        color: #3399ff;
                    }
                }
                .rBox{
                    flex: 1;
                    width: 80%;
                    box-sizing: border-box;
                    display: flex;
                    white-space: nowrap;//这个属性很重要
                    .swiper-item{
                        width: 106rpx;
                        height: 153rpx;
                        display: inline-block;
                        .box{
                            width: 100%;
                            height: 100%;
                            text-align: center;
                            padding: 20rpx 0;
                            .week{
                                font-size: 19rpx;
                                color: #888888;
                            }
                            .day{
                                width: 61rpx;
                                height: 61rpx;
                                line-height: 61rpx;
                                text-align: center;
                                // background: #3399ff;
                                border-radius: 50%;
                                margin: 30rpx auto;
                                font-size: 31rpx;
                                color: #333333;
                                font-weight: bold;
                            }
                            .day.active{
                                background: #3399ff;
                                color: #fff;
                            }
                        }
                    }
                }
            }
            .center.active{
                margin-top: 0!important;
            }
            .center{
                margin-top: 117px;
                .content{
                    padding: 33rpx;
                    background: #fff;
                    margin-bottom: 35rpx;
                    h3{
                        padding-bottom: 33rpx ;
                        font-weight: bold;
                        color: #333333;
                        border-bottom: 2rpx solid #ebedec;
                    }
                    .tagWrap{
                        display: flex;
                        padding: 20rpx 0;
                        .rowText{
                            font-size: 26rpx;
                            color: #666666;
                            span{
                                font-size: 22rpx;
                                color: #cccccc;
                                margin: 0 10rpx;
                            }
                        }
                    }
                    .icon{
                        margin-bottom: 20rpx;
                        display: flex;
                        align-items: center;
                        i{
                            color: #666666;
                            font-size: 26rpx;
                        }
                        span{
                            margin-left: 14rpx;
                            font-size: 26rpx;
                            color: #666666;
                        }
                    }
                    .scrollWrap{
                        width: 100%;
                        box-sizing: border-box;
                        display: flex;
                        white-space: nowrap;
                        .swiper-item.active{
                            background-color: rgba(51, 153, 255, .2);
                        }
                        .swiper-item.success{
                            background: #3399ff;
                            .box{
                                padding: 20rpx 0;
                                .time{
                                    font-size: 31rpx;
                                    color: #fff;
                                    font-weight: bold;
                                }
                                .min{
                                    font-size: 19rpx;
                                    color: #fff;
                                }
                            }
                        }
                        .swiper-item.overdue{
                            // background: #e4e4e4;
                            background: #e5e5e5;
                            .box{
                                padding: 20rpx 0;
                                .time{
                                    font-size: 31rpx;
                                    color: #999999;
                                    font-weight: bold;
                                }
                                .min{
                                    font-size: 19rpx;
                                    color: #999999;
                                }
                            }
                        }
                        .swiper-item{
                            width: 118rpx;
                            height: 153rpx;
                            text-align: center;
                            background: #e4e4e4;
                            border-radius: 9rpx;
                            display: inline-block;
                            margin-right: 15rpx;
                            // background-color: rgba(51, 153, 255, .2);
                            position: relative;
                            .box{
                                padding: 20rpx 0;
                                .time{
                                    font-size: 31rpx;
                                    color: #333333;
                                    font-weight: bold;
                                }
                                .min{
                                    font-size: 19rpx;
                                    color: #999999;
                                }
                            }
                            .radius{
                                width: 52rpx;
                                height: 52rpx;
                                line-height: 52rpx;
                                border-radius: 50%;
                                background: #3399ff;
                                position: absolute;
                                top:50%;
                                left: 50%;
                                transform: translate(-50%,-50%);
                            }
                        }
                    }
                }
            }
            .bottoms{
                width: 100%;
                background: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 33rpx 0;
                font-size: 33rpx;
                color: #3399ff;
                margin-top: 35rpx;
                margin-bottom: 80px;
                p{
                    margin-left: 20rpx;
                }
            }
            .footer{
                width: 100%;
                position: fixed;
                bottom: 20rpx;
                background: #fff;
                border-top: 1rpx solid #e3e3e3;
                .box{
                    padding: 25rpx 33rpx;
                    .btn{
                        border-radius: 7rpx;
                        // opacity: .4;
                    }
                    .btn.active{
                        opacity: 1;
                    }
                }
            }
        }
        .currentWrap{
            margin-top: 43px;
            h3{
                font-size: 26rpx;
                color: #999999;
                background: #f4f4f4;
                padding: 31rpx 33rpx;
            }
            .content{
                margin-bottom: 35rpx;
                .cont{
                    background: #fff;
                    padding: 33rpx;
                    .row{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        p:nth-child(1){
                            font-size: 33rpx;
                            color: #333333;
                            font-weight: bold;
                        }
                        .tag{
                            width: 115rpx;
                            height: 51rpx;
                            line-height: 51rpx;
                            text-align: center;
                            border-radius: 5rpx;
                            font-size: 24rpx;
                            background: #dbf5ec;
                            color: #39c1b3;
                        }
                        .tag.active{
                            background: #fbefe5;
                            color: #ff9237;
                        }
                        .tag.refuse{
                            background: #fcebe3;
                            color: #ff6666;
                        }

                    }
                    .rowText{
                        font-size: 24rpx;
                        color: #999999;
                        margin-top: 10rpx;
                    }
                }
                .bottomA{
                    display: flex;
                    background: #fff;
                    border-top: 2rpx solid #ebedec;
                    p{
                        flex: 1;
                        height: 97rpx;
                        line-height: 97rpx;
                        text-align: center;
                        color: #3399ff;
                        font-size: 28rpx;
                    }
                    p:nth-child(1){
                        border-right: 1rpx solid #ebedec;
                    }
                }
            }
            .showModal{
                .cont{
                    padding: 33rpx;
                    .cancel{
                        font-size: 23rpx;
                        color: #999999;
                    }
                    .text{
                        font-size: 33rpx;
                        color: #333333;
                    }
                    .cen{
                        padding: 10rpx 0;
                    }
                }
                .btn{
                    display: flex;
                    border-top: 2rpx solid #eaeeed;
                    p{
                        flex: 1;
                        height: 108rpx;
                        line-height: 108rpx;
                        text-align: center;
                        font-size: 31rpx;
                        color: #3399ff;
                    }
                    .no{
                        border-right: 1rpx solid #eaeeed;
                    }
                }
            }
        }
        .myApproval{
            margin-top: 43px;
            .nav{
                width: 100%;
                text-align: center;
                font-size: 28rpx;
                color: #333333;
                background: #fff;
                padding: 20rpx 0;
            }
            .mycontent{
                background: #fff;
                display: flex;
                padding: 15rpx 33rpx;
                margin-bottom: 35rpx;
                .lBox{
                    p{
                        width: 83rpx;
                        height: 83rpx;
                        line-height: 83rpx;
                        text-align: center;
                        border-radius: 50%;
                        background: #3399ff;
                        color: #fff;
                        font-size: 26rpx;
                    }
                }
                .rBox{
                    flex: 1;
                    margin-left: 20rpx;
                    .row{
                        display: flex;
                        justify-content: space-between;
                        p:nth-child(1){
                            font-size: 33rpx;
                            color: #333333;
                        }
                        .apply{
                            font-size: 22rpx;
                            color: #d49746;
                        }
                        .time{
                            font-size: 22rpx;
                            color: #bbbbbb;
                        }
                    }
                    .cont{
                        margin-top: 20rpx;
                        .rowText{
                            display: flex;
                            font-size: 26rpx;
                            color: #999999;
                            padding: 5rpx 0;
                            p:nth-child(1){
                                width: 150rpx;
                            }
                        }
                        .text{
                            font-size: 26rpx;
                            color: #999999;
                            padding: 5rpx 0;
                        }
                        .status{
                            font-size: 22rpx;
                            color: #39c1b3;
                        }
                        .status.refuse{
                            color: #ff6666;
                        }
                    }
                    .bottomB{
                        text-align: right;
                        span{
                            display: inline-block;
                            width: 92rpx;
                            height: 49rpx;
                            line-height: 49rpx;
                            text-align: center;
                            font-size: 24rpx;
                            border: 1rpx solid #3399ff;
                            color: #3399ff;
                            border-radius: 5rpx;
                            background: #fff;
                        }
                        span:nth-child(1){
                            margin-right: 10rpx;
                        }
                        span:nth-child(2){
                            background: #3399ff;
                            color: #fff;
                        }
                    }
                }
            }
        }
        .conferenceRoom{
            margin-top: 40px;
            .nav{
                width: 100%;
                background: #fff;
                padding: 20rpx 33rpx;
                display: flex;
                align-items: center;
                color: #3399ff;
                position: fixed;
                top:40px;
                .icon{
                    font-weight: bold;
                }
                span{
                    font-size: 32rpx;
                    color: #3399ff;
                    margin-left: 20rpx;
                }
            }
            .containerWrap{
                margin-top: 180rpx;
                .content{
                    margin-top: 16rpx;
                    background: #fff;
                    padding: 33rpx;
                    .heads{
                        display: flex;
                        justify-content: space-between;
                        padding-bottom: 33rpx;
                        border-bottom: 2rpx solid #ebedec;
                        .label{
                            font-size: 33rpx;
                            color: #333333;
                            font-weight: bold;
                        }
                        .tag{
                            width: 93rpx;
                            height: 51rpx;
                            line-height: 52rpx;
                            text-align: center;
                            background: #fcebe3;
                            border-radius: 5rpx;
                            font-size: 24rpx;
                            color: #ff6666;
                        }
                    }
                    .cont{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding-top: 20rpx;
                        .lBox{
                            p{
                                font-size: 24rpx;
                                color: #999999;
                            }
                        }
                        .rBox{
                            .imgs{
                                width: 152rpx;
                                height: 100rpx;
                                // background: #f2f2f2;
                                border-radius: 9rpx;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                border:1rpx solid #eceeed;
                                .nullImg{
                                    width: 53rpx;
                                    height: 53rpx;
                                }
                                .img{
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>