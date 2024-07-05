<template>
    <div class="panel_task">
        <div class="center">
            <div class="banner">
                <swiper class="swiper" @change="changeSwiper" :indicator-dots="true" :autoplay="false" :circular="false" :current="current" next-margin="20px">
                    <swiper-item class="swiper_item" v-for="(item,index) in listData" :key="index">
                        <div class="box_wrap">
                            <div class="head">
                                <p class="statusName">{{item.name}} {{item.cards.length || ''}}</p>
                                <p class="more" @click="handleMore(item)">
                                    <van-icon name="ellipsis" size="20px" />
                                </p>
                            </div>
                            <div class="box" v-for="(v,idx) in item.cards" :key="idx" @click="routeDetail(v)">
                                <div class="left">
                                    <img src="https://oawx.hnca.org.cn/static/img/images/icons/issuetypes/task.svg" alt="">
                                </div>
                                <div class="right">
                                    <p class="subject">{{v.summary || ''}}</p>
                                    <div class="desc">
                                        <p class="time">
                                            {{v.dueDate || ''}}
                                        </p>
                                        <p class="child">
                                            <i class="iconfont icon-zirenwu"></i>
                                            0/1
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="add_task" v-if="item.ListId&&item.ListId!=''" @click="handleAddTask(item)">
                                <van-icon name="plus" size="18" color="#999" />
                            </div>
                            <div class="createStatus" v-else>
                                <div class="add_project">
                                    <van-icon name="plus" size="18" color="#999" />
                                    添加任务列表...
                                </div>
                            </div> -->
                        </div>
                    </swiper-item>
                </swiper>
            </div>
        </div>
        <van-action-sheet
            @select="handleSelect"
            :show="isShow"
            :actions="actions"
            cancel-text="取消"
            close-on-click-action
            @close="onCancelSheet"
            @cancel="onCancelSheet"
        />
    </div>
</template>
<script>
export default {
    name: 'panelTask',
    data() {
        return {
            current: 0,
            listData: [],
            ListId: '',
            isShow: false,
            actions: [
                { name: '删除' }
            ],
            projectId: ''
        }
    },
    props:{
        id:{
            type: '',
            default: ''
        },
        sessionkey: {
            type: [String,Number],
            default: ''
        }
    },
    watch:{
        id:{
            immediate: true,
            handler(newVal, oldVal){
                console.log(newVal,'newVal')
                this.projectId = newVal;
                this.getQuery();
            }
        }
    },
    onLoad(){
        
    },
    methods:{
        getQuery(){
            const params = {
                actions: [
                    {
                        params: {
                            projectId: this.projectId,
                            OwningUser: '',
                            filterQuery: ''
                        }
                    }
                ]
            }
            this.$httpWX.get({
                url: this.$api.message.queryList,
                data:{
                    method: this.$api.task.panelList,
                    SessionKey: this.sessionkey,
                    message: JSON.stringify(params)
                }
            }).then(res=>{
                this.listData = res.data.boardScope.board.columns;
            })
        },
        handleMore(item){
            this.ListId = item.ListId;
            this.isShow = true;
        },
        handleSelect(e){
            let name = e.mp.detail.name;
            if(name=='删除'){
                this.delete();
            }
        },
        onCancelSheet(){
            this.isShow = false;
        },
        changeSwiper(e){
            console.log(e);
        },
        handleAddTask(item){
            wx.navigateTo({
                url: '/pages/task/create_task/main?projectId='+ this.projectId + '&ListId=' + item.ListId
            })
        },
        routeDetail(item){
            wx.navigateTo({
                url: '/pages/task/detail_task/main?id='+item.id + '&projectId=' + this.projectId
            })
        },
        delete(){
            this.$httpWX.get({
                url: this.$api.message.queryList,
                data:{
                    method: this.$api.task.delete,
                    SessionKey: this.sessionkey,
                    objTypeCode: 20315,
                    id: this.ListId
                }
            }).then(res=>{
                message.toast({
                    title: '删除成功',
                    delta: 0,
                    success:res=>{
                        setTimeout(()=>{
                            this.getQuery();
                        },500)
                    }
                })
            })
        }
    }
}
</script>
<style lang="scss">
    .center{
        .banner{
            margin: 0 20rpx;
            .swiper{
                height: calc(100vh - 60px);
                .swiper_item{
                    padding: 0 20rpx;
                    box-sizing: border-box;
                    .box_wrap{
                        width: 100%;
                        height: 100%;
                        overflow: auto;
                        .head{
                            padding: 25rpx 0;
                            font-size: 28rpx;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            .statusName{
                                font-weight: bold;
                            }
                        }
                        .box{
                            padding: 20rpx 25rpx;
                            border-radius: 15rpx;
                            background: #fff;
                            box-shadow: 0 2rpx 10rpx 0 rgba(0,0,0,.1);
                            box-sizing: border-box;
                            display: flex;
                            margin-bottom: 20rpx;
                            .left{
                                // width: 40rpx;
                                // height: 40rpx;
                                // background: #999;
                                // border-radius: 5rpx;
                                img{
                                    width: 40rpx;
                                    height: 40rpx;
                                }
                            }
                            .right{
                                margin-left: 20rpx;
                                .subject{
                                    font-size: 28rpx;
                                    color: #333;
                                }
                                .desc{
                                    padding: 15rpx 0;
                                    font-size: 24rpx;
                                    color: #999;
                                    display: flex;
                                    .time{
                                        display: inline-block;
                                        padding: 5rpx 15rpx;
                                        border-radius: 5rpx;
                                        background: red;
                                        color: #fff;
                                    }
                                    .child{
                                        margin-left: 20rpx;
                                        color: #999;
                                        font-size: 24rpx;
                                        display: flex;
                                        align-items: center;
                                        i{
                                            padding-right: 20rpx;
                                        }
                                    }
                                }
                            }
                        }
                        .add_task{
                            padding: 20rpx 25rpx;
                            border-radius: 15rpx;
                            background: #fff;
                            box-shadow: 0 2rpx 10rpx 0 rgba(0,0,0,.1);
                            box-sizing: border-box;
                            text-align: center;
                        }
                        .add_project{
                            padding: 20rpx 25rpx;
                            border-radius: 10rpx;
                            border: 2rpx dashed #999;
                            box-sizing: border-box;
                            text-align: center;
                            display: flex;
                            align-items: center;
                            color: #666;
                        }
                    }
                }
            }
        }
    }
</style>