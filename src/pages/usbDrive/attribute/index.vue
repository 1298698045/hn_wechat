<template>
    <div class="wrap">
        <div class="content">
            <div class="row">
                <p>链接分享</p>
                <p><van-switch :checked="checked" size="20px" @change="changeSwitch" /></p>
            </div>
            <div class="row" v-if="checked">
                <p>复制链接</p>
                <p><i-icon type="enter" size="20" color="#ababab" /></p>
            </div>
            <div class="row" v-if="checked">
                <p>分享链接</p>
                <p><i-icon type="enter" size="20" color="#ababab" /></p>
            </div>
        </div>
        <h3>接收者点击链接即可成为该共享文件夹的查看者，停止分享后原有链接将无法继续访问</h3>
         <div class="content">
            <div class="row" @click="getAdmin('0')">
                <p>谁可以管理</p>
                <p><span>{{oneTotal}}人</span><i-icon type="enter" size="20" color="#ababab" /></p>
            </div>
            <div class="row" @click="getAdmin('1')">
                <p>谁可以编辑/上传</p>
                <p><span>{{twoTotal}}人</span><i-icon type="enter" size="20" color="#ababab" /></p>
            </div>
            <div class="row" @click="getAdmin('2')">
                <p>谁可以查看</p>
                <p><span>{{threeTotal}}人</span><i-icon type="enter" size="20" color="#ababab" /></p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            checked:false,
            id:"",
            sessionkey:"",
            oneTotal:"",
            twoTotal:"",
            threeTotal:""
        }
    },
    onLoad(options){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.id = options.id;
        this.getQuery();
    },
    onShow(){
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.stat,
                    SessionKey:this.sessionkey,
                    id:this.id
                }
            }).then(res=>{
                console.log(res);
                this.list = res.data;
                this.oneTotal = this.getTotal(32);
                this.twoTotal = this.getTotal(4);
                this.threeTotal = this.getTotal(2);
            })
        },
        getTotal(Right){
            const v = this.list.find(item=>item.Right===Right);
            return v.Count;
        },
        getAdmin(index){
            let RightCode = index==0?32:index==1?4:2;
            const url = '/pages/usbDrive/admin/main?index='+index+'&id='+this.id+'&RightCode='+RightCode;
            wx.navigateTo({url:url});
        },
        changeSwitch(e){
            this.checked = e.mp.detail;
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .content{
            margin-top: 20px;
            background: #fff;
            .row{
                display: flex;
                justify-content: space-between;
                padding:25rpx 30rpx;
                align-items: center;
                border-bottom: 1rpx solid #eaebeb;
                p{
                    font-size: 28rpx;
                }
            }
            .row:last-child {
                border: none;
            }
        }
        h3{
            padding: 30rpx;
            font-size: 12px;
            color: #999999;
        }
    }
</style>