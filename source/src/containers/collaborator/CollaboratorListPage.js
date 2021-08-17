import React from "react";
import { connect } from "react-redux";
import { Button, Avatar } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import qs from 'query-string';

import ListBasePage from "../ListBasePage";
import CollaboratorForm from "../../compoments/collaborator/CollaboratorForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";

import { actions } from "../../actions";
import { FieldTypes } from "../../constants/formConfig";
import { commonStatus } from "../../constants/masterData";
import { convertUtcToTimezone } from "../../utils/datetimeHelper";
import { AppConstants, UserTypes, GroupPermissonTypes } from "../../constants";
import { sitePathConfig } from "../../constants/sitePathConfig";

class CollaboratorListPage extends ListBasePage {
  initialSearch() {
    return { username: "", fullName: "" };
  }

  constructor(props) {
    super(props);
    this.objectName = "cộng tác viên";
    const { location: { search } } = props;
    const {
      parentName,
      parentId
    } = qs.parse(search);
    this.parentId = parentId;
    this.parentName = parentName;
    this.breadcrumbs = [
      {
        name: "Cộng tác viên"
      },
      {
        name: parentName,
        path: `${sitePathConfig.employee.path}${this.handleRoutingParent()}`
      },
    ];
    this.columns = [
      this.renderIdColumn(),
      {
        title: "Ảnh đại diện",
        dataIndex: "avatarPath",
        render: (avatarPath) => (
          <Avatar
            size="large"
            icon={<UserOutlined />}
            src={avatarPath ? `${AppConstants.contentRootUrl}${avatarPath}` : null}
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

  prepareCreateData(data) {
		return {
			...data,
      employeeId: this.parentId,
		}
	}

  getList() {
    const { getDataList } = this.props;
    const page = this.pagination.current ? this.pagination.current - 1 : 0;
    const params = { page, size: this.pagination.pageSize, search: this.search, parentId: this.parentId};
    getDataList({ params });
  }

  handleRoutingParent() {
    const { location: { search } } = this.props;
    const queryString = qs.parse(search);
    const result = {};
    const prName = 'parentSearch';
    Object.keys(queryString).map(q => {
        if(q.startsWith(prName))
            result[q.substring(prName.length, q.length)] = queryString[q];
    })
    const qsMark = Object.keys(result).length > 0 ? "?" : "";
    return qsMark + qs.stringify(result);
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

  render() {
    const {
      dataList,
      loading,
      uploadFile,
    } = this.props;
    const { isShowModifiedModal, isShowModifiedLoading } = this.state;
    const collaborators = dataList.data || [];
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
            <PlusOutlined /> Tạo CTV mới
          </Button>
          ))}
        </div>
        <BaseTable
          loading={loading}
          columns={this.columns}
          rowKey={(record) => record.id}
          dataSource={collaborators}
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
          <CollaboratorForm
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
  loading: state.collaborator.tbCollaboratorLoading,
  dataList: state.collaborator.collaboratorData || {},
});

const mapDispatchToProps = (dispatch) => ({
  getDataList: (payload) => dispatch(actions.getCollaboratorList(payload)),
  getDataById: (payload) => dispatch(actions.getCollaboratorById(payload)),
  createData: (payload) => dispatch(actions.createCollaborator(payload)),
  updateData: (payload) => dispatch(actions.updateCollaborator(payload)),
  deleteData: (payload) => dispatch(actions.deleteCollaborator(payload)),
  uploadFile: (payload) => dispatch(actions.uploadFile(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollaboratorListPage);
