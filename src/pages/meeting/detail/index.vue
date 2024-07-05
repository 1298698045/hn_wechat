<template>
    <div class="wrap">
        <i-tabs :current="current" @change="handleChange">
            <i-tab key="tab1" title="会议"></i-tab>
            <i-tab key="tab2" title="任务"></i-tab>
            <i-tab key="tab3" title="纪要"></i-tab>
            <i-tab key="tab4" title="议题"></i-tab>
        </i-tabs>
        <div v-if="current=='tab1'&&!isShow">
            <div class="container">
                <div class="header">
                    <div class="row">
                        <div class="l">
                            <p></p>
                        </div>
                        <div class="r">
                            <p>{{detailInfo.name}}</p>
                            <p>我的会议</p>
                        </div>
                    </div>
                    <div class="rowTime">
                        <div class="lMin">
                            <p>{{startMonth}}月{{startDate}}日</p>
                            <p>{{startMin}}{{startDay}}</p>
                        </div>
                        <div class="num">
                            <span></span><p>{{mathNum}}</p><span></span>
                        </div>
                        <div class="lMin">
                            <p>{{endMonth}}月{{endDate}}日</p>
                            <p>{{endMin}}{{endDay}}</p>
                        </div>
                    </div>
                    <!-- <div class="rows">
                        <div class="l">
                            <i class="iconfont icon-zhongfu1"></i>
                        </div>
                        <div class="r">
                            <p>每周重复</p>
                        </div>
                    </div> -->
                    <div class="rows">
                        <div class="l">
                            <i class="iconfont icon-leixing"></i>
                        </div>
                        <div class="r">
                            <p>日历：工作</p>
                        </div>
                    </div>
                    <div class="rows">
                        <div class="l">
                            <i class="iconfont icon-gongzuozhuangtai"></i>
                        </div>
                        <div class="r">
                            <p>显示为：正忙</p>
                        </div>
                    </div>
                    <div class="rows">
                        <div class="l">
                            <i class="iconfont icon-shanguangdeng"></i>
                        </div>
                        <div class="r">
                            <p>15分钟前，应用内提醒</p>
                        </div>
                    </div>
                </div>
                <div class="header">
                    <div class="rows">
                        <div class="l">
                            <i class="iconfont icon-shiliangzhinengduixiang"></i>
                        </div>
                        <div class="r" style="border:none;">
                            <p>{{detailInfo.location}}</p>
                        </div>
                    </div>
                    <div class="rows">
                        <div class="l">
                            <i class="iconfont icon-huiyishi"></i>
                        </div>
                        <div class="r">
                            <p>会议室：{{detailInfo.roomIdName}}</p>
                        </div>
                    </div>
                </div>
                <div class="describe">
                    <div class="rows">
                        <div class="l">
                            <i class="iconfont icon-beizhu"></i>
                        </div>
                        <div class="r">
                            <p>{{detailInfo.meetingContent}}</p>
                        </div>
                    </div>
                </div>
                <div class="moveRow"  @click="getSignDetail">
                    <p>
                        <i class="iconfont icon-qiandao"></i>
                    </p>
                    <p>
                        {{detailInfo.joinQty}}人已签到
                    </p>
                    <p>
                        <i-icon type="enter" color="#999999" size="20" />
                    </p>
                </div>
                <div class="moveCont">
                    <!-- <div class="moveRow">
                        <p>
                            <i class="iconfont icon-zuzhiren"></i>
                        </p>
                        <p>
                            <input type="text" placeholder="邀请参与人">
                        </p>
                        <p>
                            <i-icon type="enter" color="#999999" size="20" />
                        </p>
                    </div> -->
                    <div class="row">
                        <div class="l">
                            <i class="iconfont icon-zuzhiren"></i>
                        </div>
                        <div class="r">
                            <p>
                                <span class="avatar">{{detailInfo.fullName}}</span>
                                <span class="name">{{detailInfo.owningUserName}}</span>
                                <span class="tag">组织人</span>
                            </p>
                        </div>
                    </div>
                    <div class="moveRow" @click="getInvitation">
                        <p>
                            <i class="iconfont icon-canyuren"></i>
                        </p>
                        <p style="border:none;">
                            邀请{{detailInfo.inviteQty}}人，{{detailInfo.joinQty}}人接受
                        </p>
                        <p>
                            <i-icon type="enter" color="#999999" size="20" />
                        </p>
                    </div>
                </div>
                <div class="moveRow" @click="getUsb">
                    <p>
                        <i class="iconfont icon-fujian"></i>
                    </p>
                    <p>
                        附件
                    </p>
                    <p v-if="isEdit">
                        <i class="iconfont icon-tianjia"></i>
                    </p>
                </div>
                <div class="enclosure">
                    <div class="rows" v-for="(item,index) in listFile" :key="index" @click="handleOpenFile(item)">
                        <p>
                            <img v-if="item.fileExtension=='.jpg'||item.fileExtension=='.png'" :src="item.link" alt="">
                            <img v-else-if="item.fileExtension=='.xls' || item.fileExtension=='.xlsx'" :src="photoUrl+'xls.png'" alt="">
                            <img v-else-if="item.fileExtension=='.doc' || item.fileExtension=='.word' || item.fileExtension=='.docx'" :src="photoUrl+'02.3.1.Word.png'" alt="">
                            <img v-else-if="item.fileExtension=='.rar'" :src="photoUrl+'rar.png'" alt="">
                            <img v-else-if="item.fileExtension=='.txt'" :src="photoUrl+'02.3.1.Txt.png'" alt="">
                            <img v-else-if="item.fileExtension=='.pdf'" :src="photoUrl+'02.3.1.Pdf.png'" alt="">
                            <img v-else-if="item.fileExtension=='.ppt'" :src="photoUrl+'02.3.1.PPT.png'" alt="">
                        </p>
                        <p>{{item.name}}</p>
                        <p @click="getDelFiles(item)">
                            <i-icon type="close" size="20" color="#666666" />
                        </p>
                    </div>
                </div>
                <div class="moveRow">
                    <p>
                        <i-icon type="enter" color="#fff" size="20" />
                    </p>
                    <p class="move">
                        更多
                    </p>
                </div>
                <h3>回复 {{commentList.length||''}}</h3>
                <div class="commentWrap">
                    <!-- <div class="comment">
                        <div class="lBox">
                            <p>卫辉</p>
                        </div>
                        <div class="rBox">
                            <p class="info">卫辉 <span>信息中心</span><span>05月25日 11:23</span></p>
                            <div class="imgBox">
                                <p></p>
                            </div>
                        </div>
                    </div> -->
                    <div class="comment items" v-for="(item,index) in commentList" :key="index">
                        <div class="lBox">
                            <p>{{item.Name}}</p>
                        </div>
                        <div class="rBox">
                            <p class="info">{{item.CreatedByName}} <span>信息中心</span><span>{{item.CreatedOn}}</span></p>
                            <p class="text">{{item.Comment}}</p>
                        </div>
                    </div>
                    <div class="comment">
                        <div class="lBox">
                            <i class="iconfont icon-tixing"></i>
                        </div>
                        <div class="rBox items">
                            <p class="info"><span>{{detailInfo.createdByName}} 创建了 会议</span><span>{{detailInfo.createdOn}}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="inpWrap" :style="{'height':height+'px'}" catchtouchmove="true" v-if="overlayShow==true">
                <div class="top" @click="getCloseOver">

                </div>
                <div class="bottom">
                    <div class="box">
                        <textarea class="textarea" :adjust-position="true" v-model="comment" @blur="getBlur" :show-confirm-bar="false" cursor-spacing='140' placeholder="我来说两句..." :auto-focus="true" name="" id="" maxlength="500" cols="30" rows="10"></textarea>
                        <div class="total">
                            <p>
                                {{contentSize}}/{{total}}
                            </p>
                            <p @click="getSendout" :class="{active:comment!=''}">
                                发送
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer_meeting" v-if="!overlayShow" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
                <div class="boxWrap">
                    <div class="lBox">
                        <div class="box" @click="getComment">
                            <p>
                                <i class="iconfont icon-pinglun"></i>
                            </p>
                            <p>评论</p>
                        </div>
                        <div class="box" v-if="detailInfo.audienceCheckinStatus!=2" @click="isSign?getSignIn():getNoSignIn()">
                            <p>
                                <i class="iconfont icon-qiandao"></i>
                            </p>
                            <p>签到</p>
                        </div>
                        <div class="box" v-if="detailInfo.audienceCheckinStatus==2">
                            <p>
                                <i class="iconfont icon-qiandao"></i>
                            </p>
                            <p>已签到</p>
                        </div>
                        <div class="box" @click="getMove">
                            <p>
                                <i class="iconfont icon-gengduo1"></i>
                            </p>
                            <p>更多</p>
                        </div>
                    </div>
                    <div class="rBox">
                        <p>
                            <span :class="{'refuse':audienceStatusCode==2}" @click="audienceStatusCode==2?'':getRefuse(2)">
                                {{audienceStatusCode==2?'已拒绝':'拒绝'}}
                            </span>
                            <span :class="{'accept':audienceStatusCode==1}" @click="audienceStatusCode==1?'':getRefuse(1)">
                                {{audienceStatusCode==1?'已接受':'接受'}}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <van-action-sheet
                :show="show"
                :round="false"
                :actions="actions"
                cancel-text="取消"
                @cancel="onClose"
                @close="onClose"
                @select="onSelect"
                z-index="99999"
            />
            <van-action-sheet :show="reasonShow" @close="getCancel" z-index="999" :round="false">
                <div class="sheetWrap">
                    <div class="title">
                        <p class="color" @click="getCancel">取消</p>
                        <p>拒绝理由</p>
                        <p class="color" @click="getSubmit">确认</p>
                    </div>
                    <van-radio-group :value="radio" @change="onChange">
                        <van-cell-group>
                            <van-cell :title="item.name" v-for="(item,index) in list" :key="index" clickable :data-name="item.name" @click="onClick">
                                <van-radio slot="right-icon" :name="item.name" />
                            </van-cell>
                            <!-- <van-cell title="单选框 2" clickable data-name="2" @click="onClick">
                            <van-radio slot="right-icon" name="2" />
                            </van-cell> -->
                        </van-cell-group>
                    </van-radio-group>
                </div>
            </van-action-sheet>
        </div>
        <Task v-if="current=='tab2'" :detailInfo="detailInfo" :current="current" :name="detailInfo.name" :Meetingid="detailInfo.valueId" :isEdit="isEdit" ref="child" />
        <Summarys v-if="current=='tab3'" :detailInfo="detailInfo" :current="current" :name="detailInfo.name" :Meetingid="detailInfo.valueId" :isEdit="isEdit" ref="child" />
        <Topics v-if="current=='tab4'" :current="current" :name="detailInfo.name" :Meetingid="detailInfo.valueId" :isEdit="isEdit" ref="child"  />
        <mapList @childFn="getChildFn" @cancel="getCancelChild" v-if="isShow" />
    </div>
</template>
<script>
import Summarys from '@/components/summary/summarys';
import Topics from "@/components/summary/topics";
import mapList from '@/components/mapList';
import QQMapWX from '@/utils/qqmap-wx-jssdk.js';
import {mapState, mapMutations} from 'vuex';
import { message } from '@/utils/message';
import Task from '@/components/schedule/task';
var qqmapsdk = new QQMapWX({
    key: 'UVRBZ-UN2WU-KMJV6-2DAPJ-JW5QE-C5BYC' // 必填
}); 
import openFiles from '@/utils/openFiles';
export default {
    components:{
        Summarys,
        mapList,
        Topics,
        Task
    },
    data(){
        return {
            current:"tab1",
            overlayShow:false,
            height:"",
            comment:"",
            total:500,
            actions: [
                {
                    name: '添加参与人',
                },
                {
                    name: '修改',
                },
                {
                    name: '删除'
                },
                // {
                //     name: '取消会议'
                // }
            ],
            show:false,
            id:"",
            sessionkey:"",
            detail:{},
            commentList:[
                {
                    CreatedByName:"张三",
                    CreatedOn:"2020-06-04 09:09",
                    Comment:'评论'
                }
            ],
            id:"f491d01b-f5bd-4de5-816e-d23b963a7384",
            detailInfo:{},
            status:'',
            reasonShow:false,
            radio:'',
            descripiton:"",
            list:[
                {
                    name:"请假中"
                },
                {
                    name:"生病中"
                },
                {
                    name:"出差中"
                },
                {
                    name:"会议中"
                },
                {
                    name:"外出中"
                },
                {
                    name:"休息中"
                },
                {
                    name:"其他"
                }
            ],
            startMonth:"",
            startDate:"",
            startDay:"",
            endMonth:"",
            endDate:"",
            endDay:"",
            mathNum:"",
            isShow:false,
            address:"",
            latitude:"",
            longitude:"",
            location:"",
            listFile:[],
            isEdit:false,
            audienceStatusCode:"",
            scheduledStart:"",
            scheduledEnd:"",
            startMin:"",
            endMin:""
        }
    },
    computed:{
        contentSize(){
            return this.comment.length || 0;
        },
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        ...mapState({
            selectFiles:state=>{
                return state.usb.selectFiles;
            }
        }),
        FileIds(){
            let temp = [];
            this.selectFiles.forEach(item=>{
                temp.push(item.id);
            })
            return temp;
        },
        isSign(){
            return this.nowInDateBetwen(this.scheduledStart,this.scheduledEnd); // 判断签到时间是否在范围内
        },
        photoUrl(){
            return this.$api.photo.url;
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        this.clearFile([]);
        this.id = options.id;
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.height = wx.getSystemInfoSync().windowHeight;
        this.getQueryDetail();
        this.getCommentQuery();
        this.getFileQuery();
        this.getFileList();
    },
    onUnload(){
        this.getClear([]); // 清空参与人
        this.clearFile([]); // 清空优盘附件
    },
    onShow(){
        this.getAddFile();
        this.getQueryDetail();
    },
    methods:{
        ...mapMutations([
            'getClear',
            'clearFile'
        ]),
        // 打开附件
        handleOpenFile(item){
            const openImgs = JSON.stringify([item.link]);
            openFiles(item,openImgs);
        },
        nowInDateBetwen (d1,d2) {
            //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
            // var dateBegin = new Date(d1.replace(/-/g, "/"));//将-转化为/，使用new Date
            // var dateEnd = new Date(d2.replace(/-/g, "/"));//将-转化为/，使用new Date
            var dateBegin = new Date(d1);//将-转化为/，使用new Date
            var dateEnd = new Date(d2);//将-转化为/，使用new Date
            var dateNow = new Date();//获取当前时间

            var beginDiff = dateNow.getTime() - dateBegin.getTime();//时间差的毫秒数       
            var beginDayDiff = Math.floor(beginDiff / (24 * 3600 * 1000));//计算出相差天数

            var endDiff = dateEnd.getTime() - dateNow.getTime();//时间差的毫秒数
            var endDayDiff = Math.floor(endDiff / (24 * 3600 * 1000));//计算出相差天数       
            if (endDayDiff < 0) {//已过期
                return false
            }
            if (beginDayDiff < 0) {//没到开始时间
                return false;
            }
            return true;
        },
        getChildFn(val,isBook){
            console.log(val,isBook);
            this.isShow = isBook;
        },
        getCancelChild(val){
            this.isShow = val;
        },
        // 选择优盘附件
        getUsb(){
            if(this.isEdit){
                const url = '/pages/uPan/main';
                wx.navigateTo({url:url});
            }
        },
        getAddFile(){
            if(this.FileIds!=""){
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:this.$api.usb.addFile,
                        SessionKey:this.sessionkey,
                        FileIds:this.FileIds.join(','),
                        ObjectTypeCode:5000,
                        ObjectId:this.id
                    }
                }).then(res=>{
                    console.log(res);
                    this.getQueryDetail();
                })
            }
        },
        // 获取会议附件
        getFileList(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.public.getFile,
                    SessionKey:this.sessionkey,
                    pid:this.id,
                    ObjTypeCode:5000
                }
            }).then(res=>{
                console.log(res);
            })
        },
        getDelFiles(item){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.public.delete,
                    SessionKey:this.sessionkey,
                    Id:item.id,
                    ObjTypeCode:1001
                }
            }).then(res=>{
                console.log(res);
                this.getQueryDetail();
            })
        },
        // 获取纪要
        getFileQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meeting.summary.get",
                    SessionKey:this.sessionkey,
                    Meetingid:this.id
                }
            }).then(res=>{
                console.log(res);
            })
        },
        getQueryDetail(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meeting.info.get",
                    SessionKey:this.sessionkey,
                    id:this.id,
                    ObjTypeCode:5000
                }
            }).then(res=>{
                console.log(res);
                this.detailInfo = res.data;
                this.detailInfo.fullName = this.detailInfo.owningUserName.length>2?this.detailInfo.owningUserName.substr(1):
                this.detailInfo.owningUserName;
                this.listFile = res.data.files;
                this.isEdit = res.data.isEdit;
                if(!this.isEdit){
                    this.actions = [];
                }
                this.audienceStatusCode = res.data.audienceStatusCode;
                let scheduledStart = this.detailInfo.scheduledStart;
                let scheduledEnd = this.detailInfo.scheduledEnd;
                this.scheduledStart = scheduledStart;
                this.scheduledEnd = scheduledEnd;
                let date = new Date(scheduledStart);
                let endDate = new Date(scheduledEnd);
                let startHour = date.getHours()<10?'0'+date.getHours():date.getHours();
                let endHour = endDate.getHours()<10?'0'+endDate.getHours():endDate.getHours();
                let startMin = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
                let endMin = endDate.getMinutes()<10?'0'+endDate.getMinutes():endDate.getMinutes();
                this.startMonth = date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1;
                this.startDate = date.getDate()<10?'0'+date.getDate():date.getDate();
                this.endMonth =  endDate.getMonth()+1<10?'0'+(endDate.getMonth()+1):endDate.getMonth()+1;
                this.endDate = endDate.getDate()<10?'0'+endDate.getDate():endDate.getDate();            
                this.startDay = this.getWeekDay(date);
                this.endDay = this.getWeekDay(endDate);
                this.mathNum = this.intervalTime(date,endDate);
                this.startMin = `${startHour}:${startMin}`;
                this.endMin = `${endHour}:${endMin}`;
            })
        },
        getWeekDay(date){
            let week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
            let day = week[date.getDay()];
            return day;
        },
        intervalTime(date,endDate){
            let startTime = new Date(date).getTime();
            let endTime = new Date(endDate).getTime();
            let date3 = endTime - startTime;
            //计算出相差天数
            let days = Math.floor(date3 / (24 * 3600 * 1000));
            // return days;
            //计算出小时数

            var leave1 = date3 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000));
            //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000));

            //计算相差秒数

            var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
            var seconds = Math.round(leave3 / 1000);
            let diff = 
                days>0&&hours>0?`${days}天${hours}小时`
                :days>0&&hours==0?`${days}天`
                :`${hours}小时`;
            return diff;
        },
        getCommentQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"object.comments.getlist",
                    SessionKey:this.sessionkey,
                    id:this.id,
                    ObjTypeCode:5000
                }
            }).then(res=>{
                console.log(res);
                this.commentList =  res.listData;
                this.commentList.map(item=>{
                    if(item.CreatedByName.length>2){
                        item.Name = item.CreatedByName.substr(1);
                    }else {
                        item.Name = item.CreatedByName;
                    }
                    return item;
                })
            })
        },
        onChange(e){
            console.log(e);
        },
        onClick(e) {
            console.log(e)
            this.radio = e.mp.currentTarget.dataset.name;
            this.descripiton = this.radio;
        },
        getCancel(){
            this.radio = '';
            this.reasonShow = false;
        },
        handleChange(e){
            this.current = e.mp.detail.key;
            if(this.current=='tab3'){
                
            }
        },
        getComment(){
            this.overlayShow = true;
        },
        getCloseOver(){
            this.overlayShow = false;
        },
        getBlur(){
            this.overlayShow = false;
            // this.height = '20';
        },
        getMove(){
            this.show = true;
        },
        onClose(){
            this.show = false;
        },
        onSelect(e){
            let name = e.mp.detail.name;
            if(name=='修改'){
                const url = '/pages/schedule/newSchedule/main?MeetingId='+this.id;
                wx.navigateTo({url:url});
            }else if(name=='删除'){
                this.getDelete();
            }else if(name=='添加参与人'){
                const url = '/pages/publics/mailList/main?admin='+1+'&meetingId='+this.id;
                wx.navigateTo({url:url});
            }else if(name=='取消会议'){
                
            }
        },
        getSendout(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"object.comment.add",
                    SessionKey:this.sessionkey,
                    objectid:this.id,
                    objTypeCode:5000,
                    comments:this.comment
                }
            }).then(res=>{
                console.log(res);
                this.comment = '';
                this.getCommentQuery();
            })
        },
        getDelete(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meeting.info.delete",
                    SessionKey:this.sessionkey,
                    ObjTypeCode:20015,
                    Id:this.id
                }
            }).then(res=>{
                if(res.status==1){
                    message.toast({
                        delta:1,
                        title:res.msg,
                        success(){

                        }
                    })
                }else {
                    message.toast({
                        title:'删除失败',
                        success(){

                        }
                    })
                }
                // wx.showToast({
                //     title:res.msg,
                //     icon:"success",
                //     duration:2000,
                //     success:res=>{
                //         wx.navigateBack({
                //             delta: 1
                //         })

                //     }
                // })

            })
        },
        getNoSignIn(){
            wx.showToast({
                title:'无法签到',
                icon: 'success',
                duration: 2000
            })
        },
        getSignIn(){
            // if(this.isEdit){
                // 管理员签到二维码
            //     // this.isShow = true; // 地图
            //     const url = '/pages/meeting/signin/main?id='+this.id;
            //     wx.navigateTo({url:url});
            // }else {
                var that = this;
                // wx.chooseLocation({
                //     success: function (res) {
                //         console.log(res);
                //         if (res.name == '') {
                //         } else {
                //             that.location = res.name;
                //             that.latitude = res.latitude;
                //             that.longitude = res.longitude;
                //             that.address = res.address;
                //             that.$httpWX.get({
                //                 url:that.$api.message.queryList,
                //                 data:{
                //                     method:"meeting.audience.checkin",
                //                     SessionKey:that.sessionkey,
                //                     id:that.id,
                //                     location:that.address,
                //                     latitude:that.latitude,
                //                     longitude:that.longitude
                //                 }
                //             }).then(res=>{
                //                 console.log(res);
                //                 wx.showToast({
                //                     title:res.msg,
                //                     icon:"success",
                //                     duration:2000
                //                 })
                //             })
                //         }
                //     },
                //     fail: function () {
                //         // fail
                //     },
                //     complete: function () {
                //         // complete
                //     }
                // })
                wx.getLocation({
                    type: 'wgs84',
                    success (res) {
                        console.log(res);
                        const latitude = res.latitude
                        const longitude = res.longitude
                        const speed = res.speed
                        const accuracy = res.accuracy
                        qqmapsdk.reverseGeocoder({
                            location:{
                                latitude:latitude,
                                longitude:longitude
                            },
                            success:res=>{
                                console.log(res);
                                that.address = res.result.address;
                                that.$httpWX.get({
                                    url:that.$api.message.queryList,
                                    data:{
                                        method:"meeting.audience.checkin",
                                        SessionKey:that.sessionkey,
                                        id:that.id,
                                        location:that.address,
                                        latitude:latitude,
                                        longitude:longitude
                                    }
                                }).then(res=>{
                                    console.log(res);
                                    if(res.status==1){
                                        wx.showToast({
                                            title:'签到成功',
                                            icon:"success",
                                            duration:2000,
                                            success:res=>{
                                                setTimeout(()=>{
                                                    that.getQueryDetail();
                                                },500)
                                            }
                                        })
                                    }else {
                                        wx.showToast({
                                            title:'签到失败',
                                            icon:"success",
                                            duration:2000,
                                            success:res=>{
                                            }
                                        })
                                    }
                                })
                            }
                        })
                        
                    }
                })
            // }
            
        },
        // 签到详情
        getSignDetail(){
            const url = '/pages/meeting/signinDetail/main?id='+this.id+'&isEdit='+this.isEdit;
            wx.navigateTo({url:url});
        },
        getInvitation(){
            const url = '/pages/meeting/joinDetail/main?id='+this.id+'&isEdit='+this.isEdit;
            wx.navigateTo({url:url});
        },
        // 拒绝
        getRefuse(status){
            this.status = status;
            if(status==2){
                this.reasonShow = true;
            }else {
                this.getSubmit();
            }
            
        },
        getSubmit(){
            var descripiton = '';
            if(this.status==2){
                descripiton = this.descripiton;
            }else {
                descripiton = '';
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meeting.people.status",
                    SessionKey:this.sessionkey,
                    Id:this.id,
                    descripiton:descripiton,
                    status:this.status
                }
            }).then(res=>{
                console.log(res);
                this.reasonShow = false;
                wx.showToast({
                    title:res.msg,
                    icon:"success",
                    duration:2000,
                    success:res=>{
                        setTimeout(()=>{
                            this.getQueryDetail();
                        },500)
                    }
                })
            })
        }
    }
}
</script>
<style lang="scss">
@import '../../../../static/css/schedule.css';
    .wrap{
        .container{
            padding-bottom: 80px;
            .header{
                margin-top: 24rpx;
                background: #fff;
                .row{
                    display: flex;
                    padding: 0 37rpx;
                    .l{
                        padding: 20rpx 0;
                        p{
                            width: 23rpx;
                            height: 23rpx;
                            border-radius: 50%;
                            background: #52b55e;
                            margin-top: 10rpx;
                        }
                    }
                    .r{
                        width: 100%;
                        padding: 20rpx 0;
                        margin-left: 20rpx;
                        border-bottom: 2rpx solid #e3e3e3;
                        p:nth-child(1){
                            width: 100%;
                            overflow: hidden;
                            word-break: break-word;
                            line-height: 1;
                            font-size: 34rpx;
                            color: #333333;
                            line-height: 1.5;
                            font-weight: bold;
                        }
                        p:nth-child(2){
                            font-size: 26rpx;
                            color: #7b8187;
                        }
                    }
                }
                .rowTime{
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding: 20rpx 0;
                    .lMin{
                        // width: 35%;
                        p:nth-child(1){
                            font-size: 40rpx;
                            font-weight: bold;
                            text-align: center;
                        }
                        p:nth-child(2){
                            text-align: center;
                            font-size: 24rpx;
                            color: #333333;
                        }
                    }
                    .num{
                        display: flex;
                        align-items: center;
                        span{
                            display: inline-block;
                            width: 20rpx;
                            height: 2rpx;
                            background: #e2e4e3;
                        }
                        p{
                            font-size: 24rpx;
                            // width: 82rpx;
                            height: 48rpx;
                            text-align: center;
                            line-height: 48rpx;
                            color: #999999;
                            background: #eef0f2;
                            border-radius: 26rpx;
                            padding: 0 20rpx;
                        }
                    }
                }
                .rows{
                    display: flex;
                    align-items: center;
                    padding: 0 37rpx;
                    .l{
                        i{
                            color: #343434;
                        }
                    }
                    .r{
                        padding: 30rpx 0;
                        border-top: 2rpx solid #e3e3e3;
                        flex: 1;
                        margin-left: 20rpx;
                        font-size: 34rpx;
                        color: #333333;
                    }                
                }
            }
            .describe{
                margin-top: 24rpx;
                background: #fff;
                .rows{
                    display: flex;
                    padding: 0 37rpx;
                    .l{
                        padding: 30rpx 0;
                        i{
                            color: #000000;
                        }
                    }
                    .r{
                        padding: 30rpx 0;
                        flex: 1;
                        margin-left: 20rpx;
                        font-size: 34rpx;
                        color: #333333;
                        p{
                            width: 100%;
                            overflow: hidden;
                            word-break: break-word;
                            line-height: 1;
                        }
                    }
                }
            }
            .moveCont{
                margin-top: 24rpx;
                background: #fff;
                .moveRow{
                    background: #fff;
                    display: flex;
                    padding: 0 37rpx;
                    align-items: center;
                    margin: 0;
                    p:nth-child(2){
                        padding: 30rpx 0;
                        flex: 1;
                        margin-left: 20rpx;
                        border-bottom: 1rpx solid #e2e3e5;
                    }
                    .move{
                        color: #999999;
                    }
                }
                .row{
                    display: flex;
                    align-items: center;
                    padding: 33rpx;
                    background: #fff;
                    border-bottom: 1rpx solid #e2e3e5;
                    .r{
                        flex: 1;
                        margin-left: 25rpx;
                        display: flex;
                        p{
                            display: flex;
                            align-items: center;
                            margin-right: 20rpx;
                            .avatar{
                                display: inline-block;
                                width: 50rpx;
                                height: 50rpx;
                                line-height: 50rpx;
                                text-align: center;
                                color: #fff;
                                font-size: 20rpx;
                                background: #3399ff;
                                border-radius: 50%;
                            }
                            .name{
                                font-size: 34rpx;
                                color: #333333;
                                margin: 0 10rpx;
                            }
                            .tag{
                                display: inline-block;
                                width: 68rpx;
                                height: 32rpx;
                                line-height: 32rpx;
                                text-align: center;
                                font-size: 20rpx;
                                color: #3399ff;
                                background: #e8f1fc;
                                border-radius: 5rpx;
                            }
                        }
                    }
                    .cont{
                        flex: 1;
                        margin-left: 25rpx;
                        font-size: 34rpx;
                        color: #333333;
                    }
                }
            }
            .moveRow{
                margin-top: 24rpx;
                background: #fff;
                display: flex;
                padding: 30rpx 37rpx;
                align-items: center;
                p:nth-child(2){
                    flex: 1;
                    margin-left: 20rpx;
                }
                .move{
                    color: #999999;
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
                            // background: #e5e5e5;
                            border-radius: 12rpx;
                            img{
                                width: 100%;
                                height: 100%;
                                overflow: hidden;
                            }
                        }
                        p:nth-child(2){
                            flex: 1;
                            margin-left: 20rpx;
                            font-size: 34rpx;
                            color: #333333;
                            width: 300rpx;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                    }
                }
            h3{
                background: #f7f7f7;
                color: #999999;
                font-size: 28rpx;
                padding: 31rpx 47rpx;
            }
            .commentWrap{
                background: #fff;
                .items{
                    align-items: center;
                }
                .comment:last-child .rBox{
                    border-bottom: none;
                }
                .comment{
                    display: flex;
                    padding: 0 32rpx;
                    .lBox{
                        padding: 20rpx 0;
                        width:60rpx;
                        p{
                            width: 60rpx;
                            height: 60rpx;
                            line-height: 60rpx;
                            text-align: center;
                            border-radius: 50%;
                            background: #3399ff;
                            color: #fff;
                            font-size: 20rpx;
                        }
                    }
                    .rBox{
                        flex: 1;
                        margin-left: 20rpx;
                        padding: 20rpx 0;
                        border-bottom: 2rpx solid #e3e3e3;
                        .imgBox{
                            display: flex;
                            margin-top: 10rpx;
                            p{
                                width: 200rpx;
                                height: 200rpx;
                                background: #e5e5e5;
                                border-radius: 9rpx;
                            }
                        }
                        .info{
                            font-size: 28rpx;
                            color: #3399ff;
                            overflow: hidden;
                            span:nth-child(1){
                                color: #666666;
                            }
                            span:nth-child(2){
                                color: #666666;
                                float: right;
                            }
                        }
                        .text{
                            font-size: 34rpx;
                            color: #333333;
                        }
                    }
                }
            }
        }
        .inpWrap{
            width: 100%;
            position: fixed;
            bottom: 100px;
            z-index: 999;
            .top{
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 1);
                opacity: .5;
            }
            .bottom{
                width: 100%;
                height: auto;
                position: fixed;
                bottom: 0;
                background: #fff;
                z-index: 9999;
                .box{
                    padding: 33rpx 33rpx 0 33rpx;
                    .textarea{
                        width: 100%;
                        height: 188rpx;
                        background: #fff;
                        color: #333333;
                        font-size: 28rpx;
                        border-bottom: 2rpx solid #eaebeb;
                    }
                    .total{
                        display: flex;
                        justify-content: space-between;
                        padding: 33rpx 0;
                        p:nth-child(1){
                            color: #999999;
                            font-size: 28rpx;
                        }
                        p:nth-child(2){
                            color: #999999;
                            font-size: 33rpx;
                        }
                        p:nth-child(2).active{
                            color: #3399ff;
                        }
                    }
                }
            }
        }
        .sheetWrap{
            .title{
                display: flex;
                padding: 26rpx 33rpx;
                p:nth-child(2){
                    flex: 1;
                    text-align: center;
                    font-size: 36rpx;
                    color: #333333;
                    font-weight: bold;
                }
                .color{
                    font-size: 33rpx;
                    color: #3399ff;
                }
            }
        }
        .footer_meeting{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            z-index: 999;
            border-top: 1rpx solid #e2e3e5;
            .boxWrap{
                display: flex;
                // justify-content: space-around;
                padding: 20rpx 0;
                .lBox{
                    width: 50%;
                    display: flex;
                    .box{
                        width: 33%;
                        text-align: center;
                        p:nth-child(1){
                            i{
                                color: #3399ff;
                            }
                        }
                        p:nth-child(2){
                            color: #3399ff;
                            font-size: 21rpx;
                            margin-top: 10rpx;
                        }
                    }
                }
                .rBox{
                    width: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    p{
                        span{
                            display: inline-block;
                            width: 164rpx;
                            height: 59rpx;
                            line-height: 59rpx;
                            text-align: center;
                            background: #fff;
                            color: #3399ff;
                            font-size: 32rpx;
                            border: 1rpx solid #bfc1c2;
                        }
                        span:nth-child(1){
                            border-right: none;
                            border-top-left-radius: 7rpx;
                            border-bottom-left-radius: 7rpx;
                        }
                        span:nth-child(2){
                            border-left: none;
                            border-top-right-radius: 7rpx;
                            border-bottom-right-radius: 7rpx;
                            // background:rgba(51, 153, 255, .5);
                            background: #3399ff;
                            color: #fff;
                        }
                        span:nth-child(2).accept{
                            // background: #fff;
                            // color: #3399ff;
                            background:rgba(51, 153, 255, .5);
                            color: #fff;
                        }
                        span:nth-child(1).refuse{
                            background: #bfc1c2;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
</style>