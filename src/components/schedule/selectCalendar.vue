<template>
    <div class="wrap">
        <div class="rowChild">
            <div class="row" v-for="(item,index) in label" :key="index" @click="getSelect(index)">
                <p class="label" :class="{'active':num==index}">{{item}}</p>
                <p v-if="num==index">
                    <i class="iconfont icon-dui"></i>
                </p>
            </div>
        </div>
        <div class="calendar">
            <Calendar
                :value="date"
                lunar
                clean
                @select="select"
                ref="calendar"
            />
        </div>
        <div class="footer">
            <div class="boxChild">
                <van-button type="primary" color="#3399ff" @click="getSubmit" block>完成</van-button>
            </div>
        </div>
    </div>
</template>
<script>
import Calendar from 'mpvue-calendar';
import 'mpvue-calendar/src/style.css';
export default {
    name:"selectCalendar",
    components:{
        Calendar
    },
    data(){
        return {
            label:['永远','特定日期'],
            num:0,
            date:""
        }
    },
    onLoad(){
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth()+1;
        let d = date.getDate();
        this.date = `${y}-${m}-${d}`;
    },
    methods:{
        getSelect(index){
            this.num = index;
        },
        getSubmit(){
            var name = '';
            if(this.num==0){
                name = '永远'
            }
            this.$emit('paramsChild',name);
            this.$parent.isShow = false;
        }

    }
}
</script>
<style lang="scss" scoped>
@import '../../../static/css/schedule.css';
    .wrap{
        .rowChild{
            padding:0 33rpx;
            background: #fff;
            margin-top: 35rpx;
            .row{
                display: flex;
                justify-content: space-between;
                font-size: 33rpx;
                border-bottom: 2rpx solid #ebedec;
                padding: 33rpx 0;
                .lable.active{
                    color: #3399ff;
                }
                i{
                    color: #3399ff;
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            .boxChild{
                padding: 26rpx 24rpx;
            }
        }
    }
</style>