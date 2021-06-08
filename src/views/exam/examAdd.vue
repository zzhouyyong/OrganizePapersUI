<template>
    <Layout>
        <div id="add">
            <div class="back">
                <a-icon type="left"></a-icon>
                <a @click="back">添加题库</a>
            </div>
            <div class="content">
                <a-form :form="form" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
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
                                v-decorator="[
                                    'examType',
                                    { rules: [{ required: true, message: '题库类别不能为空' }] },
                                ]"

                                placeholder="请选择题库类别"
                        >
                            <a-select-option value="1">
                                计算机科学与技术类
                            </a-select-option>
                            <a-select-option value="2">
                                文学类
                            </a-select-option>
                            <a-select-option value="3">
                                商管类
                            </a-select-option>
                            <a-select-option value="4">
                                语言类
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="题库备注">
                        <a-textarea
                                v-decorator="[
                                    'examRemark',
                                ]"
                                placeholder="请输入题库备注"
                        ></a-textarea>
                    </a-form-item>
                    <a-button type="primary" @click="handleSubmit">保存</a-button>
                    <a-button style="margin-left: 2%" @click="handleCancle">取消</a-button>
                </a-form>
            </div>
        </div>
    </Layout>
</template>

<script>
    import Layout from '@/views/dashboard/layout.vue'
    import { addExam } from "../../api/exam";
    export default {
        name: "examAdd",
        components: {
            Layout
        },
        data () {
            return {
                form: this.$form.createForm(this)
            }
        },
        methods: {
            back () {
                this.$router.go(-1)
            },
            handleCancle () {
                this.back()
            },
            handleSubmit () {
                this.form.validateFields((err, values) => {
                    addExam(values).then(res => {
                        if( "success" === res.msg ) {
                            this.$notification['success']({
                                message: '保存成功',
                            });
                            this.$router.push({
                                name: 'exam-detail'
                            })
                        }else{
                            this.$notification['error']({
                                message: '保存失败，请检查输入项是否填写正确',
                            });
                        }
                    }).catch(err => {
                        if( err ) {
                            this.$notification['error']({
                                message: '系统错误，请联系管理员',
                            });
                        }
                    })
                    this.resetForm()
                });
                // this.form.resetFields()
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