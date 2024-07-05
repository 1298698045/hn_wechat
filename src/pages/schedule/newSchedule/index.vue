<template>
  <div class="wrap">
    <div class="header" v-if="!isShow && !repeatShow">
      <p class="cancel" @click="getBack">取消</p>
      <p class="submit" @click="getSubmit">完成</p>
    </div>
    <div class="boxWrap" v-if="!isShow && !repeatShow">
      <p class="icon">
        <i class="iconfont icon-richeng"></i>
        <!-- <i-icon type="activity" color="#3c3c3c" size="20" /> -->
      </p>
      <p class="cont">
        <textarea
          placeholder-class="placeholder"
          v-model="title"
          name=""
          id=""
          cols="30"
          rows="10"
          placeholder="添加日程、会议、活动等标题"
        ></textarea>
      </p>
    </div>
    <div class="center" v-if="!isShow && !repeatShow">
      <picker @change="pickerSchedule" :value="index" :range="array">
        <div class="row">
          <p class="icon">
            <span></span>
            <!-- <i class="iconfont icon-shijian1"></i> -->
          </p>
          <p class="cont">{{ array[index] }}</p>
          <p>
            <i-icon type="enter" size="20" color="#a3a4a6" />
          </p>
        </div>
      </picker>
      <div class="row">
        <p class="icon">
          <i class="iconfont icon-shijian"></i>
        </p>
        <p class="cont">全天</p>
        <p>
          <van-switch :checked="checked" @change="changeSwitch" size="24px" />
        </p>
      </div>
      <div class="timeWrap">
        <picker
          class="picker"
          mode="multiSelector"
          :value="multiIndex"
          @change="bindMultiPickerChange"
          :disabled="checked"
          :range="newMultiArray"
        >
          <input
            type="text"
            v-if="month == ''"
            placeholder="开始时间"
            disabled
          />
          <div class="box">
            <p>
              {{ month }}{{ day }} <span v-if="!checked">{{ startDay }}</span>
            </p>
            <p>{{ !checked ? hours : startDay }}</p>
          </div>
        </picker>
        <div class="imgBox">
          <img src="https://oawx.hnca.org.cn/img/wechat/2845.png" alt="" />
        </div>
        <picker
          class="picker"
          mode="multiSelector"
          :value="endmultiIndex"
          @change="endbindMultiPickerChange"
          :disabled="checked"
          :range="newMultiArray"
        >
          <input
            type="text"
            v-if="endMonth == ''"
            placeholder="结束时间"
            disabled
          />
          <div class="box rBox">
            <p>
              {{ endMonth }}{{ endDay }}
              <span v-if="!checked">{{ endWeek }}</span>
            </p>
            <p>{{ !checked ? endHours : endWeek }}</p>
          </div>
        </picker>
      </div>
      <picker
        v-if="index == 0"
        @change="pickerCalendar"
        :value="calendarIdx"
        :range="calendarList"
      >
        <div class="row">
          <p class="icon">
            <i class="iconfont icon-leixing"></i>
          </p>
          <p class="cont">日历：{{ calendarList[calendarIdx] }}</p>
          <p>
            <i-icon type="enter" size="20" color="#a3a4a6" />
          </p>
        </div>
      </picker>
      <picker
        v-if="index == 0"
        @change="pickerShow"
        :value="showIdx"
        :range="showList"
      >
        <div class="row">
          <p class="icon">
            <i class="iconfont icon-gongzuozhuangtai"></i>
          </p>
          <p class="cont">显示为：{{ showList[showIdx] }}</p>
          <p>
            <i-icon type="enter" size="20" color="#a3a4a6" />
          </p>
        </div>
      </picker>
      <div class="row">
        <p class="icon">
          <i class="iconfont icon-dizhi"></i>
        </p>
        <p class="cont">
          <input
            placeholder-class="placeholder"
            type="text"
            v-model="location"
            placeholder="输入地点"
          />
        </p>
        <p @click="getOpenLocation">
          <i class="iconfont icon-dizhi1"></i>
          <!-- <i-icon type="coordinates" @click="getOpenLocation" size="20" color="#666666" /> -->
        </p>
      </div>
      <div
        class="contacts"
        @click="getOrganizer"
        v-if="index == 1 && selectListName != ''"
      >
        <div class="row">
          <div class="l">
            <i class="iconfont icon-zuzhiren"></i>
          </div>
          <div class="r">
            <p>
              <span class="avatar">{{ organizer.FullName }}</span>
              <span class="name">{{ organizer.FullName }}</span>
              <span class="tag">组织人</span>
            </p>
          </div>
        </div>
      </div>
      <!-- 会议纪要指派人： -->
      <!-- <div class="row" v-if="index==1" @click="getDesignee">
                <p class="icon">
                    <i class="iconfont icon-zuzhiren"></i>
                </p>
                <p class="cont">
                    会议纪要指派人：{{designee.FullName}}
                </p>
                <p>
                    <i-icon type="enter" size="20" color="#666666" />
                </p>
            </div> -->
      <div class="row" @click="getInvitation">
        <p class="icon">
          <i class="iconfont icon-canyuren"></i>
        </p>
        <p class="cont">
          <input
            placeholder-class="placeholder"
            type="text"
            :disabled="true"
            v-model="value"
            placeholder="邀请参与人"
          />
        </p>
        <p>
          <i-icon type="enter" size="20" color="#a3a4a6" />
        </p>
      </div>
      <div class="row">
        <p class="icon">
          <i class="iconfont icon-tixing"></i>
        </p>
        <p class="cont">15分钟前，应用内提醒</p>
        <p>
          <i-icon type="enter" size="20" color="#a3a4a6" />
        </p>
      </div>
      <!-- 会议室 -->
      <div
        class="row"
        v-if="index == 1 && conference.name"
        @click="getCheckConference"
      >
        <p class="icon">
          <i class="iconfont icon-huiyishi"></i>
        </p>
        <p class="cont">{{ conference.name }}</p>
        <p>
          <i-icon
            type="close"
            color="#a3a4a6"
            size="20"
            @click.stop="getDelConference"
          />
        </p>
      </div>
      <div class="row" v-if="noticeShow">
        <p class="icon">
          <i class="iconfont icon-shanguangdeng"></i>
        </p>
        <p class="cont">通知</p>
        <div class="btn">
          <p>
            <span class="l">应用内</span>
            <span class="r">短信</span>
            <i-icon
              type="close"
              color="#a3a4a6"
              size="20"
              @click="getDelNotice"
            />
          </p>
        </div>
      </div>
      <div class="row" @click="getRepeat" v-if="index == 0 && repeatStr != ''">
        <p class="icon">
          <i class="iconfont icon-zhongfu"></i>
        </p>
        <p class="cont">{{ repeatStr }}</p>
        <p>
          <i-icon
            type="close"
            size="20"
            color="#a3a4a6"
            @click.stop="getRepeatShow"
          />
        </p>
      </div>
      <div class="row" v-if="index == 1 && selectFiles != ''" @click="getUpan">
        <p class="icon">
          <i class="iconfont icon-fujian"></i>
        </p>
        <p class="cont">附件</p>
        <p>
          <i class="iconfont icon-tianjia" style="color: #3399ff"></i>
        </p>
      </div>
      <div class="enclosure">
        <div class="rows" v-for="(item, index) in selectFiles" :key="index">
          <p>
            <img v-if="item.fileExtension=='jpg'||item.fileExtension=='png'" :src="item.link" alt="">
            <img v-else-if="item.fileExtension=='xls' || item.fileExtension=='xlsx'" :src="photoUrl+'xls.png'" alt="">
            <img v-else-if="item.fileExtension=='doc' || item.fileExtension=='word' || item.fileExtension=='docx'" :src="photoUrl+'02.3.1.Word.png'" alt="">
            <img v-else-if="item.fileExtension=='rar'" :src="photoUrl+'rar.png'" alt="">
            <img v-else-if="item.fileExtension=='txt'" :src="photoUrl+'02.3.1.Txt.png'" alt="">
            <img v-else-if="item.fileExtension=='pdf'" :src="photoUrl+'02.3.1.Pdf.png'" alt="">
            <img v-else-if="item.fileExtension=='ppt'" :src="photoUrl+'02.3.1.PPT.png'" alt="">
          </p>
          <p>{{ item.name }}</p>
          <p @click="getDelFiles(item)">
            <i-icon type="close" size="20" color="#a3a4a6" />
          </p>
        </div>
      </div>
      <div class="row" v-if="descriptionShow">
        <p class="icon">
          <i class="iconfont icon-beizhu"></i>
        </p>
        <p class="cont">
          <van-field
            :value="description"
            type="textarea"
            placeholder="请输入描述"
            autosize
            :border="false"
            @change="changeDescription"
          />
        </p>
        <p>
          <i-icon
            type="close"
            size="20"
            color="#a3a4a6"
            @click.stop="getDescriptionShow"
          />
        </p>
      </div>
      <div class="iconRow">
        <!-- <div class="box" @click="getLocationShow">
                    <p>
                        <i class="iconfont icon-dizhi"></i>
                    </p>
                    <p class="name">地点</p>
                </div> -->
        <div
          class="box"
          v-if="index == 1 && !conference.name != ''"
          @click="getConference"
        >
          <p>
            <i class="iconfont icon-huiyishi"></i>
          </p>
          <p class="name">会议室</p>
        </div>
        <div class="box" @click="getNoticeShow" v-if="!noticeShow">
          <p>
            <i class="iconfont icon-shanguangdeng"></i>
          </p>
          <p class="name">通知</p>
        </div>
        <div
          class="box"
          @click="getRepeat"
          v-if="index == 0 && recurrenceType == ''"
        >
          <p>
            <i class="iconfont icon-zhongfu"></i>
          </p>
          <p class="name">重复</p>
        </div>
        <div
          class="box"
          v-if="index == 1 && selectFiles == ''"
          @click="getUpan"
        >
          <p>
            <i class="iconfont icon-fujian"></i>
          </p>
          <p class="name">附件</p>
        </div>
        <div class="box" v-if="!descriptionShow" @click="getDescriptionShow">
          <p>
            <i class="iconfont icon-beizhu"></i>
          </p>
          <p class="name">描述</p>
        </div>
      </div>
    </div>
    <!-- <div class="footer"  v-if="!isShow&&!repeatShow" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="btnWrap">
                <van-button type="primary" @click="getSubmit" color="#3399ff" block>完成</van-button>
            </div>
        </div> -->
    <mapList @childFn="getChildFn" @cancel="getCancelChild" v-if="isShow" />
    <repeat v-if="repeatShow" @childParams="getChildParams" :RecurrenceType2="RecurrenceType2" />
  </div>
</template>
<script>
import mapList from "../../../components/mapList";
import repeat from "../../../components/schedule/repeat";
import { mapState, mapMutations, mapGetters } from "vuex";
import { message } from "@/utils/message";
export default {
  components: {
    mapList,
    repeat,
  },
  data() {
    return {
      title: "",
      checked: false,
      // isAllDayEvent:0,
      description: "",
      index: 0,
      array: ["我的日程", "我的会议"],
      calendarIdx: 0,
      calendarList: ["工作", "个人"],
      showIdx: 0,
      showList: ["正忙", "空闲"],
      location: "",
      isShow: false,
      Latitude: "",
      Longitude: "",
      multiIndex: [0, 0, 0, 0, 0],
      endmultiIndex: [0, 0, 0, 0, 0],
      month: "",
      day: "",
      hours: "",
      endMonth: "",
      endDay: "",
      endHours: "",
      time: "",
      endTime: "",
      repeatShow: false,
      sessionkey: "",
      calendarType: "工作",
      displayStatus: "正忙",
      startTime: "2020-06-03 04:00",
      endTime: "2020-06-03 05:00",
      endWeek: "",
      id: "",
      startDay: "",
      descriptionShow: false,
      fileShow: false,
      repeatisShow: false,
      noticeShow: false,
      locationShow: false,
      MeetingId: "",
      recurrenceType: "",
      scheduleId: "", // 日程id
      copyStartTime: "",
      copyEndTime: "",
      isConference: false,
      meetingSign:'',
      RecurrenceType2: ""
    };
  },
  computed: {
    photoUrl(){
        return this.$api.photo.url;
    },
    repeatStr() {
      let str = "";
      if (this.recurrenceType != "无") {
        let temp = this.recurrenceType.split("|");
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
              ? `每周的周${temp[2] == 0 ? "日" : temp[2]}重复,直到${
                  temp[3]
                }终止重复`
              : `每周的周${temp[2] == 0 ? "日" : temp[2]}重复`;
          } else {
            str = temp[3]
              ? `每${temp[1]}周的周${temp[2] == 0 ? "日" : temp[2]}重复,直到${
                  temp[3]
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
        str = this.recurrenceType;
      }
      return str;
    },
    isModelmes() {
      return wx.getStorageSync("isModelmes");
    },
    isAllDayEvent() {
      return this.checked == true ? 1 : 0;
    },
    newMultiArray: () => {
      let array = [];
      const date = new Date();
      const years = [];
      const months = [];
      const days = [];
      const hours = [];
      const minutes = [];
      var d = new Date();
      var y = d.getFullYear();
      for (let i = y; i <= date.getFullYear() + 10; i++) {
        years.push("" + i + "年");
      }
      array.push(years);
      for (let i = 1; i <= 12; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        months.push("" + i + "月");
      }
      array.push(months);
      for (let i = 1; i <= 31; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        days.push("" + i + "日");
      }
      array.push(days);
      for (let i = 0; i < 24; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        hours.push("" + i + "时");
      }
      array.push(hours);
      for (let i = 0; i < 60; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        minutes.push("" + i + "分");
      }
      array.push(minutes);
      return array;
    },
    ...mapGetters(["filterList"]),
    ...mapState({
      selectListName: (state) => {
        return state.mailList.selectListName;
      },
      organizer: (state) => {
        return state.mailList.organizer;
      },
      designee: (state) => {
        return state.mailList.designee;
      },
      selectFiles: (state) => {
        return state.usb.selectFiles;
      },
      // 会议室
      conference: (state) => {
        return state.publics.conference;
      },
    }),
    value() {
      return this.selectListName != ""
        ? "邀请" +
            this.selectListName[0].FullName +
            "等" +
            this.selectListName.length +
            "人"
        : "";
    },
    FileIds() {
      let temp = [];
      this.selectFiles.forEach((item) => {
        temp.push(item.id);
      });
      return temp;
    },
  },
  onUnload() {
    this.getClear([]);
    this.clearFile([]);
    this.clearConferce({});
  },
  onShow() {
    console.log(this.selectListName, "selectListName");
    if (this.conference.name) {
      this.getCurrent(this.conference.startTime, this.conference.endTime);
      this.getPickerDefault(this.conference.startTime, this.conference.endTime);
      this.startTime = this.conference.startTime;
      this.endTime = this.conference.endTime;
    }
  },
  onLoad(options) {
    Object.assign(this.$data, this.$options.data());
    this.getClear([]);
    this.clearFile([]);
    let sessionkey = wx.getStorageSync("sessionkey");
    this.meetingSign = options.meetingSign;
    if(this.meetingSign==0){
      this.index = 1;
      if(options.id) {
        wx.setNavigationBarTitle({
          title: '编辑会议'
        })
      }else {
        wx.setNavigationBarTitle({
          title: '新建会议'
        })
      }
    }else {
      if(options.id) {
        wx.setNavigationBarTitle({
          title: '编辑日程'
        })
      }else {
        wx.setNavigationBarTitle({
          title: '新建日程'
        })
      }
    }
    this.sessionkey = sessionkey;
    this.startTime = options.startTime;
    this.endTime = options.endTime;
    this.copyStartTime = options.startTime;
    this.copyEndTime = options.endTime;
    this.organizer.FullName = wx.getStorageSync("fullName");
    this.organizer.id = wx.getStorageSync("userId");
    if(options.currDate){
      this.checked = true;
      let date = new Date(options.currDate.replace(/-/g,'/'));
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let currentDate = `${y}-${m}-${d}`;
      this.startTime = `${currentDate} 00:00`;
      this.endTime = `${currentDate} 23:59`;
      this.getCurrent(this.startTime, this.endTime);
      this.getPickerDefault(this.startTime, this.endTime);
    }else
    if (options.startTime) {
      this.getCurrent(options.startTime, options.endTime);
      this.getPickerDefault(options.startTime, options.endTime);
    } else {
      let date = new Date();
      let years = date.getFullYear();
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      console.log(month, "month");
      let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let s = date.getSeconds();
      // console.log(years,month,d,hours,minutes,s,'--------------');
      let startTime = `${years}-${month}-${d} ${hours}:${minutes}`;
      let endTime = `${years}-${month}-${d} ${
        Number(hours)=='23'?'00':
        Number(hours) + Number(1)
      }:${minutes}`;
      this.startTime = startTime;
      this.endTime = endTime;
      this.copyStartTime = startTime;
      this.copyEndTime = endTime;
      this.getCurrent(startTime, endTime);
      console.log(this.newMultiArray);
      const yIdx = this.newMultiArray[0].findIndex(
        (item) => item == years + "年"
      );
      const mIdx = this.newMultiArray[1].findIndex(
        (item) => item == month + "月"
      );
      const dIdx = this.newMultiArray[2].findIndex((item) => item == d + "日");
      const hIdx = this.newMultiArray[3].findIndex(
        (item) => item == hours + "时"
      );
      const minIdx = this.newMultiArray[4].findIndex(
        (item) => item == minutes + "分"
      );
      const endHidx = this.newMultiArray[3].findIndex(
        (item) => item == hours + 1 + "时"
      );
      console.log(yIdx, mIdx, dIdx, hIdx, minIdx, "nian");
      this.multiIndex[0] = yIdx;
      this.multiIndex[1] = mIdx;
      this.multiIndex[2] = dIdx;
      this.multiIndex[3] = hIdx;
      this.multiIndex[4] = minIdx;

      this.endmultiIndex[0] = yIdx;
      this.endmultiIndex[1] = mIdx;
      this.endmultiIndex[2] = dIdx;
      this.endmultiIndex[3] = endHidx;
      this.endmultiIndex[4] = minIdx;
      // console.log(this.multiIndex,'multiIndex')
    }
    // this.id = options.id;
    if (options.id) {
      this.id = options.id;
      this.index = 0;
      this.getQuery();
    } else {
      this.id = "";
    }
    if (options.MeetingId) {
      this.MeetingId = options.MeetingId;
      this.index = 1;
      this.getMeetingQuery();
    } else {
      this.MeetingId = "";
    }
  },
  methods: {
    // 默认日期
    getCurrent(startTime, endTime) {
      console.log(startTime, endTime, "========");
      let date = new Date(startTime.replace(/-/g, "/"));
      this.month = date.getMonth() + 1 + "月";
      this.day = date.getDate() + "日";
      this.hours = `${date.getHours()}:${
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
      }`;
      this.startDay = this.getWeekDay(startTime.replace(/-/g, "/"));
      let endDate = new Date(endTime.replace(/-/g, "/"));
      this.endMonth = endDate.getMonth() + 1 + "月";
      this.endDay = endDate.getDate() + "日";
      this.endHours = `${endDate.getHours()}:${
        endDate.getMinutes() < 10
          ? "0" + endDate.getMinutes()
          : endDate.getMinutes()
      }`;
      this.endWeek = this.getWeekDay(endTime.replace(/-/g, "/"));
    },
    // 日期组建默认选中
    getPickerDefault(startTime, endTime) {
      console.log(startTime, endTime);
      let date = new Date(startTime);
      let years = date.getFullYear();
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

      const yIdx = this.newMultiArray[0].findIndex(
        (item) => item == years + "年"
      );
      const mIdx = this.newMultiArray[1].findIndex(
        (item) => item == month + "月"
      );
      const dIdx = this.newMultiArray[2].findIndex((item) => item == d + "日");
      const hIdx = this.newMultiArray[3].findIndex(
        (item) => item == hours + "时"
      );
      const minIdx = this.newMultiArray[4].findIndex(
        (item) => item == minutes + "分"
      );
      this.multiIndex[0] = yIdx;
      this.multiIndex[1] = mIdx;
      this.multiIndex[2] = dIdx;
      this.multiIndex[3] = hIdx;
      this.multiIndex[4] = minIdx;

      let endDate = new Date(endTime);
      let endYears = endDate.getFullYear();
      let endMonth =
        endDate.getMonth() + 1 < 10
          ? "0" + (endDate.getMonth() + 1)
          : endDate.getMonth() + 1;
      let endD =
        endDate.getDate() < 10 ? "0" + endDate.getDate() : endDate.getDate();
      let endHours =
        endDate.getHours() < 10 ? "0" + endDate.getHours() : endDate.getHours();
      let endMinutes =
        endDate.getMinutes() < 10
          ? "0" + endDate.getMinutes()
          : endDate.getMinutes();
      const endyIdx = this.newMultiArray[0].findIndex(
        (item) => item == endYears + "年"
      );
      const endmIdx = this.newMultiArray[1].findIndex(
        (item) => item == endMonth + "月"
      );
      const enddIdx = this.newMultiArray[2].findIndex(
        (item) => item == endD + "日"
      );
      const endhIdx = this.newMultiArray[3].findIndex(
        (item) => item == endHours + "时"
      );
      const endminIdx = this.newMultiArray[4].findIndex(
        (item) => item == endMinutes + "分"
      );
      this.endmultiIndex[0] = endyIdx;
      this.endmultiIndex[1] = endmIdx;
      this.endmultiIndex[2] = enddIdx;
      this.endmultiIndex[3] = endhIdx;
      this.endmultiIndex[4] = endminIdx;
    },
    ...mapMutations(["getClear", "delete", "clearFile", "clearConferce"]),
    // 接收重复组件传过来的参数
    getChildParams(val) {
      console.log(val, "val");
      this.recurrenceType = val;
      this.RecurrenceType2 = val;
      // console.log("index:", this.index, this.repeatStr);
    },
    // 更换会议室
    getCheckConference() {
      wx.showModal({
        title: "修改会议室",
        content: "修改会议室将撤销已预订的会议室",
        confirmText: "修改预订",
        cancelColor: "#3399ff",
        success: (res) => {
          if (res.confirm) {
            console.log("用户点击确定");
            const url = "/pages/conferenceRoom/main?sign=" + "add";
            wx.navigateTo({ url: url });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    },
    getDelConference() {
      wx.showModal({
        title: "撤销预订",
        content: "会议室不支持重复预订，是否撤销已预订的会议室",
        confirmText: "撤销预订",
        success: (res) => {
          if (res.confirm) {
            console.log("用户点击确定");
            this.clearConferce({});
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    },
    // 会议室
    getConference() {
      console.log(this.startTime,'1231231');
      const url = "/pages/conferenceRoom/main?sign=" + "add"+'&startTime='+this.startTime;
      wx.navigateTo({ url: url });
      // this.isConference = !this.isConference;
    },
    // 附件
    getUpan() {
      const url = "/pages/uPan/main";
      wx.navigateTo({ url: url });
    },
    getDelFiles(item) {
      this.delete(item.id);
    },
    // 描述
    getDescriptionShow() {
      this.descriptionShow = !this.descriptionShow;
    },
    getFileShow() {
      this.fileShow = !this.fileShow;
    },
    // 重复
    getRepeatShow() {
      this.recurrenceType = "";
    },
    getNoticeShow() {
      this.noticeShow = !this.noticeShow;
    },
    getDelNotice() {
      this.noticeShow = !this.noticeShow;
    },
    getLocationShow() {
      this.locationShow = !this.locationShow;
    },
    // 组织人
    getOrganizer() {
      const url = "/pages/publics/organizer/main?sign=" + 0;
      wx.navigateTo({ url: url });
    },
    // 会议纪要指派人
    getDesignee() {
      const url = "/pages/publics/organizer/main?sign=" + 1;
      wx.navigateTo({ url: url });
    },
    // 邀请人
    getInvitation() {
      const url = "/pages/publics/mailList/main";
      wx.navigateTo({ url: url });
    },
    // 会议详情
    getMeetingQuery() {
      this.$httpWX
        .get({
          url: this.$api.message.queryList,
          data: {
            method: "meeting.info.get",
            SessionKey: this.sessionkey,
            id: this.MeetingId,
          },
        })
        .then((res) => {
          console.log(res);
          let detail = res.data;
          this.title = detail.name;
          this.location = detail.location;
          this.description = detail.meetingContent;
          this.startTime = detail.scheduledStart;
          this.endTime = detail.scheduledEnd;
          let date = new Date(detail.scheduledStart);
          this.month = date.getMonth() + 1 + "月";
          this.day = date.getDate() + "日";
          this.hours = `${date.getHours()}:${date.getMinutes()}`;
          this.startDay = this.getWeekDay(detail.scheduledStart);
          let endDate = new Date(detail.scheduledEnd);
          this.endMonth = endDate.getMonth() + 1 + "月";
          this.endDay = endDate.getDate() + "日";
          this.endHours = `${endDate.getHours()}:${endDate.getMinutes()}`;
          this.endWeek = this.getWeekDay(detail.scheduledEnd);
        });
    },
    // 日程详情
    getQuery() {
      this.$httpWX
        .get({
          url: this.$api.message.queryList,
          data: {
            method: "activity.event.get",
            SessionKey: this.sessionkey,
            id: this.id,
          },
        })
        .then((res) => {
          console.log(res);
          let detail = res.data;
          this.title = detail.Subject;
          this.description = detail.description;
          this.calendarType = this.calendarType;
          this.displayStatus = this.displayStatus;
          this.calendarIdx = this.calendarList.findIndex(
            (item) => item == this.calendarType
          );
          this.showIdx = this.showList.findIndex(
            (item) => item == this.displayStatus
          );
          this.checked = detail.isAllDayEvent == 'false' ? false : true;
          console.log('checked:', typeof this.checked, detail.isAllDayEvent)
          this.startTime = detail.scheduledStart;
          this.endTime = detail.scheduledEnd;
          let date = new Date(detail.scheduledStart.replace(/-/g, "/"));
          this.month = date.getMonth() + 1 + "月";
          this.day = date.getDate() + "日";
          this.hours = `${date.getHours()}:${date.getMinutes()}`;
          this.startDay = this.getWeekDay(
            detail.scheduledStart.replace(/-/g, "/")
          );
          let endDate = new Date(detail.scheduledEnd.replace(/-/g, "/"));
          this.endMonth = endDate.getMonth() + 1 + "月";
          this.endDay = endDate.getDate() + "日";
          this.endHours = `${endDate.getHours()}:${endDate.getMinutes()}`;
          this.endWeek = this.getWeekDay(
            detail.scheduledEnd.replace(/-/g, "/")
          );
          console.log(this.checked, "1111");
          setTimeout(() => {
            console.log(this.isAllDayEvent, "8888888");
          }, 1000);
          this.recurrenceType = detail.RecurrenceType2;
          this.RecurrenceType2 = detail.RecurrenceType2;
          this.index = 0;
        });
    },
    getChildFn(val, isBook) {
      this.location = val.Name;
      this.isShow = isBook;
      this.Latitude = val.Latitude;
      this.Longitude = val.Longitude;
    },
    getCancelChild(val) {
      this.isShow = val;
    },
    pickerSchedule(e) {
      this.index = e.mp.detail.value;
    },
    pickerShow(e) {
      this.showIdx = e.mp.detail.value;
      this.displayStatus = this.showList[this.showIdx];
    },
    pickerCalendar(e) {
      this.calendarIdx = e.mp.detail.value;
      this.calendarType = this.calendarList[this.calendarIdx];
    },
    changeSwitch(e) {
      this.checked = e.mp.detail;
      if (this.checked) {
        this.isAllDayEvent = 1;
        let date = new Date(this.startTime);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        let currentDate = `${y}-${m}-${d}`;
        this.startTime = `${currentDate} 00:00`;
        this.endTime = `${currentDate} 23:59`;
      } else {
        this.isAllDayEvent = 0;
        this.startTime = this.copyStartTime;
        this.endTime = this.copyEndTime;
      }
    },
    changeDescription(e) {
      this.description = e.mp.detail;
    },
    getOpenLocation() {
      this.isShow = true;
    },
    //获取时间日期
    bindMultiPickerChange(e) {
      this.multiIndex = e.target.value;
      console.log("当前选择的时间", this.multiIndex);
      const index = this.multiIndex;
      const year = this.newMultiArray[0][index[0]];
      const month = this.newMultiArray[1][index[1]];
      const day = this.newMultiArray[2][index[2]];
      const hour = this.newMultiArray[3][index[3]];
      const minute = this.newMultiArray[4][index[4]];
      this.time = year + "-" + month + "-" + day + " " + hour + ":" + minute;
      this.month = month;
      this.day = day;
      this.hours = this.RemoveChinese(hour) + ":" + this.RemoveChinese(minute);
      this.time = this.RemoveChinese(this.time);
      this.startTime = this.RemoveChinese(this.time);
      console.log(this.startTime,'123==-=-=-=-=')
      this.copyStartTime =
        year + "-" + month + "-" + day + " " + hour + ":" + minute;
      this.copyStartTime = this.RemoveChinese(this.copyStartTime);
      let startTime = year + "-" + month + "-" + day;
      startTime = this.RemoveChinese(startTime);
      this.startDay = this.getWeekDay(startTime);
      // console.log('this.time',this.time);
      let nDate = new Date(this.startTime.replace(/-/g,'/'));
      let yy = nDate.getFullYear();
      let mm = nDate.getMonth()+1;
      let dd = nDate.getDate();
      let h = nDate.getHours();
      let min = nDate.getMinutes();
      let endTime = `${yy}-${mm}-${Number(h)=='23'?dd+1:dd} ${
        Number(h)=='23'?'00':
        Number(h) + Number(1)
      }:${min}`;
      this.getCurrent(this.startTime,endTime);
    },
    endbindMultiPickerChange(e) {
      this.endmultiIndex = e.target.value;
      // console.log( "当前选择的时间", this.multiIndex );
      const index = this.endmultiIndex;
      const year = this.newMultiArray[0][index[0]];
      const month = this.newMultiArray[1][index[1]];
      const day = this.newMultiArray[2][index[2]];
      const hour = this.newMultiArray[3][index[3]];
      const minute = this.newMultiArray[4][index[4]];
      let oldTime = this.RemoveChinese(year + "-" + month + "-" + day + " " + hour + ":" + minute);
      let startStamp = new Date(this.startTime.replace(/-/g,'/')).getTime(); // 开始时间戳
      let endStamp = new Date(oldTime.replace(/-/g,'/')).getTime(); // 结束时间戳
      if(endStamp<startStamp){
        wx.showToast({
          title:'请选择大于开始时间',
          icon:'none',
          duration:2000
        })
        return false;
      }
      this.endTime = year + "-" + month + "-" + day + " " + hour + ":" + minute;
      this.endMonth = month;
      this.endDay = day;
      this.endHours =
        this.RemoveChinese(hour) + ":" + this.RemoveChinese(minute);
      this.endTime = this.RemoveChinese(this.endTime);
      this.copyEndTime =
        year + "-" + month + "-" + day + " " + hour + ":" + minute;
      this.copyEndTime = this.RemoveChinese(this.copyEndTime);
      let endTime = year + "-" + month + "-" + day;
      endTime = this.RemoveChinese(endTime);
      this.endWeek = this.getWeekDay(endTime);
      // console.log(this.endTime,this.time);
    },
    RemoveChinese(strValue) {
      if (strValue != null && strValue != "") {
        var reg = /[\u4e00-\u9fa5]/g;
        return strValue.replace(reg, "");
      } else return "";
    },
    getWeekDay(date) {
      var dt = new Date(date).getDay();
      //     var dt = new Date(date.split("-")[0], date.split("-")[1]-1,date = date.split("-")[2]);
      var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      return weekDay[dt];
    },
    getRepeat() {
      this.repeatShow = true;
    },
    // 添加附件
    // selectListName
    getAddFile(id) {
      this.$httpWX
        .get({
          url: this.$api.message.queryList,
          data: {
            method: this.$api.usb.addFile,
            SessionKey: this.sessionkey,
            FileIds: this.FileIds.join(","),
            ObjectTypeCode: 5000,
            ObjectId: id,
          },
        })
        .then((res) => {
          console.log(res);
          wx.navigateBack({
            delta: 1,
          });
        });
    },
    getBack() {
      wx.navigateBack({
        delta: 1,
      });
    },
    getSubmit() {
      if (this.index == 0) {
        this.$httpWX
          .get({
            url: this.$api.message.queryList,
            data: {
              method: "activity.event.create",
              SessionKey: this.sessionkey,
              id: this.id,
              subject: this.title,
              ScheduledStart: this.startTime,
              ScheduledEnd: this.endTime,
              isAllDayEvent: this.isAllDayEvent,
              Location: this.location,
              description: this.description,
              calendarType: this.calendarType,
              displayStatus: this.displayStatus,
              reminderTime: 15,
              invtee: this.filterList.join(),
              recurrenceType: this.recurrenceType,
            },
          })
          .then((res) => {
            const id = res.data.scheduleId;
            // if(res.status==1)
            // wx.showToast({
            //     title:res.msg,
            //     duration:3000,
            //     icon:'success',
            //     success:res=>{
            //         setTimeout(()=>{
            //             if(this.FileIds!=""){
            //                 this.getAddFile(id);
            //             }else {
            //                 wx.navigateBack({
            //                     delta: 1
            //                 })
            //             }
            //         },1000)
            //     }
            // })
            // else
            // wx.showToast({
            //     title:res.msg,
            //     duration:3000,
            //     icon:'success'
            // })
            let that = this;
            message.toast( {
              title:res.msg,
              delta: 1,
              success() {
                //这里是回调
                if(that.FileIds!=""){
                    that.getAddFile(id);
                }else {
                  setTimeout(() => {
                    wx.navigateBack({
                      detail:1
                    })
                  }, 500);
                }
              },
            });
          });
      } else {
        // 新建会议
        this.getAddMetting();
      }
    },
    getAddMetting() {
      let url = "meeting.info.add";
      let id = "";
      if (this.MeetingId) {
        url = "meeting.info.update";
        id = this.MeetingId;
      } else {
        url = "meeting.info.add";
        id = "";
      }
      if(this.location!='' || this.conference.id!=''){
        this.createMettingSubmig(url,id);
      }else if(this.location==''&&this.conference.id=='') {
        wx.showToast({
          title: '请选择会议室或地址',
          icon: 'none',
          duration:2000
        })
        return false;
      }
    },
    createMettingSubmig(url,id){
      this.$httpWX.get({
            url: this.$api.message.queryList,
            data: {
              method: url,
              SessionKey: this.sessionkey,
              name: this.title,
              ScheduledStart: this.startTime,
              ScheduledEnd: this.endTime,
              isAllDayEvent: this.isAllDayEvent,
              Location: this.location,
              description: this.description,
              calendarType: this.calendarType,
              displayStatus: this.displayStatus,
              reminderTime: 15,
              invtee: this.filterList.join(),
              id: id,
              owningUser: this.organizer.id,
              // meetingMgrId:this.designee.id,
              RoomId: this.conference.id || '',
            },
          }).then((res) => {
            const id = res.data[0].ValueId;
            var that = this;
            if(res.status==1){
              message.toast( {
                  title:'创建成功',
                  delta: 1,
                  success() {
                    //这里是回调
                        if(that.FileIds!=""){
                            that.getAddFile(id);
                        }else {
                          setTimeout(()=>{
                            wx.navigateBack({
                              detail:1
                            })
                          },500)
                        }
                  },
              });
            }
        });
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../../../static/css/schedule.css";
.wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .placeholder {
    color: #cccccc;
  }
  .header {
    display: flex;
    justify-content: space-between;
    background: #fff;
    padding: 32rpx 33rpx;
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 99999;
    .cancel {
      font-size: 34rpx;
      color: #999999;
    }
    .submit {
      font-size: 34rpx;
      color: #3399ff;
    }
  }
  .boxWrap {
    display: flex;
    padding: 33rpx;
    background: #fff;
    margin-top: 135rpx;
    .icon {
      margin-top: 10rpx;
    }
    .cont {
      flex: 1;
      width: 100%;
      margin-left: 20rpx;
      textarea {
        width: 100%;
        height: 100rpx;
      }
    }
  }
  .center {
    padding-bottom: 100px;
    .contacts {
      margin-top: 24rpx;
      .row {
        display: flex;
        align-items: center;
        padding: 33rpx;
        background: #fff;
        .r {
          flex: 1;
          margin-left: 25rpx;
          display: flex;
          p {
            display: flex;
            align-items: center;
            margin-right: 20rpx;
            .avatar {
              display: inline-block;
              width: 50rpx;
              height: 50rpx;
              line-height: 50rpx;
              text-align: center;
              color: #fff;
              font-size: 20rpx;
              background: #3399ff;
              border-radius: 50%;
            }
            .name {
              font-size: 34rpx;
              color: #333333;
              margin: 0 10rpx;
            }
            .tag {
              display: inline-block;
              width: 68rpx;
              height: 32rpx;
              line-height: 32rpx;
              text-align: center;
              font-size: 20rpx;
              color: #3399ff;
              background: #e8f1fc;
              border-radius: 5rpx;
            }
          }
        }
        .cont {
          flex: 1;
          margin-left: 25rpx;
          font-size: 34rpx;
          color: #333333;
        }
      }
    }
    .row {
      display: flex;
      padding: 33rpx;
      background: #fff;
      margin-top: 24rpx;
      align-items: center;
      i {
        color: #666666;
      }
      .icon {
        span {
          width: 20rpx;
          height: 20rpx;
          line-height: 20rpx;
          text-align: center;
          background: #52b55e;
          display: inline-block;
          border-radius: 50%;
        }
      }
      .cont {
        flex: 1;
        margin-left: 20rpx;
        font-size: 34rpx;
        color: #333333;
      }
      .btn {
        p {
          span {
            display: inline-block;
            width: 124rpx;
            height: 58rpx;
            line-height: 58rpx;
            text-align: center;
            font-size: 28rpx;
            color: #fff;
            background: #3399ff;
            border: 1rpx solid #3399ff;
          }
          .l {
            border-top-left-radius: 5rpx;
            border-bottom-left-radius: 5rpx;
            border-right: none;
          }
          .r {
            border-top-right-radius: 5rpx;
            border-bottom-right-radius: 5rpx;
            background: #fff;
            color: #3399ff;
            border-left: none;
            margin-right: 20rpx;
          }
        }
      }
    }
    .timeWrap {
      display: flex;
      padding: 10rpx 33rpx;
      background: #fff;
      border-top: 1rpx solid #e2e3e5;
      // justify-content: space-around;
      input {
        text-align: center;
        margin-top: 20rpx;
      }
      .picker {
        width: 45%;
      }
      .box {
        font-size: 30rpx;
        color: #333333;
        // width: 45%;
        // height: 92rpx;
        text-align: left;
        p:nth-child(2) {
          margin-top: 10rpx;
        }
      }
      .rBox {
        margin-left: 20rpx;
      }
      .imgBox {
        width: 14rpx;
        height: 92rpx;
        img {
          width: 100%;
          height: 100%;
          vertical-align: middle;
        }
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
    .iconRow {
      display: flex;
      padding: 10rpx 20rpx;
      background: #fff;
      margin-top: 35rpx;
      align-items: center;
      justify-content: space-around;
      .box {
        // width: 25%;
        text-align: center;
        .name {
          font-size: 19rpx;
          color: #666666;
        }
      }
    }
  }
  .footer {
    width: 100%;
    position: fixed;
    bottom: 20rpx;
    z-index: 999;
    background: #fff;
    .btnWrap {
      padding: 26rpx 24rpx;
    }
  }
}
</style>