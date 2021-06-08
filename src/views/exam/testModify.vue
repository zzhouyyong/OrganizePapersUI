<template>
   <layout>
       <div class="back">
           <a-icon type="left"></a-icon>
           <a @click="back">修改考试</a>
       </div>
       <a-form :form="form" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">

           <!-- 组卷配置 -->
           <div style="display: flex;justify-content: space-between">
               <div style="font-weight: bold;">组卷配置</div>
               <div style="font-weight: bold; color: orangered; margin-right: 2%">试卷总分: {{ this.testPoint }}</div>
           </div>
           <div style="box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%); text-align: left; margin-top: 1%; padding: 1%">
               <a-tabs default-active-key="1" @change="callback">
                   <a-tab-pane key="1" tab="自由选题">
                       <a-checkbox-group
                               v-model="value"
                               name="checkboxgroup"
                               :options="plainOptions"
                               @change="onChange"
                       />
                       <a-table style="margin-top: 1%" :rowSelection="{ selectRowKeys: selectedRowKeys, onChange: onRowSelectChange  }" :columns="columns" :data-source="data" row-key="id">
                           <div slot="action" slot-scope="record">
                               <a-button @click="deleteExamTitle(record.id)" size="small" type="danger">删除</a-button>
                           </div>
                       </a-table>
                   </a-tab-pane>
                   <a-tab-pane key="2" tab="题库组卷" force-render>
                       <a-form-item label="选择题库" :colon="false">
                           <a-input style="margin-left: 2%" placeholder="选择或搜索题库"></a-input>
                       </a-form-item>
                       <a-form-item label="难易程度" :colon="false">
                           <a-select style="margin-left: 2%" default-value="1">
                               <a-select-option value="1">
                                   简单
                               </a-select-option>
                               <a-select-option value="2">
                                   一般
                               </a-select-option>
                               <a-select-option value="3">
                                   较难
                               </a-select-option>
                           </a-select>
                       </a-form-item>
                   </a-tab-pane>
               </a-tabs>
           </div>



           <!-- 考试设置 -->
           <div style="font-weight: bold;text-align: left;margin-top: 1%">考试设置</div>
           <div style="box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%); text-align: left; margin-top: 1%; padding: 1%">
               <a-form-item label="考试名称" :colon="false">
                   <a-input style="margin-left: 2%"
                            v-decorator="[
                            'testName',
                                { rules: [{ required: true, message: '考试名称不能为空' }] },
                             ]"
                            placeholder="请输入考试名称"
                   >
                   </a-input>
               </a-form-item>
               <a-form-item label="考试时间" :colon="false">
                   <a-range-picker
                           style="margin-left: 2%"
                           :disabled-date="disabledDate"
                           :disabled-time="disabledRangeTime"
                           :show-time="{
                                hideDisabledOptions: true,
                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                            }"
                           @change="onTimeChange"
                           format="YYYY-MM-DD HH:mm:ss"
                           :locale="locale"
                           v-decorator="[
                                 'examTime',
                                { rules: [{ required: true, message: '考试时间不能为空' }] },
                           ]"
                   />
               </a-form-item>
               <a-form-item label="总分数" :colon="false">
                   <div style="display: flex;margin-left: 2%">
                       <a-input v-model="testPoint" disabled="disabled" style="width: 15%"></a-input>
                       <span style="color: #666;font-size: 80%;text-align: center;margin-left: 1%">组卷后自动生成</span>
                   </div>
               </a-form-item>
               <a-form-item label="及格分" :colon="false">
                   <div style="display: flex;margin-left: 2%">
                       <a-input style="width: 15%"
                                v-decorator="[
                                 'testPassPoint',
                                { rules: [{ required: true, message: '及格分不能为空' }] },
                             ]"
                       >
                       </a-input>
                   </div>
               </a-form-item>
               <a-form-item label="考试时长" :colon="false">
                   <div style="display: flex;margin-left: 2%">
                       <a-input style="width: 15%"
                                v-decorator="[
                                 'testTime',
                                { rules: [{ required: true, message: '考试时长不能为空' }] },
                             ]"
                       >
                       </a-input>
                       <span style="color: #666;font-size: 80%;margin-left: 1%">单位：分钟</span>
                   </div>
               </a-form-item>
           </div>
           <a-button @click="updateTest" style="float: left; margin-top: 1%" type="primary">保存</a-button>
       </a-form>
   </layout>
</template>

<script>
    import Layout from '@/views/dashboard/layout.vue';
    import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
    import moment from 'moment';
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import { findExamTitleByTitleType } from "../../api/examTitle";
    import { findTestTitleById } from "../../api/zy";
    import { updateTestTitleByExamDetailId } from "../../api/zy";

    const plainOptions = [
        { label: '单选题', value: '1' },
        { label: '多选题', value: '2' },
        { label: '简答题', value: '4' },
    ];
    const data = [
    ];
    const columns = [
        {
            title: '题型',
            dataIndex: 'titleType',
            key: 'titleType',
            slots: { title: 'customTitle' },
            scopedSlots: { customRender: 'titleType' },
            customRender:function (text) {
                if( text == '1' ) {
                    return "单选题";
                }
                if( text == '2' ) {
                    return "多选题";
                }
                if( text == '3' ) {
                    return "判断题";
                }
                if( text == '4' ) {
                    return "简答题";
                }
            }
        },
        {
            title: '难度',
            dataIndex: 'titleLevel',
            key: 'titleLevel',
            customRender:function (text) {
                if( text == '1' ){
                    return '简单';
                }
                if( text == '2' ){
                    return '一般';
                }
                if( text == '3' ){
                    return '较难';
                }
            }
        },
        {
            title: '试题内容',
            dataIndex: 'titleName',
            key: 'titleName',
        },
        {
            title: '试题分数',
            dataIndex: 'titlePoint',
            key: 'titlePoint',
        },
        {
            title: '创建时间',
            key: 'createTime',
            dataIndex: 'createTime',
            scopedSlots: { customRender: 'createTime' },
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: { customRender: 'action' },
        },
    ];
    export default {
        name: "testAdd",
        components: {
            AFormItem,
            Layout
        },
        created() {
            this.findTestTitleById1();
        },
        data () {
            return {
                form: this.$form.createForm(this),
                plainOptions,
                data,
                columns,
                value: [],
                selectedRowKeys: [],
                selectRows: [],
                testPoint: 1,
                locale,
                dateString:'',
                testId: this.$route.params.id
            }
        },
        methods: {
            back() {
                this.$router.go(-1)
            },
            callback (key) {
                console.log(key)
            },
            onRowSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                this.selectRows = selectedRows
                console.log(selectedRowKeys, selectedRows)
            },
            onTimeChange(values, dateString) {
                console.log('Selected Time: ', values);
                console.log('Formatted Selected Time: ', dateString);
                this.dateString = dateString;
            },
            onChange () {
                console.log(this.value);
                findExamTitleByTitleType({types: this.value.join(',')}).then(res =>{
                    console.log(res)
                    if( "success" === res.msg ) {
                        this.data = res.data
                    }
                })
            },

            /* 日期 */
            moment,
            range(start, end) {
                const result = [];
                for (let i = start; i < end; i++) {
                    result.push(i);
                }
                return result;
            },

            disabledDate(current) {
                // Can not select days before today and today
                return current && current < moment().endOf('day');
            },

            disabledDateTime() {
                return {
                    disabledHours: () => this.range(0, 24).splice(4, 20),
                    disabledMinutes: () => this.range(30, 60),
                    disabledSeconds: () => [55, 56],
                };
            },

            disabledRangeTime(_, type) {
                if (type === 'start') {
                    return {
                        disabledHours: () => this.range(0, 60).splice(4, 20),
                        disabledMinutes: () => this.range(30, 60),
                        disabledSeconds: () => [55, 56],
                    };
                }
                return {
                    disabledHours: () => this.range(0, 60).splice(20, 4),
                    disabledMinutes: () => this.range(0, 31),
                    disabledSeconds: () => [55, 56],
                };
            },

            // 更新题目
            updateTest() {
                this.form.validateFields((err, values) => {
                    updateTestTitleByExamDetailId({ id: this.$route.params.id,testName: values.testName, testPassPoint: values.testPassPoint, testTime: values.testTime,
                        startTime: this.dateString[0], endTime: this.dateString[1], examDetailId: this.selectedRowKeys.join(',')}).then(res =>{
                        if( "success" === res.msg ) {
                            this.$notification['success']({
                                message: '添加成功',
                            });
                            this.data = res.data
                            this.$router.push('/exam/testmanager');
                        }else{
                            this.$notification['error']({
                                message: '考试题目中有存在的题目，请重新选择',
                            });
                        }
                    }).catch(err =>{
                        if( err ){
                            console.log(err)
                            this.$notification['error']({
                                message: '系统错误，请联系管理员',
                            });
                        }
                    })
                    console.log(values);
                    this.form.resetFields();
                    this.selectedRowKeys = []
                });
            },

            findTestTitleById1(){
                findTestTitleById({id: this.$route.params.id}).then(res =>{
                    console.log(res)
                    if( "success" === res.msg ) {
                        this.testPoint = res.data.testTitleById.testPoint
                        this.form.setFieldsValue({
                            // 将题目信息绑定
                            id: res.data.testTitleById.id,
                            testName: res.data.testTitleById.testName,
                            testPassPoint: res.data.testTitleById.testPassPoint,
                            testTime: res.data.testTitleById.testTime
                        })
                        this.data = res.data.examTitle;
                    }
                })
            },

            // 只是删除考试表中的题目，相当于更新考试表
            deleteExamTitle(id) {
                console.log(id);
                updateTestTitleByExamDetailId({examDetailId: id, id: this.testId}).then(res =>{
                    console.log(res);
                    if("success" === res.msg) {
                        this.findTestTitleById1();
                    }
                })
            }

        }
    }
</script>

<style scoped>
    .back {
        border-bottom: 1px solid #dfe3e6;
        margin-bottom: 2%;
        padding: 1%;
        text-align: left;
    }
</style>