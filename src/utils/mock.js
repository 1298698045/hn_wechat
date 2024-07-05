// export const mockData = [{"label":"姓名","type":"S","id":"FullName","category":"CustomField","name":"FullName","displayCategory":"Field","require":true,"helpText":"请输入姓名"},{"label":"工号","type":"S","id":"EmployeeNo","category":"CustomField","name":"EmployeeNo","displayCategory":"Field","helpText":"请输入工号"},{"label":"部门","type":"O","id":"DeptId","category":"CustomField","name":"DeptId","displayCategory":"Field","helpText":"请输入部门","sObjectType":10},{"label":"人员类别","type":"L","id":"EmpCategoryCode","category":"CustomField","name":"EmpCategoryCode","displayCategory":"Field","helpText":"请输入人员类别"},{"label":"岗位设置日期","type":"D","id":"SalaryPostStart","category":"CustomField","name":"SalaryPostStart","displayCategory":"Field","helpText":"请输入岗位设置日期"},{"label":"岗位类别","type":"L","id":"PostCategoryCode","category":"CustomField","name":"PostCategoryCode","displayCategory":"Field","helpText":"请输入岗位类别","sObjectType":0},{"label":"薪级别","type":"L","id":"SalaryLevel","category":"CustomField","name":"SalaryLevel","displayCategory":"Field","helpText":"请输入薪级别","sObjectType":0},{"label":"部门变动","type":"RelatedList","id":"RL__HREmployeeJobTransferList","category":"StandardRelatedList","name":"RL__HREmployeeJobTransferList","displayCategory":"RelatedList","fields":[{"label":"调动类型","type":"DT","id":"TransferTypeCode","category":"CustomField","alwaysDisplayed":false,"alwaysNotRequired":false,"displayCategory":"Field","name":"TransferTypeCode","helpText":"请输入调动类型"},{"label":"调出部门","type":"O","id":"FromDept","category":"CustomField","alwaysDisplayed":false,"alwaysNotRequired":false,"displayCategory":"Field","name":"FromDept","helpText":"请输入调出部门","sObjectType":10},{"label":"调出日期","type":"D","id":"OutDate","category":"CustomField","alwaysDisplayed":false,"alwaysNotRequired":false,"displayCategory":"Field","name":"OutDate","helpText":"请输入调出日期"},{"label":"分管院长意见","type":"UC","id":"ApproveOfIncharge","category":"CustomField","alwaysDisplayed":false,"alwaysNotRequired":false,"displayCategory":"Field","name":"ApproveOfIncharge","helpText":"院长意见"}]}]
export const mockData = [{
        "label": "姓名",
        "type": "S",
        "id": "FullName",
        "category": "CustomField",
        "name": "FullName",
        "displayCategory": "Field",
        "require": true,
        "helpText": "请输入姓名"
    },
    {
        "label": "年份",
        "type": "Year",
        "id": "YearNumber",
        "category": "CustomField",
        "name": "YearNumber",
        "displayCategory": "Field",
        "require": true,
        "helpText": "请输入年份"
    },
    {
        "label": "年月",
        "type": "Month",
        "id": "MonthNumber",
        "category": "CustomField",
        "name": "MonthNumber",
        "displayCategory": "Field",
        "require": true,
        "helpText": "请输入年月"
    },
    {
        "label": "工号",
        "type": "S",
        "id": "EmployeeNo",
        "category": "CustomField",
        "name": "EmployeeNo",
        "displayCategory": "Field",
        "helpText": "请输入工号"
    },
    {
        "label": "部门",
        "type": "O",
        "id": "DeptId",
        "category": "CustomField",
        "name": "DeptId",
        "displayCategory": "Field",
        "helpText": "请输入部门",
        "sObjectType": 10
    },
    {
        "label": "人员类别",
        "type": "L",
        "id": "EmpCategoryCode",
        "category": "CustomField",
        "name": "EmpCategoryCode",
        "displayCategory": "Field",
        "helpText": "请输入人员类别"
    },
    {
        "label": "岗位设置日期",
        "type": "D",
        "id": "SalaryPostStart",
        "category": "CustomField",
        "name": "SalaryPostStart",
        "displayCategory": "Field",
        "helpText": "请输入岗位设置日期"
    },
    {
        "label": "岗位类别",
        "type": "L",
        "id": "PostCategoryCode",
        "category": "CustomField",
        "name": "PostCategoryCode",
        "displayCategory": "Field",
        "helpText": "请输入岗位类别",
        "sObjectType": 0
    },
    {
        "label": "薪级别",
        "type": "L",
        "id": "SalaryLevel",
        "category": "CustomField",
        "name": "SalaryLevel",
        "displayCategory": "Field",
        "helpText": "请输入薪级别",
        "sObjectType": 0
    },
    {
        "label": "部门变动",
        "type": "RelatedList",
        "id": "RL__HREmployeeJobTransferList",
        "category": "StandardRelatedList",
        "name": "RL__HREmployeeJobTransferList",
        "displayCategory": "RelatedList",
        "fields": [{
                "label": "调动类型",
                "type": "DT",
                "id": "TransferTypeCode",
                "category": "CustomField",
                "alwaysDisplayed": false,
                "alwaysNotRequired": false,
                "displayCategory": "Field",
                "name": "TransferTypeCode",
                "helpText": "请输入调动类型"
            },
            {
                "label": "调出部门",
                "type": "O",
                "id": "FromDept",
                "category": "CustomField",
                "alwaysDisplayed": false,
                "alwaysNotRequired": false,
                "displayCategory": "Field",
                "name": "FromDept",
                "helpText": "请输入调出部门",
                "sObjectType": 10
            },
            {
                "label": "调出日期",
                "type": "D",
                "id": "OutDate",
                "category": "CustomField",
                "alwaysDisplayed": false,
                "alwaysNotRequired": false,
                "displayCategory": "Field",
                "name": "OutDate",
                "helpText": "请输入调出日期"
            },
            {
                "label": "分管院长意见",
                "type": "UC",
                "id": "ApproveOfIncharge",
                "category": "CustomField",
                "alwaysDisplayed": false,
                "alwaysNotRequired": false,
                "displayCategory": "Field",
                "name": "ApproveOfIncharge",
                "helpText": "院长意见"
            }
        ]
    }
]
export const dataList = { "actions": [{ "id": "", "state": "SUCCESS", "returnValue": { "masterRecord": { "entityLabel": "人员库", "keyPrefix": "a0V", "entityApiName": "HREmployee", "recordNameField": null, "objectTypeCode": 30020, "record": { "EmployeeId": null, "CreatedBy": { "Id": null, "Name": null, "objectTypeCode": 8, "sobjectType": "8" }, "CreatedOn": null, "ModifiedBy": { "Id": null, "Name": null, "objectTypeCode": 8, "sobjectType": "8" }, "ModifiedOn": null, "EmployeeNo": null, "FullName": null, "DeptId": { "Id": null, "Name": null, "objectTypeCode": 10, "sobjectType": "10" }, "SubDeptId": { "Id": null, "Name": null, "objectTypeCode": 10, "sobjectType": "10" }, "RootDeptId": { "Id": null, "Name": null, "objectTypeCode": 10, "sobjectType": "10" }, "ContractTypeCode": null, "StateCode": null, "EmpPool": null, "EmpCategoryCode": null, "SalaryPostCategory": null, "SalaryPostCode": null, "SalaryLevel": null, "SalaryPostStart": null, "PostCategoryCode": null, "PostSubCategory": null, "PostId": { "Id": null, "Name": null, "objectTypeCode": 30010, "sobjectType": "30010" }, "PeopleSourceCode": null, "JobTitleCode": null, "JobTitle": null, "JobTitleLevelCode": null, "JobTitleStart": null, "ProfessionTitle": null, "ProfessionGrade": null, "ProfessionRankCode": null, "ProfessionRankCodeOfHired": null, "ProfessionTitleGetOn": null, "ProfessionTitleHiredOn": null, "TeachingTitle": null, "TeachingTitleGetOn": null, "SKillType": null, "SKillLevelCode": null, "SkillGetOn": null, "SkillHiredOn": null, "WorkStartDate": null, "JoinDate": null, "EndProbationOn": null, "EstablishedOn": null, "FEducationGradeCode": null, "FDegreeCode": null, "FGraduateDate": null, "LengthOfEducation": null, "FMajor": null, "FSchoolName": null, "EducationGradeCode": null, "DegreeCode": null, "SchoolName": null, "MajorCategory": null, "StartWorkLengthDate": null, "StatusOfHouse": null, "LabelCode": null, "PractiseMajor": null, "Language": null, "PlaceOfBirth": null, "DistrictOfBirth": null, "MarryStatusCode": null, "RaceCode": null, "IDNumber": null, "Birthday": null, "GenderCode": null, "Age": null, "BloodType": null, "ResidenceCode": null, "DwellAddress": null, "IDAddress": null, "HomeAddress": null, "MobileNumber": null, "WorkPhone": null, "HomePhone": null, "EmailAddress1": null, "Fax": null, "InternalEmailAddress": null, "EmpFilePlaceCode": null, "LoginName": null, "Pinyin": null, "NurseLevel": null, "ShoeSize": null, "NurseStart": null, "HasNurseExtraSalary": null, "CadreSourceCode": null, "CarNo": null, "MealCardNumber": null, "BadgeNumber": null, "CertNo": null, "CertDate": null, "PhysicianLicenseCode": null, "PracticingCertName": null, "CertNoOfPractise": null, "CertDateOfPractise": null, "IdentityCate": null, "HealthStatusCode": null, "EvalTypeCode": null, "PartyCode": null, "UnitOfParty": null, "JoinPartyDate": null, "ApplyPartyDate": null, "PartyDisconnetDate": null, "IsDisconnetParty": null, "IsFlowPartyMem": null, "PartyStatus": null, "QuitOn": null, "QuitReason": null, "Workinglife": null, "WorkingYears": null, "DeductWorkingLife": null, "MasterName": null, "Sequence": null, "SequenceNumber": null, "SequenceNumber1": null, "SequenceNumber2": null, "SequenceNumber3": null, "SalaryMemo": null, "Description": null, "YearNumber": null, "MonthNumber": null }, "picklistValuesMap": { "ContractTypeCode": [{ "label": "在编", "value": "0" }, { "label": "合同", "value": "1" }, { "label": "试用", "value": "11" }, { "label": "退休", "value": "4" }, { "label": "临时人员", "value": "12" }, { "label": "退休返聘", "value": "41" }], "EmpCategoryCode": [{ "label": "行政", "value": "0" }, { "label": "职能", "value": "1" }, { "label": "医师", "value": "2" }, { "label": "医技", "value": "3" }, { "label": "护理", "value": "4" }, { "label": "医辅", "value": "5" }, { "label": "工勤", "value": "6" }, { "label": "其它", "value": "10" }, { "label": "院领导", "value": "20" }], "EmpPool": [{ "label": "在编在岗", "value": "0" }, { "label": "合同", "value": "1" }, { "label": "试用见习", "value": "11" }, { "label": "临时工", "value": "12" }, { "label": "劳务派遣", "value": "13" }, { "label": "离职", "value": "3" }, { "label": "调出", "value": "33" }, { "label": "退休", "value": "4" }, { "label": "退休返聘", "value": "41" }, { "label": "死亡", "value": "5" }], "EvalTypeCode": [{ "label": "专业技术", "value": "1" }, { "label": "管理", "value": "2" }, { "label": "工勤", "value": "3" }, { "label": "双肩挑", "value": "4" }], "HasNurseExtraSalary": [{ "label": "否", "value": "0" }, { "label": "是", "value": "1" }], "IdentityCate": [{ "label": "职员", "value": "0" }, { "label": "干部", "value": "1" }, { "label": "工人", "value": "2" }], "LabelCode": [{ "label": "在编", "value": "1" }, { "label": "在编见习", "value": "2" }, { "label": "编外卫技", "value": "3" }, { "label": "退休留用", "value": "4" }, { "label": "编外其它", "value": "5" }], "PostCategoryCode": [{ "label": "管理", "value": "1" }, { "label": "专业技术", "value": "2" }, { "label": "工勤", "value": "3" }, { "label": "管理以及专业技术岗位兼职", "value": "4" }, { "label": "其他", "value": "5" }], "ProfessionGrade": [{ "label": "专技1级", "value": "1" }, { "label": "专技2级", "value": "2" }, { "label": "专技3级", "value": "3" }, { "label": "专技4级", "value": "4" }, { "label": "专技5级", "value": "5" }, { "label": "专技6级", "value": "6" }, { "label": "专技7级", "value": "7" }, { "label": "专技8级", "value": "8" }, { "label": "专技9级", "value": "9" }, { "label": "专技10级", "value": "10" }, { "label": "专技11级", "value": "11" }, { "label": "专技12级", "value": "12" }, { "label": "专技13级", "value": "13" }], "SalaryLevel": [{ "label": "1", "value": "1" }, { "label": "2", "value": "2" }, { "label": "3", "value": "3" }, { "label": "4", "value": "4" }, { "label": "5", "value": "5" }, { "label": "6", "value": "6" }, { "label": "7", "value": "7" }, { "label": "8", "value": "8" }, { "label": "9", "value": "9" }, { "label": "10", "value": "10" }, { "label": "11", "value": "11" }, { "label": "12", "value": "12" }, { "label": "13", "value": "13" }, { "label": "14", "value": "14" }, { "label": "15", "value": "15" }, { "label": "16", "value": "16" }, { "label": "17", "value": "17" }, { "label": "18", "value": "18" }, { "label": "19", "value": "19" }, { "label": "20", "value": "20" }, { "label": "21", "value": "21" }, { "label": "22", "value": "22" }, { "label": "23", "value": "23" }, { "label": "24", "value": "24" }, { "label": "25", "value": "25" }, { "label": "26", "value": "26" }, { "label": "27", "value": "27" }, { "label": "28", "value": "28" }, { "label": "29", "value": "29" }, { "label": "30", "value": "30" }, { "label": "31", "value": "31" }, { "label": "32", "value": "32" }, { "label": "33", "value": "33" }, { "label": "34", "value": "34" }, { "label": "35", "value": "35" }, { "label": "36", "value": "36" }, { "label": "37", "value": "37" }, { "label": "38", "value": "38" }, { "label": "39", "value": "39" }, { "label": "40", "value": "40" }, { "label": "41", "value": "41" }, { "label": "42", "value": "42" }, { "label": "43", "value": "43" }, { "label": "44", "value": "44" }, { "label": "45", "value": "45" }, { "label": "46", "value": "46" }, { "label": "47", "value": "47" }, { "label": "48", "value": "48" }, { "label": "49", "value": "49" }, { "label": "50", "value": "50" }, { "label": "51", "value": "51" }, { "label": "52", "value": "52" }, { "label": "53", "value": "53" }, { "label": "54", "value": "54" }, { "label": "55", "value": "55" }, { "label": "56", "value": "56" }, { "label": "57", "value": "57" }, { "label": "58", "value": "58" }, { "label": "59", "value": "59" }, { "label": "60", "value": "60" }, { "label": "61", "value": "61" }, { "label": "62", "value": "62" }, { "label": "63", "value": "63" }, { "label": "64", "value": "64" }, { "label": "65", "value": "65" }], "SalaryPostCategory": [{ "label": "管理", "value": "1" }, { "label": "专业技术", "value": "2" }, { "label": "工勤", "value": "3" }], "SalaryPostCode": [{ "label": "管理1级", "value": "101" }, { "label": "管理2级", "value": "102" }, { "label": "管理3级", "value": "103" }, { "label": "管理4级", "value": "104" }, { "label": "管理5级", "value": "105" }, { "label": "管理6级", "value": "106" }, { "label": "管理7级", "value": "107" }, { "label": "管理8级", "value": "108" }, { "label": "管理9级", "value": "109" }, { "label": "管理10级", "value": "110" }, { "label": "专技1级", "value": "201" }, { "label": "专技2级", "value": "202" }, { "label": "专技3级", "value": "203" }, { "label": "专技4级", "value": "204" }, { "label": "专技5级", "value": "205" }, { "label": "专技6级", "value": "206" }, { "label": "专技7级", "value": "207" }, { "label": "专技8级", "value": "208" }, { "label": "专技9级", "value": "209" }, { "label": "专技10级", "value": "210" }, { "label": "专技11级", "value": "211" }, { "label": "专技12级", "value": "212" }, { "label": "专技13级", "value": "213" }, { "label": "工勤1级", "value": "301" }, { "label": "工勤2级", "value": "302" }, { "label": "工勤3级", "value": "303" }, { "label": "工勤4级", "value": "304" }, { "label": "工勤5级", "value": "305" }, { "label": "工勤6级", "value": "306" }], "StateCode": [{ "label": "在职", "value": "0" }, { "label": "不在岗", "value": "2" }, { "label": "离职", "value": "3" }, { "label": "退休", "value": "4" }, { "label": "死亡", "value": "5" }], "BloodType": [{ "label": "A", "value": "A" }, { "label": "B", "value": "B" }, { "label": "O", "value": "O" }, { "label": "AB", "value": "AB" }, { "label": "RH阴性", "value": "RH阴性" }], "CadreSourceCode": [{ "label": "分配干部", "value": "分配干部" }, { "label": "调入干部", "value": "调入干部" }, { "label": "派遣调入", "value": "派遣调入" }, { "label": "军转干部", "value": "军转干部" }, { "label": "转业干部", "value": "转业干部" }, { "label": "复员军人", "value": "复员军人" }, { "label": "聘干", "value": "聘干" }], "EducationGradeCode": [{ "label": "专科", "value": "专科" }, { "label": "本科", "value": "本科" }, { "label": "硕士研究生", "value": "硕士研究生" }, { "label": "博士研究生", "value": "博士研究生" }, { "label": "中专", "value": "中专" }, { "label": "普通高中", "value": "普通高中" }, { "label": "职业高中", "value": "职业高中" }, { "label": "初中及以下", "value": "初中及以下" }], "EmpFilePlaceCode": [{ "label": "本院", "value": "本院" }, { "label": "人才中心", "value": "人才中心" }], "FDegreeCode": [{ "label": "学士", "value": "学士" }, { "label": "硕士", "value": "硕士" }, { "label": "博士", "value": "博士" }, { "label": "博士后", "value": "博士后" }], "FEducationGradeCode": [{ "label": "普通高中", "value": "普通高中" }, { "label": "专科", "value": "专科" }, { "label": "本科", "value": "本科" }, { "label": "硕士研究生", "value": "硕士研究生" }, { "label": "博士研究生", "value": "博士研究生" }, { "label": "初中及以下", "value": "初中及以下" }, { "label": "中专", "value": "中专" }, { "label": "职业高中", "value": "职业高中" }], "GenderCode": [{ "label": "男", "value": "男" }, { "label": "女", "value": "女" }], "HealthStatusCode": [{ "label": "健康", "value": "健康" }, { "label": "残疾", "value": "残疾" }], "JobTitleCode": [{ "label": "党委（副）书记", "value": "党委（副）书记" }, { "label": "单位行政负责人（正职）", "value": "单位行政负责人（正职）" }, { "label": "单位行政负责人（副职）", "value": "单位行政负责人（副职）" }, { "label": "科室（部门）正职", "value": "科室（部门）正职" }, { "label": "科室（部门）副职", "value": "科室（部门）副职" }], "JobTitleLevelCode": [{ "label": "正部", "value": "正部" }, { "label": "副部", "value": "副部" }, { "label": "正局", "value": "正局" }, { "label": "副局", "value": "副局" }, { "label": "正处", "value": "正处" }, { "label": "副处", "value": "副处" }, { "label": "正科", "value": "正科" }, { "label": "副科", "value": "副科" }, { "label": "科员", "value": "科员" }, { "label": "办事员", "value": "办事员" }], "Language": [{ "label": "英语", "value": "英语" }, { "label": "法语", "value": "法语" }, { "label": "日语", "value": "日语" }, { "label": "德语", "value": "德语" }, { "label": "俄语", "value": "俄语" }], "MajorCategory": [{ "label": "执业医师", "value": "执业医师" }, { "label": "执业助理医师", "value": "执业助理医师" }, { "label": "见习医师", "value": "见习医师" }, { "label": "注册护士", "value": "注册护士" }, { "label": "助产士", "value": "助产士" }, { "label": "西药师(士)", "value": "西药师(士)" }, { "label": "中药师(士)", "value": "中药师(士)" }, { "label": "检验技师(士)", "value": "检验技师(士)" }, { "label": "影像技师(士)", "value": "影像技师(士)" }, { "label": "其他卫生技术人员", "value": "其他卫生技术人员" }, { "label": "其他技术人员", "value": "其他技术人员" }, { "label": "管理人员", "value": "管理人员" }, { "label": "工勤及技能人员", "value": "工勤及技能人员" }], "MarryStatusCode": [{ "label": "未婚", "value": "未婚" }, { "label": "已婚", "value": "已婚" }, { "label": "离异", "value": "离异" }, { "label": "丧偶", "value": "丧偶" }], "NurseLevel": [{ "label": "N0", "value": "N0" }, { "label": "N1", "value": "N1" }, { "label": "N2", "value": "N2" }, { "label": "N3", "value": "N3" }, { "label": "N4", "value": "N4" }, { "label": "N5", "value": "N5" }], "PartyCode": [{ "label": "群众", "value": "群众" }, { "label": "中共党员", "value": "中共党员" }, { "label": "共青团员", "value": "共青团员" }, { "label": "民革党员", "value": "民革党员" }, { "label": "民盟盟员", "value": "民盟盟员" }, { "label": "民建会员", "value": "民建会员" }, { "label": "民进会员", "value": "民进会员" }, { "label": "农工党党员", "value": "农工党党员" }, { "label": "致公党党员", "value": "致公党党员" }, { "label": "九三学社社员", "value": "九三学社社员" }, { "label": "台盟盟员", "value": "台盟盟员" }], "PartyStatus": [{ "label": "正常", "value": "正常" }, { "label": "停止党籍", "value": "停止党籍" }], "PeopleSourceCode": [{ "label": "高中等院校毕业生", "value": "高中等院校毕业生" }, { "label": "其他卫生机构调入", "value": "其他卫生机构调入" }, { "label": "非卫生机构调入", "value": "非卫生机构调入" }, { "label": "军转人员", "value": "军转人员" }, { "label": "其他流入", "value": "其他流入" }], "PhysicianLicenseCode": [{ "label": "临床", "value": "临床" }, { "label": "口腔", "value": "口腔" }, { "label": "公共卫生", "value": "公共卫生" }, { "label": "护理", "value": "护理" }, { "label": "中医", "value": "中医" }], "PlaceOfBirth": [{ "label": "安徽", "value": "安徽" }, { "label": "北京", "value": "北京" }, { "label": "重庆", "value": "重庆" }, { "label": "福建", "value": "福建" }, { "label": "甘肃", "value": "甘肃" }, { "label": "广东", "value": "广东" }, { "label": "广西", "value": "广西" }, { "label": "贵州", "value": "贵州" }, { "label": "海南", "value": "海南" }, { "label": "河北", "value": "河北" }, { "label": "黑龙江", "value": "黑龙江" }, { "label": "河南", "value": "河南" }, { "label": "湖北", "value": "湖北" }, { "label": "湖南", "value": "湖南" }, { "label": "内蒙古", "value": "内蒙古" }, { "label": "江苏", "value": "江苏" }, { "label": "江西", "value": "江西" }, { "label": "吉林", "value": "吉林" }, { "label": "辽宁", "value": "辽宁" }, { "label": "宁夏", "value": "宁夏" }, { "label": "青海", "value": "青海" }, { "label": "山西", "value": "山西" }, { "label": "山东", "value": "山东" }, { "label": "上海", "value": "上海" }, { "label": "四川", "value": "四川" }, { "label": "天津", "value": "天津" }, { "label": "西藏", "value": "西藏" }, { "label": "新疆", "value": "新疆" }, { "label": "云南", "value": "云南" }, { "label": "浙江", "value": "浙江" }, { "label": "陕西", "value": "陕西" }, { "label": "台湾地区", "value": "台湾地区" }, { "label": "香港地区", "value": "香港地区" }, { "label": "澳门地区", "value": "澳门地区" }, { "label": "海外", "value": "海外" }, { "label": "其他", "value": "其他" }], "PostSubCategory": [{ "label": "行政", "value": "行政" }], "ProfessionRankCode": [{ "label": "正高", "value": "正高" }, { "label": "副高", "value": "副高" }, { "label": "中级", "value": "中级" }, { "label": "助理", "value": "助理" }, { "label": "员级", "value": "员级" }], "ProfessionRankCodeOfHired": [{ "label": "正高", "value": "正高" }, { "label": "副高", "value": "副高" }, { "label": "中级", "value": "中级" }, { "label": "助理", "value": "助理" }, { "label": "员级", "value": "员级" }], "RaceCode": [{ "label": "汉族", "value": "汉族" }, { "label": "壮族", "value": "壮族" }, { "label": "满族", "value": "满族" }, { "label": "回族", "value": "回族" }, { "label": "苗族", "value": "苗族" }, { "label": "维吾尔族", "value": "维吾尔族" }, { "label": "土家族", "value": "土家族" }, { "label": "彝族", "value": "彝族" }, { "label": "蒙古族", "value": "蒙古族" }, { "label": "藏族", "value": "藏族" }, { "label": "布依族", "value": "布依族" }, { "label": "侗族", "value": "侗族" }, { "label": "瑶族", "value": "瑶族" }, { "label": "朝鲜族", "value": "朝鲜族" }, { "label": "白族", "value": "白族" }, { "label": "哈尼族", "value": "哈尼族" }, { "label": "哈萨克族", "value": "哈萨克族" }, { "label": "黎族", "value": "黎族" }, { "label": "傣族", "value": "傣族" }, { "label": "畲族", "value": "畲族" }, { "label": "傈僳族", "value": "傈僳族" }, { "label": "仡佬族", "value": "仡佬族" }, { "label": "东乡族", "value": "东乡族" }, { "label": "高山族", "value": "高山族" }, { "label": "拉祜族", "value": "拉祜族" }, { "label": "水族", "value": "水族" }, { "label": "佤族", "value": "佤族" }, { "label": "纳西族", "value": "纳西族" }, { "label": "羌族", "value": "羌族" }, { "label": "土族", "value": "土族" }, { "label": "仫佬族", "value": "仫佬族" }, { "label": "锡伯族", "value": "锡伯族" }, { "label": "柯尔克孜族", "value": "柯尔克孜族" }, { "label": "达斡尔族", "value": "达斡尔族" }, { "label": "景颇族", "value": "景颇族" }, { "label": "毛南族", "value": "毛南族" }, { "label": "撒拉族", "value": "撒拉族" }, { "label": "布朗族", "value": "布朗族" }, { "label": "塔吉克族", "value": "塔吉克族" }, { "label": "阿昌族", "value": "阿昌族" }, { "label": "普米族", "value": "普米族" }, { "label": "鄂温克族", "value": "鄂温克族" }, { "label": "怒族", "value": "怒族" }, { "label": "京族", "value": "京族" }, { "label": "基诺族", "value": "基诺族" }, { "label": "德昂族", "value": "德昂族" }, { "label": "保安族", "value": "保安族" }, { "label": "俄罗斯族", "value": "俄罗斯族" }, { "label": "裕固族", "value": "裕固族" }, { "label": "乌孜别克族", "value": "乌孜别克族" }, { "label": "门巴族", "value": "门巴族" }, { "label": "鄂伦春族", "value": "鄂伦春族" }, { "label": "独龙族", "value": "独龙族" }, { "label": "塔塔尔族", "value": "塔塔尔族" }, { "label": "赫哲族", "value": "赫哲族" }, { "label": "珞巴族", "value": "珞巴族" }], "ResidenceCode": [{ "label": "本院集体户口", "value": "本院集体户口" }, { "label": "本地非农业户口", "value": "本地非农业户口" }, { "label": "本地农业户口", "value": "本地农业户口" }], "Sequence": [{ "label": "行政", "value": "行政" }, { "label": "工勤", "value": "工勤" }, { "label": "医疗", "value": "医疗" }, { "label": "医技", "value": "医技" }, { "label": "护理", "value": "护理" }, { "label": "相关", "value": "相关" }], "SKillLevelCode": [{ "label": "高级技师", "value": "高级技师" }, { "label": "技师", "value": "技师" }, { "label": "高级工", "value": "高级工" }, { "label": "中级工", "value": "中级工" }, { "label": "初级工", "value": "初级工" }, { "label": "普工工", "value": "普工工" }], "StatusOfHouse": [{ "label": "无", "value": "无" }, { "label": "有", "value": "有" }] }, "defaultFieldValues": {} }, "relatedListRecords": [] }, "error": [] }], "context": { "globalValueProviders": null, "picklistValuesMap": {}, "enableAccessChecks": false } };
export const serachList = { "status": 1, "listData": [{ "ID": "e1d8caa3-59ae-43c0-85ad-b47772e66d7d", "Name": "0000000 | 全院" }, { "ID": "ae836fb1-833b-417f-811a-69b8b619b3b3", "Name": "324 | few" }, { "ID": "d86942ea-0eae-44e4-967d-82d8292a6e1c", "Name": "DE321111111 | 维修三部" }, { "ID": "727310d1-948b-4ba7-baf9-fb7c0511e347", "Name": "CD323232 | 维修三部" }, { "ID": "2d061a49-4143-4b3b-8504-6a59c83dc383", "Name": "03 | 医技科室" }, { "ID": "260c9497-6b73-4215-8708-8d42c6357035", "Name": "010002 | 医院办公室" }, { "ID": "38518011-767e-4548-837d-5f8390bd5a4c", "Name": "010004 | 财务部" }, { "ID": "6fc55aa7-e3fb-4f31-b5e3-a7febb41603e", "Name": "010006 | 人事科" }, { "ID": "5db5933d-476d-4c0c-ae1a-f598dfa5890f", "Name": " | 医院办公室三级" }, { "ID": "f65ba987-da3e-4627-8be1-fbc218b76e80", "Name": " | 医院办公室二级" }, { "ID": "6c7fe0f5-9d3d-48ac-9921-03c55281fa12", "Name": "25 | 对外联络部" }, { "ID": "80341c74-aa27-4038-83db-198b9fd6b831", "Name": "2 | 社区科" }, { "ID": "5adfd139-3e5b-4107-b601-167ba8613929", "Name": "4 | 信息检测科" }, { "ID": "dfa296cc-1255-44bc-b6b5-017462e5d08d", "Name": "3 | 宣传科" }, { "ID": "abe44bdd-2c52-4afc-890c-586e393f7547", "Name": "22 | 口腔科" }, { "ID": "dd95e63f-43df-4bd4-b81f-8d539cc9785f", "Name": "1 | 所办公室 " }, { "ID": "6288e331-38a8-4dad-ae35-1a2513f6e0c1", "Name": "3 | 疾病样本资源库 " }, { "ID": "41d9a4c6-40ca-47a1-ae2b-50652044a267", "Name": "2 | 实验室办公室" }, { "ID": "f4d4bac7-4a93-4027-af9e-ccba7e5e7b7d", "Name": "3 | 心理组（三级部门）" }, { "ID": "dbc1e0b2-b833-4538-88c6-034ae929a8db", "Name": "2 | 心理治疗中心（含门诊和病房）" }, { "ID": "a8128d88-8772-4bfc-b979-4c731e051363", "Name": "1 | 心理测查中心 " }, { "ID": "820afe05-801f-441e-aacf-ac8d0880727e", "Name": "3 | 干部保健门诊" }, { "ID": "4e88640d-a62b-47fd-ba0e-8c6b989be076", "Name": "1 | 干部保健专家组" }, { "ID": "2086bdd0-8580-4f68-a23f-a3273133dd58", "Name": "20 | 介入室" }, { "ID": "36981fd0-1e03-4a4b-a4e8-e3986965632c", "Name": "1 | 国家精神心理疾病临床医学研究中心办公室 " }, { "ID": "3e43c834-345b-4c55-bc7b-1e9a0fe07777", "Name": "4 | 免疫组（三级部门）" }, { "ID": "6e4bf72e-7fba-408a-ab06-5e6066962005", "Name": "3 | 生化组（三级部门）" }, { "ID": "7883deb6-7722-4a18-b152-d7539f0f8120", "Name": "2 | 药理组（三级部门）" }, { "ID": "0be9b341-452a-45a2-a4d7-54cb80275269", "Name": "1 | 临检组（三级部门）" }, { "ID": "579f7936-589d-4533-a217-20a0dddb7341", "Name": "5 | 中心药房" }, { "ID": "9056f7e9-6f04-47a5-82ae-4eb3b260f1f0", "Name": "4 | 药库" }, { "ID": "afe6b9a5-28be-4bf0-a4f9-06f5ecb47679", "Name": "3 | 中药房 " }, { "ID": "6f23f4e0-79aa-4212-9b3e-8c7406affb45", "Name": "2 | 西药房 " }, { "ID": "91c8c070-50c7-4589-b35e-9e9fbcd0b7d5", "Name": "1 | 临床药学室" }, { "ID": "a767475b-1f56-41f2-b9b4-3b1cd8e67c27", "Name": "1 | 物价办公室" }, { "ID": "30c2b9d7-e334-4165-a8a0-b6297ef9e091", "Name": "2 | 库房组（三级部门）" }, { "ID": "75fbbc48-fdd6-4706-b061-54a3216413f1", "Name": "1 | 器械组" }, { "ID": "1a92a663-5ee4-413f-85e9-9fb52147cbb9", "Name": "7 | 工勤组（三级部门）" }, { "ID": "88cfd3a3-36a8-4258-9847-dd5fc3241fd2", "Name": "6 | 司机班（三级部门）" }, { "ID": "e081eecc-3caf-40ab-b0f5-4055946b2015", "Name": "5 | 营养食堂（三级部门）" }, { "ID": "779ae281-1444-4f60-800b-77856fc0f549", "Name": "3 | 维修班（三级部门）" }, { "ID": "9cb77d3c-944e-4cb3-ad1b-5ee6591dba62", "Name": "4 | 电工班（三级部门）" }, { "ID": "5ab32d7d-f2aa-42e1-a800-80a2e5d04647", "Name": "2 | 锅炉房（三级部门）" }, { "ID": "a726a8f8-f841-48c0-a59e-fce3d5fcbcdb", "Name": "1 | 洗衣房（三级部门）" }, { "ID": "98899498-7c76-4831-838e-fc333788b010", "Name": "3 | 门诊挂号收费处" }, { "ID": "55f0c328-8617-4ae6-8b91-ff53b22f5bd0", "Name": "2 | 住院处" }, { "ID": "9da52da9-b906-4bce-8bb6-30771e756f87", "Name": "1 | 会计室" }, { "ID": "4166685c-340b-47dc-b217-970f43f8d059", "Name": "2 | 巡逻班" }, { "ID": "67f431fe-82fb-413d-b75d-7358da64ace2", "Name": "1 | 技防监控" }, { "ID": "3d34f729-1c3b-46f0-a40f-e9f4e79f74da", "Name": "4 | 电生理检测治疗" }] }

export const testList = {
    "SplitType": "and",
    "listData": [{
            "ToActivityId": "1bce1eb2-5b8b-45fb-80d2-0bf632320e3e",
            "ToActivityName": "财务审阅",
            "TransitionId": "4a8ee30f-a57f-47b3-9ae0-9cb1a86e2083",
            "FromActivityId": "b7c8e2e6-6b4c-4350-a6d7-40503f074344",
            "FromActivityName": "填写合同",
            "Selected": true,
            "ParticipantMember": [{
                "UserId": "f5edd0f7-bf43-466f-845d-0d4020b12729",
                "FullName": "司路",
                "BusinessUnitIdName": "会计室",
                "OrganizationIdName": "",
                "Selected": true
            }]
        },
        {
            "ToActivityId": "a2c2e187-e1f6-4f63-aefb-80016dd2e2a7",
            "ToActivityName": "审计审核",
            "TransitionId": "7b0211fc-b48a-4c73-b491-678cb66b7ab2",
            "FromActivityId": "b7c8e2e6-6b4c-4350-a6d7-40503f074344",
            "FromActivityName": "填写合同",
            "Selected": true,
            "ParticipantMember": [{
                    "UserId": "a58a0d97-2a37-4dca-92b4-395f5c49a117",
                    "FullName": "杜洁",
                    "BusinessUnitIdName": "审计处",
                    "OrganizationIdName": "",
                    "Selected": true
                },
                {
                    "UserId": "d7225752-d1d9-494d-bf88-865bf21ec55f",
                    "FullName": "许晨",
                    "BusinessUnitIdName": "审计处",
                    "OrganizationIdName": "",
                    "Selected": true
                }
            ]
        }
    ]
}