<template>
    <div class="wrap">
        <van-search :value="value" placeholder="搜索" />
        <!-- <i-notice-bar icon="systemprompt" color="#3399ff" i-class="systemprompt" closable>
            启用新消息通知，不错过重要新消息!
        </i-notice-bar> -->
        <div class="center" :class="{'active':list.length>8}">
            <div class="content" :class="{active:num==index}" v-for="(item,index) in list" :key="index">
                <van-swipe-cell :right-width=" 135 " :left-width=" 0 ">
                    <i-row i-class="row"  @touchstart="touchstart(item,index)" @touchend="touchend" @click="handleSelelct(item,index)">
                        <i-col span="4" i-class="left">
                            <div class="imgWrap">
                                <img :src="imgUrl+item.Icon" alt="">
                            </div>
                        </i-col>
                        <i-col span="15" i-class="centerCol">
                            <p class="topText">
                                {{item.Name}}
                                <!-- {{index==1?'新闻':index==2?'优盘':'待办事务'}} -->
                            </p>
                            <p class="minText">查看{{item.Name}}的内容</p>
                        </i-col>
                        <i-col span="5" class="rightCol">
                            <p class="time">{{item.time}}</p>
                            <span :class="{'radius':item.Quantity<10}" v-if="item.Quantity>0">{{item.Quantity}}</span>
                            <!-- <i-badge count="66" i-class-alone="demo-badge-alone" /> -->
                        </i-col>
                    </i-row>
                    <view slot="right" class="moreBox">
                        <p class="top" @click="getTop(item)">置顶</p>
                        <p class="del" @click="getRowDel(item,index)">删除</p>
                    </view>
                </van-swipe-cell>
            </div>
        </div>
        <vue-tab-bar
            @fetch-index="clickIndexNav"
            :selectNavIndex="selectNavIndex"
            :needButton="needButton"
            :handButton="handButton"
            :btnText="btnText">
        </vue-tab-bar>
    </div>
</template>
<script>
import { mapState,mapMutations} from 'vuex';
import vueTabBar from '../../components/vueTabBar';
export default {
    components:{
        vueTabBar
    },
    data(){
        return {
            list:[],
            num:-1,
            sessionkey:"",
            selectNavIndex:0,
            needButton:false,
            handButton:'',
            btnText:'',
            total:""
        }
    },
    onShow(){
        this.num = -1;
    },
    computed:{
        ...mapState({
            imgUrl:state=>{
                return state.user.imgUrl
            },
            openid:state=>{
                return state.loginUser.openid
            }
            // sessionkey:state=>{
            //     return state.loginUser.sessionkey
            // }
        })
    },
    onShow(){
        wx.hideTabBar();
        this.getQuery();
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getQuery();
        
    },
    methods:{
        ...mapMutations([
            'getMessageTotal'
        ]),
        getQuery(){
            console.log(this.$httpWX,this.$api.message.queryList);
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.msg.query,
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                this.list = res.listDta;
                let total = 0;
                this.list.map(item=>{
                    const time = this.getDate(item.ModifiedOn.replace(/-/g,'/'));
                    item.time = time;
                    return item;
                })
                this.list.forEach(item=>{
                   total += Number(item.Quantity)
                })
                this.total = total;
                this.getMessageTotal(total);
                wx.setTabBarBadge({
                    index: 0,
                    text: String(total)
                })
            })
        },
        getDate(ModifiedOn){
            let time = (new Date(ModifiedOn)).getTime();
            time = new Date(time);
            var year = time.getFullYear()+'年';
            var month = time.getMonth()+1+'月';
            var date = time.getDate()+'日';
            const newDate = `${month}${date}`;
            return newDate;
        },
        touchstart(item,index){
            this.num = index;
        },
        touchend(){
            this.num = -1;
        },
        handleSelelct(item,index){
            console.log(item);
            // this.num = index;
            let id = item.ModuleId;
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.msg.update,
                    SessionKey:this.sessionkey,
                    objectTypeCode:item.ObjectTypeCode
                }
            }).then(res=>{
                console.log(res);
                this.getQuery();
            })
            // 107邮件 101待办事务 104新闻
            if(id==104){
                const url = '/pages/journalism/main?contentTypeCode='+1+'&title='+item.Name;
                wx.navigateTo({url:url});
            }else if(id==106){
                const url = '/pages/usbDrive/main';
                wx.navigateTo({url:url});
            }else if(id==101){
                const url = '/pages/todoBusiness/main'
                wx.navigateTo({url:url});
            }else if(id==107){
                const url = '/pages/email/main'
                wx.navigateTo({url:url});
            }else if(id==103){
                const url = '/pages/schedule/main';
                wx.switchTab({url:url});
            }else if(id==100202){
                const url = '/pages/journalism/main?contentTypeCode='+2+'&title='+item.Name;
                wx.navigateTo({url:url});
            }else if(id==111){
                const url = '/pages/meeting/notice/main';
                wx.navigateTo({url:url});
            }else if(id==6030){
                const url = '/pages/hr/weRunData/main';
                wx.navigateTo({url:url});
            }else if(id==102){
                const url = '/pages/homeMailList/main';
                wx.switchTab({url:url});
            }else if(id==203){
                const url = '/pages/wagesQuery/main';
                wx.navigateTo({url:url})
            }else if(id==30400){
                const url = '/pages/vote/main';
                wx.navigateTo({url:url});
            }else if(id==30300){
                const url = '/pages/questionnaire/main';
                wx.navigateTo({url:url});
            }else if(id==6000){
                const url = '/pages/community/main';
                wx.navigateTo({url:url})
            }else if(id==30022){
                const url = '/pages/clockIn/leaveApply/main';
                wx.navigateTo({url:url});
            }else if(id==30036){
                const url = '/pages/hr/Business/main';
                wx.navigateTo({url:url});
            }else if(id==30037){
                const url = '/pages/hr/overTimeApply/main';
                wx.navigateTo({url:url});
            }else if(id==30020){
                const url = '/pages/hr/personnelFiles/main';
                wx.navigateTo({url:url});
            }else if(id==30091){
                const url = '/pages/hr/holidayAccount/main';
                wx.navigateTo({url:url});
            }else if(id==20500){
                const url = '/pages/workNotice/main';
                wx.navigateTo({url:url});
            }else if(id==5003){
                const url = '/pages/meeting/notice/main';
                wx.navigateTo({url:url});
            }else if(id==110){
                const url = '/pages/journalModule/main';
                wx.navigateTo({url:url});
            }else if(id==301){
                const url = '/pages/signIn/main';
                wx.navigateTo({url:url});
            }else if(id==105){
                const url = '/pages/task/main';
                wx.navigateTo({url:url});
            }
        },
        // 删除
        getRowDel(item,index){
            let that = this;
            wx.showModal({
                title: '',
                content: `确定要删除${item.Name}吗？`,
                success:(res)=>{
                    if (res.confirm) {
                        that.list.splice(index,1)
                        // that.getDelete(item);
                    } else if (res.cancel) {

                    }
                }
            })
        },
        getDelete(item){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.public.delete,
                    SessionKey:this.sessionkey,
                    ObjTypeCode:"20501",
                    Id:item.ModuleId
                }
            }).then(res=>{
                console.warn(res);
            })
        },
        // 置顶
        getTop(item){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.msg.update,
                    SessionKey:this.sessionkey,
                    objectTypeCode:item.ObjectTypeCode
                }
            }).then(res=>{
                this.getQuery();
            })
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        .systemprompt{
            background: #fff!important;
        }
        .center.active{
            padding-bottom: 80px;
        }
        .center{
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #fff;
            .content.active{
                background: #f3f3f3;
            }
            .content:last-child{
                border-bottom: none;
            }
            .content{
                // padding: 20rpx;
                background: #fff;
                border-bottom: 1rpx solid #e2e3e5;
                .row{
                    padding: 20rpx;
                }
                .left{
                    .imgWrap{
                        width: 100rpx;
                        height: 100rpx;
                        img{
                            width: 100rpx;
                            height: 100rpx;
                            vertical-align: middle;
                            border-radius: 50%;
                        }
                    }
                }
                .centerCol{
                    .topText{
                        color: #333333;
                        font-size: 35rpx;
                        margin-top: 10rpx;
                    }
                    .minText{
                        color: #999999;
                        font-size: 28rpx;
                    }
                }
                .rightCol{
                        text-align: right;
                    .time{
                        font-size: 23rpx;
                        color: #999999;
                        margin-top: 10rpx;
                    }
                    span{
                        width: 40rpx;
                        height: 32rpx;
                        line-height: 32rpx;
                        text-align: center;
                        background: #ff6666;
                        color: #fff;
                        display: inline-block;
                        font-size: 20rpx;
                        border-radius: 16rpx;
                    }
                    span.radius{
                        width: 32rpx;
                        height: 32rpx;
                        line-height: 32rpx;
                        border-radius: 50%;
                        text-align: center;
                        font-size: 17rpx;
                    }
                }
                .moreBox{
                    display: flex;
                    height: 100%;
                    .top{
                        width: 160rpx;
                        background: #3399ff;
                        color: #fff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 28rpx;
                    }
                    .del{
                        width: 111rpx;
                        background: #ff6666;
                        color: #fff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 28rpx;

                    }
                }
            }
        }
    }
</style>