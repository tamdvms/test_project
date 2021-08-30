import React from 'react'
import { Tabs } from 'antd'
import CollaboratorOrdersListPage from './CollaboratorOrdersListPage';

const { TabPane } = Tabs;

const WrapperCollaboratorOrders = (props) => {
    return (
        <div>
            <Tabs defaultActiveKey="1" type="card">
                <TabPane tab="Đơn hàng" key="1">
                    <CollaboratorOrdersListPage {...props}/>
                </TabPane>
            </Tabs>
        </div>
    )
}

export default WrapperCollaboratorOrders
