const v = '/rest';
const api = {
    pathUrl: "https://oawx.hnca.org.cn",
    photo: {
        url: "https://oawx.hnca.org.cn/img/wechat/"
    },
    message: {
        queryList: v
    },
    // 消息
    msg: {
        update: "messageitem.click.update",
        query: "message.statics.getlist"
    },
    // 登陆
    login: {
        login: '/wxmi/UserLogin.aspx'
    },
    // 邮件
    email: {
        qtyGet: "email.mailbox.qty.get",
        thoroughDel: "email.delete", // 邮件 – 彻底删除
        folderQuery: "email.folder.my", // 获取文件
        addFolder: "email.folder.add", // 新建文件
        emailMove: "email.folder.move", // 移动到文件夹
        send: "email.componse.send", // 发邮件
        addusbfile: "email.attachfiles.addusbfile", // 写邮件 – 选择来自优盘的文件作为附件
        addStar: "email.star.add",
        // delete:"email.delete", // 邮件 – 彻底删除
        clear: "email.clear", // 邮件 –已删除清空(回收箱一键清空)
        respond: "email.respond.get",
        readMark: "email.read.mark", // 标为已读未读邮件多选接口
        starMark: "email.star.mark", // 添加星标
        basicinfoSearch: "email.basicinfo.search",
        starList: "email.star.getlist",
        mailboxDel: "email.mailbox.delete",
        upload: "email.attachfiles.upload",
        contactSearch: "email.contact.search",
        contentbody: "email.contentbody.get",
        attachfilesList: "email.attachfiles.getlist", // 附件列表
        setread: "email.info.setread", // 标记已读、未读
        infoGet: "email.info.get"

    },
    // 通讯录
    mailList: {
        queryAll: "oa.addresslist.user.search", // 查询所有联系人
        delUser: "sys.group.removeuser", // 小组删除人员
        addUser: "sys.group.adduser"    // 小组添加人员
    },
    // 会议
    // meeting:{
    //     peoples:"meeting.peoples.getlist", // 获取会议参会人员列表
    // },
    // 优盘
    usb: {
        filesQuery: "file.files.search",
        batchDelete: "file.batch.delete",
        upload: "file.upload.create",
        directoryDel: "file.directory.delete",
        fileDel: "file.delete",
        directoryfileMove: "file.directoryfile.move",
        latest: "file.latest.getlist",
        rename: "file.fileinfo.rename",
        directoryCreate: "file.directory.create",
        fileAdmin: "file.folderright.add", // 文件权限
        addFile: "file.attachfiles.addusbfile", // 选择优盘文件
        access: "folder.share.access", // 权限列表
        remove: "file.folderright.remove", // 文件权限删除
        adminDel: "folder.share.delete", // 文件权限批量删除
        stat: "folder.share.stat", // 文件权限数量
        latelyClear: "file.latestuse.clear", // 最近使用-单个清除记录
        addresslist: "oa.addresslist.latest.getlist",
        fileCopy: "file.copy"
    },
    // 工作
    work: {
        uploadFile: "app.banner.upload",
        banner: "app.banner.get",
        latelyModule: "app.recentmodule.getlist",
        upLatelyModule: "app.module.userecord",
        modulesList: "app.modules.getlist",
        banners: "app.banners.getlist"
    },
    // 上传
    upload: {
        url: "https://oawx.hnca.org.cn/rest"
    },
    // 会议
    meeting: {
        query: "meetings.recs.search",
        addPeople: "meeting.peoples.invite",
        qrCode: "wxmi.acode.qrcode.create", // 获取二维码
        signIn: "meeting.audience.checkin", // 会议签到
        detail: "meeting.info.get", // 会议详情
        peoples: "meeting.peoples.getlist", // 获取会议参会人员列表
        tagSign: "meeting.audience.checkin.edit", // 标记签到
        taskList: "project.task.search", // 任务
        taskcreate: "project.task.edit" // 添加任务
    },
    // 会议室
    conference: {
        del: "entity.info.delete",
        create: "meetingroom.create",
        queryList: "resource.room.getlist"
    },
    // 日程
    schedule: {
        addMailList: "meeting.info.add"
    },
    // 公共
    public: {
        url: "https://oawx.hnca.org.cn",
        getFile: "file.attachfiles.getlist", // 获取附件
        delete: "entity.info.delete",
        edit: "entity.save", // 修改
        leaveQuery:"stringmap.getlist"
    },
    my: {
        Avatar: "sys.user.uploadavatar",
        editMobile: "sys.user.updatemobile.valid", // 修改手机号
        getAvatar: "sys.user.avatar.app.get",
        isset: "sys.user.avatar.app.isset", // 判断是否已设置头像
        default: "sys.user.avatar.app.default"
    },
    clockIn: {
        photoSave: "hr.attendsettings.save",
        seniorSetting: "hr.attendsettings.save",
        peoplesList: "hr.attendrpt.month.userlist", // 考勤日统计 – 打卡/未打卡/迟到/外勤 人员明细
        querySetting: "hr.attendsettings.get", // 获取考勤设置
        privilege: "sys.privilege.get"
    },
    // 待办事务
    instance: {
        urging: "flow.instance.pushmessage", // 催办
        cancelsubmit: "flow.process.cancelsubmit",
        forward: "process.approve.forward", // 流程审批 – 委托
        addparticipator: "process.approve.addparticipator", // 加签
        steptree: "process.steptree.get",
        jump: "process.approve.jump", // 跳转
        entrust: "process.approve.entrust", // 委托
        steppri: "process.steppri.get", // 权限
        redo: "process.rulelog.rehandle" // 重办
    },
    // 审批
    approval: {
        layout: "mobileform.layout.get",
        layoutData: "mobileform.layout.render",
        mobileform: "process.mobileform.get", // 获取表单 – 根据流程获取表单
        lookup: "entity.lookup",
        renderData: "mobileform.layout.render",
        upload: "flow.files.upload",
        saverecord: "process.form.saverecord", // 保存 表单数据
        stepList: "process.step.transition.getlist", // 流程表单 – 根据流程步骤获取流程节点
        accept: "process.approve.accept",
        stepSubmit: "process.step.submit", // 提交流程 
        // refuse: "process.approve.reject", // 审批拒绝
        refuse: "process.approve.reject.tolast", // 退回到上一步
        tostarter: "process.approve.reject.tostarter", // 退回到发起人
        tostep: "process.approve.reject.toactivity", // 退回到指定节点
        create: "process.instance.create", // 创建流程实例 – 不带表单数据
        finish: "process.approve.finish", // 流程审批 – 结束
        delete: "process.instance.draftdeleteid" // 删除草稿审批单
    },
    // 投票
    vote: {
        create: "poll.update",
        upload: "poll.optionimage.upload",
        query: "poll.search",
        response: "poll.response", // 投票提交
        delete: "poll.delete",
        peopleList: "poll.people.getlist",
        getpoll: "poll.get",
        invite: "poll.people.invite", // 邀请投票人员
        queryPeople:"poll.people.getlist", // 获取投票人员
    },
    // 问卷
    survey: {
        query: "survey.search",
        getSurvey: "survey.get",
        submit: "survey.response.submit",
        surveyPeople:"survey.audience.search"
    },
    // 工作通知
    notice: {
        query: "notification.user.search"
    },
    // 社区
    community: {
        send: "chatter.status.update",
        query: "chatter.status.search",
        like: "object.comment.like",
        queryComment: "chatter.commentme.getlist",
        comment: "object.comment.add",
        del: "chatter.status.destroy",
        detail:"chatter.status.get"
    },
    hr:{
        payList: "salary.pay.app.paylist",
        payempdetail :"salary.pay.app.payempdetail",
        holidayaccount:"attendance.holidayaccount.personal.getlist", //  获取当前用户所有假期账户列表
    },
    // 日志
    journal:{
        send: "worklog.reportcontent.send",
        query: "worklog.reports.search", //获取当前用户的所有日志
        detail: "worklog.reportcontent.get",
        del:"worklog.report.delete",
        favor:"worklog.click.favors", //收藏
        likeQuery:"object.likes.getlist"
    },
    sign:{
        checkin:"hr.attend.out.checkin",
        attendcheck:"hr.attendcheck.gettimes",// 获取签到次数
        getdaily:"hr.attenddetail.getdaily" //查询一天的打卡记录
    },
    // 排班
    scheduling:{
        query:"workshift.monthowner.getlist",
        calendar:"calendar.holiday.getlist",
        // departQuery:"workshift.dept.employee.search",
        departQuery:"workshift.dept.employee.week.search",
        set_shift: "workshift.employee.day.set",
        del_shift: "workshift.employee.month.delete",
        shiftQuery: 'workshift.owner.getlist',
        shiftList: 'workshift.search',
        pickerList: 'layout.picklistvalues.get',
        add_shift: 'entity.saverecord', // 添加班次
        add_employee:"attendance.employee.month.transferdept", // 新增人员
        sort: "attendance.deptorgroup.employee.sort", // 排序
        del_employee:"attendance.employee.month.transferout", // 删除人员
    },
    // 人力资源
    human:{
        employeeRoster: 'entity.grid.search', // 人员花名册
        formList:'entity.config.get',
        saverecord:'entity.saverecord',
        detail: 'entity.detail.get'
    },
    // 新闻
    journalism:{
        unread: 'content.unread.search', // 新闻未读
        newQuery: 'content.search',
        recommend: 'content.recommend.search', // 推荐
    },
    // 任务
    task: {
        list: "IssueListQuery",
        formLayout: "GlobalIssueCreateModalLoad",
        create: "entity.saverecord",
        detail: "IssueDataGet",
        project: "LookupProjects", // 项目
        // users: "entity.lookup", // 用户
        users: "ProjectMemberLoad",
        sendComment: "entity.saverecord", // 评论
        commentList: "project.comment.getlist", // 评论列表
        delete: "entity.delete",
        upload: "file.attachment.upload", // 上传文件
        deleteFile: "file.attachment.delete",
        projectAll: "project.mine.search",
        childrenTask: "BusinessListViewItems", // 子任务列表
        calendarTask: "BusinessCalendarViewPaginatedItems", // 日历列表
        panelList: "BusinessBoardViewItems", // 面板列表
    }
}
export default api;