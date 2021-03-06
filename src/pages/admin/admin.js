import React, { Component } from "react";
import { Layout } from "antd";
import { Switch, Route, Redirect } from 'react-router-dom';
import LeftNav from "../../components/left-nav";
// 你会发现子文件是index命名时，不需要写具体名称，只需要写到上级文件就行
import Header from "../../components/header";
import Home from "../home/home";
import Category from "../category/category";
import Product from "../product/product";
import Role from "../role/role";
import User from "../user/user";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";
import NotFound from '../not-found/not-found'
import memoryUtils from "../../utils/memoryUtils";


const { Footer, Sider, Content } = Layout;

// 后台管理的路由组件
export default class Admin extends Component {
	render() {
		const user = memoryUtils.user;
		// 如果内存中没有存储user，说明尚未登陆过账号
		if (!user || !user._id) {
			// 作自动跳转到登陆界面(在render()中的使用此方法,而不是用history里的方法)
			return <Redirect to='/login' />
		}
		/*
		但是作这种处理有bug：不能维持登陆即一刷新又要重新登陆。
		所以我们要做的不仅是保存在内存中，还需要保存到local中或session中。
		才不会出现刷新重新登陆的问题。
		 */

		return (
			<Layout style={{ minHeight: "100%" }}>
				{/* minheght比hight的好处是:height太局限性,如果高度超过设定值的时候会覆盖点 
				比如有个子div的高度大于父div的高度时,就会覆盖掉父div未超过子div高度的部分 */}
				<Sider>
					<LeftNav />
				</Sider>
				<Layout>
					<Header />
					<Content style={{ margin: 20, backgroundColor: "#fff" }}>
						<Switch>
							<Redirect exact from='/' to='/home' />  {/*如果访问根路径转到主页,必须是精准匹配 */}
							<Route path='/home' component={Home} />
							<Route path='/category' component={Category} />
							<Route path='/product' component={Product} />
							<Route path='/role' component={Role} />
							<Route path='/user' component={User} />
							<Route path='/charts/bar' component={Bar} />
							<Route path='/charts/line' component={Line} />
							<Route path='/charts/pie' component={Pie} />
							<Route component={NotFound} /> {/*上方路径没有匹配到时，显示404*/}
						</Switch>
					</Content>
					<Footer style={{ textAlign: "center", color: "#cccccc" }}>
						推荐使用谷歌浏览器，可以获得更佳页面操作体验
                    </Footer>
				</Layout>
			</Layout>
		);
	}
}
