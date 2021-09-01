import React from "react";
import { connect } from "react-redux";
import { Button, Divider } from "antd";
import { PlusOutlined, EditOutlined, LockOutlined, CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import qs from 'query-string';
import moment from "moment";
import { withTranslation } from "react-i18next";

import SearchForm from '../../compoments/common/entryForm/SearchForm';
import ListBasePage from "../ListBasePage";
import ImportManagementForm from "../../compoments/importManagement/ImportManagementForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";
import { convertDateTimeToString, convertTimezoneToUtc, convertStringToDateTime, convertUtcToTimezone } from "../../utils/datetimeHelper";
import Utils from "../../utils/index";
import ElementWithPermission from "../../compoments/common/elements/ElementWithPermission";

import { actions } from "../../actions";
import {sitePathConfig} from '../../constants/sitePathConfig';
import apiConfig from "../../constants/apiConfig";
import { FieldTypes } from "../../constants/formConfig";
import { IMPORT_EXPORT_KIND_IMPORT, categoryKinds } from "../../constants/masterData";
import { showErrorMessage } from "../../services/notifyService";
import { STATUS_ACTIVE } from "../../constants";
const { CATEGORY_KIND_IMPORT } = categoryKinds;

class ImportManagementListPage extends ListBasePage {
	initialSearch() {
		return { code: "" , categoryId: undefined, fromDateToDate: undefined };
	}

	constructor(props) {
		super(props);
		const { t } = props;
		this.pagination = { pageSize: 100 };
		this.objectName = t("objectName");
		this.breadcrumbs = [
			{
				name: t('breadcrumbs.currentPage'),
			},
		];

		this.columns = [
			{
				title: t("table.categoryName"),
				width: "21%",
				dataIndex: ["categoryDto", "categoryName"],
			},
			{
				title:  <div style={{paddingRight: "20px"}}>{t("table.money")}</div>,
				dataIndex: "money",
				align: "right",
				width: 150,
				render: (money) => {
					return <div style={{paddingRight: "20px", whiteSpace: 'nowrap'}}>{Utils.formatMoney(money)}</div>
				}
			},
			{
				title: t("table.employeeFullName"),
				width: 150,
				dataIndex: ["accountAdminDto", "fullName"],
				render: (fullName) => {
					return <div style={{ whiteSpace: 'nowrap' }}>{fullName}</div>
				}
			},
			{
				title: t("table.note"),
				width: 200,
				dataIndex: "note",
			},
			{
				title: <div style={{paddingRight: "20px"}}>{t("table.date")}</div>,
				dataIndex: "createdDate",
				align: "right",
				width: 180,
				render: (createdDate) => (
					<div style={{paddingRight: "20px"}}>
					{convertUtcToTimezone(createdDate, "DD/MM/YYYY HH:mm")}
					</div>
				)
			},
			this.renderStatusColumn(),
			this.renderActionColumn(),
		];
		this.actionColumns = {
			isEdit: true,
			isDelete: true,
			isChangeStatus: false,
		};
		props.getCategoryAutoComplete({ params: { kind: CATEGORY_KIND_IMPORT }})
	}

	getSearchFields() {
		const { t } = this.props;
		return [
			{
				key: "code",
				seachPlaceholder: t("searchPlaceHolder.code"),
				initialValue: this.search.code,
			},
			{
				key: "categoryId",
				seachPlaceholder: t("searchPlaceHolder.categoryId"),
				fieldType: FieldTypes.SELECT,
				options: this.props.categoryAutoComplete?.data || [],
				initialValue: this.search.categoryId,
				optionValueKey: 'id',
				optionLabelKey: 'categoryName',
				width: 250,
			},
			{
				key: 'fromDateToDate',
				seachPlaceholder: [t("searchPlaceHolder.fromDate"), t("searchPlaceHolder.toDate")],
				fieldType: FieldTypes.DATE_RANGE,
				format: "DD/MM/YYYY",
				disabledDate: (current) => {
					// Can not select days before today and today
					return current && current > moment().endOf('day');
				},
				width: 250,
			}
		];
	}

	renderSearchForm(hiddenAction) {
        const searchFields = this.getSearchFields();
		const from = this.search.fromDateToDate?.[0];
		const to = this.search.fromDateToDate?.[1];
        if(searchFields.length > 0)
            return <SearchForm
                searchFields={searchFields}
                onSubmit={this.onSearch}
                onResetForm={this.onResetFormSearch}
                hiddenAction={hiddenAction}
                initialValues={
					{
						...this.search,
						fromDateToDate: from && to ? [
							moment(this.search.fromDateToDate?.[0]),
							moment(this.search.fromDateToDate?.[1]),
						] : undefined,
					}
				}
                />;
        return null;
    }

	getList() {
		const { getDataList } = this.props;
		const page = this.pagination.current ? this.pagination.current - 1 : 0;
		let params;
		if(this.search.fromDateToDate) {
			const fromDateToDate = {
				...this.search.fromDateToDate
			}
			const from = moment(fromDateToDate[0]);
			const to = moment(fromDateToDate[1]);
			if(from && to) {
				fromDateToDate[0] = convertTimezoneToUtc(moment(from).format("DD/MM/YYYY") + " 00:00:00", "DD/MM/YYYY HH:mm:ss");
				fromDateToDate[1] = convertTimezoneToUtc(moment(to).format("DD/MM/YYYY") + " 23:59:59", "DD/MM/YYYY HH:mm:ss");
			}
			params = {
				page,
				size: this.pagination.pageSize,
				search: {
					...this.search,
					kind: IMPORT_EXPORT_KIND_IMPORT,
					fromDateToDate,
				}
			}
		}
		else {
			params = {
				page,
				size: this.pagination.pageSize,
				search: {
					...this.search,
					kind: IMPORT_EXPORT_KIND_IMPORT,
				}
			}
		}

		getDataList({ params });
	};

	prepareCreateData(data) {
        return {
			...data,
			kind: IMPORT_EXPORT_KIND_IMPORT,
			categoryId: data.categoryDto?.id,
		};
    }

	prepareUpdateData(data) {
        return {
            ...data,
            id: this.dataDetail.id,
			categoryId: data.categoryDto?.id,
        };
    }

	renderActionColumn() {
		const { t } = this.props;
        return {
            title: t('listBasePage:titleActionCol'),
            width: '100px',
            align: 'center',
            render: (dataRow) => {
                const actionColumns = [];
                if(this.actionColumns.isEdit) {
                    actionColumns.push(this.renderButton((
                        <Button type="link" onClick={() => this.getDetail(dataRow.id)} className="no-padding">
                            <EditOutlined/>
                        </Button>
                    ), [1, 3, 5])) // Update, get by id
                }
                if(this.actionColumns.isChangeStatus) {
                    actionColumns.push(
                        <Button type="link" onClick={() => this.showChangeStatusConfirm(dataRow) } className="no-padding">
                            {
                                dataRow.status === STATUS_ACTIVE
                                ?
                                <LockOutlined/>
                                :
                                <CheckOutlined/>
                            }
                        </Button>
                    )
                }
                if(this.actionColumns.isDelete) {
                    actionColumns.push(
                        this.renderButton((
                            <Button type="link" onClick={() => this.showDeleteConfirm(dataRow.id) } className="no-padding">
                                <DeleteOutlined/>
                            </Button>
                        ), [4]) // Delete
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

	render() {
		const {
			dataList,
			loading,
			history,
			uploadFile,
			categoryAutoComplete,
			t,
		} = this.props;
		const { isShowModifiedModal, isShowModifiedLoading } = this.state;
		const importManagement = dataList.data || [];
		this.pagination.total = dataList.totalElements || 0;
		return (
		<div>
			{this.renderSearchForm()}
			<div className="action-bar province">
				<div className="summary text-green">{t("totalExport")}: {Utils.formatMoney(dataList.sum) || Utils.formatMoney(0)}</div>
				{
					this.renderButton((
						<Button
							type="primary"
							onClick={() => this.onShowModifiedModal(false)}
						>
							<PlusOutlined /> {t("createNewButton")}
						</Button>
					), [2, 5])
				}
			</div>
			<BaseTable
				loading={loading}
				columns={this.columns}
				rowKey={(record) => record.id}
				dataSource={importManagement}
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
			<ImportManagementForm
				isEditing={this.isEditing}
				dataDetail={this.isEditing ? this.dataDetail : {}}
				loadingSave={isShowModifiedLoading}
				uploadFile={uploadFile}
				categoryAutoComplete={categoryAutoComplete.data || []}
				t={t}
			/>
			</BasicModal>
		</div>
		);
	}
}

const mapStateToProps = (state) => ({
  loading: state.importManagement.importManagementListLoading,
  dataList: state.importManagement.importManagementListData || {},
  categoryAutoComplete: state.importManagement.categoryAutoComplete || {},
});

const mapDispatchToProps = (dispatch) => ({
  getDataList: (payload) => dispatch(actions.getImportManagementList(payload)),
  getDataById: (payload) => dispatch(actions.getImportManagementById(payload)),
  createData: (payload) => dispatch(actions.createImportManagement(payload)),
  updateData: (payload) => dispatch(actions.updateImportManagement(payload)),
  deleteData: (payload) => dispatch(actions.deleteImportManagement(payload)),
  uploadFile: (payload) => dispatch(actions.uploadFile(payload)),
  getCategoryAutoComplete: (payload) => dispatch(actions.getCategoryAutoCompleteImport(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(["imExManagementListPage", "listBasePage"])(ImportManagementListPage));
