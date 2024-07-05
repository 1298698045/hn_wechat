<template>
    <div class="wrap">
        <div class="contentWrap">
            <div class="rowContent" v-for="(item,index) in list" :key="index">
                <div class="rowT">
                    <div class="l">
                        <p>{{item.OwningUserName}}</p>
                    </div>
                    <div class="r">
                        <p>{{item.OwningUserName}}</p>
                        <p>{{item.BusinessUnitIdName || ''}}</p>
                    </div>
                </div>
                <p class="title">
                    {{item.Subject}}
                </p>
                <div class="cont">
                    {{item.Description}}
                </div>
                <div class="more">
                    <p>
                        {{item.CreatedOn}}
                    </p>
                    <p @click="getMore(item)" v-if="isEdit">
                        <i-icon type="more" color="#666666" size="20" />
                    </p>
                </div>
            </div>
        </div>
        <van-action-sheet
            :show="isShow"
            :round="false"
            :actions="actions"
            cancel-text="取消"
            @cancel="onClose"
            @close="onClose"
            @select="onSelect"
            z-index="99999"
        />
        <van-action-sheet
            :show="moreShow"
            :round="false"
            :actions="moreActions"
            cancel-text="取消"
            @cancel="onCloseMore"
            @close="onCloseMore"
            @select="onSelectMore"
            z-index="99999"
        />
        <div class="footer" @click="getAddTask">
            <p>
                添加任务
            </p>
        </div>
    </div>
</template>
<script>
export default {
    props:['name','Meetingid','current','detailInfo','isEdit'],
    data(){
        return {
            list:[
                {
                    CreatedByName:'测试',
                    BusinessUnitIdName:'部门',
                    cont:"123"
                }
            ],
            sessionkey: "",
            moreActions: [
                {
                    name: '新建任务',
                }
            ],
            moreShow: false,
            actions: [
                {
                    name: '修改',
                },
                {
                    name: '删除'
                }
            ],
            isShow:false,
            descrip: "",
            id: ""
        }
    },
    onLoad(){
        this.sessionkey = wx.getStorageSync('sessionkey');
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method: this.$api.meeting.taskList,
                    SessionKey: this.sessionkey,
                    RegardingObjectId: this.Meetingid
                }
            }).then(res=>{
                this.list = res.listData;
            })
        },
        getAddTask(){
            this.moreShow = true;
        },
        onCloseMore(){
            this.moreShow = false;
        },
        onSelectMore(e){
            let name = e.mp.detail.name;
            if(name=='新建任务'){
                const url = '/pages/meeting/newSummary/main?name='+this.name+'&Meetingid='+this.Meetingid+'&current='+this.current;                
                wx.navigateTo({url:url});
            }
        },
        getMore(item){
            this.id = item.ActivityId;
            this.descrip = item.Description;
            this.isShow = true;
        },
        onClose(){
            this.isShow = false;
        },
        onSelect(e){
            console.log(e);
            let name = e.mp.detail.name;
            if(name=='删除'){
                this.getDelete();
            }else if(name=='修改'){
                const url = '/pages/meeting/newSummary/main?content='+this.descrip+'&current='+this.current+'&Meetingid='+this.Meetingid+'&ActivityId='+this.id;
                wx.navigateTo({url:url});
            }
        },
        // 删除任务
        getDelete(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"entity.info.delete",
                    SessionKey:this.sessionkey,
                    ObjTypeCode:5005,
                    RegardingObjectId:this.Meetingid,
                    id: this.id
                }
            }).then(res=>{
                let that = this;
                if(res.status==1){
                    message.toast({
                        title:res.msg,
                        delta: 0,
                        success(){
                            that.getQuery();
                        }
                    })
                }else {
                    wx.showToast({
                        title:'删除失败',
                        icon:"success",
                        duration:2000
                    })
                }
                
            })
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .contentWrap{
            padding: 0 24rpx 120rpx 24rpx; 
            .rowContent{
                background: #fff;
                border-radius: 23rpx;
                margin: 24rpx 0;
                padding: 33rpx;
                .rowT{
                    display: flex;
                    align-items: center;
                    .l{
                        p{
                            width: 72rpx;
                            height: 72rpx;
                            line-height: 72rpx;
                            text-align: center;
                            background: #3399ff;
                            color: #fff;
                            font-size: 26rpx;
                            border-radius: 50%;
                        }
                    }
                    .r{
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
                .title{
                    font-size: 34rpx;
                    color: #333333;
                    font-weight: bold;
                    margin: 30rpx 0;
                }
                .cont{
                    font-size: 34rpx;
                    color: #333333;
                    // margin-bottom: 50rpx;
                }
                .files{
                    padding: 19rpx;
                    border: 1rpx solid #e7e8ea;
                    display: flex;
                    align-items: center;
                    margin: 10rpx 0;
                    .l{
                        width: 108rpx;
                        height: 108rpx;
                        img{
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                        }
                    }
                    .r{
                        margin-left: 25rpx;
                        p:nth-child(1){
                            width: 300rpx;
                            font-size: 28rpx;
                            color: #333333;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            padding-bottom: 20rpx;
                        }
                        p:nth-child(2){
                            font-size: 24rpx;
                            color: #7e8184;
                        }
                    }
                }
                .more{
                    display: flex;
                    justify-content: space-between;
                    p{
                        font-size: 24rpx;
                        color: #a1a5aa;
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            p{
                text-align: center;
                font-size: 34rpx;
                color: #3399ff;
                padding: 30rpx 0;
            }
        }
    }
</style>