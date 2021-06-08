<template>
    <Layout>
        <div>
            <a-input-search placeholder="请输入你需要查找的题库名称" enter-button @search="onSearch" />
            <a-button type="primary" icon="plus" @click="showModalAdd" style="margin-top: 1%;float: left">
                添加
            </a-button>
            <a-button type="danger" icon="minus" @click="deleteExam" style="margin-top: 1%; margin-left: 1%; float: left">
                批量删除
            </a-button>

            <!-- 表单 -->
            <a-table style="margin-top: 5%;" :rowSelection="{ selectRowKeys: ids, onChange: onRowSelectChange }" :columns="columns" :data-source="data" row-key="id">
                <span slot="action" slot-scope="record">
                    <a-button @click="showModalEdit(record.id)" size="small" icon="edit">修改</a-button>
                    <a-button @click="toManagerPage(record.examName,record.id)" type="primary" size="small" icon="setting" style="margin-left: 15px">试题管理</a-button>
                </span>
            </a-table>

            <!-- 编辑题库 -->
            <a-modal v-model="visibleEdit" ok-text="确认" cancel-text="取消" title="修改题库" @ok="handleEditOk" @cancel="handleEditClose">
                <a-form :form="form">
                    <a-form-item style="display: none;">
                        <a-input v-decorator="['id']"></a-input>
                    </a-form-item>
                    <a-form-item
                            label="题库名称"
                    >
                        <a-input
                                v-decorator="[
                                    'examName',
                                    { rules: [{ required: true, message: '题库名称不能为空' }] },
                                ]"
                                placeholder="请输入题库名称"
                        />
                    </a-form-item>
                    <a-form-item label="题库类别">
                        <a-select
                                placeholder="请选择题库类别"
                                v-decorator="[
                                    'examType',
                                    { rules: [{ required: true, message: '题库类别不能为空' }] },
                                ]"
                        >
                            <a-select-option :value="1">
                                计算机科学与技术类
                            </a-select-option>
                            <a-select-option :value="2">
                                文学类
                            </a-select-option>
                            <a-select-option :value="3">
                                商管类
                            </a-select-option>
                            <a-select-option :value="4">
                                语言类
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="题库备注">
                        <a-input
                                v-decorator="[
                                    'examRemark'
                                ]"
                                placeholder="请输入题库备注"/>
                    </a-form-item>
                </a-form>
            </a-modal>
        </div>
    </Layout>
</template>

<script>
    import Layout from '@/views/dashboard/layout.vue'
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import { findAllExam } from "../../api/exam";
    import { deleteExam } from "../../api/exam";
    import { findExamByParams } from "../../api/exam";
    import { updateExamById } from "../../api/exam";

    const columns = [
        {
            title: '题库名称',
            dataIndex: 'examName',
            key: 'examName',
            slots: { title: 'customTitle' },
            scopedSlots: { customRender: 'examName' },
        },
        {
            title: '试题数量',
            dataIndex: 'examNumber',
            key: 'examNumber',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: { customRender: 'action' },
        },
    ];

    const data = [

    ];

    export default {
        name: "examDetail",
        data() {
            return {
                form: this.$form.createForm(this),
                visibleAdd: false,
                visibleEdit: false,
                data,
                columns,
                ids: [],
                selectRows: []
            };
        },
        created() {
            this.findAllExam2()
        },
        methods: {
            findAllExam2(){
                findAllExam().then(res => {
                    if( "success" === res.msg ){
                        console.log(res)
                        this.data = res.data;
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
            onSearch(value) {
                findExamByParams({examName: value}).then(res => {
                    if( "success" === res.msg ){
                        console.log(res)
                        this.data = res.data;
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
            showModalAdd() {
                // this.visibleAdd = true;
                this.$router.push({
                    name: 'exam-add'
                })
            },
            deleteExam() {
                deleteExam( {ids: this.ids.join(",")} ).then(res =>{
                    console.log(res)
                    if( "success" === res.msg ){
                        this.$notification['success']({
                            message: '删除成功',
                        });
                        this.findAllExam2()
                    }else{
                        this.$notification['error']({
                            message: '删除失败，请联系管理员',
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

            showModalEdit(id) {
                this.visibleEdit = true;
                console.log(id)
                findExamByParams({id: id}).then(res =>{
                    console.log(res)
                    if( res.code === 200 ) {
                        this.form.setFieldsValue({
                            id: res.data[0].id,
                            examName: res.data[0].examName,
                            examType: res.data[0].examType,
                            examRemark: res.data[0].examRemark
                        })
                        console.log(this.form)
                    }
                })
            },

            handleEditOk() {
                this.form.validateFields((err, values) => {
                    if (err) {
                        this.$notification['error']({
                            message: '修改失败',
                        });
                    }else{
                        updateExamById(values).then(res =>{
                            console.log(values)
                            if( "success" === res.msg ) {
                                this.$notification['success']({
                                    message: '修改成功',
                                });
                                this.findAllExam2()
                                this.visibleEdit = false
                            }
                        })

                    }
                    console.log(values)
                });
            },
            handleEditClose() {
                this.visibleAdd = false;
                this.form.resetFields();
            },

            toManagerPage(examName,id) {
                this.$router.push({
                    name: 'exam-manager',
                    params: {
                        examName: examName,
                        id: id
                    }
                })
            },

            onRowSelectChange(selectedRowKeys, selectedRows) {
                this.ids = selectedRowKeys
                this.selectRows = selectedRows
                console.log(selectedRowKeys, selectedRows)
            },
        },
        components: {
            AFormItem,
            Layout
        }
    }
</script>

<style scoped>
    /deep/ .ant-input-group{
        width: 40%;
    }
    /*/deep/ .ant-table-body{
        margin-top: 5%;
    }*/
</style>