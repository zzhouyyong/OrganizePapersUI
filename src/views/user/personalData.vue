<template>
    <layout>
        <div >
            <a-row>
                <a-col :span="7">
                    <table style="box-shadow: 0 2px 12px 0 rgb(0 0 0 / 20%); margin-top: 3%; padding: 1%;">
                        <tr>
                            <td style="width: 45%;border-bottom: 1px solid darkgrey;text-align: left;padding: 8%">
                                <span>个人资料</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding-top: 19%;">
                                <a-avatar :size="128" style="color: #f56a00; backgroundColor: #fde3cf" icon="user">
                                </a-avatar><br>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding-top: 5%; padding-bottom: 21%">
                                <span>{{ username }}</span>
                            </td>
                        </tr>
                    </table>
                </a-col>
                <a-col :span="17">
                    <table width="100%" style="box-shadow: 0 2px 12px 0 rgb(0 0 0 / 20%); margin-top: 1%; padding: 1%;">
                        <tr>
                            <td>
                                <a-form style="padding: 5%;text-align: left">
                                    <a-form-item label="用户名">
                                        <a-input placeholder="不修改请留空" v-model="username1"></a-input>
                                    </a-form-item>
                                    <a-form-item label="密码">
                                        <a-input type="password" placeholder="不修改请留空" v-model="password"></a-input>
                                    </a-form-item>
                                    <a-form-item>
                                        <a-button @click="updateNameOrPwd" type="primary">修改</a-button>
                                    </a-form-item>
                                </a-form>
                            </td>
                        </tr>
                    </table>
                </a-col>
            </a-row>
        </div>
    </layout>
</template>

<script>
    import Layout from '@/views/dashboard/layout.vue'
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import { updateUser } from "../../api/user";
    import { findUserById } from "../../api/user";

    export default {
        name: "personalData",
        data(){
            return {
                username: localStorage.getItem("username"),
                id: localStorage.getItem("userId"),
                username1: '',
                password: ''
            }
        },
        created() {
            findUserById({id: this.id}).then(res => {
                console.log(res);
                this.username1 = res.data.username
            })
        },
        methods: {
            updateNameOrPwd() {
                updateUser({ id: this.id, username: this.username1, password: this.password }).then(res =>{
                    if( res.msg === "success" ) {
                        this.password = ''
                        this.$notification['success']({
                            message: '更新成功，请重新登录',
                        });
                        this.$router.push({
                            name: '登录页'
                        });
                    }else{
                        this.$notification['error']({
                            message: '更新失败，请联系管理员',
                        });
                    }
                }).catch(err => {
                    if( err ) {
                        this.$notification['error']({
                            message: '系统错误，请联系管理员',
                        });
                    }
                })

            }
        },
        components: {
            AFormItem,
            Layout
        }
    }
</script>

<style scoped>

</style>