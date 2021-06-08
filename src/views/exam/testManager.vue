<template>
    <Layout>
        <div>
            <a-row>
                <a-col :span="12">
                    <a-range-picker
                            :locale="locale"
                            :disabled-date="disabledDate"
                            :disabled-time="disabledRangeTime"
                            :show-time="{
                            hideDisabledOptions: true,
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                            }"
                            format="YYYY-MM-DD HH:mm:ss"
                            style="width: 97%"
                            @change="getTime"
                    />
                </a-col>
<!--                <a-col :span="6">-->
<!--                    <a-time-picker style="width: 95%"  placeholder="考试结束时间" :open.sync="endOpen" @change="handleEndTime">-->
<!--                        <a-button slot="addon" size="small" type="primary" @click="handleEnd">-->
<!--                            Ok-->
<!--                        </a-button>-->
<!--                    </a-time-picker>-->
<!--                </a-col>-->
                <a-col :span="6">
                    <a-input style="width: 132%" placeholder="请输入考试名称" v-model="testName"></a-input>
                </a-col>
                <a-col :span="6">
                    <a-button style="width: 32%" type="primary" @click="findByParams"><a-icon type="search"></a-icon>查询</a-button>
                </a-col>
            </a-row>
            <a-button style="float: left;margin-top: 1%" type="primary" @click="toAddTest"><a-icon type="plus"></a-icon>添加</a-button>
            <a-button type="danger" style="float: left;margin-top: 1%;margin-left: 1%" @click="handleDel">
                <a-icon type="minus"></a-icon>
                批量删除
            </a-button>

            <!-- 表单 -->
            <a-table style="margin-top: 5%" :rowSelection="{ selectRowKeys: selectedRowKeys, onChange: onRowSelectChange  }" :columns="columns" :data-source="data" row-key="id">
                <div slot="action" slot-scope="record">
                    <a-button @click="testModify(record.id)" size="small" icon="edit" slot="action" href="javascript:;">修改</a-button>
                </div>
            </a-table>
        </div>
    </Layout>
</template>

<script>
    import Layout from '@/views/dashboard/layout.vue';
    import { findAllTestTitle } from "../../api/zy";
    import { deleteTestTitle } from "../../api/zy";
    import { findTestTitleByParams } from "../../api/zy";
    import moment from 'moment';
    import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';

    const data = [
    ];
    const columns = [
        {
            title: '考试名称',
            dataIndex: 'testName',
            key: 'testName',
        },
        {
            title: '考试时间(分钟)',
            dataIndex: 'testTime',
            key: 'testTime',
        },
        {
            title: '考试总分',
            dataIndex: 'testPoint',
            key: 'testPoint',
        },
        {
            title: '及格线',
            key: 'testPassPoint',
            dataIndex: 'testPassPoint',
        },
        {
            title: '状态',
            key: 'testState',
            dataIndex: 'testState',
            customRender:function (text) {
                if ( text == 0 ) {
                    return '进行中'
                }
                if( text == 1 ){
                    return '已结束'
                }
                if( text == 2 ) {
                    return '未开始'
                }
            }
        },
        {
            title: '创建时间',
            key: 'createTime',
            dataIndex: 'createTime',
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
            Layout
        },
        data () {
            return {
                locale,

                data,
                columns,

                selectedRowKeys: [],
                selectRows: [],

                startAndEndTime: [],
                testName: '',
                startOpen: false,
                endOpen: false
            }
        },
        created() {
            this.findAllTest();
        },
        methods: {
            moment,

            findAllTest() {
                findAllTestTitle().then(res =>{
                    console.log(res)
                    this.data = res.data
                })
            },

            findByParams() {
                findTestTitleByParams({testName: this.testName, startTime: this.startAndEndTime[0], endTime: this.startAndEndTime[1]}).then(res =>{
                    if( "success" === res.msg ) {
                        this.data = res.data
                    }else{
                        this.$notification['error']({
                            message: '删除失败，请联系管理员',
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
            },

            onRowSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                this.selectRows = selectedRows
                console.log(selectedRowKeys, selectedRows)
            },

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

            getTime(time,timeString) {
                this.startAndEndTime = timeString
            },

            handleDel () {
                deleteTestTitle({ids: this.selectedRowKeys.join(",")}).then(res =>{
                    console.log(res)
                    if( "success" === res.msg ) {
                        this.$notification['success']({
                            message: '删除成功',
                        });
                        this.findAllTest()
                    }else{
                        this.$notification['error']({
                            message: '删除失败，请联系管理员',
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
            },
            toAddTest () {
                this.$router.push({
                    name: 'test-add'
                })
            },
            testModify(id) {
                this.$router.push({
                    name: 'test-modify',
                    params: {
                        id: id
                    }
                })
            }
        },
    }
</script>

<style scoped>
</style>