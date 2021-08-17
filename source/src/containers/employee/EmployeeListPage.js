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
  CheckOutlined } from '@ant-design/icons';

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
    this.objectName = "nhân viên";
    this.breadcrumbs = [{ name: "Nhân viên" }];
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
      isShowCollaborator: actions.getUserData()?.settings?.Collaborator?.["enable-collaborator"]
    };
  }

  renderActionColumn() {
    return {
        title: 'Hành động',
        width: '100px',
        align: 'center',
        render: (dataRow) => {
            const actionColumns = [];
            if(this.actionColumns.isShowCollaborator) {
              actionColumns.push(this.renderButton((
                <Button type="link" onClick={() => this.handleRouting(dataRow.id, dataRow.fullName)} className="no-padding">
                  { this.actionColumns.isShowCollaborator.icon || <TeamOutlined /> }
                </Button>
              ), [5]
              ))
            }
            if(this.actionColumns.isEdit) {
                actionColumns.push(this.renderEditButton((
                    <Button type="link" onClick={() => this.getDetail(dataRow.id)} className="no-padding">
                        { this.actionColumns.isEdit.icon || <EditOutlined/> }
                    </Button>
                )))
            }
            if(this.actionColumns.isDelete) {
                actionColumns.push(
                    this.renderDeleteButton((
                        <Button type="link" onClick={() => this.showDeleteConfirm(dataRow.id) } className="no-padding">
                            { this.actionColumns.isDelete.icon || <DeleteOutlined/> }
                        </Button>
                    ))
                )
            }
            const actionColumnsWithDivider = [];
            actionColumns.forEach((action, index) => {
                actionColumnsWithDivider.push(action);
                if(index !== (actionColumns.length -1))
                {
                    actionColumnsWithDivider.push(<Divider type="vertical" />);
                }
            })
            return (
                <span>
                    {
                        actionColumnsWithDivider.map((action, index) => <span key={index}>{action}</span>)
                    }
                </span>
            )
        }
    }
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
            <PlusOutlined /> Tạo nhân viên mới
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
