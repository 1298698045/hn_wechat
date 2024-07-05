<template>
    <div class="wrap">
        <div class="content">
            <div class="rowWrap"  @click="getUploadAvatar">
                <div class="name">
                    <p>头像</p>
                </div>
                <div class="right">
                    <p class="radius"  v-if="imgUrl==''" :class="imgUrl!=''?'active':''">
                        <span>
                            {{info.fullName}}
                        </span>
                    </p>
                    <p class="radius" style="background:#fff;" v-if="imgUrl!=''" @click.stop="getPreviewImg(imgUrl)">
                        <img v-if="imgUrl!=''" :src="imgUrl" alt="" @click="getAvatar">
                    </p>
                    <i-icon type="enter" color="#cccccc" size="20" />
                </div>
            </div>
            <div class="rowWrap" @click="getEditName">
                <div class="name">
                    <p>名字</p>
                </div>
                <div class="right">
                    <span class="text">{{info.fullName}}</span>
                    <i-icon type="enter" color="#cccccc" size="20" />
                </div>
            </div>
            <div class="rowWrap">
                <div class="name">
                    <p>账号</p>
                </div>
                <div class="right">
                    <span class="text">{{info.userName}}</span>
                    <i-icon type="enter" color="#fff" size="20" />
                </div>
            </div>
            <!-- <div class="rowWrap" @click="getQrcode">
                <div class="name">
                    <p>我的二维码</p>
                </div>
                <div class="right">
                    <i-icon type="picture" />
                    <i-icon type="enter" color="#cccccc" size="20" />
                </div>
            </div> -->
            <picker @change="bindPickerSix" :value="sixIndex" :range="sixList">
                <div class="rowWrap">
                    <div class="name">
                        <p>性别</p>
                    </div>
                    <div class="right">
                        <span class="text">{{sixList[sixIndex]}}</span>
                        <i-icon type="enter" color="#cccccc" size="20" />
                    </div>
                </div>
            </picker>
            <!-- <picker mode="region" @change="bindPickerRegion" :value="region">
                <div class="rowWrap">
                    <div class="name">
                        <p>地区</p>
                    </div>
                    <div class="right">
                        <span class="text">{{region[0]}}-{{region[1]}}</span>
                        <i-icon type="enter" color="#cccccc" size="20" />
                    </div>
                </div>
            </!-->
            <div class="rowWrap">
                <div class="name">
                    <p>单位名称</p>
                </div>
                <div class="right">
                    <span class="text">{{info.orgnizationIdName}}</span>
                    <i-icon type="enter" color="#fff" size="20" />
                </div>
            </div>
             <div class="rowWrap">
                <div class="name">
                    <p>部门</p>
                </div>
                <div class="right">
                    <span class="text">{{info.deptName}}</span>
                    <i-icon type="enter" color="#fff" size="20" />
                </div>
            </div>
            <div class="rowWrap">
                <div class="name">
                    <p>职务</p>
                </div>
                <div class="right">
                    <span class="text">{{info.jobTitle}}</span>
                    <i-icon type="enter" color="#fff" size="20" />
                </div>
            </div>
            <div class="rowWrap" @click="getBindingPhone">
                <div class="name">
                    <p>手机号</p>
                </div>
                <div class="right">
                    <span class="text">{{info.mobile}}</span>
                    <i-icon type="enter" color="#cccccc" size="20" />
                </div>
            </div>
            <!-- <div class="rowWrap" @click="getEmail">
                <div class="name">
                    <p>邮箱</p>
                </div>
                <div class="right">
                    <span class="text">{{info.emailAddress==''?'未设置':info.emailAddress}}</span>
                    <i-icon type="enter" color="#cccccc" size="20" />
                </div>
            </div> -->
        </div>
         <van-popup
        :show="showName"
        position="center"
        custom-style="width:80%;height: auto;border-radius:7rpx;"
        @close="onClosePopup"
        >
            <div class="popup">
                <h3>
                    修改名字
                </h3>
                <p>
                    <input type="text" v-model="editName" ref="inp" class="inp">
                </p>
                <div>
                    <span @click="onClosePopup">取消</span>
                    <span @click="getSubmitName">确定</span>
                </div>
            </div>
        </van-popup>
        <van-popup
        :show="showEmail"
        position="center"
        custom-style="width:80%;height: auto;border-radius:7rpx;"
        @close="onCloseEmail"
        >
            <div class="popup">
                <h3>
                    邮箱
                </h3>
                <p>
                    <input type="text" v-model="email" placeholder="请输入" class="inp">
                </p>
                <div>
                    <span @click="onCloseEmail">取消</span>
                    <span @click="getDetermineEmail">确定</span>
                </div>
            </div>
        </van-popup>
        <van-action-sheet
            :show="show"
            cancel-text="取消"
            @close="getClose"
            @cancel="getClose"
        >
            <div class="sheetWrap">
                <p @click="getEditAvatar">修改头像</p>
                <p @click="getDefaultAvatar">恢复默认头像</p>
            </div>
        </van-action-sheet>
    </div>
</template>
<script>
import { isEmail } from '@/utils/email';
export default {
    data(){
        return {
            name:"张丽萍",
            showName:false,
            sixList:['男','女'],
            sixIndex:0,
            region: ['浙江省', '绍兴市', '海珠区'],
            showEmail:false,
            editName:"",
            isTrue:true,
            imgUrl:"",
            sessionkey:"",
            info:{},
            email:"",
            show:false
        }
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getUserInfo();
    },
    methods:{
        getUserInfo(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"sys.userinfo.get",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.info = res.data[0];
                this.email = this.info.emailAddress;
                this.getAvatar();
                // let that = this;
                // this.imgUrl = this.info.avatar;
                // wx.downloadFile({
                //     url: that.info.avatar, //仅为示例，并非真实的资源
                //     success (res) {
                //         console.log(res);
                //         // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                //         if (res.statusCode === 200) {
                //             that.imgUrl = res.tempFilePath;
                //         }
                //     }
                // })
                
                
            })
        },
        getAvatar(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.my.isset,
                    SessionKey:this.sessionkey,
                    userId:this.info.id
                }
            }).then(res=>{
                console.log(res);
                if(res.status==0){
                    this.imgUrl = '';
                }else {
                    let that = this;
                    let url = `${that.$api.upload.url}?method=${that.$api.my.getAvatar}&SessionKey=${that.sessionkey}&UserId=${that.info.id}`;
                    wx.downloadFile({
                        url: url, //仅为示例，并非真实的资源
                        success (res) {
                            console.log(res);
                            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                            if (res.statusCode === 200) {
                                that.imgUrl = res.tempFilePath;
                            }
                        }
                    })
                }
            })
        },
        // 恢复默认头像
        getDefaultAvatar(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.my.default,
                    SessionKey:this.sessionkey,
                    userId:this.info.id
                }
            }).then(res=>{
                this.show = false;
                this.getAvatar();
            })
        },
        getSubmitName(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.public.edit,
                    SessionKey:this.sessionkey,
                    ObjTypeCode:8,
                    id:this.info.id,
                    FullName:this.editName
                }
            }).then(res=>{
                console.log(res);
                wx.showToast({
                    title:'设置成功',
                    icon:"success",
                    duration:2000,
                    success:res=>{
                        this.showName = false;
                    }
                })
            })
        },
        getDetermineEmail(){
            if(!isEmail(this.email)){
                wx.showToast({
                    title:'邮箱格式不正确',
                    icon:'none',
                    duration:2000
                })
                return false;
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.public.edit,
                    SessionKey:this.sessionkey,
                    ObjTypeCode:8,
                    id:this.info.id,
                    Internalemailaddress:this.email
                }
            }).then(res=>{
                console.log(res);
                wx.showToast({
                    title:'设置成功',
                    icon:"success",
                    duration:2000,
                    success:res=>{
                        this.showEmail = false;
                    }
                })
            })
        },
        getUploadAvatar(){
            if(this.imgUrl!=""){
                this.show = true;
            }else {
                this.uploadPhoto() 
            }
    
        },
        uploadPhoto(){
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    console.log(tempFilePaths);
                    that.imgUrl = tempFilePaths[0];
                    let url = `${that.$api.upload.url}?method=${that.$api.my.Avatar}&SessionKey=${that.sessionkey}&UserId=${that.info.id}`;
                    console.log(url);
                    wx.uploadFile({
                        url:url,
                        filePath: tempFilePaths[0],
                        name:"file",
                        formData: {
                            'user': 'test'
                        },
                        success:res=>{
                            console.log(res);
                        }
                    })
                }
            })
        },
        getEditAvatar(){
            this.uploadPhoto();
            this.show = false;
        },
        getClose(){
            this.show = false;
        },
        getPreviewImg(imgUrl){
            let that = this;
            wx.previewImage({
                current: imgUrl, // 当前显示图片的http链接
                urls: [imgUrl] // 需要预览的图片http链接列表
            })
        },
        getEditName(){
            // this.editName = this.info.fullName;
            // this.showName = true;
        },
        onClosePopup(){
            this.showName = false;
        },
        getQrcode(){
            const url = '/pages/myFile/qrCode/main';
            wx.navigateTo({url:url});
        },
        bindPickerSix(e){
            this.sixIndex = e.mp.detail.value;
        },
        bindPickerRegion(e){
            console.log(e);
            this.region = e.mp.detail.value;
        },
        onCloseEmail(){
            this.showEmail = false;
        },
        getEmail(){
            this.showEmail = true;
        },
        getBindingPhone(){
            const url = '/pages/myFile/bindingPhone/main?mobile='+this.info.mobile+'&nickName='+this.info.nickName;
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .content{
            width: 100%;
            background: #fff;
            margin-top: 35rpx;
            .rowWrap{
                display: flex;
                justify-content: space-between;
                padding: 10rpx 33rpx;
                border-bottom: 1rpx solid #eaebeb;
                .name{
                    color: #666666;
                    font-size: 32rpx;
                    line-height: 100rpx;
                }
                .right{
                    line-height: 100rpx;
                    .radius{
                        width: 100rpx;
                        height: 100rpx;
                        line-height: 100rpx;
                        display: inline-block;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                            border-radius: 50%;
                        }
                    }
                    .radius.active{
                        background: #fff;
                    }
                    .text{
                        color: #333333;
                        font-size: 33rpx;
                    }
                }
            }
        }
        .popup{
            padding: 20rpx 30rpx;
            h3{
                font-size: 23rpx;
                color: #999999;
            }
            p{
                font-size: 33rpx;
                color: #333333;
                padding: 30rpx 0;
                .inp{
                    border-bottom: 1rpx solid #3399ff;
                }
            }
            div{
                text-align: right;
                span{
                    font-size: 28rpx;
                    color: #3399ff;
                }
                span:nth-child(1){
                    margin-right: 60rpx;
                }
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