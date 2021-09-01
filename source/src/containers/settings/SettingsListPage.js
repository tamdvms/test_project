import React from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { withTranslation } from "react-i18next";

import ListBasePage from "../ListBasePage";
import SettingForm from "../../compoments/settings/SettingForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";

import { actions } from "../../actions";

class SettingsListPage extends ListBasePage {

  constructor(props) {
    super(props);
    const { t } = props;
    this.objectName = "cài đặt";
    this.breadcrumbs = [{ name: "Cài đặt" }];
    this.columns = [
      this.renderIdColumn(),
      { title: t("table.name"), dataIndex: "name" },
      {
        title: <div style={{paddingRight: "2vw"}}>{t("table.value")}</div>,
        dataIndex: "value",
        render: (value) => (
          <div style={{paddingRight: "2vw"}}>{value}</div>
        )
      },
      { title: t("table.description"), dataIndex: "description"},
      this.renderActionColumn(),
    ];
    this.actionColumns = {
      isEdit: true,
      isDelete: false,
      isChangeStatus: false,
    };
  }

  prepareCreateData(data) {
    const {description, name, editable, group, key, value} = data;
    return {
        description,  
        name,
        editable,
        settingValue: value,
        settingGroup: group,
        settingKey: key,
    }
  }

    prepareUpdateData(data) {
        const {description, name, group, key, value} = data;
        return {
            description,  
            name,
            settingValue: value,
            settingGroup: group,
            settingKey: key,
            id: this.dataDetail.id
        }
    }


  render() {
    const {
      dataList,
      loading,
      t,
    } = this.props;
    const { isShowModifiedModal, isShowModifiedLoading } = this.state;
    const settings = dataList.data || [];
    this.pagination.total = dataList.totalElements || 0;

    return (
      <div>
        <div className="action-bar">
        </div>
        <BaseTable
          loading={loading}
          columns={this.columns}
          rowKey={(record) => record.id}
          dataSource={settings}
          pagination={this.pagination}
          onChange={this.handleTableChange}
          className="base-table table-setting"
        />
        <BasicModal
          visible={isShowModifiedModal}
          isEditing={this.isEditing}
          objectName={this.objectName}
          loading={isShowModifiedLoading}
          onOk={this.onOkModal}
          onCancel={this.onCancelModal}
        >
          <SettingForm
            isEditing={this.isEditing}
            dataDetail={this.isEditing ? this.dataDetail : {}}
            loadingSave={isShowModifiedLoading}
            t={t}
          />
        </BasicModal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.settings.tbSettingsLoading,
  dataList: state.settings.settingsData || {},
});

const mapDispatchToProps = (dispatch) => ({
  getDataList: (payload) => dispatch(actions.getSettingsList(payload)),
  getDataById: (payload) => dispatch(actions.getSettingById(payload)),
  createData: (payload) => dispatch(actions.createSetting(payload)),
  updateData: (payload) => dispatch(actions.updateSetting(payload)),
  deleteData: (payload) => dispatch(actions.deleteSetting(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(['settingsListPage','listBasePage','constants', 'basicModal'])(SettingsListPage));