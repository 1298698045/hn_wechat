<template>
    <div class="wrapper">
        <todoList ref="todoList" v-if="current=='tab1'" :isModelmes="isModelmes" />
        <calendarTask v-if="current=='tab2'" />
        <div class="project" v-if="current=='tab3'">
            <div class="box" v-for="(item,index) in projectList" :key="index" @click="handleDetail(item)">
                <div class="cell">
                    <div class="l_img">
                        <img :src="pathUrl+item.AvatarUrl" alt="">
                    </div>
                    <div class="name">
                        {{item.Name}}
                    </div>
                    <div class="more" @click.stop="handleProjectMore(item)">
                        <van-icon name="ellipsis" />
                    </div>
                </div>
                <div class="cell createBy">
                    <i class="iconfont icon-canyuren"></i>
                    <span>
                        项目负责人：{{item.LeaderIdName || ''}}
                    </span>
                </div>
            </div>
            <van-action-sheet
                @select="handleSelect"
                :show="isProject"
                :actions="actions"
                cancel-text="取消"
                close-on-click-action
                @close="onCancelSheet"
                @cancel="onCancelSheet"
            />
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div>
                <i-tab-bar :current="current" color="#049bfb" @change="handleChangeBar">
                    <i-tab-bar-item key="tab1" :img="imgUrl+'schedule.png'" :current-img="imgUrl+'schedule_active.png'" title="待办"></i-tab-bar-item>
                    <i-tab-bar-item key="tab2" :img="imgUrl+'calendar.png'" :current-img="imgUrl+'calendar_active.png'" title="日历"></i-tab-bar-item>
                    <i-tab-bar-item key="tab3" :img="imgUrl+'project.png'" :current-img="imgUrl+'project_active.png'" title="项目"></i-tab-bar-item>
                </i-tab-bar>
            </div>
        </div>
    </div>
</template>
<script>
import todoList from '@/components/task/todo_list.vue';
import calendarTask from '@/components/task/calendar_task.vue';
export default {
    components:{
        todoList,
        calendarTask
    },
    data() {
        return {
            current:"tab1",
            projectList: [],
            projectId: '',
            isProject: false,
            actions: [
                { name: '删除' }
            ]
        }
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
    },
    onShow(){
        if(this.$refs.todoList){
            this.$refs.todoList.pageNumber = 1;
            this.$refs.todoList.current = 'tab1';
            this.$refs.todoList.tag = 'neq'
            this.$refs.todoList.getQuery('neq');
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        },
        imgUrl(){
            return this.$api.photo.url;
        },
        pathUrl(){
            return "https://oawx.hnca.org.cn";
        },
    },
    methods: {
        handleChangeBar(e){
            this.current = e.mp.detail.key;
            if(this.current=='tab3'){
                this.getProject();
            }
        },
        getProject(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.task.projectAll,
                    SessionKey: this.sessionkey
                }
            }).then(res=>{
                this.projectList = res.rows;
            })
        },
        handleProjectMore(item){
            this.projectId = item.ProjectId;
            this.isProject = true;
        },
        onCancelSheet(){
            this.isProject = false;
        },
        handleSelect(e){
            const name = e.mp.detail.name;
            if(name=='删除'){
                this.deleteProject();
            }
        },
        deleteProject(){
            this.$httpWX.get({
                url: this.$api.message.queryList,
                data:{
                    method: this.$api.task.delete,
                    SessionKey: this.sessionkey,
                    objTypeCode: 20290,
                    id: this.projectId
                }
            }).then(res=>{
                console.log(res);
                this.getProject();
            })
        },
        handleDetail(item){
            wx.navigateTo({
                url:'/pages/task/panel_task/main?projectId='+item.ProjectId
            })
        }
    }
}
</script>
<style lang="scss">
@import url('../../../static/css/task.css');
    .wrapper{
        padding-bottom: 160rpx;
        .project{
            margin: 30rpx 0;
            padding-left: 20rpx;
            padding: 0 20rpx;
            .box{
                margin-bottom: 20rpx;
                border-radius: 15rpx;
                background: #fff;
                border-bottom: 1rpx solid #e2e3e5;
                // box-shadow: 0 2rpx 10rpx 0 rgba(0,0,0,.3);
                .cell{
                    display: flex;
                    align-items: center;
                    padding: 20rpx 20rpx 20rpx;
                    .l_img{
                        width: 40rpx;
                        height: 40rpx;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .name{
                        flex: 1;
                        margin-left: 20rpx;
                        font-size: 32rpx;
                        color: #333;
                    }
                }
                .cell.createBy{
                    padding: 0 20rpx 20rpx 20rpx;
                    span{
                        padding-left: 20rpx;
                        font-size: 28rpx;
                    }
                }
            }
        }
    }
    .footer{
        width: 100%;
        position: fixed;
        bottom: 0;
        background: #fff;
        z-index: 10;
    }
</style>