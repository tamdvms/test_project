import React from "react";
import { connect } from "react-redux";
import { Button, Avatar, Divider } from "antd";
import qs from 'query-string'
import {
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UserOutlined,
  TeamOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { withTranslation } from "react-i18next";

import ListBasePage from "../ListBasePage";
import BaseTable from "../../compoments/common/table/BaseTable";

import { actions } from "../../actions";
import { AppConstants } from "../../constants";
import { sitePathConfig } from "../../constants/sitePathConfig";

class EmployeeCollaboratorListPage extends ListBasePage {
  initialSearch() {
    return { username: "", fullName: "" };
  }

  constructor(props) {
    super(props);
    const { t } = props;
    this.objectName = t("objectName");
    this.breadcrumbs = [{ name: t("breadcrumbs.currentPage") }];
    this.columns = [
      this.renderIdColumn(),
      {
        title: "#",
        dataIndex: "avatar",
        width: 100,
        align: 'center',
        render: (avatar) => (
          <Avatar
            size="large"
            icon={<UserOutlined />}
            src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
          />
        ),
      },
      { title: t("table.fullName"), dataIndex: "fullName" },
      {
        title: t("table.countColl"),
        dataIndex: "countColl",
        width: "130px",
        align: 'center',
        render: (countColl, dataRow) => {
          return <div>
            <span>({countColl})</span>
            {
              this.renderButton((
                <Button style={{ marginLeft: 4 }} type="link" onClick={() => this.handleRouting(dataRow.id, dataRow.fullName)} className="no-padding">
                  { this.actionColumns.isShowCollaborator.icon || <TeamOutlined /> }
                </Button>
              ), [5]
              )
            }
          </div>
        }
      },
    ];
    this.actionColumns = {
      isEdit: true,
      isDelete: true,
      isShowCollaborator: Number(actions.getUserData()?.settings?.Collaborator?.["enable-collaborator"])
    };
  }

  handleRouting(parentId, parentName) {
    const { location: { search }, history } = this.props;
    const queryString = qs.parse(search);
    const result = {};
    Object.keys(queryString).map(q => {
        result[`parentSearch${q}`] = queryString[q];
    })
    history.push(`${sitePathConfig.collaborator.path}?${qs.stringify({...result, parentId, parentName})}`);
  }

  render() {
    const {
      dataList,
      loading,
    } = this.props;
    const { isShowModifiedModal, isShowModifiedLoading } = this.state;
    const employeeCollaborators = dataList.data || [];
    this.pagination.total = dataList.totalElements || 0;
    return (
      <div>
        <BaseTable
          loading={loading}
          columns={this.columns}
          rowKey={(record) => record.id}
          dataSource={employeeCollaborators}
          pagination={this.pagination}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.collaborator.tbEmployeeCollaboratorLoading,
  dataList: state.collaborator.employeeCollaboratorData || {},
});

const mapDispatchToProps = (dispatch) => ({
  getDataList: (payload) => dispatch(actions.getEmployeeCollaboratorList(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(['employeeCollaboratorListPage','listBasePage','constants', 'basicModal'])(EmployeeCollaboratorListPage));
