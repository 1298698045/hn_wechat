<template>
    <div class="wrap">
        <div class="row">
            <p class="label">
                是否允许使用相册图片
            </p>
            <i-switch :value="switch1" @change="onChange"></i-switch>
        </div>
        <div class="content">
            <div class="row border">
                <p class="label">
                    是否允许地点微调
                </p>
                <i-switch :value="switch2" @change="onChangeTwo"></i-switch>
            </div>
            <div class="row">
                <p class="label">
                    允许微调距离
                </p>
                <p class="text">
                    500米
                </p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            switch1:false,
            switch2:false
        }
    },
    methods:{
        onChange(e){
            this.switch1 = e.mp.detail.value;
        },
        onChangeTwo(e){
            this.switch2 = e.mp.detail.value;
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        .row{
            background: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 34rpx 33rpx;
            .label{
                font-size: 32rpx;
                color: #666666;
            }
        }
        .content{
            margin-top: 35rpx;
            .border{
                border-bottom: 1rpx solid #eaebeb;
            }
            .text{
                font-size: 31rpx;
                color: #333333;
            }
        }
    }
</style>