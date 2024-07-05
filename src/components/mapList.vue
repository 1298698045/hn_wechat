<template>
  <div class="wrap">
        <van-search :value="keyWord" placeholder="请输入搜索关键词" @change="bindInputSchool" />
        <view style="display:flex; justify-content:center;" >
            <map id="myMap" style="width: 100%; height: 600rpx;"
            :longitude="longitude"
            :latitude="latitude"
            :show-location="true"
            scale="15" :markers="markers" ></map>
        </view>
        <div class="contents">
            <div class="row" v-for="(item,index) in pois" :key="index" @click="getSelectLocation(item,index)">
                <div class="lBox">
                    <p class="name">{{item.title}}</p>
                    <p class="adress">{{item.address}}</p>
                </div>
                <div class="rBox" v-if="num==index">
                    <p><i-icon type="right" color="#3399ff" size="20" /></p>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="boxchild">
                <van-button custom-class="btn black" color="#f3f3f3" type="default" @click="getClose">取消</van-button>
                <van-button custom-class="btn" color="#3399ff" type="info" @click="getDetermine">确定</van-button>
            </div>
        </div>
  </div>
</template>
<script>
import QQMapWX from "../utils/qqmap-wx-jssdk";
var timer = false;
const qqmapsdk = new QQMapWX({
  key: "UVRBZ-UN2WU-KMJV6-2DAPJ-JW5QE-C5BYC" // 必填
});
export default {
  name:"mapList",  
  data() {
    return {
      keyWord:"",
      latitude: "",
      longitude: "",
      pois: [],
      page: 1,
      num:-1,
      markers:[{
            iconPath: "/resources/others.png",
            id: 0,
            latitude: 23.099994,
            longitude: 113.324520,
            width: 50,
            height: 50
      }],
      params:{
          Name:"",
          Location:"",
          Longitude:"",
          Latitude:""
      }
    };
  },
  
  onLoad() {
      this.mapCtx = wx.createMapContext('myMap')
      this.getUserLocation();
  },
  methods: {
      getSelectLocation(item,index){
          console.log(item);
          this.params.Name = item.title;
          this.params.Location = item.address;
          this.params.Latitude = item.location.lat;
          this.params.Longitude = item.location.lng;
          this.num = index;
      },
      getClose(){
          this.$emit('cancel',false)
      },
      getDetermine(){
          this.$emit('childFn',this.params,false);
      },
    getUserLocation() {
      let vm = this;
      wx.getSetting({
        success: res => {
          console.log(JSON.stringify(res));
          // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
          // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
          // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
          if (
            res.authSetting["scope.userLocation"] != undefined &&
            res.authSetting["scope.userLocation"] != true
          ) {
            wx.showModal({
              title: "请求授权当前位置",
              content: "需要获取您的地理位置，请确认授权",
              success: function(res) {
                if (res.cancel) {
                  wx.showToast({
                    title: "拒绝授权",
                    icon: "none",
                    duration: 1000
                  });
                //   vm.BackTap2();
                } else if (res.confirm) {
                  wx.openSetting({
                    success: function(dataAu) {
                      if (dataAu.authSetting["scope.userLocation"] == true) {
                        wx.showToast({
                          title: "授权成功",
                          icon: "success",
                          duration: 1000
                        });
                        //再次授权，调用wx.getLocation的API
                        vm.getLocation();
                      } else {
                        wx.showToast({
                          title: "授权失败",
                          icon: "none",
                          duration: 1000
                        });
                        // vm.BackTap2();
                      }
                    }
                  });
                }
              }
            });
          } else if (res.authSetting["scope.userLocation"] == undefined) {
            //调用wx.getLocation的API
            vm.getLocation();
          } else {
            //调用wx.getLocation的API
            vm.getLocation();
          }
        }
      });
    },
    // 微信获得经纬度
    getLocation: function() {
      let vm = this;
      wx.getLocation({
        type: "gcj02",
        success: function(res) {
          console.log(JSON.stringify(res), "获得经纬度");
          var latitude = res.latitude;
          var longitude = res.longitude;
          vm.latitude = latitude;
          vm.longitude = longitude;
          console.log(vm.latitude,vm.longitude)
        //   debugger
          vm.getLocal(latitude, longitude);
        },
        fail: function(res) {
        //   vm.BackTap2();
        }
      });
    },
    // 获取当前地理位置
    getLocal: function(latitude, longitude) {
      let vm = this;
      wx.showLoading({
        title: "加载中"
      });
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        coord_type: 1,
        get_poi: 1,
        poi_options: "page_size=20;page_index=" + vm.page,
        success: function(res) {
          console.log(res, "地理位置");
          wx.hideLoading();
          let pois = res.result.pois;
          vm.pois = vm.pois.concat(pois);
          console.log(vm.pois,'vm.pois');
        },
        fail: function(res) {
          console.log(res);
        },
        complete: function(res) {
          // console.log(res);
        }
      });
    },
    //根据坐标查询位置
    bindInputSchool(e) {
      var val = e.mp.detail;
      let vm = this;
      clearTimeout(timer);
      timer = setTimeout(function() {
        if (val.length > 0) {
          qqmapsdk.search({
            keyword: val, //搜索关键词
            location: {
              latitude: vm.latitude,
              longitude: vm.longitude
            },
            page_size: 20,
            success: function(res) {
              console.log(res, "搜索位置");
              let pois = res.data;
              vm.pois = pois;
            }
          });
        } else {
            vm.pois = [];
          vm.getLocal(vm.latitude, vm.longitude);
        }
      }, 500);
    }
  }
};
</script>
<style lang="scss" scpoed>
    .wrap{
        .contents{
            padding-bottom: 80px;
            .row{
                padding: 26rpx 33rpx;
                border-bottom: 1rpx solid #ebedec;
                background: #fff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .lBox{
                    .name{
                        font-size: 24rpx;
                        color: #333333;
                    }
                    .adress{
                        font-size: 19rpx;
                        color: #999999;
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            .boxchild{
                display: flex;
                justify-content: space-around;
                padding: 20rpx 0;
                .black{
                    color: #333333!important;
                }
                .btn{
                    width: 328rpx;
                }
            }
        }
    }
</style>