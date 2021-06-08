<template>
    <a-layout id="components-layout-demo-top-side-2">
        <a-layout-header class="header">
            <span class="logo-text" >99在线组卷系统</span>
            <a-dropdown>
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                    {{ username }} <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                    <a-menu-item>
                        <a @click="itemclickPlus('personal-data')">个人资料<a-icon type="user"/></a>
                    </a-menu-item>
                    <a-menu-item>
                        <a @click="loginOut">退出登录<a-icon type="close"/></a>
                    </a-menu-item>
                </a-menu>
            </a-dropdown>
        </a-layout-header>
        <a-layout>
            <a-layout-sider width="200" style="background: #fff">
                <a-menu
                        mode="inline"
                        :default-selected-keys="selectedKeys"
                        :style="{ height: '100%', borderRight: 0 }"
                        @click="itemclick"
                        :defaultOpenKeys="['sub2']"
                        >
                    <a-sub-menu key="sub2">
                        <span slot="title"><a-icon type="laptop" />考试管理</span>
                        <a-menu-item key="exam-detail">
                                题库管理
                        </a-menu-item>
                        <a-menu-item key="exam-testmanager">
                            考试管理
                        </a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </a-layout-sider>
            <a-layout>
                <a-layout-content
                        :style="{ background: '#fff', padding: '10px', margin: '15px', minHeight: '130%' }"
                >
                    <slot></slot>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </a-layout>
</template>
<script>
    import { loginOut } from "../../api/user";

    export default {
        name: 'Layout',
        data() {
            return {
                selectedKeys: [this.$route.name],
                username: localStorage.getItem("username"),
            };
        },
        methods: {
            loginOut() {
                loginOut().then(res =>{
                    if( "success" === res.msg ){
                        this.$router.push({
                            name: '登录页'
                        })
                    }else{
                        this.$notification['error']({
                            message: '会话session已过期',
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

            itemclick(val) {
                this.$router.push({
                    name: val.key
                })
            },

            itemclickPlus(val) {
                this.$router.push({
                    name: val
                })
            }
        }
    };
</script>

<style scoped>
    #components-layout-demo-top-side-2 {
        height: 115vh;
    }
    .ant-breadcrumb{
        text-align: left;
    }
    .logo-text {
        float: left;
        color: #fff;
        font-size: 15px;
    }
    .ant-dropdown-link{
        float: right;
        color: #fff;
        font-size: 15px;
    }
</style>
