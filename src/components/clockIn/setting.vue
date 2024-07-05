<template>
    <div class="wrap">
        <h3 class="hs">全公司56人，参与考勤50人</h3>
        <div class="headRow" @click="getNewClockIn">
            <div class="lBox">
                <p>新增考勤组</p>
                <p>考勤规则相同的人设置到同一考勤组，方便统计</p>
            </div>
            <div class="rBox">
                <p><i-icon type="add" color="#349cfc" size="20" /></p>
            </div>
        </div>
        <div class="settWrap">
            <div class="setCenter" v-for="(item,index) in list" :key="index">
                <div class="title">
                    <p>{{item.name}}</p>
                    <p><i-icon type="trash" color="#646464" size="20" /></p>
                </div>
                <div class="cont">
                    <p>
                        <i-icon type="addressbook_fill" color="#999999" />
                        成员：16人，2个参与部门：儿科、妇产科
                    </p>
                    <p>
                        <i-icon type="addressbook_fill" color="#999999" />
                        负责人：张丽萍，崔曼
                    </p>
                    <p>
                        <i-icon type="addressbook_fill" color="#999999" />
                        固定班制：周一、二、三、四、五 默认班次 08:00-12:00...
                    </p>
                    <p>
                        <i-icon type="coordinates" color="#999999" />
                        绍兴第二医院
                    </p>
                </div>
                <div class="btn">
                    <p>
                        <span class="pai">排 班</span>
                        <span>修 改</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"setting",
    data(){
        return {
            list:[
                {
                    name:"临床科室"
                },
                {
                    name:"行政科室"
                },
                {
                    name:"医技科室"
                }
            ]
        }
    },
    methods:{
        getNewClockIn(){
            const url = '/pages/clockIn/newClockInGroup/main';
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        .hs{
            padding: 31rpx 33rpx;
            font-size: 26rpx;
            color: #999999;
        }
        .headRow{
            display: flex;
            background: #fff;
            padding: 33rpx;
            justify-content: space-between;
            align-items: center;
            .lBox{
                p:nth-child(1){
                    font-size: 32rpx;
                    color: #3399ff
                }
                p:nth-child(2){
                    font-size: 24rpx;
                    color: #999999;
                }
            }
            .rBox{
                width: 63rpx;
                height: 63rpx;
                line-height: 63rpx;
                border-radius:50%;
                border: 1rpx dashed #349cfc;
                text-align: center;
            }
        }
        .settWrap{
            padding-bottom: 80px;
            .setCenter{
                background: #fff;
                padding: 32rpx 33rpx;
                margin-top: 35rpx;
                .title{
                    display: flex;
                    justify-content: space-between;
                    p{
                        font-size: 32rpx;
                        color: #333333;
                        font-weight: bold;
                    }
                }
                .cont{
                    margin: 15rpx 0;
                    p{
                        color: #999999;
                        font-size: 24rpx;
                        padding-top: 10rpx ;
                    }
                }
                .btn{
                    p{
                        text-align: right;
                        span{
                            display: inline-block;
                            width: 121rpx;
                            height: 60rpx;
                            line-height: 60rpx;
                            text-align: center;
                            border:7rpx solid #3399ff;
                            font-size: 25rpx;
                            color: #3399ff;
                            border-radius: 9rpx;
                        }
                        .pai{
                            margin-right:21rpx;
                        }
                    }
                }
            }
        }
    }
</style>