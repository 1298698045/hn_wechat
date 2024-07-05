<template>
    <div class="wrap">
        <div class="center" v-for="(item,index) in list" :key="index">
            <p class="time">{{item.ModifiedOn}}</p>
            <div class="content">
                <div class="lBox">
                    <p>{{item.name}}</p>
                </div>
                <div class="rBox"  @click="getDetail(item)">
                    <div class="cont">
                        <div class="title">
                            <!-- <p class="name">{{item.Subject}}</p> -->
                            <p class="name">{{item.CreatedByName}}邀请你加入会议</p>
                            <p class="tag" :class="item.ReceiveStatusCode==2?'refule':''" v-if="item.ReceiveStatusCode==1||item.ReceiveStatusCode==2">
                                {{item.ReceiveStatusCode==1?'已接受':item.ReceiveStatusCode==2?'已拒绝':''}}
                            </p>
                        </div>
                        <!-- <p class="text">针对服务品质进行评估</p> -->
                        <div class="info">
                            <p>会议主题：<span>{{item.Subject}}</span></p>
                            <!-- <span>组织人：<span>{{item.CreatedByName}}</span></p> -->
                            <p>会议时间：<span>1月9日 周二 10:00～11:00</span></p>
                            <p>会议室：<span>{{item.RoomIdName}}</span></p>
                            <p v-if="item.ReceiveStatusCode==2">拒绝理由：<span>{{item.Description}}</span></p>
                        </div>
                    </div>
                    <div class="btnWrap" v-if="item.ReceiveStatusCode==0">
                        <p @click.stop="getRefule(item)">拒绝</p>
                        <p @click.stop="getAccept(item)">接受</p>
                    </div>
                    <div class="btnWrap" v-if="item.ReceiveStatusCode!=0">
                        <p @click.stop="item.ReceiveStatusCode==1?getRefule(item):item.ReceiveStatusCode==2?getAccept(item):getEdit(item)">{{item.ReceiveStatusCode==1?'拒绝':item.ReceiveStatusCode==2?'接受':'修改'}}</p>
                        <!-- <p @click.stop="getEdit(item)">
                            修改
                        </p> -->
                        <p @click.stop="getDetail(item)">查看详情</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer"  :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <p @click="getIntoModule">点击进入会议模块</p>
        </div>
        <van-action-sheet :show="reasonShow" @close="getCancel" z-index="999" :round="false">
            <div class="sheetWrap">
                <div class="title">
                    <p class="color" @click="getCancel">取消</p>
                    <p>拒绝理由</p>
                    <p class="color" @click="getSubmit">确认</p>
                </div>
                <van-radio-group :value="radio" @change="onChange">
                    <van-cell-group>
                        <van-cell :title="item.name" v-for="(item,index) in listData" :key="index" clickable :data-name="item.name" @click="onClick">
                            <van-radio slot="right-icon" :name="item.name" />
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
                <textarea class="detail-textarea" v-if="radio=='其他'" placeholder-class="placeholder" placeholder="备注内容" auto-height='true' maxlength="300" @input="getTextareaInput"/>
            </div>
        </van-action-sheet>
    </div>
</template>
<script>
export default {
    data(){
        return {
            sessionkey:"",
            pageNumber:1,
            pageSize:20,
            list:[],
            reasonShow:false,
            listData:[
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
            radio:"",
            descripiton:"",
            id:"",
            status:"",
            content:""
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        }
    },
    onShow(){
        this.getQuery();
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getQuery();
        setTimeout(()=>{
            this.pageScrollToBottom();
        },1000)
    },
    methods:{
       getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meeting.my.getlist",
                    SessionKey:this.sessionkey,
                    pageNumber:this.pageNumber,
                    pageSize:this.pageSize
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
                this.list.forEach(item=>{
                    if(item.OwningUserName.length>2){
                        this.$set(item,'name',item.OwningUserName.substr(1));
                    }else {
                        this.$set(item,'name',item.OwningUserName);
                    }
                })
            })
        },
        // 获取容器高度，使页面滚动到容器底部
        pageScrollToBottom: function () {
            wx.createSelectorQuery().select('.wrap').boundingClientRect(function (rect) {
                // 使页面滚动到底部
                wx.pageScrollTo({
                    scrollTop: rect.bottom
                })
            }).exec();
        },
        getDetail(item){
            const url = '/pages/meeting/detail/main?id='+item.MeetingId;
            wx.navigateTo({url:url});
        },
        getEdit(item){
            const url = '/pages/schedule/newSchedule/main?MeetingId='+item.MeetingId;
            wx.navigateTo({url:url});
        },
        getIntoModule(){
            const url = '/pages/meetingEntry/main';
            wx.navigateTo({url:url});   
        },
        onClick(e) {
            console.log(e)
            this.radio = e.mp.currentTarget.dataset.name;
            this.descripiton = this.radio;
        },
        getTextareaInput(e){
            console.log(e);
            this.descripiton = `${this.radio}:${e.mp.detail.value}`;
            console.log(this.descripiton)
        },
        getCancel(){
            this.radio = '';
            this.reasonShow = false;
        },
        getSubmit(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meeting.people.status",
                    SessionKey:this.sessionkey,
                    Id:this.id,
                    descripiton:this.descripiton,
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
                        this.getQuery();
                    }
                })
            })
        },
        // 拒绝
        getRefule(item){
            this.id = item.MeetingId;
            this.status = 2;
            this.reasonShow = true;
        },
        // 接受
        getAccept(item){
            this.id = item.MeetingId;
            this.descripiton = '';
            let that = this;
            wx.showModal({
                title: '重新接受会议？',
                content: '是否重新接受会议并进入会议详情',
                success:res=>{
                    if (res.confirm) {
                        console.log('用户点击确定');
                        that.status = 1;
                        that.getSubmit();
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        padding-bottom: 100px;
        .time{
            font-size: 24rpx;
            color: #666666;
            width: 240rpx;
            height: 48rpx;
            line-height: 48rpx;
            text-align: center;
            background: #f7f8f9;
            border-radius: 5rpx;
            margin: 0 auto;
            margin-top: 60rpx;
            border-radius: 26rpx;
        }
        .content{
            display: flex;
            padding: 17rpx;
            .lBox{
                p{
                    width: 80rpx;
                    height: 80rpx;
                    line-height: 80rpx;
                    text-align: center;
                    background: #3399ff;
                    font-size: 26rpx;
                    color: #fff;
                    border-radius: 50%;
                }
            }
            .rBox{
                width: 587rpx;
                background: #fff;
                border-radius: 5rpx;
                margin-left: 20rpx;
                border-radius: 23rpx;
                .cont{
                    padding: 28rpx;
                    .title{
                        display: flex;
                        justify-content: space-between;
                        .name{
                            font-size: 32rpx;
                            font-weight: bold;
                            color: #333333;
                        }
                        .tag{
                            width: 80rpx;
                            height: 32rpx;
                            line-height: 32rpx;
                            text-align: center;
                            background: #fff;
                            background: #e6f6f0;
                            color: #57b987;
                            border-radius: 7rpx;
                            font-size: 20rpx;
                        }
                        .tag.refule{
                            background: #faebe9;
                            color: #ff6666;
                        }
                    }
                    .text{
                        font-size: 32rpx;
                        color: #333333;
                    }
                    .info{
                        margin-top: 20rpx;
                        p{
                            font-size: 31rpx;
                            color: #a1a5aa;
                            span{
                                color: #333333;
                            }
                        }
                    }
                }
                .btnWrap{
                    display: flex;
                    width: 100%;
                    margin: auto;
                    border-top: 2rpx solid #e4e4e4;
                    p{
                        flex: 1;
                        font-size: 30rpx;
                        color: #3399ff;
                        text-align: center;
                        padding: 20rpx 0;
                    }
                    p:nth-child(1){
                        border-right: 2rpx solid #e4e4e4;
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
            .detail-textarea{
                width: 95%;
                height: 80rpx!important;
                margin: 0 auto;
                background: #f6f6f6;
                font-size: 24rpx!important;
                padding:10rpx !important;
            }
            .placeholder{
                line-height:80rpx!important;
                font-size:24rpx!important;
                color:#c7c7cc!important;
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            p{
                text-align: center;
                padding: 33rpx 0;
                font-size: 33rpx;
                color: #3399ff;
            }
        }
    }
</style>