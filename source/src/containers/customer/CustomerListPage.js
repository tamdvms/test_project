import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button } from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import { withTranslation } from "react-i18next";

import ListBasePage from "../ListBasePage";
import CustomerForm from "../../compoments/customer/CustomerForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";

import { actions } from "../../actions";
import { FieldTypes } from "../../constants/formConfig";
import { convertUtcToTimezone } from "../../utils/datetimeHelper";
import { AppConstants } from "../../constants";
import { commonStatus } from "../../constants/masterData";

class CustomerListPage extends ListBasePage {
  initialSearch() {
    return { fullName: "", phone: "" };
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
        dataIndex: "customerAvatarPath",
        align: 'center',
        width: 100,
        render: (avatarPath) => (
          <Avatar
            className="table-avatar"
            size="large"
            icon={<UserOutlined />}
            src={avatarPath ? `${AppConstants.contentRootUrl}${avatarPath}` : null}
          />
        ),
      },
      { title: t("table.fullName"), dataIndex: "customerFullName" },
      { title: t("table.phone"), dataIndex: "customerPhone", width: 120 },
      { title: 'E-mail', dataIndex: "customerEmail", width: "200px" },
      {
        title: <div style={{ paddingRight: 20 }}>{t("table.createdDate")}</div>,
        dataIndex: "createdDate",
        align: "right",
        width: 120,
        render: (createdDate) => <div style={{ paddingRight: 20 }}>{convertUtcToTimezone(createdDate, "DD/MM/YYYY")}</div>,
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
    const { t } = this.props;
    return [
      {
        key: "fullName",
        seachPlaceholder: t("searchPlaceHolder.fullName"),
        initialValue: this.search.fullName,
      },
      {
        key: "phone",
        seachPlaceholder:  t("searchPlaceHolder.phone"),
        initialValue: this.search.phone,
      },
      // {
      //   key: "status",
      //   seachPlaceholder: t('searchPlaceHolder.status'),
      //   fieldType: FieldTypes.SELECT,
      //   options: commonStatus,
      //   initialValue: this.search.status,
      // },
    ];
  }

  render() {
    const {
      dataList,
      loading,
      uploadFile,
      t,
    } = this.props;
    const { isShowModifiedModal, isShowModifiedLoading } = this.state;
    const customer = dataList.data || [];
    this.pagination.total = dataList.totalElements || 0;
    return (
      <div>
        {this.renderSearchForm()}
        <div className="action-bar">
          {
            this.renderCreateNewButton((
              <Button
              type="primary"
              onClick={() => this.onShowModifiedModal(false)}
            >
              <PlusOutlined /> {t("createNewButton")}
            </Button>
            ))
          }
        </div>
        <BaseTable
          loading={loading}
          columns={this.columns}
          rowKey={(record) => record.id}
          dataSource={customer}
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
          <CustomerForm
            isEditing={this.isEditing}
            dataDetail={this.isEditing ? this.dataDetail : {}}
            uploadFile={uploadFile}
            commonStatus={commonStatus}
            loadingSave={isShowModifiedLoading}
            t={t}
          />
        </BasicModal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.customer.tbCustomerLoading,
  dataList: state.customer.customerData || {},
});

const mapDispatchToProps = (dispatch) => ({
  getDataList: (payload) => dispatch(actions.getCustomerList(payload)),
  getDataById: (payload) => dispatch(actions.getCustomerById(payload)),
  updateData: (payload) => dispatch(actions.updateCustomer(payload)),
  deleteData: (payload) => dispatch(actions.deleteCustomer(payload)),
  createData: (payload) => dispatch(actions.createCustomer(payload)),
  uploadFile: (payload) => dispatch(actions.uploadFile(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(['customerListPage','listBasePage','constants', 'basicModal'])(CustomerListPage));