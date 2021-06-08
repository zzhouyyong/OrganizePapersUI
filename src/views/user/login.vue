<template>
    <div>
        <div class="container">
            <div id="particlsLogin">
                <a-form class="card-box" v-model="loginForm">
                    <a-form-item><span class="welMsg loginText">99在线组卷欢迎您</span></a-form-item>
                    <a-form-item>
                        <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                        <a-input type="text" class="loginInput" placeholder="请输入手机号/邮箱"
                                 v-model="loginForm.phoneOrEmail"></a-input>
                    </a-form-item>
                    <a-form-item>
                        <i class="fa fa-lock" aria-hidden="true" style="font-size: 20px"></i>
                        <a-input type="password" class="loginInput" placeholder="请输入密码"
                                 v-model="loginForm.password"></a-input>
                    </a-form-item>
                    <div class="action">
                    <a-button class="loginButton" type="primary" @click="login">登录</a-button>
                    <a-button class="registButton" type="primary" @click="dialogFormVisible = true">注册</a-button>
                    </div>
                </a-form>
                <!-- 注册弹窗 -->
                <a-modal width="35%" title="注册中心" :visible="dialogFormVisible" @cancel="cancel">
                    <a-form :form="form">
                        <a-form-item label="邮箱/手机号" :label-width="formLabelWidth" prop="phoneOrEmail">
                            <a-input
                                    placeholder="请输入邮箱或者手机号注册"
                                    autocomplete="off"
                                    v-decorator="[
                                'phoneOrEmail',
                                {
                                    rules: [
                                    {required: true, message: '请输入邮箱或者手机号注册'},
                                    ]
                                }
                                ]"
                            >
                            </a-input>
                        </a-form-item>
                        <a-form-item label="密码" :label-width="formLabelWidth">
                            <a-input
                                    type="password"
                                    placeholder="请输入密码"
                                    autocomplete="off"
                                    v-decorator="[
                                'password',
                                {
                                    rules: [
                                    {required: true, message: '请输入密码'},
                                    {validator: validateToNextPassword }
                                    ]
                                }
                                ]"
                            ></a-input>
                        </a-form-item>
                        <a-form-item label="确认密码" :label-width="formLabelWidth">
                            <a-input
                                    type="password"
                                    @blur="handleConfirmBlur"
                                    autocomplete="off"
                                    placeholder="请再次输入密码"
                                    v-decorator="[
                                'confirmPwd',
                                {
                                    rules: [
                                     { required: true, message: '请再次输入密码' },
                                     { validator: compareToFirstPassword }
                                    ],
                                }
                                ]"
                            ></a-input>
                        </a-form-item>
                    </a-form>
                    <template slot="footer" class="dialog-footer">
                        <a-button @click="resetForm">重 置</a-button>
                        <a-button type="primary" :plain="true" @click="submitForm">提 交</a-button>
                    </template>
                </a-modal>
            </div>
        </div>
    </div>
</template>

<script>
    import { userLogin } from "../../api/user";
    import { userRegister } from "../../api/user";
    export default {
        data() {
            return {
                loginForm: {
                    phoneOrEmail: '',
                    password: ''
                },
                dialogTableVisible: false,
                dialogFormVisible: false,
                form: this.$form.createForm(this),
                confirmDirty: false,
                formLabelWidth: '70px'
            };
        },
        methods: {
            // 重置
            resetForm() {
                this.form.resetFields();
            },
            handleConfirmBlur(e) {
                const value = e.target.value;
                this.confirmDirty = this.confirmDirty || !!value;
            },
            compareToFirstPassword(rule, value, callback) {
                const form = this.form;
                if (value && value !== form.getFieldValue('password')) {
                    callback('两次输入的密码不一致，请重新输入');
                } else {
                    callback();
                }
            },
            validateToNextPassword(rule, value, callback) {
                const form = this.form;
                if (value && this.confirmDirty) {
                    form.validateFields(['confirmPwd'], { force: true });
                }
                callback();
            },

            // 提交注册信息，val是表单中输入的数据
            submitForm() {
                // debugger
                this.form.validateFieldsAndScroll((err, val) => {
                    userRegister(val).then(res => {
                        if( "success" === res.msg ) {
                            this.$notification['success']({
                                message: '注册成功，欢迎您',
                            });
                        }else{
                            this.$notification['error']({
                                message: '注册失败，请检查用户名或者密码',
                            });
                        }
                        this.resetForm()
                        this.dialogFormVisible = false
                    }).catch(err => {
                        if( err ) {
                            this.$notification['error']({
                                message: '系统错误，请联系管理员',
                            });
                        }
                    });
                })
            },
            //登录
            login() {
                userLogin(this.loginForm).then(res =>{
                    console.log(res)
                    if( "success" === res.msg ) {
                        this.$notification['success']({
                            message: '登录成功，【' + res.data.username + '】欢迎您',
                        });
                        this.$router.push({
                            name: 'exam-detail',
                        })
                        localStorage.setItem("username", res.data.username);
                        localStorage.setItem("userId", res.data.id)
                    }else{
                        this.$notification['error']({
                            message: '登录失败，账号或者密码错误',
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
            cancel() {
                this.dialogFormVisible = false
            }
        }
    };
</script>

<style scoped>
    /*input框中的图标样式*/
    i.fa {
        position: absolute;
        top: 13px;
        left: 8px;
        font-size: 16px;
        color: #8c939d
    }
    .welMsg {
        font-size: 18px;
    }

    .loginText {
        color: black;
    }

    .loginButton, .registButton{
        width: 120px;
        border-radius: 15px;
        margin: 5px;
    }
    .action {
        width: 100%;
        display: flex;
        justify-content: center;
    }
    #particlsLogin {
        /*position: absolute;*/
        width: 100%;
        height: 100vh;
        /*background: rgba(19, 30, 70, 1);*/
        background: url("../../assets/images/coding2.jpg") no-repeat;
        background-size: 100% 100%;
    }

    .container {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        /*background: url(../assets/bg.jpg) no-repeat center center fixed;
        background-size: cover;*/

    }

    .card-box {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        /*background-color: #dfe5ec;*/
        border-radius: 5px;
        margin: 0 auto;
    }

    .loginInput {
        color: white;
        background-color: transparent;
        /*border-width: 0.5px;*/
        /*border-color: #f0f0f0;*/
        height: 30px;
        width: 250px;
        border-radius: 15px;
        border: 1px solid black;
        transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
        text-indent: 38px;
        /*outline:medium;*/ /*点击时不加边框*/
    }

    /*input点击边框样式*/
    input:focus {
        border-color: #409EFF !important;
        outline: 0;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, 0.6);
        -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, 0.6);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, 0.6);
    }

    ::-webkit-input-placeholder {
        font-size: 13px;
        color: #8c939d;
    }
</style>