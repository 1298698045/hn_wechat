<template>
    <div class="wrap">
        <h3>限额以下(零星)工程结算送审计审批</h3>
        <div class="containerWrap">
            <div>
                <van-field
                    :value="title"
                    title-width="100rpx"
                    required
                    clearable
                    label="标题"
                />
                <picker @change="pickerDeparment" :value="departmentIdx" :range="department">
                    <van-field
                        :value="department[departmentIdx]"
                        title-width="100rpx"
                        :readonly="true"
                        input-class="inp"
                        clearable
                        label="部门"
                        right-icon="arrow"
                    />
                </picker>
                <van-field
                    :value="launchPeople"
                    title-width="100rpx"
                    :readonly="true"
                    input-class="inp inpActive"
                    clearable
                    label="发起人"
                />
            </div>
            <div class="cont">
                <picker @change="pickerLevel" :value="levelIdx" :range="level">
                    <van-field
                        :value="level[levelIdx]"
                        required
                        title-width="100rpx"
                        :readonly="true"
                        input-class="inp"
                        clearable
                        label="部门"
                        right-icon="arrow"
                    />
                </picker>
            </div>
            <div class="content">
                <div class="nav">
                    <p>报销明细(1)</p>
                    <p class="del">删除</p>
                </div>
                <van-field
                    :value="''"
                    title-width="180rpx"
                    input-class="inp"
                    required
                    clearable
                    label="报销金额(元)"
                    placeholder="请输入金额"
                />
                <picker @change="pickerLevel" :value="bxClassIdx" :range="bxClass">
                    <van-field
                        :value="bxClass[bxClassIdx]"
                        required
                        title-width="180rpx"
                        :readonly="true"
                        input-class="inp"
                        clearable
                        label="报销类别"
                        right-icon="arrow"
                    />
                </picker>
                <van-field
                    :value="''"
                    title-width="180rpx"
                    :border="false"
                    :readonly="true"
                    clearable
                    label="费用明细"
                />
                <div class="text">
                    <textarea name="" id="" cols="30" rows="10" placeholder="请输入费用明细描述"></textarea>
                    <p>+增加报销明细</p>
                </div>
            </div>
            <h3>总报销金额(元)：</h3>
            <div class="rowWrap" @click="getAddTodoBusiness">
                <div class="row">
                    <p class="name">关联事务</p>
                    <p class="icon"><i-icon type="add" color="#3399ff" size="20" /></p>
                </div>
                <div class="rowCont">
                    <div class="box" v-for="(item,index) in 2" :key="index">
                        <div class="l">
                            <p>卫辉</p>
                        </div>
                        <div class="r">
                            <div class="text">
                                <p class="title">生物医学研究伦理审查审批表</p>
                                <p class="bottom">
                                    <span class="inline">特</span>
                                    卫辉    信息中心    <span class="time">2018年4月4日</span>
                                </p>
                            </div>
                            <p>
                                <i-icon type="delete" size="20" color="#9c9c9c" />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rowWrap top">
                <div class="row" @click="getChooseImage">
                    <p class="name">图片</p>
                    <p class="icon"><i-icon type="picture" color="#3399ff" size="20" /></p>
                </div>
                <div class="imgWrap">
                    <div v-if="imgList!=''">
                        <div class="imgs" v-for="(item,index) in imgList" :key="index">
                            <img :src="item" alt="">
                            <i-icon type="delete" size="20" color="#9c9c9c" i-class="icon" @click="getDeleteImg(index)" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="rowWrap top">
                <div class="row">
                    <p class="name">附件</p>
                    <p class="icon"><i-icon type="accessory" color="#3399ff" size="20" /></p>
                </div>
                <div class="enclosureCont">
                    <div class="img">
                        <p>
                            <img src="https://oawx.hnca.org.cn/img/wechat/Folder.png" alt="">
                        </p>
                    </div>
                    <div class="cen">
                        <p>事假的审批流程.xls</p>
                        <p>2018/6/9  17:56   31.2MB</p>
                    </div>
                    <div>
                        <p>
                            <i-icon type="delete" size="20" color="#9c9c9c" />
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="btn">
                <van-button type="primary" color="#3399ff" block>提交</van-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            title:"限额以下(零星)工程结算送审计审批",
            departmentIdx:0,
            department:['院办','财务科','人事科'],
            launchPeople:"杜丽萍",
            level:['普通','紧急','特级'],
            levelIdx:0,
            bxClassIdx:0,
            bxClass:[],
            imgList:[]
        }
    },
    onLoad(options){
        this.title = options.title;
    },
    methods:{
        pickerDeparment(e){
            this.departmentIdx = e.mp.detail.value;
        },
        pickerLevel(e){
            this.levelIdx = e.mp.detail.value;
        },
        getDeleteImg(index){
            this.imgList.splice(index,1);
        },
        getAddTodoBusiness(){
            const url = '/pages/todoBusiness/selectRelation/main';
            wx.navigateTo({url:url});
        },
        getChooseImage(){
            let that = this;
            wx.chooseImage({
                count: 9,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    that.imgList = tempFilePaths;
                }
            })
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .containerWrap{
            padding-bottom: 100px;
        }
        h3{
            padding: 20rpx 33rpx;
            color: #ababab;
            font-size: 28rpx;
        }
        .inp{
            text-align: right;
        }
        .inp.inpActive{
            margin-right: 20rpx;
        }
        .cont{
            margin-top: 34rpx;
            .inp{
                text-align: right;
            }
        }
        .content{
            .nav{
                display: flex;
                justify-content: space-between;
                padding: 20rpx 33rpx;
                font-size: 26rpx;
                color: #ababab;
                .del{
                    font-size: 26rpx;
                    color: #3399ff;
                }
            }
            .text{
                background: #fff;
                padding: 0 30rpx;
                textarea{
                    font-size: 31rpx;
                    height:150rpx ;
                }
                p{
                    font-size: 26rpx;
                    color: #3399ff;
                    text-align: center;
                    background: #fff;
                    padding-bottom: 10rpx;
                }
            }
        }
        .top{
            margin-top: 35rpx;
        }
        .rowWrap{
            background: #fff;
            padding-bottom: 35rpx;
            .row{
                display: flex;
                justify-content:space-between;
                padding: 20rpx 33rpx;
                .name{
                    font-size: 28rpx;
                    color: #666666;
                }
            }
            .rowCont{
                .box:last-child .r{
                    border: none;
                }
                .box{
                    display: flex;
                    padding: 0 33rpx;
                    align-items: center;
                    .l{
                        padding: 20rpx 0;
                        p{
                            width: 83rpx;
                            height: 83rpx;
                            line-height: 83rpx;
                            text-align: center;
                            border-radius: 50%;
                            font-size: 26rpx;
                            color: #fff;
                            background: #3399ff;
                        }
                    }
                    .r{
                        flex: 1;
                        margin-left: 20rpx;
                        padding: 20rpx 0;
                        border-bottom: 1rpx solid #eceeed;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .title{
                            font-size: 32rpx;
                            color: #333333;
                        }
                        .bottom{
                            font-size: 24rpx;
                            color: #3399ff;
                            .inline{
                                color: #fff;
                                background: #ff6666;
                            }
                            .time{
                                color: #bbbbbb;
                            }
                        }
                    }
                }
            }
            .imgWrap{
                display: flex;
                flex-wrap: wrap;
                padding: 0 33rpx;
                .imgs{
                    width: 100rpx;
                    height: 100rpx;
                    border-radius: 7rpx;
                    background: #dce1e4;
                    margin-right: 10rpx;
                    margin-top: 10rpx;
                    position: relative;
                    img{
                        width: 100%;
                        height: 100%;
                        vertical-align: middle;
                    }
                    .icon{
                        position: absolute;
                        right: -10rpx;
                        top: -10rpx;
                    }
                }
            }
            .enclosureCont{
                display: flex;
                align-items: center;
                padding: 20rpx 33rpx;
                .img{
                    p{
                        width: 83rpx;
                        height: 83rpx;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                }
                .cen{
                    flex:1;
                    margin-left: 20rpx;
                    p:nth-child(1){
                        color: #333333;
                        font-size: 32rpx;
                    }
                    p:nth-child(2){
                        color: #999999;
                        font-size: 24rpx;
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            .btn{
                padding: 20rpx 33rpx;
            }
        }
    }
</style>