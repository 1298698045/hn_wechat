<template>
    <div class="wrap">
        <!-- <div class="banner padding">
            <image :src="pathUrl" mode="scaleToFill" class="img"></image>
            <span @click="getOpenPhoto">
                更换封面
            </span>
        </div> -->
        <div class="banner">
            <swiper :autoplay="true" interval="3000" :circular="true" :current="0" 	next-margin="20px" previous-margin="20px">
                <swiper-item class="swiper_item" v-for="(item,index) in banners" :key="index">
                    <div class="box">
                        <image :src="pathUrl+item.ImageUrl" mode="scaleToFill"></image>
                    </div>
                </swiper-item>
            </swiper>
        </div>
        <!-- 管理员控制台 -->
        <!-- <div class="nav padding">
            <p>管理员控制台<span>（仅管理员可见）</span></p>
            <p>应用管理</p>
        </div>
        <div class="header padding">
            <div class="boxWrap">
                <div class="box" @click="getGroup">
                    <p>
                        <img :src="imgUrls+'04.Organizational_Structure.png'" alt="">
                    </p>
                    <p>组织架构</p>
                </div>
                <div class="box">
                    <p>
                        <img :src="imgUrls+'04.User_Manual.png'" alt="">
                    </p>
                    <p>使用手册</p>
                </div>
                <div class="box">
                    <p>
                        <img :src="imgUrls+'04.Customer_Servicel.png'" alt="">
                    </p>
                    <p>我的客服</p>
                </div>
                <div class="box">
                    <p>
                        <img :src="imgUrls+'04.Setup_Workbench.png'" alt="">
                    </p>
                    <p>设置工作台</p>
                </div>
            </div>
        </div> -->
        <div class="center">
            <h3 class="padding">最近使用</h3>
            <div class="box">
                <div class="box_img" v-for="(item,index) in rowImgs" :key="index" @click="getRouter(item,0)">
                    <p class="imgBox" :class="{'acitve':item.icon==''}">
                        <img :src="imgUrl+item.icon" alt="">
                    </p>
                    <p class="label">{{item.label}}</p>
                </div>
                
            </div>
        </div>
        <div class="content_wrap">
            <div class="content" v-for="(item,index) in list" :key="index">
                <h3 class="padding" @click="item.items.length>4?getOpen(index):''">
                    <p>{{item.label}}</p>
                    <p v-if="item.items.length>4">{{item.showContent?'收起':'展开'}}</p>
                </h3>
                <div class="row">
                    <div class="box" v-for="(v,i) in item.showContent?item.items:item.array" :key="i" @click="getRouter(v,1)">
                        <p :class="v.icon==''?'active':''">
                            <img :src="imgUrl+v.icon" alt="" v-if="item.icon!=''">
                        </p>
                        <p>{{v.label}}</p>
                    </div>
                </div>
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
import { mapState } from 'vuex';
import vueTabBar from '../../components/vueTabBar';
export default {
    components:{
        vueTabBar
    },
    data(){
        return {
            rowImgs:[
                'https://oawx.hnca.org.cn/img/icons/news.png',
                'https://oawx.hnca.org.cn/img/icons/wftasks.png',
                'https://oawx.hnca.org.cn/img/icons/email.png',
                'https://oawx.hnca.org.cn/img/icons/file.png',
                'https://oawx.hnca.org.cn/img/icons/meeting.png',
                'https://oawx.hnca.org.cn/img/icons/addresslist.png'

            ],
            list:[],
            show:false,
            sessionkey:"",
            organizationName:"",
            imgUrls:this.$api.photo.url,
            selectNavIndex:2,
            needButton:false,
            handButton:'',
            btnText:'',
            banners: []
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.organizationName = wx.getStorageSync('organizationName');
        // this.pathUrl = this.$api.pathUrl+'/img/banner/work_banner.png?'+ new Date().getTime();
        wx.setNavigationBarTitle({
            title: this.organizationName
        })
        // this.getBanner();
        this.queryBannerList();
        this.getLatelyModule();
        this.getQuery();
    },
    onShow(){
        wx.hideTabBar();
    },
    computed:{
        ...mapState({
            imgUrl:state=>{
                return state.user.imgUrl
            },
            sessionkey:state=>{
                return state.loginUser.sessionkey
            }
        }),
        pathUrl(){
            return this.$api.pathUrl;
        }
    },
    methods:{
        // 组织架构
        getGroup(){
            const url = '/pages/mailList/organization/main';
            wx.navigateTo({url:url});
        },
        getOpen(index){
            this.list[index].showContent = !this.list[index].showContent;
            console.log(this.list[index].showContent);
        },
        getLatelyModule(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.work.latelyModule,
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                this.rowImgs = res.data.slice(0,4);
            })
        },
        getBanner(){
            // this.$httpWX.get({
            //     url:this.$api.message.queryList,
            //     data:{
            //         method:this.$api.work.banner,
            //         SessionKey:this.sessionkey
            //     }
            // }).then(res=>{
            //     cosnole.log(res);
            // })
            let that = this;
            let url = `${that.$api.upload.url}?method=${that.$api.work.banner}&SessionKey=${that.sessionkey}`;
            wx.downloadFile({
                url: url, //仅为示例，并非真实的资源
                success (res) {
                    console.log(res);
                    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                    if (res.statusCode === 200) {
                        that.pathUrl = res.tempFilePath;
                    }
                }
            })
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.work.modulesList,
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
                this.list.map(item=>{
                    this.$set(item,'showContent',false)
                    const array = item.items.slice(0,4);
                    this.$set(item,'array',array);
                })
                console.log(this.list,'list');
                // this.list[0].showContent = true;
            })
        },
        queryBannerList(){
            this.$httpWX.get({
                url: this.$api.message.queryList,
                data: {
                    method: this.$api.work.banners,
                    SessionKey: this.sessionkey
                }
            }).then(res=>{
                this.banners = res;
            })
        },
        getOpenDetail(index){
            if(index==0){
                const url = '/pages/journalism/main?contentTypeCode='+1;
                wx.navigateTo({url:url});
            }else if(index==1){
                const url = '/pages/todoBusiness/main';
                wx.navigateTo({url:url});
            }else if(index==2){
                const url  = '/pages/email/main';
                wx.navigateTo({url:url});
            }else if(index==3){
                const url = '/pages/usbDrive/main';
                wx.navigateTo({url:url});
            }else if(index==4){
                const url = '/pages/meeting/notice/main';
                wx.navigateTo({url:url});
            }else if(index==5){
                const url = '/pages/homeMailList/main';
                wx.switchTab({url:url});
            }
        },
        getRouter(item,str){
            console.log(item);
            if(str==1){
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:this.$api.work.upLatelyModule,
                        SessionKey:this.sessionkey,
                        ModuleId:item.id
                    }
                }).then(res=>{
                    console.log(res);
                    this.getLatelyModule();
                })
            }
            // 107邮件 101待办事务 104新闻
            if(item.id==107){
                const url  = '/pages/email/main';
                wx.navigateTo({url:url});
            }else if(item.id==104){
                const url = '/pages/journalism/main?contentTypeCode='+1+'&title='+item.label;
                wx.navigateTo({url:url});
            }else if(item.id==101){
                const url = '/pages/todoBusiness/main';
                wx.navigateTo({url:url});
            }else if(item.id==106){
                const url = '/pages/usbDrive/main';
                wx.navigateTo({url:url});
            }else if(item.id==100202){
                const url = '/pages/journalism/main?contentTypeCode='+2+'&title='+item.label;
                wx.navigateTo({url:url});
                // const url = '/pages/todoBusiness/launch/main';
                // wx.navigateTo({url:url});
            }else if(item.id==302){
                const url = '/pages/clockIn/main';
                wx.navigateTo({url:url});
            }else if(item.id==20034){
                const url = '/pages/conferenceRoom/main';
                wx.navigateTo({url:url});
            }else if(item.id==103){
                const url = '/pages/schedule/main';
                wx.switchTab({url:url});
            }else if(item.id==100101){
                const url = '/pages/approval/main';
                wx.navigateTo({url:url});
            }else if(item.id==112){
                const url = '/pages/meeting/notice/main';
                wx.navigateTo({url:url});
            }else if(item.id==111){
                const url = '/pages/meetingEntry/main';
                wx.navigateTo({url:url});
            }else if(item.id==102){
                const url = '/pages/homeMailList/main';
                wx.switchTab({url:url});
            }else if(item.id==203){
                const url = '/pages/wagesQuery/main';
                wx.navigateTo({url:url})
            }else if(item.id==30400){
                const url = '/pages/vote/main';
                wx.navigateTo({url:url});
            }else if(item.id==30300){
                const url = '/pages/questionnaire/main';
                wx.navigateTo({url:url});
            }else if(item.id==6000){
                const url = '/pages/community/main';
                wx.navigateTo({url:url})
            }else if(item.id==30022){
                const url = '/pages/clockIn/leaveApply/main';
                wx.navigateTo({url:url});
            }else if(item.id==30036){
                const url = '/pages/hr/Business/main';
                wx.navigateTo({url:url});
            }else if(item.id==30037){
                const url = '/pages/hr/overTimeApply/main';
                wx.navigateTo({url:url});
            }else if(item.id==30020){
                // const url = '/pages/hr/personnelFiles/main';
                const url = '/pages/personnelFiles/main';
                wx.navigateTo({url:url});
            }else if(item.id==30091){
                const url = '/pages/hr/holidayAccount/main';
                wx.navigateTo({url:url});
            }else if(item.id==20500){
                const url = '/pages/workNotice/main';
                wx.navigateTo({url:url});
            }else if(item.id==5003){
                const url = '/pages/meeting/notice/main';
                wx.navigateTo({url:url});
            }else if(item.id==110){
                const url = '/pages/journalModule/main';
                wx.navigateTo({url:url});
            }else if(item.id==301){
                const url = '/pages/signIn/main';
                wx.navigateTo({url:url});
            }else if(item.id==30027){
                const url = '/pages/hr/deptTransfer/main';
                wx.navigateTo({url:url});
            }else if(item.id==303){
                const url = '/pages/scheduling/main';
                wx.navigateTo({url:url});
            }else if(item.id==3002000){
                const url = '/pages/human/main';
                wx.navigateTo({url:url});
            }else if(item.id=="105") {
                const url = '/pages/task/main';
                wx.navigateTo({url:url});
            }
        },
        getOpenPhoto(){
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    that.pathUrl = tempFilePaths[0];
                    console.log(`${that.$api.upload.url}?method=${that.$api.work.uploadFile}&SessionKey=${that.sessionkey}`,'000');
                    wx.uploadFile({
                        url: `${that.$api.upload.url}?method=${that.$api.work.uploadFile}&SessionKey=${that.sessionkey}`, //仅为示例，非真实的接口地址
                        filePath: tempFilePaths[0],
                        name: 'file',
                        formData: {
                            'user': 'test'
                        },
                        success (res){
                            console.log(res);
                            that.pathUrl = '';
                            that.pathUrl = this.$api.pathUrl+'/img/banner/work_banner.png?'+ new Date().getTime();
                            // that.getBanner();
                        }
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss">
    @import '../../../static/css/public.scss';
    .wrap{
        background: #f4f4f4;
        padding-bottom: 80px;
        .banner{
            // background: #fff;
            height: 272rpx;
            position: relative;
            margin: 20rpx 0;
            .swiper_item{
                padding: 0 20rpx;
                box-sizing: border-box;
                .box{
                    border-radius: 20rpx;
                    height: 100% !important;
                    // background: #3399ff;
                    overflow: hidden;
                    image{
                        width: 100%;
                        border-radius: 20rpx;
                    }
                }
            }
            .img{
                width: 100%;
                height: 100%;
                vertical-align: middle;
                border-radius: 12rpx;
            }
            span{
                display: inline-block;
                color: #fff;
                font-size: 24rpx;
                width: 179rpx;
                height: 52rpx;
                line-height: 52rpx;
                text-align: center;
                position: absolute;
                top:60rpx;
                background: #000000;
                right: 30rpx;
                opacity: .5;
                border-top-left-radius: 28rpx;
                border-bottom-left-radius: 28rpx;
            }
        }
        .nav{
            background: #fff;
            display: flex;
            justify-content: space-between;
            p:nth-child(1){
                font-size: 33rpx;
                font-weight: bold;
                span{
                    font-size: 12px;
                    color: #a3a3a3;
                }
            }
            p:nth-child(2){
                font-size: 25rpx;
                color: #3399ff;
            }
        }
        .header{
            border-bottom: 1rpx solid #e2e2e2;
            .boxWrap{
                display: flex;
                .box{
                    width: 25%;
                    p:nth-child(1){
                        width: 60rpx;
                        height: 60rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin: 0 auto;
                        img{
                            width: 40rpx;
                            height: 40rpx;
                        }
                    }
                    p:nth-child(2){
                        font-size: 12px;
                        text-align: center;
                    }

                }
            }
        }
        .center{
            // border-bottom: 1rpx solid #e2e2e2;
            background: #fff;
            margin: 50rpx 20rpx 20rpx 20rpx;
            border-radius: 20rpx;
            h3{
                font-size: 28rpx;
                font-weight: bold;
            }
            .box{
                display: flex;
                padding: 20rpx 0;
                .box_img{
                    width: 25%;
                    .imgBox{
                        width: 116rpx;
                        height: 116rpx;
                        margin: 0 auto;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                    .imgBox.acitve{
                        background: #eef0f2;
                        border-radius: 15rpx;
                    }
                    .label{
                        font-size: 24rpx;
                        color: #333333;
                        text-align: center;
                        margin-top: 20rpx;
                    }
                }
                
            }
        }
        .content_wrap{
            margin: 20rpx;
        }
        .content:last-child{
            border: none;
        }
        .content{
            // border-bottom: 1rpx solid #e2e2e2;
            border-radius: 20rpx;
            background: #fff;
            margin-bottom: 20rpx;
            h3{
                display: flex;
                justify-content: space-between;
                p:nth-child(1){
                    font-size: 28rpx;;
                    font-weight: bold;
                }
                p:nth-child(2){
                    font-size: 25rpx;
                    color: #a3a3a3;
                }
            }
            .row{
                display: flex;
                flex-wrap: wrap;
                .box{
                    width: 25%;
                    margin: 20rpx 0;
                    p:nth-child(1){
                        width: 116rpx;
                        height: 116rpx;
                        margin: 0 auto;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                    p:nth-child(1).active{
                        background: #eef0f2;
                        border-radius: 25rpx;
                    }
                    p:nth-child(2){
                        font-size: 24rpx;
                        color: #333333;
                        text-align: center;
                        margin-top: 20rpx;
                    }
                }
            }
        }
    }
</style>