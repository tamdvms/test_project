import React from "react";
import { connect } from "react-redux";
import { Button, Avatar, Divider } from "antd";
import {
	PlusOutlined,
	UserOutlined,
	CheckOutlined,
	DeleteOutlined,
	EditOutlined,
	LockOutlined,
	InboxOutlined,
} from "@ant-design/icons";
import qs from 'query-string';
import { withTranslation } from "react-i18next";

import ListBasePage from "../ListBasePage";
import CollaboratorForm from "../../compoments/collaborator/CollaboratorForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";

import { actions } from "../../actions";
import { FieldTypes } from "../../constants/formConfig";
import { commonStatus } from "../../constants/masterData";
import { convertUtcToTimezone } from "../../utils/datetimeHelper";
import { AppConstants, UserTypes, GroupPermissonTypes, STATUS_ACTIVE } from "../../constants";
import { sitePathConfig } from "../../constants/sitePathConfig";

class CollaboratorListPage extends ListBasePage {
	initialSearch() {
		return { username: "", fullName: "" };
	}

  	constructor(props) {
		super(props);
		const { t } = props;
		this.objectName = t("objectName");
		const { location: { search } } = props;
		const {
			parentName,
			parentId
		} = qs.parse(search);
		this.parentId = parentId;
		this.parentName = parentName;
		this.breadcrumbs = [
			{
				name: `${t("breadcrumbs.employeePage")} (${parentName})`,
				path: `${sitePathConfig.employeeCollaborator.path}${this.handleRoutingParent()}`
			},
			{
				name: t("breadcrumbs.currentPage")
			},
		];
		this.columns = [
		this.renderIdColumn(),
		{
			title: "#",
			dataIndex: "avatarPath",
			align: 'center',
			render: (avatarPath) => (
			<Avatar
				size="large"
				icon={<UserOutlined />}
				src={avatarPath ? `${AppConstants.contentRootUrl}${avatarPath}` : null}
			/>
			),
		},
		{
			title: t("table.username"),
			render: (dataRow) => {
				return <span className="routing"
				onClick={() => this.handleRouting(dataRow.id, dataRow.fullName, sitePathConfig.wrapperCollaboratorOrders.path)}
				>
					{dataRow.username}
				</span>
			}
		},
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
			isChangeStatus: false,
			isProduct: true,
		};
	}

	renderActionColumn() {
		const { t } = this.props;
		return {
			title: t("table.action"),
			width: '100px',
			align: 'center',
			render: (dataRow) => {
				const actionColumns = [];
				if(this.actionColumns.isProduct) {
					actionColumns.push(this.renderButton((
						<Button type="link" onClick={() => this.handleRouting(dataRow.id, dataRow.fullName, sitePathConfig.collaboratorProduct.path)} className="no-padding">
							<InboxOutlined/>
						</Button>
					), [5]))
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

	handleRouting(parentId, parentName, pathname, blankTarget) {
		const { location: { search }, history } = this.props;
		const queryString = qs.parse(search);
		const result = {};
		Object.keys(queryString).map(q => {
			result[`parentSearch${q}`] = queryString[q];
		})
		const path = `${pathname}?${qs.stringify({...result, parentId, parentName})}`;
		if(blankTarget) {
			window.open(path, '_blank')
			window.focus()
		}
		else {
			history.push(path);
		}
	}

	prepareCreateData(data) {
		// Filter null or undefinded properties
		const filteredData = Object.entries(data).reduce((accumulate, [key, value]) => (
			value === null || value === undefined || value === "" ? accumulate : (accumulate[key] = value, accumulate)),
			{}
		);
			return {
				...filteredData,
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
		const { t } =  this.props;
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

	render() {
		const {
		dataList,
		loading,
		uploadFile,
		t,
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
				<PlusOutlined /> {t("createNewButton")}
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
				t={t}
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(['collaboratorListPage','listBasePage','constants', 'basicModal'])(CollaboratorListPage));
