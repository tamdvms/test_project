import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { navMenuConfig } from '../../../constants/menuConfig';
import logoUrl from '../../../assets/images/logo.png';
import { AppConstants } from '../../../constants'

const { Sider } = Layout;
const { SubMenu } = Menu;

const findNavMenuActive = (navMenu, pathname) => {

    const menuActive = Object.keys(navMenu).find(navMenuKey => {
        if(navMenu[navMenuKey].children)
        {
            return  !!navMenu[navMenuKey].children.find(navChild => navChild.path === pathname);
        }
        else if(navMenu[navMenuKey].path === pathname)
            return true;
        else if(navMenu[navMenuKey].childrenKeys) {
            return true;
        }
        return false;
    });
    return menuActive;
} 

const findNavMenuItemActive = (navMenu, pathname) => {
    let menuList = [];
    Object.keys(navMenu).forEach(menuKey => {
        const menuItem = navMenu[menuKey];
        if(menuItem.children) {
            menuList = menuList.concat(menuItem.children)
        }
        else {
            menuList.push(menuItem);
        }
    });

    const activeMenu = menuList.find(menuItem => {
        if(menuItem.childrenKeys && menuItem.childrenKeys.some(menuChildPath => pathname === menuChildPath))
            return true;
        return pathname === menuItem.path;
    });
    if(activeMenu) {
        return activeMenu.path;
    }
    return pathname;
} 

class NavSider extends Component {

    render() {
        const { onToggleNavSide, currentPathname, navSidercollapsed, userData } = this.props;
        const availableMenu = navMenuConfig.filter(navMenu => {
            if(navMenu.children) {
                navMenu.children = navMenu.children.filter(navMenuChild => {
                    if(navMenuChild.permissions)
                        return userData.permissions.indexOf(navMenuChild.permissions[0]) > -1;
                    return true;
                });

                return navMenu.children.length > 0;
            }
            else if(navMenu.permissions) {
                return userData.permissions.indexOf(navMenu.permissions[0]) > -1;
            }
            return true;
        });
        const menuActive = findNavMenuActive(availableMenu, currentPathname);
        const menuItemActive = findNavMenuItemActive(availableMenu, currentPathname);
        return (
            <Sider
                style={{
                    // overflow: 'auto',
                    // height: '100vh',
                    // position: 'fixed',
                    // left: 0,
                    // zIndex:2,
                    // width: navSidercollapsed ? LayoutConfigs.NAV_WIDTH_COLLAPSED : LayoutConfigs.NAV_WIDTH_EXPANDED
                }}
                // collapsible
                collapsed={navSidercollapsed}
                onCollapse={onToggleNavSide}
                className={navSidercollapsed ? 'nav-sider nav-sider__collapsed' : 'nav-sider nav-sider__expanded'}
                >
                <div className={navSidercollapsed ? 'logo logo__collapsed' : 'logo logo__expanded'} style={{ height: navSidercollapsed ? "80px" : "150px"}}>
                    <img src={userData.logo ? `${AppConstants.contentRootUrl}/${userData.logo}` : logoUrl} alt="Mira"/>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[menuItemActive]}
                    className="custom-nav"
                    defaultOpenKeys={[menuActive]}
                >
                    {availableMenu.map((navMenuItem, idx) =>
                        navMenuItem.children
                        ?
                        <SubMenu
                            style={!navSidercollapsed ? { paddingLeft: '0 34px 0 10px' } : null}
                            key={idx}
                            title={
                                <span>
                                    {
                                        navMenuItem.icon
                                    }
                                    
                                    <span>{navMenuItem.label}</span>
                                </span>
                            }
                            className="custom-sub-nav"
                        >
                            {
                                navMenuItem.children.map(navChildMenu =>
                                    <Menu.Item key={navChildMenu.path}>
                                        <Link to={navChildMenu.path}>
                                            <span>{navChildMenu.label}</span>
                                        </Link>
                                    </Menu.Item>
                                )
                            }
                        </SubMenu>
                        :
                        <Menu.Item
                            className="custom-nav-item"
                            key={navMenuItem.path}
                            style={!navSidercollapsed ? { paddingLeft: '0 34px 0 10px' } : null}
                            >
                            <Link to={navMenuItem.path}>
                                <span>
                                    {
                                        navMenuItem.icon
                                    }
                                    
                                    <span>{navMenuItem.label}</span>
                                </span>
                            </Link>
                        </Menu.Item>
                    )}     
                </Menu>
            </Sider>
        )
    }
}

export default NavSider;
