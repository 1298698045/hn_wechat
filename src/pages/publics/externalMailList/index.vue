<template>
    <div class="wrap">
        <div class="rowMail" v-for="(item,index) in list" :key="index" @click="getContacts(item)">
            <div class="flex">
                <div>
                    <p class="name">{{item.name}}</p>
                </div>
                <div class="text">
                    <p>{{item.fullname}}</p>
                    <p class="dept">{{item.businessunitidname}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            list:[
                {
                    name:"张三",
                    fullname:"张三",
                    businessunitidname:"总务部"
                }
            ]
        }
    },
    methods:{
        getContacts(item){
            
        }
    }
}
</script>
<style lang="scss">
    .rowMail{
        background: #fff;
        .flex{
            display: flex;
            justify-content: flex-start;
            padding: 20rpx 33rpx;
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
</style>