<template>
    <div class="wrap">
        <div class="header">
            <div class="nav">
                <div class="search">
                    <input type="text" placeholder="搜索" placeholder-class="placeholder" />
                </div>
                <div class="tabs">
                    <i-tabs :current="current" scroll @change="handleChangeScroll">
                        <i-tab key="tab1" title="全部"></i-tab>
                        <i-tab key="tab2" title="院办"></i-tab>
                        <i-tab key="tab3" title="临床科"></i-tab>
                        <i-tab key="tab4" title="医技科"></i-tab>
                        <i-tab key="tab5" title="选项5"></i-tab>
                        <i-tab key="tab6" title="选项6"></i-tab>
                        <i-tab key="tab7" title="选项7"></i-tab>
                        <i-tab key="tab8" title="选项8"></i-tab>
                        <i-tab key="tab9" title="选项9"></i-tab>
                    </i-tabs>
                </div>
                <div class="more" @click="getClassification">
                    <i class="iconfont icon-gengduo"></i>
                </div>
            </div>
            <div class="screen">
                 <picker @change="bindPickerChange" :value="index" range-key="text" :range="listMenu">
                    <div class="select">
                        {{listMenu[index].text}}
                        <span class="jiantou"></span>
                    </div>
                </picker>
                <div class="right">
                    <div class="box" @click="getSwitch">
                        <i class="iconfont" :class="!isBook?'icon-liebiaoxianshi':'icon-datumoshi'"></i>
                    </div>
                    <div class="box" @click="getScreen">
                        <i class="iconfont icon-shaixuan1"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="center" v-if="isBook==false">
            <div class="content">
                <div class="box_card" v-for="(item,index) in list" :key="index" @click="getDetail">
                    <div class="imgs">

                    </div>
                    <div class="Copywriting">
                        <p class="name">
                            <span>卫辉</span>
                            <span>在编</span>
                        </p>
                        <p class="depart">
                            临床科 · 主治医师
                        </p>
                        <div class="desc">
                            血液疾病、多发性骨髓瘤、干细胞移植。
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        <div class="rowCenter"  v-if="isBook">
            <div class="cont" v-for="item in list">
                <div class="avatar">
                </div>
                <div class="info">
                    <p class="name">碧池</p>
                    <p class="depart">临床科 · 主任医师</p>
                    <p class="desc">
                        血液疾病、多发性骨髓瘤、干细胞移植。
                    </p>
                </div>
                <div class="tag">
                    在编
                </div>
            </div>
        </div>
        <van-popup
            :show="show"
            position="top"
            z-index="9999"
            custom-style="width:100%;height: 100vh;"
            @close="onClose"
        >
            <div class="screenWrap">
                <div class="contWrap">
                    <div class="rowWrap">
                    <div class="status">
                        <span class="radius"></span>
                        <span class="text">状态</span>
                    </div>
                    <div class="rowCont">
                        <p class="tag" :class="{'active':statusIdx==index}" v-for="(item,index) in tagList" :key="index" @click="getChoiceStatus(index)">{{item}}</p>
                    </div>
                    </div>
                    <div class="rowWrap">
                    <div class="status">
                        <span class="radius success"></span>
                        <span class="text">类型</span>
                    </div>
                    <div class="collapse" v-for="(item,index) in optionList" :key="index">
                        <div class="title" v-if="item.lengths>0" @click="item.lengths>4?getOpen(item,index):''">
                        <p class="name">{{item.Name}}</p>
                        <p class="text" v-if="item.lengths>4">{{item.isBook?'展开':'收起'}}</p>
                        </div>
                        <div class="contentWrap">
                        <!-- <p class="item" :class="{'active':item.num==i}" v-for="(v,i) in item.isBook?item.array:item.Items" :key="i" @click="getOptions(item,index,v,i)">{{v.Name}}</p> -->
                        <p class="item" :class="{'active':v.isBook}" v-for="(v,i) in item.isBook?item.array:item.Items" :key="i" @click="getOptions(item,index,v,i)">{{v.Name}}</p>
                        </div>
                    </div>  
                    </div>
                </div>
                <div class="bottom"  :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
                    <van-button type="primary" color="#3399ff" block @click="getSubmit">确定</van-button>
                </div>
            </div>
        </van-popup>
        <!-- <drag-sort :imgSrcs="files" @change="onDragSortChange" /> -->
    </div>
</template>
<script>
import dragSort from '@/components/dragSort'
export default {
     components: {
        dragSort
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        }
    },
    data(){
        return {
            current:"tab1",
            itemTitle:"所有编制",
            index:0,
            listMenu:[
                {
                    text:"所有编制",
                    value:0
                },
                {
                    text:"在编",
                    value:1
                },
                {
                    text:"合同",
                    value:2
                },
                {
                    text:"临时",
                    value:3
                },
                {
                    text:"离职",
                    value:4
                },
                {
                    text:"退休",
                    value:5
                },
                {
                    text:"返聘",
                    value:6
                },
                {
                    text:"实习/见习",
                    value:6
                }
            ],
            value1: 1,
            num:0,
            isBook:false,
            list:[1,2,3],
            // files:['https://oawx.hnca.org.cn/img/icons/task.png','https://oawx.hnca.org.cn/img/icons/task.png','https://oawx.hnca.org.cn/img/icons/task.png']
            files:[
                {
                    name:"1"
                },
                {
                    name:"2"
                },
                {
                    name:"3"
                },
                {
                    name:"4"
                },
                {
                    name:"5"
                },
                {
                    name:"6"
                },
                {
                    name:"7"
                },
                {
                    name:"8"
                }
            ],
            show:false,
            optionList:[
                {
                    Id:1,
                    Name:"123",
                    Items:[
                        {
                            Name:"院办"
                        },
                        {
                            Name:"管理"
                        },
                        {
                            Name:"专业技术"
                        }
                    ]
                }
            ]
        }
    },
    methods:{
        getSwitch(){
            this.isBook = !this.isBook;
        },
        handleChangeScroll(e){
            this.current = e.mp.detail.key;
        },

        bindPickerChange(e){
            this.index = e.mp.detail.value;
        },
        getCheck(item,index){
            this.num = index;
            this.itemTitle = item;
            this.$mp.page.selectComponent('#item').toggle();
        },
        onDragSortChange(data) {
            this.files = data
        },
        getClassification(){
            const url = '/pages/personnelFiles/classification/main';
            wx.navigateTo({url:url});
        },
        getScreen(){
            this.show = true;
        },
        getSubmit(){
            this.show = false;
        },
        getDetail(){
            // const url = '/pages/hr/personnelFiles/main';
            const url = '/pages/personnelFiles/detail/main';
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
@font-face {
    font-family: 'iconfont';
    src: url('data:font/truetype;charset=utf-8;base64,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') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #7B8187;
  font-size: 18px;
}

.icon-gengduo:before {
  content: "\e601";
}

.icon-shaixuan1:before {
  content: "\e650";
}

.icon-liebiaoxianshi:before {
  content: "\e65c";
}

.icon-datumoshi:before {
  content: "\e65e";
}



    .wrap{
        .header{
            background: #fff;
            .nav{
                display: flex;
                // justify-content: space-between;
                align-items: center;
                padding-left: 33rpx;
                // position: relative;
                border-bottom: 1rpx solid #e2e4e3;
                .search{
                    input{
                        width: 181rpx;
                        height: 76rpx;
                        border-radius: 40rpx;
                        font-size: 32rpx;
                        background: #eceeed;
                        text-align: center;
                    }
                    .placeholder{
                        color: #999999;
                    }
                }
                .tabs{
                    width: 60%;
                    overflow: hidden;
                }
                .more{
                    // position: absolute;
                    // right: 0;
                    width: 94rpx;
                    height: 108rpx;
                    background: #fff;
                    box-shadow: -12rpx 0rpx 9rpx 0rpx rgba(0, 0, 0, 0.05);
                    z-index: 999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
            .screen{
                display: flex;
                justify-content: space-between;
                align-content: center;
                border-bottom: 1rpx solid #e2e4e3;
                .select{
                    font-size: 26rpx;
                    color: #999999;
                    line-height: 104rpx;
                    padding-left: 33rpx;
                    display: flex;
                    align-items: center;
                    .jiantou:before{
                        width: 0;
                        border-top: 15rpx solid #999999;
                        border-bottom: 15rpx solid transparent;
                        border-left: 15rpx solid transparent;
                        border-right: 15rpx solid transparent;
                        content: '';
                        display: block;
                        margin-top: 10rpx;
                        margin-left: 20rpx;

                    }
                }
                .right{
                    display: flex;
                    .box{
                        width: 104rpx;
                        height: 104rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
        }
        .content{
            padding: 0 33rpx;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            .box_card{
                width: 48%;
                background: #fff;
                margin-top: 33rpx;
                .imgs{
                    height: 331rpx;
                    background: #ccc;
                }
                .Copywriting{
                    padding: 20rpx;
                    .name{
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        span{
                            display: inline-block;
                        }
                        span:nth-child(1){
                            font-size: 33rpx;
                            color: #333;
                            font-weight: bold;
                        }
                        span:nth-child(2){
                            border: 5rpx solid #39c1b3;
                            font-size: 18rpx;
                            color: #39c1b3;
                            border-radius: 3rpx;
                        }
                    }
                    .depart{
                        font-size: 26rpx;
                        color: #999999;
                    }
                    .desc{
                        font-size: 26rpx;
                        color: #666666;
                        margin-top: 28rpx;
                    }
                }
            }
        }
        .rowCenter{
            .cont{
                padding: 25rpx 33rpx;
                display: flex;
                justify-content: space-between;
                background: #fff;
                margin-top: 14rpx;
                .avatar{
                    width: 83rpx;
                    height: 83rpx;
                    border-radius: 12rpx;
                    background: #ccc;
                }
                .info{
                    flex: 1;
                    margin-left: 26rpx;
                    .name{
                        font-size: 33rpx;
                        color: #333333;
                        font-weight: bold;
                    }
                    .depart{
                        font-size: 29rpx;
                        color: #999999;
                        margin-top: 10rpx;
                    }
                    .desc{
                        margin-top: 35rpx;
                        color: #666666;
                        font-size: 29rpx;
                    }
                }
                .tag{
                    height: 26rpx;
                    line-height: 26rpx;
                    border: 5rpx solid #39c1b3;
                    font-size: 18rpx;
                    color: #39c1b3;
                    border-radius: 3rpx;
                }
            }
        }
        .screenWrap{
            .contWrap {
                background: #fff;
                .rowWrap{
                    padding: 0 34rpx;
                    .status{
                        padding: 20rpx 0;
                        .radius{
                        display: inline-block;
                        width: 21rpx;
                        height: 21rpx;
                        background: #3399ff;
                        border-radius: 50%;
                        }
                        .success{
                        background: #39c1b3;
                        }
                        .text{
                        color: #333333;
                        font-size: 25rpx;
                        margin-left: 10rpx;
                        }
                    }
                    .rowCont{
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                        .tag{
                        width: 200rpx;
                        height: 69rpx;
                        line-height: 69rpx;
                        text-align: center;
                        // background: #dfeffe;
                        background: #f4f4f4;
                        font-size: 28rpx;
                        color: #666666;
                        border-radius: 7rpx;
                        margin-bottom: 20rpx;
                        }
                        .active{
                        background: #dfeffe;
                        color: #3399ff;
                        }
                    }
                    .collapse{
                        .title{
                        display: flex;
                        justify-content: space-between;
                        padding: 20rpx 0;
                        .name{
                            font-size: 33rpx;
                            color: #333333;
                            font-weight: bold;
                        }
                        .text{
                            font-size: 26rpx;
                            color: #999999;
                        }
                        }
                        .contentWrap{
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                        .item{
                            width: 321rpx;
                            height: 69rpx;
                            line-height: 69rpx;
                            border-radius: 7rpx;
                            background: #f4f4f4;
                            font-size: 28rpx;
                            color: #333333;
                            margin-bottom: 20rpx;
                            padding-left: 20rpx;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .item.active{
                            background: #dbf5ec;
                            color: #39c1b3;
                        }
                        }
                    }
                }
                .title {
                    font-size: 28rpx;
                    font-weight: bold;
                }
                .rowBox {
                    display: flex;
                    flex-flow: wrap;
                    justify-content: space-between;
                    padding: 10rpx 20rpx;
                    p {
                    width: 45%;
                    height: 30px;
                    line-height: 30px;
                    font-size: 14px;
                    background: #f4f4f4;
                    color: #666666;
                    border-radius: 10rpx;
                    padding-left: 10rpx;
                    margin: 10rpx 0;
                    }
                    p.active {
                    background: #dbf5ec;
                    color: #39c1b3;
                    }
                }
                }
        }
    }
</style>