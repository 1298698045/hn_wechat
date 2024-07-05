<template>
    <div class="wrap">
        <div class="unitData" v-if="unitData!=''">
            <div class="rows" v-for="(item,index) in unitData" :key="index" @click="getDepartDetail(item)">
                <p>
                    {{item.name}} ({{item.quantity}}）
                </p>
                <p>
                    <i-icon type="enter" size="20" color="#999999" />
                </p>
            </div>
        </div>
        <div class="head" v-if="list!=''">
            <van-checkbox :value="check" @change="changeAll">
                <p :style="{'width':width+'px'}">全选</p>
            </van-checkbox>
        </div>
        <div class="center">
            <!-- <van-checkbox-group :value="result" @change="changeGroup"> -->
                <van-index-bar sticky @select="getSelect" :index-list="indexList">
                    <view class="boxWrap" v-for="(item,index) in list" :key="index">
                        <van-index-anchor :index="item.title"></van-index-anchor>
                        <van-checkbox custom-class="checkbox" @change="(e)=>{changeCheckbox(e,v)}" :value="v.checked" :name="v.ValueId" v-for="(v,i) in item.item" :key="i">
                            <div class="row" :style="{'width':width+'px'}">
                                <div class="col_l">
                                    <p>{{v.Name}}</p>
                                </div>
                                <div class="col_r">
                                    <p>{{v.FullName}}</p>
                                    <p>{{v.DeptName}}</p>
                                </div>
                            </div>
                        </van-checkbox>
                    </view>
                </van-index-bar>
            <!-- </van-checkbox-group> -->
        </div>
    </div>
</template>
<script>
import { mapState,mapMutations} from 'vuex';
import Bus from '../../utils/bus';
export default {
    name:"Contacts",
    props:['groupId','id','cc'],
    data(){
        return {
            result:[],
            width:"",
            check:false,
            list:[],
            indexList:['A','B'],
            sessionkey:"",
            unitData:[],
            childShow:false,
            checkList:[]
        }
    },
    computed:{
        ...mapState({
            selectId:state=>{
                return state.mailList.selectId
            },
            selectListName:state=>{
                return state.mailList.selectListName;
            },
            selectListNameCC:state=>{
                return state.mailList.selectListNameCC;
            }
        })
    },
    mounted(){
        let vm = this;
        Bus.$on('val', (data) => {
            vm.childShow = data;
        })
    },
    watch:{
        selectId(v){
            this.result = v;
        }
    },
    onLoad(){
        this.width = wx.getSystemInfoSync().windowWidth-60;
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;

        if(this.groupId){
            this.getQueryList();
        }else if(this.id){
            this.getQuery();
        }
    },
    methods:{
        ...mapMutations([
            'getSelectId',
            'getDeleteAll',
            'getListName',
            'getSingleDelete',
            'getListNameCC',
            'getSingleDeleteCC',
            'getDeleteAllCC'
        ]),
        getDepartDetail(item){
            this.$emit('childFn',item);
            this.id = item.id;
            this.getQuery();
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"oa.unitandaddresslist.group.list",
                    SessionKey:this.sessionkey,
                    parentId:this.id,
                }
            }).then(res=>{
                console.log(res);
                this.list = res.addrData;
                let indexList = [];
                this.list.forEach(item=>{
                    indexList.push(item.title);
                    item.item.forEach(v=>{
                        if(v.FullName.length>=3){
                            this.$set(v,'Name',v.FullName.substr(1));
                        }else {
                            this.$set(v,'Name',v.FullName);
                        }
                    })
                })
                if(this.cc=='cc'){
                    this.selectListNameCC.forEach(one=>{
                        this.list.forEach(t=>{
                            t.item.forEach(s=>{
                                if(one.id==s.ValueId){
                                    this.$set(s,'checked',true);
                                    s.checked = true;
                                }
                            })
                        })
                    })
                }else {
                    this.selectListName.forEach(one=>{
                        this.list.forEach(t=>{
                            t.item.forEach(s=>{
                                if(one.id==s.ValueId){
                                    this.$set(s,'checked',true);
                                    s.checked = true;
                                }
                            })
                        })
                    })
                }
                this.indexList = indexList;
                let unitDataTemp = [];
                this.unitData = res.unitData.forEach(item=>{
                   unitDataTemp =  unitDataTemp.concat(item.item);
                });
                this.unitData = unitDataTemp;
            })
        },
        changeCheckbox(e,v){
            v.checked = e.mp.detail;
            if(v.checked){
                this.checkList.push({
                    id:v.ValueId,
                    FullName:v.FullName,
                    DeptName:v.DeptName
                })
            }else {
                let index = this.checkList.findIndex(item=>item.id==v.ValueId);
                this.checkList.splice(index,1);
                if(this.cc=='cc'){
                    this.getSingleDeleteCC(v.ValueId);
                }else {
                    this.getSingleDelete(v.ValueId);
                }
            }
            let temp = [...this.checkList,...this.selectListName];
            if(this.cc=='cc'){
                this.getListNameCC(temp);
            }else {
                this.getListName(temp);
            }
        },
        changeGroup(e){
            this.result = e.mp.detail;
            // this.getSelectId(this.result);
            let temp = [];
            let listName = [];
            let selectData = [];
            this.list.forEach(item=>{
                temp = temp.concat(item.item);
                item.item.forEach(v=>{
                    v.checked = false;
                    if(this.cc=='cc'){
                        this.getSingleDeleteCC(v.ValueId);
                    }else {
                        this.getSingleDelete(v.ValueId);
                    }
                    for(var j=0; j<this.result.length;j++){
                        if(v.ValueId==this.result[j]){
                            v.checked = true;
                            selectData.push(v.ValueId);
                            listName.push({
                                id:v.ValueId,
                                FullName:v.FullName,
                                DeptName:v.DeptName
                            })
                            break;
                        }
                    }
                })
            })
            console.log(selectData,listName,'selectData');
            // debugger
            if(this.cc=='cc'){
                this.getListNameCC(listName);
            }else {
                this.getSelectId(selectData);
                this.getListName(listName);
            }
            
            // this.result.forEach(item=>{
            //     let id = item.ValueId;
            //     let row =  temp.find(v=>v.ValueId==item);
            //     listName.push({
            //         id:item,
            //         FullName:row.FullName
            //     })
            // })
        },
        getQueryList(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"oa.addresslist.group.search",
                    SessionKey:this.sessionkey,
                    groupId:this.groupId
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
                let indexList = [];
                this.list.forEach(item=>{
                    item.item.forEach(v=>{
                        this.$set(v,'checked',false);
                    })
                    indexList.push(item.title);
                })
                this.indexList = indexList;

            })
        },
        changeAll(e){
            this.check = e.mp.detail;
            let copyTemp = [];
            let listName = [];
            this.list.forEach(item=>{
                item.item.forEach(v=>{
                    copyTemp.push(v.ValueId);
                })
            })
            if(this.check){
                let temp = [];
                this.list.forEach(item=>{
                    item.item.forEach(v=>{
                        this.$set(v,'checked',true);                        
                        temp.push(v.ValueId);
                        listName.push({
                            id:v.ValueId,
                            FullName:v.FullName,
                            DeptName:v.DeptName
                        })
                        // listName.push(v.ValueId);
                        // listName.push(v.FullName);
                    })
                })
                this.result = temp;
                if(this.cc=='cc'){
                    this.getListNameCC(listName);
                }else {
                    this.getSelectId(this.result);
                    this.getListName(listName);
                }

            }else {
                this.result = [];
                this.list.forEach(item=>{
                    item.item.forEach(v=>{
                        this.$set(v,'checked',false);
                    })
                })
                if(this.cc=='cc'){
                    this.getDeleteAllCC(copyTemp);
                }else {
                    this.getSelectId(this.result);
                    this.getDeleteAll(copyTemp);
                }
            }
        }
    }
}
</script>
<style lang="scss" scopod>
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .head{
            width: 100%;
            background: #fff;
            padding:20rpx 33rpx;
        }
        .unitData{
            margin-bottom: 16rpx;
            .rows{
                padding: 20rpx 33rpx;
                background: #fff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 34rpx;
                color: #333333;
            }
        }
        .center{
            .boxWrap{
                .checkbox{
                    background: #fff;
                    display: flex;
                    align-items: center;
                    padding: 20rpx 33rpx;
                    .row{
                        width: 100%;
                        display: flex;
                        align-items: center;
                        .col_l{
                            p{
                                width: 80rpx;
                                height: 80prx;
                                line-height: 80rpx;
                                text-align: center;
                                border-radius: 50%;
                                background: #3399ff;
                                color: #fff;
                                font-size: 26rpx;
                            }
                        }
                        .col_r{
                            flex: 1;
                            margin-left: 24rpx;
                            p:nth-child(1){
                                font-size: 35rpx;
                                color: #333333;
                            }
                            p:nth-child(2){
                                font-size: 26rpx;
                                color: #999999;
                            }
                        }
                    }
                }
            }
        }
    }
</style>