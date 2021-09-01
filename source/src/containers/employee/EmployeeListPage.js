import React from "react";
import { connect } from "react-redux";
import { Button, Avatar, Divider } from "antd";
import qs from 'query-string'
import {
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  PictureOutlined,
  PlusOutlined,
  UserOutlined,
  TeamOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { withTranslation } from "react-i18next";

import ListBasePage from "../ListBasePage";
import AdminForm from "../../compoments/user/AdminForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";

import { actions } from "../../actions";
import { FieldTypes } from "../../constants/formConfig";
import { commonStatus } from "../../constants/masterData";
import { convertUtcToTimezone } from "../../utils/datetimeHelper";
import { AppConstants, UserTypes, GroupPermissonTypes, STATUS_ACTIVE } from "../../constants";
import { sitePathConfig } from "../../constants/sitePathConfig";

class EmployeeListPage extends ListBasePage {
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
        align: 'center',
        width: 100,
        render: (avatar) => (
          <Avatar
            size="large"
            icon={<UserOutlined />}
            src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
          />
        ),
      },
      { title: t("table.username"), dataIndex: "username" },
      { title: t("table.fullName"), dataIndex: "fullName" },
      { title: t("table.phone"), dataIndex: "phone" },
      { title: "E-mail", dataIndex: "email", width: "200px" },
      {
        title: t("table.createdDate"),
        dataIndex: "createdDate",
        render: (createdDate) => convertUtcToTimezone(createdDate),
      },

      this.renderStatusColumn(),
      this.renderActionColumn(),
    ];
    this.actionColumns = {
      isEdit: true,
      isDelete: true,
    };
  }

  getSearchFields() {
    const { t } = this.props;
    return [
      {
        key: "username",
        seachPlaceholder: t("searchPlaceHolder.username"),
        initialValue: this.search.username,
      },
      {
        key: "fullName",
        seachPlaceholder: t("searchPlaceHolder.fullName"),
        initialValue: this.search.fullName,
      },
    ];
  }

  prepareCreateData(values) {
    return {
      kind: UserTypes.EMPLOYEE,
      avatarPath: values.avatar,
      ...values,
    };
  }

  prepareUpdateData(values) {
    return {
      id: this.dataDetail.id,
      kind: UserTypes.EMPLOYEE,
      avatarPath: values.avatar,
      ...values,
    };
  }

  getDataDetailMapping(data) {
    return {
      ...data,
      groupId: data.group && data.group.id,
    };
  }

  render() {
    const {
      dataList,
      loading,
      uploadFile,
      t,
    } = this.props;
    const { isShowModifiedModal, isShowModifiedLoading } = this.state;
    const employees = dataList.data || [];
    this.pagination.total = dataList.totalElements || 0;
    return (
      <div>
        {this.renderSearchForm()}
        <div className="action-bar">
          {this.renderCreateNewButton((
            <Button
            type="primary"
            onClick={() => this.onShowModifiedModal(false)}
          >
            <PlusOutlined /> { t("createNewButton") }
          </Button>
          ))}
        </div>
        <BaseTable
          loading={loading}
          columns={this.columns}
          rowKey={(record) => record.id}
          dataSource={employees}
          pagination={this.pagination}
          onChange={this.handleTableChange}
        />
        <BasicModal
          visible={isShowModifiedModal}
          isEditing={this.isEditing}
          objectName={this.objectName}
          loading={isShowModifiedLoading}
          onOk={this.onOkModal}
          onCancel={this.onCancelModal}
        >
          <AdminForm
            isEditing={this.isEditing}
            dataDetail={this.isEditing ? this.dataDetail : {}}
            loadingSave={isShowModifiedLoading}
            uploadFile={uploadFile}
            showColorPicker={true}
            t={t}
          />
        </BasicModal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.employee.tbEmployeeLoading,
  dataList: state.employee.employeeData || {},
});

const mapDispatchToProps = (dispatch) => ({
  getDataList: (payload) => dispatch(actions.getEmployeeList(payload)),
  searchGroupPermissionList: (payload) => dispatch(actions.searchGroupPermission(payload)),
  getDataById: (payload) => dispatch(actions.getEmployeeById(payload)),
  createData: (payload) => dispatch(actions.createEmployee(payload)),
  updateData: (payload) => dispatch(actions.updateEmployee(payload)),
  deleteData: (payload) => dispatch(actions.deleteEmployee(payload)),
  uploadFile: (payload) => dispatch(actions.uploadFile(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(['employeeListPage','listBasePage','constants', 'basicModal'])(EmployeeListPage));