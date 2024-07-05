<template>
    <div class="wrap">
        <div class="container">
            <div class="header">
                <div class="row">
                    <div class="l">
                        <p></p>
                    </div>
                    <div class="r">
                        <p>{{detail.Subject}}</p>
                        <p>我的日程</p>
                    </div>
                </div>
                <div class="rowTime">
                    <div class="lMin">
                        <p>{{startMonth}}月{{startDate}}日</p>
                        <p>{{startMin}}{{startDay}}</p>
                    </div>
                    <div class="num">
                        <span></span>
                        <p>{{mathNum}}</p><span></span>
                    </div>
                    <div class="lMin">
                        <p>{{endMonth}}月{{endDate}}日</p>
                        <p>{{endMin}}{{endDay}}</p>
                    </div>
                </div>
                <div class="rows">
                    <div class="l">
                        <i class="iconfont icon-zhongfu"></i>
                    </div>
                    <div class="r">
                        <p>{{ repeatStr || '无'}}</p>
                    </div>
                </div>
                <div class="rows">
                    <div class="l">
                        <i class="iconfont icon-type"></i>
                    </div>
                    <div class="r">
                        <p>日历：{{detail.calendarType}}</p>
                    </div>
                </div>
                <div class="rows">
                    <div class="l">
                        <i class="iconfont icon-gongzuozhuangtai"></i>
                    </div>
                    <div class="r">
                        <p>显示为：{{detail.displayStatus}}</p>
                    </div>
                </div>
                <div class="rows">
                    <div class="l">
                        <i class="iconfont icon-shanguangdeng"></i>
                    </div>
                    <div class="r">
                        <p>15分钟前，应用内提醒</p>
                    </div>
                </div>
            </div>
            <div class="describe">
                <div class="rows">
                    <div class="l">
                        <i class="iconfont icon-beizhu"></i>
                    </div>
                    <div class="r">
                        <p>{{detail.description}}</p>
                    </div>
                </div>
            </div>
            <!-- <div class="moveRow">
                <p>
                    <i class="iconfont icon-zuzhiren"></i>
                </p>
                <p>
                    <input type="text" placeholder="邀请参与人">
                </p>
                <p>
                    <i-icon type="enter" color="#a3a4a6" size="20" />
                </p>
            </div> -->
            <div class="moveRow" @click="getUsb">
                <p>
                    <i class="iconfont icon-fujian"></i>
                </p>
                <p>
                    附件
                </p>
                <p>
                    <i class="iconfont icon-tianjia"></i>
                </p>
            </div>
            <div class="enclosure">
                <div class="rows" v-for="(item,index) in listFile" :key="index">
                    <p>
                        <img v-if="item.fileExtension=='.jpg'||item.fileExtension=='.png'||item.fileExtension=='jpg'||item.fileExtension=='png'"
                            :src="item.link" alt="">
                        <img v-else-if="item.fileExtension=='.xls' || item.fileExtension=='.xlsx'||item.fileExtension=='xls' || item.fileExtension=='xlsx'"
                            :src="photoUrl+'xls.png'" alt="">
                        <img v-else-if="item.fileExtension=='.doc' || item.fileExtension=='.word' || item.fileExtension=='.docx'||item.fileExtension=='doc' || item.fileExtension=='word' || item.fileExtension=='docx'"
                            :src="photoUrl+'02.3.1.Word.png'" alt="">
                        <img v-else-if="item.fileExtension=='.rar'||item.fileExtension=='rar'" :src="photoUrl+'rar.png'"
                            alt="">
                        <img v-else-if="item.fileExtension=='.txt'||item.fileExtension=='txt'"
                            :src="photoUrl+'02.3.1.Txt.png'" alt="">
                        <img v-else-if="item.fileExtension=='.pdf'||item.fileExtension=='pdf'"
                            :src="photoUrl+'02.3.1.Pdf.png'" alt="">
                        <img v-else-if="item.fileExtension=='.ppt'||item.fileExtension=='ppt'"
                            :src="photoUrl+'02.3.1.PPT.png'" alt="">
                    </p>
                    <p>{{item.name}}</p>
                    <p @click="getDelFiles(item)">
                        <i-icon type="close" size="20" color="#666666" />
                    </p>
                </div>
            </div>
            <div class="moveRow">
                <p>
                    <i-icon type="enter" color="#fff" size="20" />
                </p>
                <p class="move">
                    更多
                </p>
            </div>
            <h3 v-if="commentList!=''">回复 {{commentList.length}}</h3>
            <div class="commentWrap">
                <!-- <div class="comment">
                    <div class="lBox">
                        <p>卫辉</p>
                    </div>
                    <div class="rBox">
                        <p class="info">卫辉 <span>信息中心</span><span>05月25日 11:23</span></p>
                        <div class="imgBox">
                            <p></p>
                        </div>
                    </div>
                </div> -->
                <div class="comment items" v-for="(item,index) in commentList" :key="index">
                    <div class="lBox">
                        <p>{{item.CreatedByName}}</p>
                    </div>
                    <div class="rBox">
                        <p class="info">{{item.CreatedByName}}
                            <span>{{item.BusinessUnitName}}</span><span>{{item.CreatedOn}}</span></p>
                        <p class="text">{{item.Comment}}</p>
                    </div>
                </div>
                <div class="comment">
                    <div class="lBox">
                        <i class="iconfont icon-tixing"></i>
                    </div>
                    <div class="rBox items">
                        <p class="info"><span>{{detail.CreatedByName}} 创建了 日程</span><span>{{detail.createdOn}}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="inpWrap" :style="{'height':height+'px'}" catchtouchmove="true" v-if="overlayShow==true">
            <div class="top" @click="getCloseOver">

            </div>
            <div class="bottom">
                <div class="box">
                    <textarea class="textarea" v-model="comment" @blur="getBlur" :show-confirm-bar="false"
                        cursor-spacing='140' placeholder="我来说两句..." :auto-focus="true" name="" id="" maxlength="500"
                        cols="30" rows="10"></textarea>
                    <div class="total">
                        <p>
                            {{contentSize}}/{{total}}
                        </p>
                        <p @click="getSendout" :class="{active:comment!=''}">
                            发送
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer" v-if="!overlayShow" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="boxWrap">
                <div class="box" @click="getComment">
                    <p>
                        <i class="iconfont icon-pinglun"></i>
                    </p>
                    <p>评论</p>
                </div>
                <!-- <div class="box">
                    <p>
                        <i class="iconfont icon-zhuanfa"></i>
                    </p>
                    <p>发送</p>
                </div> -->
                <div class="box" @click="getMove">
                    <p>
                        <i class="iconfont icon-gengduo1"></i>
                    </p>
                    <p>更多</p>
                </div>
            </div>
        </div>
        <van-action-sheet :show="show" :round="false" :actions="actions" cancel-text="取消" @cancel="onClose"
            @close="onClose" @select="onSelect" z-index="99999" />
    </div>
</template>
<script>
    import { mapState, mapMutations } from 'vuex';
    import { message } from '@/utils/message';
    export default {
        data() {
            return {
                overlayShow: false,
                height: "",
                comment: "",
                total: 500,
                actions: [
                    // {
                    //     name: '添加参与人',
                    // },
                    {
                        name: '修改',
                    },
                    {
                        name: '删除'
                    }
                ],
                show: false,
                id: "",
                sessionkey: "",
                detail: {},
                commentList: [],
                listFile: [],
                startMonth: "",
                startDate: "",
                startDay: "",
                endMonth: "",
                endDate: "",
                endDay: "",
                mathNum: "",
                startMin: "",
                endMin: ""
            }
        },
        computed: {
            contentSize() {
                return this.comment.length || 0;
            },
            ...mapState({
                selectFiles: state => {
                    return state.usb.selectFiles;
                }
            }),
            FileIds() {
                let temp = [];
                this.selectFiles.forEach(item => {
                    temp.push(item.id);
                })
                return temp;
            },
            isModelmes() {
                return wx.getStorageSync('isModelmes');
            },
            photoUrl() {
                return this.$api.photo.url;
            },
            repeatStr() {
                var recurrenceType = this.detail.RecurrenceType2;
                // console.log("recurrenceType", recurrenceType);
                let str = "";
                if (recurrenceType && recurrenceType != "无") {
                    let temp = recurrenceType.split("|");
                    if (temp[0] == "ftd") {
                        if (temp[1] == "d0") {
                            str = temp[2] ? `每天重复,直到${temp[2]}终止重复` : "每天重复";
                        } else {
                            str = temp[3]
                                ? `每${temp[2]}天重复,直到${temp[3]}终止重复`
                                : `每${temp[2]}天重复`;
                        }
                    } else if (temp[0] == "ftw") {
                        if (temp[1] == 1) {
                            str = temp[3]
                                ? `每周的周${temp[2] == 0 ? "日" : temp[2]}重复,直到${temp[3]
                                }终止重复`
                                : `每周的周${temp[2] == 0 ? "日" : temp[2]}重复`;
                        } else {
                            str = temp[3]
                                ? `每${temp[1]}周的周${temp[2] == 0 ? "日" : temp[2]}重复,直到${temp[3]
                                }终止重复`
                                : `每${temp[1]}周的周${temp[2] == 0 ? "日" : temp[2]}重复`;
                        }
                    } else if (temp[0] == "ftm") {
                        if (temp[2] == 1) {
                            str = temp[4]
                                ? `每个月的第${temp[3]}天重复,直到${temp[4]}终止重复`
                                : `每个月的第${temp[3]}天重复`;
                        } else {
                            str = temp[4]
                                ? `每${temp[2]}个月的第${temp[3]}天重复,直到${temp[4]}终止重复`
                                : `每${temp[2]}个月的第${temp[3]}天重复`;
                        }
                    }
                } else {
                    str = recurrenceType;
                }
                return str;
            },
        },
        onUnload() {
            this.clearFile([])
        },
        onLoad(options) {
            this.id = options.id;
            let sessionKey = wx.getStorageSync('sessionkey');
            this.sessionKey = sessionKey;
            this.height = wx.getSystemInfoSync().windowHeight;
            this.getQuery();
            this.getCommentQuery();
            this.getFileList();
        },
        onShow() {
            this.getAddFile();
            this.getFileList();
        },
        methods: {
            ...mapMutations([
                'delete',
                'clearFile'
            ]),
            
            getFileList() {
                this.$httpWX.get({
                    url: this.$api.message.queryList,
                    data: {
                        method: this.$api.public.getFile,
                        SessionKey: this.sessionKey,
                        pid: this.id,
                        ObjTypeCode: 4200
                    }
                }).then(res => {
                    console.log(res);
                    this.listFile = res.listData;
                    this.listFile = this.listFile.concat(this.selectFiles);
                    console.log(this.listFile, 'listData');
                })
            },
            getAddFile() {
                if (this.FileIds != "") {
                    this.$httpWX.get({
                        url: this.$api.message.queryList,
                        data: {
                            method: this.$api.usb.addFile,
                            SessionKey: this.sessionKey,
                            FileIds: this.FileIds.join(','),
                            ObjectTypeCode: 4200,
                            ObjectId: this.id
                        }
                    }).then(res => {
                        console.log(res);
                    })
                }
            },
            getQuery() {
                this.$httpWX.get({
                    url: this.$api.message.queryList,
                    data: {
                        method: "activity.event.get",
                        SessionKey: this.sessionKey,
                        id: this.id
                    }
                }).then(res => {
                    console.log(res);
                    this.detail = res.data;
                    let date = new Date(this.detail.scheduledStart.replace(/-/g, '/'));
                    let endDate = new Date(this.detail.scheduledEnd.replace(/-/g, '/'));
                    let startHour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                    let endHour = endDate.getHours() < 10 ? '0' + endDate.getHours() : endDate.getHours();
                    let startMin = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                    let endMin = endDate.getMinutes() < 10 ? '0' + endDate.getMinutes() : endDate.getMinutes();
                    this.startMonth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
                    this.startDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                    this.endMonth = endDate.getMonth() + 1 < 10 ? '0' + (endDate.getMonth() + 1) : endDate.getMonth() + 1;
                    this.endDate = endDate.getDate() < 10 ? '0' + endDate.getDate() : endDate.getDate();
                    this.startDay = this.getWeekDay(date);
                    this.endDay = this.getWeekDay(endDate);
                    this.mathNum = this.intervalTime(date, endDate);
                    this.startMin = `${startHour}:${startMin}`;
                    this.endMin = `${endHour}:${endMin}`;
                })
            },
            getWeekDay(date) {
                let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                let day = week[date.getDay()];
                return day;
            },
            intervalTime(date, endDate) {
                let startTime = new Date(date).getTime();
                let endTime = new Date(endDate).getTime();
                let date3 = endTime - startTime;
                //计算出相差天数
                let days = Math.floor(date3 / (24 * 3600 * 1000));
                console.log(days, '12131233');
                //计算出小时数

                var leave1 = date3 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
                var hours = Math.floor(leave1 / (3600 * 1000));
                //计算相差分钟数
                var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
                var minutes = Math.floor(leave2 / (60 * 1000));

                //计算相差秒数

                var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
                var seconds = Math.round(leave3 / 1000);
                let diff =
                    days > 0 && hours > 0 ? `${days}天${hours}小时`
                        : days > 0 && hours == 0 ? `${days}天`
                            : `${hours}小时`;
                return diff;
            },
            // 添加附件
            getUsb() {
                const url = '/pages/uPan/main';
                wx.navigateTo({ url: url });
            },
            getDelFiles(item) {
                this.delete(item.id);
                this.$httpWX.get({
                    url: this.$api.message.queryList,
                    data: {
                        method: this.$api.public.delete,
                        SessionKey: this.sessionKey,
                        Id: item.id,
                        ObjTypeCode: 1001
                    }
                }).then(res => {
                    console.log(res);
                    this.getFileList();
                })
            },
            getCommentQuery() {
                this.$httpWX.get({
                    url: this.$api.message.queryList,
                    data: {
                        method: "object.comments.getlist",
                        SessionKey: this.sessionKey,
                        id: this.id
                    }
                }).then(res => {
                    console.log(res);
                    this.commentList = res.listData;
                })
            },
            getComment() {
                this.overlayShow = true;
            },
            getCloseOver() {
                this.overlayShow = false;
            },
            getBlur() {
                this.overlayShow = false;
                // this.height = '20';
            },
            getMove() {
                this.show = true;
            },
            onClose() {
                this.show = false;
            },
            onSelect(e) {
                let name = e.mp.detail.name;
                if (name == '修改') {
                    const url = '/pages/schedule/newSchedule/main?id=' + this.id;
                    wx.navigateTo({ url: url });
                } else if (name == '删除') {
                    this.getDelete();
                } else if (name == '添加参与人') {
                    // const url = '/pages/publics/mailList/main?admin='+1;
                    // wx.navigateTo({url:url});
                }
            },
            getSendout() {
                this.$httpWX.get({
                    url: this.$api.message.queryList,
                    data: {
                        method: "object.comment.add",
                        SessionKey: this.sessionKey,
                        objectid: this.id,
                        objTypeCode: 4200,
                        comments: this.comment
                    }
                }).then(res => {
                    console.log(res);
                    this.getCommentQuery();
                })
            },
            getDelete() {
                this.$httpWX.get({
                    url: this.$api.message.queryList,
                    data: {
                        method: "activity.event.delete",
                        SessionKey: this.sessionKey,
                        id: this.id
                    }
                }).then(res => {
                    if (res.status == 1) {
                        message.toast({
                            title: "删除成功",
                            delta: 1,
                            success() {

                            }
                        })
                    } else {
                        message.toast({
                            title: "删除失败",
                            delta: 0,
                            success() {

                            }
                        })
                    }
                })
            }
        }
    }
</script>
<style lang="scss">
    @import '../../../../static/css/schedule.css';

    .wrap {
        .container {
            padding-bottom: 80px;

            .header {
                margin-top: 24rpx;
                background: #fff;

                .row {
                    display: flex;
                    padding: 0 37rpx;

                    .l {
                        padding: 20rpx 0;

                        p {
                            width: 23rpx;
                            height: 23rpx;
                            border-radius: 50%;
                            background: #52b55e;
                            margin-top: 10rpx;
                        }
                    }

                    .r {
                        width: 100%;
                        padding: 20rpx 0;
                        margin-left: 20rpx;
                        border-bottom: 1rpx solid #e2e3e5;

                        p:nth-child(1) {
                            width: 100%;
                            overflow: hidden;
                            word-break: break-word;
                            line-height: 1;
                            font-size: 34rpx;
                            color: #333333;
                            line-height: 1.5;
                            font-weight: bold;
                        }

                        p:nth-child(2) {
                            font-size: 26rpx;
                            color: #7b8187;
                        }
                    }
                }

                .rowTime {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding: 20rpx 0;

                    .lMin {

                        // width: 35%;
                        p:nth-child(1) {
                            font-size: 40rpx;
                            font-weight: bold;
                            text-align: center;
                        }

                        p:nth-child(2) {
                            text-align: center;
                            font-size: 24rpx;
                            color: #333333;
                        }
                    }

                    .num {
                        display: flex;
                        align-items: center;

                        span {
                            display: inline-block;
                            width: 20rpx;
                            height: 2rpx;
                            background: #e2e4e3;
                        }

                        p {
                            font-size: 24rpx;
                            // width: 82rpx;
                            height: 48rpx;
                            text-align: center;
                            line-height: 48rpx;
                            color: #999999;
                            background: #eef0f2;
                            border-radius: 26rpx;
                            padding: 0 20rpx;
                        }
                    }
                }

                .rows {
                    display: flex;
                    align-items: center;
                    padding: 0 37rpx;

                    .l {
                        i {
                            color: #343434;
                        }
                    }

                    .r {
                        padding: 30rpx 0;
                        border-top: 1rpx solid #e2e3e5;
                        flex: 1;
                        margin-left: 20rpx;
                        font-size: 34rpx;
                        color: #333333;
                    }
                }
            }

            .describe {
                margin-top: 24rpx;
                background: #fff;

                .rows {
                    display: flex;
                    padding: 0 37rpx;

                    .l {
                        padding: 30rpx 0;

                        i {
                            color: #000000;
                        }
                    }

                    .r {
                        padding: 30rpx 0;
                        flex: 1;
                        margin-left: 20rpx;
                        font-size: 34rpx;
                        color: #333333;

                        p {
                            width: 100%;
                            overflow: hidden;
                            word-break: break-word;
                            line-height: 1;
                        }
                    }
                }
            }

            .moveRow {
                margin-top: 24rpx;
                background: #fff;
                display: flex;
                padding: 30rpx 37rpx;
                align-items: center;

                p:nth-child(2) {
                    flex: 1;
                    margin-left: 20rpx;
                }

                .move {
                    color: #999999;
                }
            }

            .enclosure {
                background: #fff;

                .rows {
                    display: flex;
                    padding: 33rpx;
                    align-items: center;

                    p:nth-child(1) {
                        width: 96rpx;
                        height: 96rpx;
                        // background: #e5e5e5;
                        border-radius: 12rpx;

                        img {
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                        }
                    }

                    p:nth-child(2) {
                        flex: 1;
                        margin-left: 20rpx;
                        font-size: 34rpx;
                        color: #333333;
                        width: 300rpx;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                }
            }

            h3 {
                background: #f7f7f7;
                color: #999999;
                font-size: 28rpx;
                padding: 31rpx 47rpx;
            }

            .commentWrap {
                background: #fff;

                .items {
                    align-items: center;
                }

                .comment:last-child .rBox {
                    border-bottom: none;
                }

                .comment {
                    display: flex;
                    padding: 0 32rpx;

                    .lBox {
                        padding: 20rpx 0;
                        width: 60rpx;

                        p {
                            width: 60rpx;
                            height: 60rpx;
                            line-height: 60rpx;
                            text-align: center;
                            border-radius: 50%;
                            background: #3399ff;
                            color: #fff;
                            font-size: 20rpx;
                        }
                    }

                    .rBox {
                        flex: 1;
                        margin-left: 20rpx;
                        padding: 20rpx 0;
                        border-bottom: 1rpx solid #e2e3e5;

                        .imgBox {
                            display: flex;
                            margin-top: 10rpx;

                            p {
                                width: 200rpx;
                                height: 200rpx;
                                background: #e5e5e5;
                                border-radius: 9rpx;
                            }
                        }

                        .info {
                            font-size: 28rpx;
                            color: #3399ff;
                            overflow: hidden;

                            span:nth-child(1) {
                                color: #666666;
                            }

                            span:nth-child(2) {
                                color: #666666;
                                float: right;
                            }
                        }

                        .text {
                            font-size: 34rpx;
                            color: #333333;
                        }
                    }
                }
            }
        }

        .inpWrap {
            width: 100%;
            position: fixed;
            bottom: 100px;
            z-index: 999;

            .top {
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 1);
                opacity: .5;
            }

            .bottom {
                width: 100%;
                height: auto;
                position: fixed;
                bottom: 0;
                background: #fff;
                z-index: 9999;

                .box {
                    padding: 33rpx 33rpx 0 33rpx;

                    .textarea {
                        width: 100%;
                        height: 188rpx;
                        background: #fff;
                        color: #333333;
                        font-size: 28rpx;
                        border-bottom: 2rpx solid #eaebeb;
                    }

                    .total {
                        display: flex;
                        justify-content: space-between;
                        padding: 33rpx 0;

                        p:nth-child(1) {
                            color: #999999;
                            font-size: 28rpx;
                        }

                        p:nth-child(2) {
                            color: #999999;
                            font-size: 33rpx;
                        }

                        p:nth-child(2).active {
                            color: #3399ff;
                        }
                    }
                }
            }
        }

        .footer {
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            z-index: 999;

            .boxWrap {
                display: flex;
                justify-content: space-around;
                padding: 20rpx 0;

                .box {
                    width: 33%;
                    text-align: center;

                    p:nth-child(1) {
                        i {
                            color: #666666;
                        }
                    }

                    p:nth-child(2) {
                        color: #666666;
                        font-size: 21rpx;
                        margin-top: 10rpx;
                    }
                }
            }
        }
    }
</style>