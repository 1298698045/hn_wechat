<template>
    <div class="wrap">
        <div class="header">
            <van-search
                :value="value"
                placeholder="请输入搜索关键词"
                :show-action="showAction"
                @change="onSearch"
                @cancel="onCancel"
                cancel-class="cancel"
            />
        </div>
        <div class="center">
            <!-- <div class="tips_wrap">
                <p class="tips">
                    点击键盘上的“搜索”开始
                </p>
            </div> -->
            <div class="content" v-if="value!=''">
                <div class="row" v-for="(item,index) in list" :key="index" @click="getDetail(item)">
                    <p>
                        {{item.Name}}
                    </p>
                    <p>
                        <i-icon type="enter" size="20" color="#999999" />
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            isShow:false,
            value:"",
            list:[]
        }
    },
    computed:{
        showAction(){
            return this.value!=''?false:true;
        },
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        }
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
    },
    methods:{
        onSearch(e){
            this.value = e.mp.detail;
            this.getQuery();
        },
        onCancel(){
            wx.navigateBack({
                delta:1
            })
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"flow.process.all.list",
                    SessionKey:this.sessionkey,
                    search:this.value
                }
            }).then(res=>{
                let data = res.data;
                let temp = [];
                for(let i=0;i<data.length;i++){
                    for(let j=0;j<data[i].Items.length;j++){
                        temp.push({
                            Name:data[i].Items[j].Name,
                            ProcessId:data[i].Items[j].ProcessId,
                            FolderName:data[i].Items[j].FolderName,
                            departId:data[i].Id,
                            departName:data[i].Name
                        })
                    }
                }
                this.list = temp;

            })
        },
        getDetail(item){
            const url = '/pages/approval/preAdd/main?Name='+item.Name+'&ProcessId='+item.ProcessId+'&departName='+item.departName+'&departId='+item.departId;
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
.wrap{
    width: 100%;
    height: 100%;
    .header{
        background: #fff;
        .cancel{
            font-size: 32rpx;
            color: #3399ff;
        }
    }
    .center{
        height: 100vh;
        background: #fff;
        .tips_wrap{
            padding-top: 69rpx;
            .tips{
                text-align: center;
                font-size: 32rpx;
                color: #333333;
            }
        }
        .content{
            .row{
                padding: 31rpx 33rpx;
                border-bottom: 1rpx solid #e2e3e5;
                font-size: 34rpx;
                color: #333333;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }
    }
}
</style>