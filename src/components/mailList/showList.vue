<template>
    <div class="wrap">
        <div class="showCont">
            <div class="rowWrap" v-for="(item,index) in selectListName" :key="index">
                <div class="l">
                    <p>{{item.FullName}}</p>
                </div>
                <div class="c">
                    <p>{{item.FullName}}</p>
                    <p>{{item.DeptName}}</p>
                </div>
                <div class="r" @click="getDelete(item)">
                    <i-icon type="delete" size="20" color="#999999" />
                </div>
            </div>
        </div>
        <div class="bottom">
            <div class="boxs">
                <van-button type="primary" color="#3399ff" @click="getSubmit" block>确定</van-button>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState,mapMutations,mapGetters} from 'vuex';
import Bus from '../../utils/bus';
export default {
    name:'ShowList',
    data(){
        return {

        }
    },
    computed:{
        ...mapState({
            selectId:state=>{
                return state.mailList.selectId
            },
            selectListName:state=>{
                return state.mailList.selectListName
            }
        })
    },
    methods:{
        ...mapMutations([
            'getSingleDelete'
        ]),
        getDelete(item){
            this.getSingleDelete(item.id);
        },
        getSubmit(){
            this.$parent.maxShow = false;
            Bus.$emit('val', true);
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .showCont{
            background: #fff;
            .rowWrap{
                display: flex;
                align-items: center;
                padding: 13rpx 32rpx;
                border-bottom: 1rpx solid #e2e3e5;
                .l{
                    p{
                        width: 66rpx;
                        height: 66rpx;
                        line-height: 66rpx;
                        text-align: center;
                        background: #3399ff;
                        color: #fff;
                        font-size: 24rpx;
                        border-radius: 50%;
                    }
                }
                .c{
                    flex: 1;
                    margin-left: 25rpx;
                    p:nth-child(1){
                        font-size: 32rpx;
                        color: #333333;
                    }
                    p:nth-child(2){
                        font-size: 26rpx;
                        color: #999999;
                    }
                }
            }
        }
        .bottom{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            .boxs{
                padding: 10rpx 33rpx;
            }
        }
    }
</style>