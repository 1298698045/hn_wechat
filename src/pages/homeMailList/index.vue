<template>
    <div class="wrap">
        <div v-if="!isShow">
            <!-- <van-nav-bar title="通讯录">
                <img src="https://oawx.hnca.org.cn/img/wechat/Add.png" style="width:30rpx;height:30rpx;" alt="" slot="left" @click="getAddMail">
            </van-nav-bar> -->
            <div class="search">
                <van-search :value="value" placeholder="搜索" @click="getSearch" />
            </div>
            <div class="container">
                <!-- <div class="header">
                    <div class="box" @click="getRouter">
                        <p class="imgWrap">
                            <img src="https://oawx.hnca.org.cn/img/wechat/Phone.png" alt="">
                        </p>
                        <p>手机联系人</p>
                    </div>
                    <div class="box">
                        <p class="imgWrap">
                            <img src="https://oawx.hnca.org.cn/img/wechat/Myfriend.png" alt="">
                        </p>
                        <p>凤凰好友</p>
                    </div>
                    <div class="box">
                        <p class="imgWrap">
                            <img src="https://oawx.hnca.org.cn/img/wechat/MyGroup.png" alt="">
                        </p>
                        <p>我的群组</p>
                    </div>
                    <div class="box">
                        <p class="imgWrap">
                            <img src="https://oawx.hnca.org.cn/img/wechat/Corporate.png" alt="">
                        </p>
                        <p>企业广场</p>
                    </div>
                </div> -->
                <div class="center">
                    <div class="row">
                        <p><img src="https://oawx.hnca.org.cn/img/wechat/Organization.png" alt=""></p>
                        <p>{{organizationName}}</p>
                        <!-- <p><i-icon type="setup" size="20" />管理</p> -->
                    </div>
                    <div class="rowWrap">
                        <div class="box">
                            <div class="icon">
                                <img src="https://oawx.hnca.org.cn/img/wechat/Organization_system.png" alt="">
                            </div>
                            <div class="name" @click="getGroup">
                                <p>组织架构</p>
                                <!-- <p><i-icon type="message" size="20" color="#229bfa" />全员群</p> -->
                            </div>
                        </div>
                        <!-- <div class="box">
                            <div class="icon">
                                <img src="https://oawx.hnca.org.cn/img/wechat/External_Contacts.png" alt="">
                            </div>
                            <div class="name">
                                <p>外部联系人</p>
                            </div>
                        </div> -->
                    </div>
                </div>
                <!-- <div class="establish">
                    <div class="wimg">
                        <img src="https://oawx.hnca.org.cn/img/wechat/Create_team.png" alt="">
                    </div>
                    <div>
                        <p>创建单位/组织/团队</p>
                    </div>
                    <div>
                        <p><i-icon type="enter" size="18" /></p>
                    </div>
                </div> -->
                <div class="contWrap">
                    <!-- <div class="box">
                        <div class="imgs">
                            <img src="https://oawx.hnca.org.cn/img/wechat/05.Phone.png" alt="">
                        </div>
                        <div class="text">
                            <p>手机联系人</p>
                        </div>
                        <div>
                            <p><i-icon type="enter" size="18" color="#999999" /></p>
                        </div>
                    </div> -->
                    <!-- <div class="box">
                        <div class="imgs">
                            <img src="https://oawx.hnca.org.cn/img/wechat/05.Myfriend.png" alt="">
                        </div>
                        <div class="text">
                            <p>我的好友</p>
                        </div>
                        <div>
                            <p><i-icon type="enter" size="18" color="#999999" /></p>
                        </div>
                    </div> -->
                    <div class="box">
                        <div class="imgs">
                            <img src="https://oawx.hnca.org.cn/img/wechat/05.MyGroup.png" alt="">
                        </div>
                        <div class="text" @click="getMyGroup">
                            <p>我的群组</p>
                        </div>
                        <div class="icon">
                            <p><i-icon type="enter" size="18" color="#999999" /></p>
                        </div>
                    </div>
                </div>
                <div class="mail">
                    <h3>常用联系人</h3>
                    <div class="rowMail" v-for="(item,index) in list" :key="index" @click="getContacts(item)">
                        <div class="flex">
                            <div>
                                <p class="name">{{item.name}}</p>
                            </div>
                            <div class="text">
                                <p>{{item.fullname || item.FullName}}</p>
                                <p class="dept">{{item.businessunitidname}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <SearchCom v-if="isShow" />
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
import SearchCom from '@/components/mailList/searchCom';
import vueTabBar from '../../components/vueTabBar';

export default {
    components:{
        SearchCom,
        vueTabBar
    },
    data(){
        return {
            list:[],
            sessionkey:"",
            isShow:false,
            selectNavIndex:3,
            needButton:false,
            handButton:'',
            btnText:''
        }
    },
    computed:{
        organizationName(){
            return wx.getStorageSync('organizationName');
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.queryList();
    },
    onShow(){
        wx.hideTabBar();
    },
    methods:{
        getSearch(){
            this.isShow = true;
        },
        // 常用联系人
        queryList(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"oa.addresslist.latest.getlist",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                this.list = res;
                this.list.map(item=>{
                    if(item.FullName.length>2){

                        const name = item.FullName.substr(1);
                        item.name = name;
                    }else {
                        item.name = item.FullName;
                    }
                    return item;
                })
            })
        },
        getAddMail(){
            const url = '/pages/mailList/add/main';
            wx.navigateTo({url:url});
        },
        getRouter(){
            const url = '/pages/mailList/organization/main';
            wx.navigateTo({url:url});
        },
        getGroup(){
            const url = '/pages/mailList/organization/main';
            wx.navigateTo({url:url});
        },
        //  我的群组
        getMyGroup(){
            const url = '/pages/mailList/myGroup/main';
            wx.navigateTo({url:url});
        },
        getContacts(item){
            const url = '/pages/mailList/cardInfo/main?id='+item.UserId+'&hiddenphone='+item.HiddenPhone;
            wx.navigateTo({
                url:url
            })
        }
    }
}
</script>
<style lang="scss">
    @import '../../../static/css/public.scss';
    .container{
        padding-bottom: 80px;
        .search{
            background: #fff;
            padding: 30rpx;
        }
        .header{
            padding: 0 30rpx 30rpx 30rpx;
            background: #fff;
            display: flex;
            justify-content: space-around;
            .box{
                font-size: 12px;
                color: #999999;
                .imgWrap{
                    width: 100rpx;
                    height: 100rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img{
                        width: 50rpx;
                        height: 50rpx;
                    }
                }
            }
        }
        .center{
            background: #fff;
            padding: 30rpx 30rpx 0 30rpx;
            margin-bottom: 30rpx;
            .row{
                display: flex;
                padding-bottom: 10rpx;
                border-bottom: 1rpx solid #e2e4e3;
                p:nth-child(1){
                    width: 80rpx;
                    height: 80rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                p:nth-child(2){
                    flex: 1;
                    line-height: 80rpx;
                    margin-left: 24rpx;
                    font-size: 35rpx;
                    font-weight: bold;
                }
                p:nth-child(3){
                    line-height: 80rpx;
                    font-size: 12px;
                    color: #229bfa;
                }
            }
            .rowWrap{
                .box{
                    display: flex;
                    align-items: center;
                    .icon{
                        width: 80rpx;
                        height: 80rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 10rpx 0;
                        img{
                            width: 40rpx;
                            height: 40rpx;
                        }
                    }
                    .name{
                        width: 100%;
                        font-size: 35rpx;
                        display: flex;
                        justify-content: space-between;
                        border-bottom: 1rpx solid #e2e4e3;
                        padding: 10rpx 0;
                        margin-left: 24rpx;
                        p{
                            line-height: 80rpx;
                        }
                        p:nth-child(2){
                            color: #229bfa;
                        }
                    }
                }
                .box:last-child .name{
                    border: none;
                }
            }
        }
        .establish{
            background: #fff;
            padding: 30rpx ;
            display: flex;
            align-items: center;
            .wimg{
                width: 49rpx;
                height: 49rpx;
                display: flex;
                justify-content: center;
                align-items:center;
                img{
                    width:100%;
                    height:100%;
                }
            }
            div:nth-child(2){
                flex: 1;
                font-size: 30rpx;
                margin-left: 20px;
            }
            div:nth-child(3){
                font-size: 12px;
                color: #999999;
            }
        }
        .contWrap{
            padding: 0 30rpx;
            background: #fff;
            margin-top: 35rpx;
            .box{
                display: flex;
                align-items: center;
                padding: 20rpx 0;
                .imgs{
                    width: 49rpx;
                    height: 49rpx;
                    display: flex;
                    justify-content: center;
                    align-items:center;
                    img{
                        width: 100%;
                        height: 100%;
                        vertical-align: middle;
                    }
                }
                .text{
                    flex: 1;
                    font-size: 35rpx;
                    color: #333333;
                    margin-left: 24rpx ;
                }
            }
        }
        .mail{
            background: #fff;
            padding: 30rpx 30rpx 0 30rpx;
            margin: 20px 0;
            h3{
                font-size: 35rpx;
                font-weight: bold;
                padding-bottom: 30rpx;
            }
            .rowMail{
                .flex{
                    display: flex;
                    justify-content: flex-start;
                    padding: 20rpx 0;
                    .name{
                        width: 80rpx;
                        height: 80rpx;
                        line-height: 80rpx;
                        border-radius: 50%;
                        text-align: center;
                        font-size: 26rpx;
                        color: #fff;
                        background: #229bfa;
                    }
                    .text{
                        width: 100%;
                        font-size: 34rpx;
                        margin-left: 10px;
                        // border-bottom: 1rpx solid #e2e4e3;
                        .dept{
                            font-size: 26rpx;
                            color: #999999;
                        }
                    }
                }
            }
            .rowMail:last-child .flex .text{
                border: none;
            }
        }
    }
</style>