<template>
    <Layout>
        <div id="manager">
            <div class="back">
                <a-icon type="left"></a-icon>
                <a @click="back">试题管理</a>
            </div>
            <div class="content">
            <span style="float: left">当前题库：{{ this.$route.params.examName }}</span><br>
            <a-row style="margin-top: 2%">
                <a-col :span="8">
                    <a-select
                            placeholder="请选择试题类型"
                            v-model="titleType"
                            style="width: 95%">
                        <a-select-option value="1">
                            单选题
                        </a-select-option>
                        <a-select-option value="2">
                            多选题
                        </a-select-option>
                        <a-select-option value="4">
                            简答题
                        </a-select-option>
                    </a-select>
                </a-col>
                <a-col :span="8">
                    <a-input
                            v-model="titleName"
                            placeholder="请选择试题内容" />
                </a-col>
                <a-col :span="8">
                    <a-button @click="selectExamTitleByParams(titleType,titleName)" type="primary">
                        <a-icon type="search"></a-icon>查询
                    </a-button>
                    <a-button @click="addExamDetail"  type="primary" style="margin-left: 5%">
                        <a-icon type="plus"></a-icon>添加题型
                    </a-button>
                    <a-button type="danger" style="margin-left: 5%" @click="handleDel">
                        <a-icon type="minus"></a-icon>
                        批量删除
                    </a-button>
                </a-col>
            </a-row>

            <!-- 表单 -->
            <a-table style="margin-top: 1%" :rowSelection="{ selectRowKeys: selectedRowKeys, onChange: onRowSelectChange  }" :columns="columnsNew" :data-source="dataNew" row-key="id">
                <span slot="action" slot-scope="record">
                    <a-button @click="showExamModalEdit(record.id)" size="small" icon="edit" slot="action">修改</a-button>
                </span>
            </a-table>

            <!-- 添加题型 -->
            </div>
            <a-modal width="50%" v-model="visibleAddExam" title="添加题型" ok-text="确认" cancel-text="取消" @ok="handleAddExamOk" @cancel="handleAddExamCancel">
                <a-form :form="form">
                    <a-form-item label="试题类型">
                        <a-select
                                v-decorator="[
                                    'titleType',
                                    { rules: [{ required: true, message: '试题类型不能为空' }] }
                                ]"
                                v-model="typeVal"
                                placeholder="请选择题型">
                            <a-select-option :value="1">
                                单选题
                            </a-select-option>
                            <a-select-option :value="2">
                                多选题
                            </a-select-option>
                            <a-select-option :value="4">
                                简答题
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="难度等级">
                        <a-select
                                v-decorator="[
                                    'titleLevel',
                                    { rules: [{ required: true, message: '难度等级不能为空' }] },
                                ]"
                                placeholder="请选择难度等级">
                            <a-select-option :value="1">
                                简单
                            </a-select-option>
                            <a-select-option :value="2">
                                一般
                            </a-select-option>
                            <a-select-option :value="3">
                                较难
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="试题内容">
                        <a-textarea
                                v-decorator="[
                                    'titleName',
                                    { rules: [{ required: true, message: '试题内容不能为空' }] },
                                ]"
                                placeholder="请输入试题内容"
                        ></a-textarea>
                    </a-form-item>
<!--                    <a-form-item label="试题分数">-->
<!--                        <a-input-->
<!--                                v-decorator="[-->
<!--                                    'titlePoint',-->
<!--                                    { rules: [{ required: true, message: '试题分数不能为空' }] },-->
<!--                                ]"-->
<!--                                placeholder="请输入试题分数"></a-input>-->
<!--                    </a-form-item>-->
                    <a-form-item>
                        <table v-if="this.typeVal == 1 || this.typeVal == 2" width="100%" border="1" style="border: 1px solid darkgrey;">
                            <tr>
                                <td style="padding: 1%;text-align: center">
                                    <a-checkbox v-model="tableList[0].examDetailAnswer1">
                                        选择答案
                                    </a-checkbox>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-decorator="[
                                    'examDetailContent1',
                                    { rules: [{ required: true, message: '选项内容不能为空' }] },
                                ]" v-model="tableList[0].examDetailContent1" placeholder="请输入选项内容">
                                    </a-textarea>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-decorator="[
                                    'examDetailExplain1',
                                    { rules: [{ required: true, message: '选项解析不能为空' }] },
                                ]" v-model="tableList[0].examDetailExplain1" placeholder="请输入选项解析">
                                    </a-textarea>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 1%;text-align: center">
                                    <a-checkbox v-model="tableList[1].examDetailAnswer2" @change="onAnswerChange">
                                        选择答案
                                    </a-checkbox>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-decorator="[
                                    'examDetailContent2',
                                    { rules: [{ required: true, message: '选项内容不能为空' }] },
                                ]" v-model="tableList[1].examDetailContent2" placeholder="请输入选项内容">
                                    </a-textarea>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-decorator="[
                                    'examDetailExplain2',
                                    { rules: [{ required: true, message: '选项解析不能为空' }] },
                                ]" v-model="tableList[1].examDetailExplain2" placeholder="请输入选项解析">
                                    </a-textarea>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 1%;text-align: center">
                                    <a-checkbox v-model="tableList[2].examDetailAnswer3" @change="onAnswerChange">
                                        选择答案
                                    </a-checkbox>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-decorator="[
                                    'examDetailContent3',
                                    { rules: [{ required: true, message: '选项内容不能为空' }] },
                                ]" v-model="tableList[2].examDetailContent3" placeholder="请输入选项内容">
                                    </a-textarea>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-decorator="[
                                    'examDetailExplain3',
                                    { rules: [{ required: true, message: '选项解析不能为空' }] },
                                ]" v-model="tableList[2].examDetailExplain3" placeholder="请输入选项解析">
                                    </a-textarea>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 1%;text-align: center">
                                    <a-checkbox v-model="tableList[3].examDetailAnswer4" @change="onAnswerChange">
                                        选择答案
                                    </a-checkbox>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-decorator="[
                                    'examDetailContent4',
                                    { rules: [{ required: true, message: '选项内容不能为空' }] },
                                ]" v-model="tableList[3].examDetailContent4" placeholder="请输入选项内容">
                                    </a-textarea>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-decorator="[
                                    'examDetailExplain4',
                                    { rules: [{ required: true, message: '选项解析不能为空' }] },
                                ]" v-model="tableList[3].examDetailExplain4" placeholder="请输入选项解析">
                                    </a-textarea>
                                </td>
                            </tr>
                        </table>

                        <table v-if="this.typeVal == 3" width="100%" border="1" style="border: 1px solid darkgrey;">
                            <tr>
                                <td style="padding: 1%;text-align: center">
                                    <a-checkbox v-model="tableList[0].examDetailAnswer1">
                                        选择答案
                                    </a-checkbox>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-decorator="[
                                    'examDetailContent1',
                                    { rules: [{ required: true, message: '选项内容不能为空' }] },
                                ]" v-model="tableList[0].examDetailContent1" placeholder="请输入选项内容">
                                    </a-textarea>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-decorator="[
                                    'examDetailExplain1',
                                    { rules: [{ required: true, message: '选项解析不能为空' }] },
                                ]" v-model="tableList[0].examDetailExplain1" placeholder="请输入选项解析">
                                    </a-textarea>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 1%;text-align: center">
                                    <a-checkbox v-model="tableList[1].examDetailAnswer2" @change="onAnswerChange">
                                        选择答案
                                    </a-checkbox>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-decorator="[
                                    'examDetailContent2',
                                    { rules: [{ required: true, message: '选项内容不能为空' }] },
                                ]" v-model="tableList[1].examDetailContent2" placeholder="请输入选项内容">
                                    </a-textarea>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-decorator="[
                                    'examDetailExplain2',
                                    { rules: [{ required: true, message: '选项解析不能为空' }] },
                                ]" v-model="tableList[1].examDetailExplain2" placeholder="请输入选项解析">
                                    </a-textarea>
                                </td>
                            </tr>
                        </table>
                    </a-form-item>
                </a-form>
            </a-modal>


            <!-- 修改题型 -->
            <a-modal width="50%" v-model="visibleExam" title="修改题型" ok-text="确认" cancel-text="取消" @ok="handleExamOk" @cancel="handleExamCancel">
                <a-form :form="form">
                    <a-form-item style="display: none;">
                        <a-input v-decorator="['id']"></a-input>
                    </a-form-item>
                    <a-form-item label="试题类型">
                        <a-select
                                disabled="disabled"
                                v-decorator="[
                                    'titleType',
                                    { rules: [{ required: true, message: '试题类型不能为空' }] }
                                ]">
                            <a-select-option :value="1">
                                单选题
                            </a-select-option>
                            <a-select-option :value="2">
                                多选题
                            </a-select-option>
                            <a-select-option :value="4">
                                简答题
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="难度等级">
                        <a-select
                                v-decorator="[
                                    'titleLevel',
                                    { rules: [{ required: true, message: '难度等级不能为空' }] },
                                ]">
                            <a-select-option :value="1">
                                简单
                            </a-select-option>
                            <a-select-option :value="2">
                                一般
                            </a-select-option>
                            <a-select-option :value="3">
                                较难
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="试题内容">
                        <a-textarea
                                v-decorator="[
                                    'titleName',
                                    { rules: [{ required: true, message: '试题内容不能为空' }] },
                                ]"
                        ></a-textarea>
                    </a-form-item>
<!--                    <a-form-item label="试题分数">-->
<!--                        <a-input-->
<!--                                v-decorator="[-->
<!--                                    'titlePoint',-->
<!--                                    { rules: [{ required: true, message: '试题分数不能为空' }] },-->
<!--                                ]"-->
<!--                                placeholder="请输入试题分数"></a-input>-->
<!--                    </a-form-item>-->
                    <a-form-item>
                        <table v-if="this.typeVal == 1 || this.typeVal == 2" width="100%" border="1" style="border: 1px solid darkgrey;">
                            <tr>
                                <td style="padding: 1%;text-align: center">
                                    <a-checkbox v-model="tableList[0].examDetailAnswer1">
                                        选择答案
                                    </a-checkbox>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea  v-model="tableList[0].examDetailContent1" placeholder="请输入选项内容">
                                    </a-textarea>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-model="tableList[0].examDetailExplain1" placeholder="请输入选项解析">
                                    </a-textarea>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 1%;text-align: center">
                                    <a-checkbox v-model="tableList[1].examDetailAnswer2" @change="onAnswerChange">
                                        选择答案
                                    </a-checkbox>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea  v-model="tableList[1].examDetailContent2" placeholder="请输入选项内容">
                                    </a-textarea>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-model="tableList[1].examDetailExplain2" placeholder="请输入选项解析">
                                    </a-textarea>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 1%;text-align: center">
                                    <a-checkbox v-model="tableList[2].examDetailAnswer3" @change="onAnswerChange">
                                        选择答案
                                    </a-checkbox>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea  v-model="tableList[2].examDetailContent3" placeholder="请输入选项内容">
                                    </a-textarea>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-model="tableList[2].examDetailExplain3" placeholder="请输入选项解析">
                                    </a-textarea>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 1%;text-align: center">
                                    <a-checkbox v-model="tableList[3].examDetailAnswer4" @change="onAnswerChange">
                                        选择答案
                                    </a-checkbox>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-model="tableList[3].examDetailContent4" placeholder="请输入选项内容">
                                    </a-textarea>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea  v-model="tableList[3].examDetailExplain4" placeholder="请输入选项解析">
                                    </a-textarea>
                                </td>
                            </tr>
                        </table>

                        <table v-if="this.typeVal == 3" width="100%" border="1" style="border: 1px solid darkgrey;">
                            <tr>
                                <td style="padding: 1%;text-align: center">
                                    <a-checkbox v-model="tableList[0].examDetailAnswer1">
                                        选择答案
                                    </a-checkbox>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-model="tableList[0].examDetailContent1" placeholder="请输入选项内容">
                                    </a-textarea>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-model="tableList[0].examDetailExplain1" placeholder="请输入选项解析">
                                    </a-textarea>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 1%;text-align: center">
                                    <a-checkbox v-model="tableList[1].examDetailAnswer2" @change="onAnswerChange">
                                        选择答案
                                    </a-checkbox>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-model="tableList[1].examDetailContent2" placeholder="请输入选项内容">
                                    </a-textarea>
                                </td>
                                <td style="padding: 1%;">
                                    <a-textarea v-model="tableList[1].examDetailExplain2" placeholder="请输入选项解析">
                                    </a-textarea>
                                </td>
                            </tr>
                        </table>

                    </a-form-item>
                </a-form>
            </a-modal>

        </div>
    </Layout>
</template>

<script>
    import Layout from '@/views/dashboard/layout.vue'
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import ATextarea from "ant-design-vue/es/input/TextArea";
    import { findAllTitle } from "../../api/examTitle";
    import { findExamTitleByParams } from "../../api/examTitle";
    import { deleteExamTitle } from "../../api/examTitle";
    import { updateExamTitleById } from "../../api/examTitle";
    import { addExamTitle } from "../../api/examTitle";

    const dataNew = [
    ];
    const columnsNew = [
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
        }
    ];

    export default {
        name: "examManager",
        components: {
            ATextarea,
            AFormItem,
            Layout
        },
        data () {
            return {
                dataNew,
                columnsNew,
                // data,
                // columns,
                // 单选和多选
                tableList:[
                    {
                        'id': '',
                        'examDetailAnswer1':false,
                        'examDetailContent1':'',
                        'examDetailExplain1':'',
                    },
                    {
                        'id': '',
                        'examDetailAnswer2':false,
                        'examDetailContent2':'',
                        'examDetailExplain2':'',
                    },
                    {
                        'id': '',
                        'examDetailAnswer3':false,
                        'examDetailContent3':'',
                        'examDetailExplain3':'',
                    },
                    {
                        'id': '',
                        'examDetailAnswer4':false,
                        'examDetailContent4':'',
                        'examDetailExplain4':'',
                    }
                ],
                visibleAddExam: false,
                visibleExam: false,
                visibleAnswer: false,
                form: this.$form.createForm(this),
                selectedRowKeys: [],
                selectRows: [],
                typeVal: '1',
                titleType: '',
                titleName: '',
                examId: this.$route.params.id
            }
        },
        created() {
            this.findAllExamTitle(this.examId)
        },
        methods: {
            onAnswerChange(e) {
                console.log(`checked = ${e.target.checked}`);
            },
            selectExamTitleByParams() {
                findExamTitleByParams({titleType: this.titleType,titleName: this.titleName,examId: this.examId}).then(res => {
                    if( "success" === res.msg ){
                        this.dataNew = res.data.paperExamTitle;
                        this.titleType = ''
                    }else{
                        this.$notification['error']({
                            message: '查询失败，请联系管理员',
                        });
                    }
                }).catch(err => {
                    if( err ) {
                        this.$notification['error']({
                            message: '系统错误，请联系管理员',
                        });
                    }
                })
            },
            findAllExamTitle(id) {
                findAllTitle({id: id}).then(res => {
                    if( "success" === res.msg ){
                        console.log(res)
                        this.dataNew = res.data;
                    }else{
                        this.$notification['error']({
                            message: '查询失败，请联系管理员',
                        });
                    }
                }).catch(err => {
                    if( err ) {
                        this.$notification['error']({
                            message: '系统错误，请联系管理员',
                        });
                    }
                })
            },
            onRowSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                this.selectRows = selectedRows
                console.log(selectedRowKeys, selectedRows)
            },
            showExamModalEdit (id) {
                this.visibleExam = true
                findExamTitleByParams({id: id}).then(res =>{
                    console.log(res)
                    if( "success" === res.msg ){
                        this.form.setFieldsValue({
                            // 将题目信息绑定
                            id: res.data.paperExamTitle[0].id,
                            titleType: res.data.paperExamTitle[0].titleType,
                            titleLevel: res.data.paperExamTitle[0].titleLevel,
                            titleName: res.data.paperExamTitle[0].titleName,
                            titlePoint: res.data.paperExamTitle[0].titlePoint,
                        })
                            this.tableList[0].id = res.data.paperExamDetailAnswer[0].id;
                            this.tableList[0].examDetailAnswer1 = res.data.paperExamDetailAnswer[0].examDetailAnswer === 1 ? true : false;
                            this.tableList[0].examDetailContent1 = res.data.paperExamDetailAnswer[0].examDetailContent
                            this.tableList[0].examDetailExplain1 = res.data.paperExamDetailAnswer[0].examDetailExplain

                            this.tableList[1].id = res.data.paperExamDetailAnswer[1].id;
                            this.tableList[1].examDetailAnswer2 = res.data.paperExamDetailAnswer[1].examDetailAnswer === 1 ? true : false;
                            this.tableList[1].examDetailContent2 = res.data.paperExamDetailAnswer[1].examDetailContent
                            this.tableList[1].examDetailExplain2 = res.data.paperExamDetailAnswer[1].examDetailExplain

                            this.tableList[2].id = res.data.paperExamDetailAnswer[2].id;
                            this.tableList[2].examDetailAnswer3 = res.data.paperExamDetailAnswer[2].examDetailAnswer === 1 ? true : false;
                            this.tableList[2].examDetailContent3 = res.data.paperExamDetailAnswer[2].examDetailContent
                            this.tableList[2].examDetailExplain3 = res.data.paperExamDetailAnswer[2].examDetailExplain

                            this.tableList[3].id = res.data.paperExamDetailAnswer[3].id;
                            this.tableList[3].examDetailAnswer4 = res.data.paperExamDetailAnswer[3].examDetailAnswer === 1 ? true : false;
                            this.tableList[3].examDetailContent4 = res.data.paperExamDetailAnswer[3].examDetailContent
                            this.tableList[3].examDetailExplain4 = res.data.paperExamDetailAnswer[3].examDetailExplain
                        console.log(this.tableList)
                    }else{
                        this.$notification['error']({
                            message: '查询失败，请联系管理员',
                        });
                    }
                }).catch(err => {
                    if( err ) {
                        this.$notification['error']({
                            message: '系统错误，请联系管理员',
                        });
                    }
                })
            },
            back () {
                this.$router.go(-1)
            },
            handleDel () {
                deleteExamTitle( {ids: this.selectedRowKeys.join(",")} ).then(res => {
                    console.log(res)
                    if( "success" === res.msg ){
                        this.$notification['success']({
                            message: '删除成功',
                        });
                        this.findAllExamTitle(this.examId)
                    }else{
                        this.$notification['error']({
                            message: '删除失败，请联系管理员',
                        });
                    }
                }).catch(err => {
                    if( err ) {
                        console.log(err)
                        this.$notification['error']({
                            message: '系统错误，请联系管理员',
                        });
                    }
                })
            },
            addExamDetail() {
                this.visibleAddExam = true
                this.tableList[0].examDetailAnswer1 = false
                this.tableList[1].examDetailAnswer2 = false
                this.tableList[2].examDetailAnswer3 = false
                this.tableList[3].examDetailAnswer4 = false
            },
            handleAddExamOk() {
                this.form.validateFields((err, values) => {
                    addExamTitle({ examId: this.examId,titleType: values.titleType, titleName: values.titleName, titlePoint: values.titlePoint,titleLevel: values.titleLevel,tableList: this.tableList }).then(res =>{
                        if ("fail" === res.msg) {
                            this.$notification['error']({
                                message: '添加失败',
                            });
                        }else{
                            this.$notification['success']({
                                message: '添加成功',
                            });
                            this.visibleAddExam = false;
                            this.findAllExamTitle(this.examId)
                            this.form.resetFields();
                        }
                    })
                    console.log(values)
                });
            },
            handleAddExamCancel(){
                this.visibleAddExam = false
                this.form.resetFields();
            },
            handleExamOk() {
                this.form.validateFields((err, values) => {
                    if (err) {
                        this.$notification['error']({
                            message: '修改失败',
                        });
                    }else{
                        updateExamTitleById({id: values.id, titleLevel: values.titleLevel, titleName: values.titleName,titlePoint: values.titlePoint,titleType: values.titleType, tableList: this.tableList}).then(res =>{
                            if( "success" === res.msg ){
                                this.$notification['success']({
                                    message: '修改成功',
                                });
                                this.visibleExam = false
                                this.findAllExamTitle(this.examId)
                                this.form.resetFields();
                            }
                        })
                    }
                    console.log(values)
                });
            },
            handleExamCancel(){
                this.visibleExam = false
                this.tableList[0].examDetailAnswer1 = false
                this.tableList[1].examDetailAnswer1 = false
                this.tableList[2].examDetailAnswer1 = false
                this.tableList[3].examDetailAnswer1 = false
                this.form.resetFields();
            },
            addAnswer () {
                this.visibleAnswer = true
            },
            handleExamAnswerOk () {
                this.form.validateFields((err, values) => {
                    if (err) {
                        this.$notification['error']({
                            message: '添加失败',
                        });
                    }else{
                        this.$notification['success']({
                            message: '添加成功',
                        });
                    }
                    console.log(values)
                });
            },
            handleExamAnswerClose () {
                this.visibleAnswer = false
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