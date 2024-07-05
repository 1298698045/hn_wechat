<template>
    <div class="wrap">
        <div class="cont">
            <div class="row">
                <p class="label">签到时间：</p>
                <p class="val">{{time}}</p>
            </div>
            <div class="row">
                <p class="label">签到地址：</p>
                <p class="val">{{Location}}</p>
            </div>
        </div>
        <div class="content">
            <textarea name="" :auto-height="true" id="" maxlength="-1"
            v-model="Descripiton"
            placeholder="请填写签到备注"
            placeholder-class="placeholder"
            :show-confirm-bar="false"
            ></textarea>
            <div class="boxImg">
                <van-uploader :file-list="fileList" @afterRead="afterRead" @delete="getDelete" />
            </div>
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box" @click="getSubmit">
                <p class="btn">
                    提交
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import {message} from '@/utils/message';
export default {
    data(){
        return {
            fileList:[],
            time:"",
            paramsTime:"",
            Descripiton:"",
            Location:"",
            BuildingName:""
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        }
    },
    onLoad(options){
        this.paramsTime = options.paramsTime;
        this.time = options.time;
        this.Location = options.address;
        this.BuildingName = options.BuildingName;
    },
    methods:{
        afterRead(e){
            let that = this;
            const { file } = e.mp.detail;
            this.fileList.push({
                url:file.path,
                name:Math.floor(Math.random() * (100-1)) +1
            })
        },
        getDelete(e){
            let idx = e.mp.detail.index;
            this.fileList.splice(idx,1);
        },
        getChoseImg(){
            wx.chooseImage({
                count: 9,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                }
            })
        },
        getSubmit(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    SessionKey:this.sessionkey,
                    method:this.$api.sign.checkin,
                    BuildingName:this.BuildingName,
                    Location:this.Location,
                    ContactId:'',
                    CotactName:'',
                    objectId:'',
                    objectTypeCode:'301',
                    CheckTime:this.time,
                    Descripiton:this.Descripiton,
                    Photo:''
                }
            }).then(res=>{
                if(res.status==1){
                    message.toast({
                        title:res.msg,
                        delta:1
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss">
.wrap{
    .cont{
        padding: 0 33rpx;
        background: #fff;
        .row{
            display: flex;
            padding: 25rpx 0;
            align-items: center;
            .label{
                font-size: 25rpx;
                color: #999999;
            }
            .val{
                width: 70%;
                font-size: 25rpx;
                color: #333333;
            }
        }
    }
    .content{
        margin-top: 25rpx;
        background: #fff;
        padding: 36rpx;
        textarea{
            min-height: 300rpx;
            width: 100%;
            font-size: 30rpx;
        }
        .placeholder{

        }
        .boxImg{
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            .img{
                width: 116rpx;
                height: 116rpx;
                border: 1rpx solid #e4e4e4;
            }
        }
        .boxImg::after{
            content: '';
            width: 116rpx;
        }
    }
    .footer{
        width: 100%;
        position: fixed;
        bottom: 0;
        background: #fff;
        z-index: 999;
        .box{
            padding: 25rpx 24rpx;
            .btn{
                width: 100%;
                height: 88rpx;
                line-height: 88rpx;
                text-align: center;
                background: #3399ff;
                border-radius: 7rpx;
                color: #fff;
            }
        }
    }
}
</style>