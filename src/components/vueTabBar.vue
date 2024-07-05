<template>
  <section class="tabBar-wrap">
    <article class="tabBar-box" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
      <ul class="tabBar-nav" v-if="navList.length > 0">
        <li class="item" v-for="(item, index) in navList"
            @click="selectNavItem(index,item.pagePath)"
            :key="index">
          <p class="item-images">
            <img :src="selectNavIndex === index ? item.selectedIconPath : item.iconPath" alt="iconPath">
            <span :class="{'active':messageTotal>=10}" v-if="index==0&&messageTotal>0">{{messageTotal>=99?'99+':messageTotal}}</span>
          </p>
          <p :class="selectNavIndex === index ? 'item-text item-text-active' : 'item-text' ">
            {{item.text}}
          </p>
        </li>
        <li v-if="needButton" style="flex: 3">
          <div class="submit-box">
            <button :disabled="!handButton"
                    @click="bindNavigateTo('../order/main')"
                    :class="handButton ? 'submit-box-btn submit-box-btn-active' : 'submit-box-btn' ">
              {{ btnText }}
            </button>
          </div>
        </li>
      </ul>
    </article>
  </section>
</template>
<script>
import { mapState } from 'vuex';
//   import store from '../vuex/index'

  export default {
    props: ['selectNavIndex', 'needButton', 'handButton', 'btnText'],
    data() {
      return {
        navList: [
          {
            pagePath: "../messages/main",
            iconPath: "/static/tabs/02.Messages.png",
            selectedIconPath: "/static/tabs/02.Messages_1.png",
            text: "消息"
          },
          {
            pagePath: "../schedule/main",
            iconPath: "/static/tabs/02.Programme.png",
            selectedIconPath: "/static/tabs/02.Programme_1.png",
            text: "日程"
          },
          {
            pagePath: "../work/main",
            iconPath: "/static/tabs/02.Work.png",
            selectedIconPath: "/static/tabs/02.Work_1.png",
            text: "工作台"
          },
          {
            pagePath: "../homeMailList/main",
            iconPath: "/static/tabs/02.Address.png",
            selectedIconPath: "/static/tabs/02.Address_1.png",
            text: "通讯录"
          },
          {
            pagePath: "../my/main",
            iconPath: "/static/tabs/02.Personal-center.png",
            selectedIconPath: "/static/tabs/02.Personal-center_1.png",
            text: "我的"
          }
        ],
      }
    },
    created() {
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        ...mapState({
          messageTotal:state=>{
            return state.publics.messageTotal;
          }
        })
    },
    methods: {
      /**
       * 点击导航栏
       * @param index
       */
      selectNavItem(index, pagePath) {
          console.log(index,pagePath,'000');
        console.log(this.selectNavIndex)

        if (index === this.selectNavIndex) {
          return false;
        }


        if (index == 0 && this.selectNavIndex == -1) {
          this.$emit("fetch-index");
        }
        this.bindViewTap(pagePath);
      },

      /**
       * 路由跳转
       */
      bindNavigateTo(url) {
        wx.navigateTo({
          url
        })
      },

      /**
       * tabBar路由跳转
       */
      bindViewTap(url) {
        // 回到顶部
        if (url === '../index/main') {
          store.commit('setGroupsID', '');
        }
        wx.switchTab({
          url,
        })
      },
    }
  }
</script>
<style lang="less" scoped>
  .tabBar-box {
    position: fixed;
    bottom: 0;
    width: 100%;
    // height: 80px;
    padding: 17rpx 0;
    border-top: 1px solid #eee;
    background-color: #fff;
  }

  .tabBar-nav {
    width: 100%;
    display: flex;

    .item {
      flex: 1;
      text-align: center;
    }
    .item-text {
      color: #666;
      font-size: 20rpx;
      transition: .24s linear;
    }
    .item-text-active {
      color: #3399ff;
    }

    .item-images {
      width: 43rpx;
      height: 43rpx;
      margin: 0 auto;
      text-align: center;
      transition: .24s linear;
      margin-bottom: 10rpx;
      position: relative;

      & img {
        display: inline;
        width: 100%;
        height: 100%;
      }
      & span{
        position: absolute;
        top: -10rpx;
        left: 32rpx;
        display: inline-block;
        width: 32rpx;
        height: 32rpx;
        text-align: center;
        line-height: 32rpx;
        font-size: 17rpx;
        background: #ff6666;
        color: #fff;
        border-radius: 50%;
      }
      & span.active{
        width: 58rpx;
        border-radius: 16rpx;
      }
    }
  }

  .submit-box-btn {
    position: relative;
    z-index: 999;
    width: 85%;
    height: 90px;
    line-height: 90px;
    border-radius: 10px;
    color: #404040;
    font-size: 36px;
    border: none;
    background-color: #eee;
    text-align: center;
    border: 1px solid #eee;
  }

  .submit-box-btn-active {
    color: #fff;
    border: none;
    border: 1px solid #ff6c00;
    background-color: #ff6c00;
  }

  button {
    border: none;
    outline: none;
  }
</style>