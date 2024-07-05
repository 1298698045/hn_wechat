<template>
    <div class="wrap">
        <div class="center">
            <div class="rowWrap" v-for="(item,index) in list" :key="index" @click="getSel(item,index)">
                <div class="colLeft">
                    <p>
                        <img :src="item.imgUrl" alt="">
                    </p>
                </div>
                <div class="colRight">
                    <p>{{item.Name}}</p>
                    <p v-if="num==index">
                        <i-icon type="right" color="#3399ff" size="20" />
                    </p>
                </div>
            </div>
            <!-- <div class="rowWrap">
                <div class="colLeft">
                    <p>
                        <img src="https://oawx.hnca.org.cn/img/wechat/Shared_files.png" alt="">
                    </p>
                </div>
                <div class="colRight">
                    <p>已发送</p>
                </div>
            </div>
            <div class="rowWrap">
                <div class="colLeft">
                    <p>
                        <img src="https://oawx.hnca.org.cn/img/wechat/Shared_files.png" alt="">
                    </p>
                </div>
                <div class="colRight">
                    <p>院办</p>
                </div>
            </div>
            <div class="rowWrap">
                <div class="colLeft">
                    <p>
                        <img src="https://oawx.hnca.org.cn/img/wechat/Shared_files.png" alt="">
                    </p>
                </div>
                <div class="colRight">
                    <p>临床科室</p>
                </div>
            </div> -->
        </div>
        <div class="footer">
            <div class="box">
                <p @click="getNewFile">新建文件夹</p>
                <p @click="getSend">发送</p>
            </div>
        </div>
        <van-popup
            :show="newFolderShow"
            position="center"
            custom-style="width:80%;height:auto;border-radius:7rpx;"
            @close="getOnClose"
        >
            <div class="popupContent">
                <h3 class="overflow">{{sign==1?fileName:'新建文件夹'}}</h3>
                <p class="tips">{{sign==1?'请输入新命名':'请输入文件夹名称'}}</p>
                <div class="inpWrap">
                    <input class="inp" v-model="name" type="text" selection-start="10">
                </div>
                <div class="footers">
                    <p @click="getOnClose">取消</p>
                    <p @click="getConfirm">确定</p>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
export default {
    data(){
        return {
            sessionkey:"",
            newFolderShow:false,
            name:"",
            list:[
                {
                    Name:"收件箱",
                    num:"",
                    imgUrl:"https://oawx.hnca.org.cn/img/wechat/02.4.Inbox.png"
                },
                {
                    Name:"已发送",
                    num:"",
                    imgUrl:"https://oawx.hnca.org.cn/img/wechat/02.4.Sendout.png"
                },
                {
                    Name:"已删除",
                    num:"",
                    imgUrl:"https://oawx.hnca.org.cn/img/wechat/02.4.Delete.png"
                }
            ],
            num:-1,
            folderId:"",
            id:""
        }
    },
    computed:{
        pathUrl(){
            return this.$api.pathUrl;
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.id = options.id;
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.folderQuery,
                    SessionKey:this.sessionkey                    
                }
            }).then(res=>{
                console.log(res);
                let data = res.data.map(item=>({
                    Name:item.Name,
                    Id:item.Id,
                    imgUrl:this.pathUrl+"/img/wechat/02.4.GroupMail.png"
                }))
                this.list = this.list.concat(data);
            })
        },
        getSel(item,index){
            this.num = index;
            this.folderId = item.Id;
        },  
        getNewFile(){
            this.newFolderShow = true;
            // const url = '/pages/email/newFile/main';
            // wx.navigateTo({url:url});
        },
        getOnClose(){
            this.name = '';
            this.newFolderShow = true;
        },
        getConfirm(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.addFolder,
                    SessionKey:this.sessionkey,
                    name:this.name
                }
            }).then(res=>{
                this.name = '';
                this.newFolderShow = false;
                if(res.status*1===1){
                    this.getQuery();
                }
            })
        },
        getSend(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.emailMove,
                    SessionKey:this.sessionkey,
                    ids:this.id,
                    folderId:this.folderId
                }
            }).then(res=>{
                console.log(res);
                wx.showToast({
                    title:res.msg,
                    icon:"none",
                    duration:2000,
                    success:res=>{
                        setTimeout(()=>{
                            wx.navigateBack({
                                delta: 2
                            })
                        },1000)
                    }
                })
            })
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .center{
            background: #fff;
            .rowWrap:last-child .colRight{
                border:none;
            }
            .rowWrap{
                display: flex;
                padding: 0 30rpx;
                .colLeft{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    p{
                        width: 80rpx;
                        height: 80rpx;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                }
                .colRight{
                    width: 100%;
                    flex: 1;
                    font-size: 28rpx;
                    margin-left: 20rpx;
                    border-bottom: 1rpx solid #f6f6f6;
                    padding: 30rpx 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            .box{
                display: flex;
                justify-content: space-between;
                font-size: 28rpx;
                align-items: center;
                padding: 30rpx;
                color: #3399ff;
                p:nth-child(2){
                    width: 120rpx;
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    color: #fff;
                    background: #3399ff;
                    border-radius: 10rpx;
                }
            }
        }
        .popupContent{
            .overflow{
                width: 100%;
            }
            h3{
                color: #333333;
                font-size: 33rpx;
                text-align: center;
                padding-top: 42rpx;
            }
            .tips{
                color: #999999;
                font-size: 25rpx;
                text-align: center;
                padding: 15rpx 0;
            }
            .inpWrap{
                padding: 0 37rpx 20rpx 37rpx; 
                .inp{
                    height: 69rpx;
                    line-height: 69rpx;
                    border: 1rpx solid #aaaaaa;
                    border-radius: 12rpx;
                }
            }
            .footers{
                background: #fff;
                border-top: 1rpx solid #aaaaaa;
                display: flex;
                color: #3399ff;
                font-size: 31rpx;
                p{
                    flex: 1;
                    text-align: center;
                    height: 100rpx;
                    line-height: 100rpx;
                }
                p:nth-child(1){
                    border-right: 1rpx solid #aaaaaa;
                }
            }
        }
    }
</style>