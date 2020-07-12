import React, { Component } from "react";
import { Card, Button, Table, message, Modal } from "antd";
import { reqRoles, reqAddRole } from "../../api";
import AddForm from "./add-form";
import UpateForm from "./update-form";

// 角色路由
export default class Role extends Component {
    state = {
        roles: [], // 所有角色的列表
        role: {}, // 选中的角色(根据此要实现前面的按钮对应高亮)
        loading: false,
        add_visible: false,
        update_visible: false,
    };

    showAddModal = () => {
        this.setState({ add_visible: true });
    };

    cancelAddModal = () => {
        this.setState({ add_visible: false });
        // this.formRef_current.resetFields();
    };

    okAddModal = () => {
        // 1.前提条件：先进行表单的验证
        this.formRef_current.validateFields().then(async (values) => {
            // 2.隐藏Modal弹出框
            this.setState({ add_visible: false });

            // 3.从表单中搜集数据做接口参数的准备
            const { roleName } = values;
            this.formRef_current.resetFields();

            // 3.请求接口
            const result = await reqAddRole(roleName);

            if (result.status === 0) {
                // 4.判断并处理表单的更新(=>新表单)
                /* this.getRoles();
				因为上面那个又要发送一次接口请求,可尝试下列做法(即更新我们state中的对象role的值状态就能解决)：
				
				Ⅰ.新产生角色(基于原状态数据(整个)的替换)：*/
                const role = result.data;
                // const { roles } = this.state;
                // roles.push(role);
                // this.setState({ roles });

                /* 
				上面的这个方法有点bug：表单添加后要刷新页面才能看见，不能自刷新表格
				可能原因 ：push()返回的不是新数组是新数组的长度虽然是添加值进去了 
				
				概念：对象中的扩展运算符(…)用于取出参数对象中的所有可遍历属性，拷贝到当前对象之中，属于一种浅拷贝。
				浅拷贝: 简单的说, obj2复制obj1,修改obj1的值,obj2的值随之改变,就是浅拷贝。
				思考：浅拷贝很重要吧，这样不就能拿到之前全部的而且做我们的添加操作了。
				*/

                // this.setState({ roles: [...this.state.roles, role] });

                // Ⅱ.基于原本状态数据某个(修改)更新(其实上面那个setState语法是简洁形式)
                this.setState((state, props) => ({
                    roles: [...state.roles, role],
                })); // 传一个函数返回对象，返回对象的函数在add-update.jsx中也用过

                message.success("添加角色信息成功！");
            } else {
                message.error("添加角色信息失败！");
            }
        });
    };

    okUpdateModal = () => {
        console.log("UpdateModal");
    };

    onRow = (role) => {
        return {
            onClick: (e) => {
                // 点击行(按钮中算?)的回调,此函数(onRow()语法结构)的用法可参考官方文档
                console.log("onRow() click", role); // role:当前行对象属性
                this.setState({ role });
            },
        };
    };

    initColumns = () => {
        this.columns = [
            {
                title: "角色名称",
                dataIndex: "name",
            },
            {
                title: "创建时间",
                dataIndex: "create_time",
            },
            {
                title: "授权时间",
                dataIndex: "auth_time",
            },
            {
                title: "授权人",
                dataIndex: "auth_name",
            },
        ];
    };

    getRoles = async () => {
        this.setState({ loading: true });

        const result = await reqRoles();

        this.setState({ loading: false });

        if (result.status === 0) {
            const roles = result.data;
            this.setState({ roles });
        } else {
            message.error("获取角色列表失败！");
        }
    };

    componentWillMount() {
        this.initColumns();
    }

    componentDidMount() {
        this.getRoles();
    }

    render() {
        const {
            roles,
            role,
            loading,
            add_visible,
            update_visible,
        } = this.state;
        const title = (
            <div>
                <Button type="primary" onClick={this.showAddModal}>
                    创建角色
                </Button>
                <span style={{ marginLeft: 10 }}>
                    <Button
                        type="primary"
                        disabled={!role._id}
                        onClick={() => {
                            this.setState({ update_visible: true });
                        }}
                    >
                        设置角色权限
                    </Button>
                </span>
            </div>
        );

        return (
            <Card title={title}>
                <Modal
                    title="创建角色"
                    visible={add_visible}
                    onCancel={this.cancelAddModal}
                    onOk={this.okAddModal}
                    okText="确定"
                    cancelText="取消"
                >
                    <AddForm
                        setForm={(fatherSon) => {
                            this.formRef_current = fatherSon;
                        }}
                    />
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={update_visible}
                    onCancel={() => {
                        this.setState({ update_visible: false });
                    }}
                    onOk={this.okUpdateModal}
                    okText="确定"
                    cancelText="取消"
                >
                    <UpateForm role={role} />
                </Modal>

                <Table
                    bordered
                    loading={loading}
                    rowKey="_id"
                    rowSelection={{
                        type: "radio",
                        selectedRowKeys: [role._id], // 不设置没有高亮行为不知道点选了哪个
                    }} /* 指定选中项的key数组,需要和onChange(我们用的是onRow)进行配合
					数组格式是因为兼容type：'checkbox' */
                    onRow={this.onRow}
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize: 5,
                        showQuickJumper: "true",
                    }}
                />
            </Card>
        );
    }
}
