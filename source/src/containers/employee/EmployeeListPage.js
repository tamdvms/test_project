import React from "react";
import { connect } from "react-redux";
import { Button, Avatar } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";

import ListBasePage from "../ListBasePage";
import AdminForm from "../../compoments/user/AdminForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";

import { actions } from "../../actions";
import { FieldTypes } from "../../constants/formConfig";
import { commonStatus } from "../../constants/masterData";
import { convertUtcToTimezone } from "../../utils/datetimeHelper";
import { AppConstants, UserTypes, GroupPermissonTypes } from "../../constants";

class EmployeeListPage extends ListBasePage {
  initialSearch() {
    return { username: "", fullName: "", status: undefined };
  }

  constructor(props) {
    super(props);
    this.objectName = "quản trị nhân viên";
    this.breadcrumbs = [{ name: "Quản trị nhân viên" }];
    this.columns = [
      this.renderIdColumn(),
      {
        title: "Ảnh đại diện",
        dataIndex: "avatar",
        render: (avatar) => (
          <Avatar
            size="large"
            icon={<UserOutlined />}
            src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
          />
        ),
      },
      { title: "Tên đăng nhập", dataIndex: "username" },
      { title: "Họ và tên", dataIndex: "fullName" },
      { title: "Số điện thoại", dataIndex: "phone" },
      { title: "E-mail", dataIndex: "email", width: "200px" },
      {
        title: "Ngày tạo",
        dataIndex: "createdDate",
        render: (createdDate) => convertUtcToTimezone(createdDate),
      },

      this.renderStatusColumn(),
      this.renderActionColumn(),
    ];
    this.actionColumns = {
      isEdit: true,
      isDelete: true,
      isChangeStatus: false,
    };

  }

  getSearchFields() {
    return [
      {
        key: "username",
        seachPlaceholder: "Tên đăng nhập",
        initialValue: this.search.username,
      },
      {
        key: "fullName",
        seachPlaceholder: "Họ và tên",
        initialValue: this.search.fullName,
      },
      {
        key: "status",
        seachPlaceholder: "Chọn trạng thái",
        fieldType: FieldTypes.SELECT,
        options: commonStatus,
        initialValue: this.search.status,
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
            <PlusOutlined /> Tạo mới
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

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeListPage);
