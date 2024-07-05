<template>
    <div class="wrap">
         <div class="header">
             <p @click="getReduceYear"><i-icon type="return" size="20" color="#666666" /></p>
            <picker mode="date" fields="year" @change="bindDateChange">
                <p class="time">{{year}}年</p>
            </picker>
             <p @click="getAddYear"><i-icon type="enter" size="20" color="#666666" /></p>
         </div>
         <div class="center">
             <div class="content">
                 <div class="row" @click="getDetail">
                     <P>08月-工资条</P>
                     <P>
                         明细
                         <i-icon type="enter" size="15" color="#3399ff" />
                     </P>
                 </div>
             </div>
         </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            year:""
        }
    },
    computed:{
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        }
    },
    onLoad(){
        const myDate = new Date();
        this.year = myDate.getFullYear();
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.hr.payList,
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
            })
        },
        bindDateChange(e){
            this.year = e.mp.detail.value;
        },
        getReduceYear(){
            if(this.year==1999){
                wx.showToast({
                    title:"超出选择范围！",
                    icon:'none',
                    duration:2000
                })
                return false;
            }
            this.year--;
        },
        getAddYear(){
            this.year++;
        },
        // 查看明细
        getDetail(){
            const url = '/pages/wagesQuery/detail/main';
            wx.navigateTo({url:url})
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .header{
            display: flex;
            justify-content: center;
            align-content: center;
            margin: 39rpx 0;
            .time{
                padding: 0 33rpx;
            }
        }
        .center{
            padding: 0 33rpx;
            .content{
                width: 100%;
                height: auto;
                background: #fff;
                border-radius: 6rpx;
                .row{
                    height: 97rpx;
                    line-height: 97rpx;
                    padding: 0 29rpx;
                    font-size: 24rpx;
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 1rpx solid #e2e3e5;
                    p:nth-child(1){
                        font-size: 24rpx;
                        color: #333333;
                    }
                    p:nth-child(2){
                        font-size: 22rpx;
                        color: #3399ff;
                    }
                }
            }
        }
    }
</style>