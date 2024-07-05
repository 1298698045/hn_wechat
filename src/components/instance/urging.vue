<template>
    <div class="wrap">
        <van-dialog
            use-slot
            title="催办"
            :show="urgingShow"
            show-cancel-button
            @close="onClose"
            @confirm="getUrgeSubmit"
            >
             <div class="dialog">
                <p>
                    <textarea class="textarea" v-model="message" placeholder="请输入留言" name="" id="" cols="30" rows="10"></textarea>
                </p>
                <div class="rowCheck">
                    <div class="notice">通知方式：</div>
                    <van-checkbox-group :value="resultTag" @change="changeTag">
                        <div class="checkboxGroup">
                            <van-checkbox :name="item" v-for="(item,index) in tagList" :key="index" custom-class="check" label-class="labels"  shape="square">
                                {{item}}
                            </van-checkbox>
                        </div>
                    </van-checkbox-group>
                </div>
            </div>
        </van-dialog>
    </div>
</template>
<script>
export default {
    name:"Urging",
    props:['urgingShow','processInstanceId'],
    data(){
        return {
            message:"",
            tagList:['短信','应用内'],
            resultTag:[]
        }
    },
    onLoad(){

    },
    computed:{
        notifySms(){
           let isBol = this.resultTag.indexOf('短信')!==-1?true:false;
           return isBol;
        },
        notifyMessager(){
            let isBol = this.resultTag.indexOf('应用内')!==-1?true:false;
            return isBol;
        },
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        }
    },
    methods:{
        changeTag(e){
            this.resultTag = e.mp.detail;
        },
        onClose(){
            this.$parent.urgingShow = false;
        },
        getUrgeSubmit(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.instance.urging,
                    SessionKey:this.sessionkey,
                    processInstanceId:this.processInstanceId,
                    Message:this.message,
                    notifySms:this.notifySms,
                    notifyMessager:this.notifyMessager
                }
            }).then(res=>{
                wx.showToast({
                    title:res.msg,
                    icon:"none",
                    duration:2000,
                    success:res=>{
                        this.$parent.urgingShow = false;
                    }
                })
            })
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        .dialog{
            p{
                padding:  30rpx;
                .textarea{
                    width: 100%;
                    height: 100px;
                    background: #fff;
                    border-radius: 10rpx;
                    color: #333333;
                    border: 1rpx solid #a6a6a6;
                    border-radius: 2rpx;
                    padding: 10rpx;
                }
            }
            .rowCheck{
                display: flex;
                align-items: center;
                padding: 0 30rpx 30rpx 30rpx;
                .notice{
                    color: #999999;
                    font-size: 25rpx;
                }
                .checkboxGroup{
                    display: flex;
                    .check{
                        margin-right: 20rpx;
                        font-size: 28rpx;
                    }
                }
            }
        }
    }
</style>