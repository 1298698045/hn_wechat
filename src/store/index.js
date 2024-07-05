import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import user from './module/user';
import email from './module/email';
import loginUser from './module/loginUser';
import mailList from './module/mailList';
import usb from './module/usb';
import publics from './module/public';
export default new Vuex.Store({
  modules: {
    user,
    email,
    loginUser,
    mailList,
    usb,
    publics
  }
})
