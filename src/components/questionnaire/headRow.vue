<template>
  <div class="header">
    <div class="row">
      <p class="Avatar">{{detail.CreatedByName}}</p>
      <div class="rBox">
        <p class="name">{{detail.CreatedByName}}</p>
        <p class="info">{{detail.DeptName || ''}} {{detail.CreatedOn}}</p>
      </div>
    </div>
    <h3>{{detail.Name}}</h3>
    <div class="text_row">
      <p>
        <i class="iconfont icon-shijian-copy"></i>
        <span>{{detail.EndDate}} 截止</span>
      </p>
      <p @click="getInvitees">
        <i class="iconfont icon-canyuren"></i>
        <span>
          {{detail.NumOfResponses}}人参与
        </span>
      </p>
    </div>
  </div>
</template>
<script>
export default {
    name:'HeadRow',
    props:['info'],
    data(){
        return {
          detail:{}
        }
    },
    watch:{
      info(newVal,oldVal){
        // console.log(newVal,oldVal,'21323132');
        this.detail = JSON.parse(newVal);
      }
    }
}
</script>
<style lang="scss">
  .header {
    padding: 26rpx 33rpx;
    .row {
      display: flex;
      align-items: center;
      .Avatar {
        width: 75rpx;
        height: 75rpx;
        line-height: 75rpx;
        text-align: center;
        border-radius: 50%;
        background: #3399ff;
        font-size: 21rpx;
        color: #fff;
      }
      .rBox {
        flex: 1;
        margin-left: 24rpx;
        .name {
          font-size: 28rpx;
          color: #333333;
        }
        .info {
          font-size: 22rpx;
          color: #999999;
        }
      }
    }
    h3 {
      font-size: 33rpx;
      color: #3399ff;
      font-weight: bold;
      padding: 28rpx 0;
    }
    .text_row {
      font-size: 24rpx;
      color: #999999;
      display: flex;
      justify-content: space-between;
      p {
        display: flex;
        align-items: center;
        i {
          color: #a4a4a4;
        }
        span {
          margin-left: 10rpx;
        }
      }
    }
    .title {
      font-size: 28rpx;
      color: #666666;
      padding: 15rpx 0;
    }
    .radio_wrap {
      .radio {
        background: #fff;
        margin: 17rpx 0;
        padding: 35rpx 20rpx;
        border-radius: 9rpx;
        font-size: 33rpx;
        color: #333333;
      }
    }
    .checkbox_wrap {
      .check {
        background: #fff;
        margin: 17rpx 0;
        border-radius: 9rpx;
        display: flex;
        align-items: center;
        padding: 26rpx 20rpx;
        .row {
          display: flex;
          align-items: center;
          .radius {
            width: 104rpx;
            height: 104rpx;
            border: 1rpx solid #ebedec;
            margin: 0 21rpx;
          }
          div:nth-child(3) {
            .name {
              font-size: 31rpx;
              color: #333333;
            }
            .deparment {
              font-size: 28rpx;
              color: #999999;
            }
          }
        }
      }
    }
    .progress_wrap {
      .row {
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: 9rpx;
        padding: 30rpx 20rpx;
        margin-top: 17rpx;
        .num {
          font-size: 31rpx;
          color: #333333;
        }
        .rBox {
          flex: 1;
          margin-left: 24rpx;
          .descript {
            font-size: 31rpx;
            color: #333333;
            display: flex;
            align-items: center;
            .img {
              width: 104rpx;
              height: 104rpx;
              border: 1rpx solid #ebedec;
              img {
                width: 100%;
                height: 100%;
                vertical-align: middle;
              }
            }
            .text_r {
              margin-left: 21rpx;
              p:nth-child(1) {
                font-size: 31rpx;
                color: #333333;
              }
              p:nth-child(2) {
                color: #999999;
                font-size: 31rpx;
              }
            }
          }
          .r {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .progress {
              width: 331rpx;
              height: 21rpx;
              background: #e5e5e5;
              margin-top: 27rpx;
              span {
                display: block;
                width: 30rpx;
                height: 100%;
                background: #ff6666;
              }
            }
            .num {
              height: 21rpx;
              font-size: 25rpx;
              color: #999999;
              span:nth-child(1) {
                margin-right: 28rpx;
              }
            }
          }
        }
      }
    }
  }
</style>