import React from "react";
import { connect } from "react-redux";
import { Button, Avatar } from "antd";
import { PlusOutlined, UserOutlined, EditOutlined } from "@ant-design/icons";
import qs from 'query-string';
import { withTranslation } from "react-i18next";

import ListBasePage from "../ListBasePage";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";
import StatusTag from "../../compoments/common/elements/StatusTag";

import { actions } from "../../actions";
import { FieldTypes } from "../../constants/formConfig";
import { commonStatus, COLLABORATOR_PRODUCT_KIND_MONEY } from "../../constants/masterData";
import { convertUtcToTimezone } from "../../utils/datetimeHelper";
import { AppConstants, UserTypes, GroupPermissonTypes } from "../../constants";
import { sitePathConfig } from "../../constants/sitePathConfig";
import Utils from "../../utils";
import CreateCollaboratorProduct from "./CreateCollaboratorProduct";

class CollaboratorProductListPage extends ListBasePage {
    initialSearch() {
        return { productName: "" };
    }

    constructor(props) {
        super(props);
        const { t } = props;
        this.objectName = t("objectName");
        const { location: { search } } = props;
        const {
            parentName,
            parentId,
            parentSearchparentName,
        } = qs.parse(search);
        this.parentId = parentId;
        this.parentName = parentName;
        this.breadcrumbs = [
            {
                name: `${t("breadcrumbs.employeePage")} (${parentSearchparentName})`,
                path: `${sitePathConfig.employeeCollaborator.path}${this.handleRoutingParent('parentSearchparentSearch')}`
            },
            {
                name: `${t("breadcrumbs.collaboratorPage")} (${parentName})`,
                path: `${sitePathConfig.collaborator.path}${this.handleRoutingParent('parentSearch')}`
            },
        ];
        this.columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                width: '50px',
                align: 'center',
                render: (id, dataRow) => {
                    return {
                        props: {
                            style: dataRow.productDto.labelColor === 'none' ? {} : { background: dataRow.productDto.labelColor },
                        },
                        children: (
                            <div>{id}</div>
                        ),
                    }
                }
            },
            {
                title: "#",
                dataIndex: "productImage",
                align: 'center',
                width: 86,
                render: (productImage, dataRow) => {
                    return {
                        props: {
                            style: dataRow.productDto.labelColor === 'none' ? {} : { background: dataRow.productDto.labelColor },
                        },
                        children: (
                            <Avatar
                                size="large"
                                src={productImage ? `${AppConstants.contentRootUrl}${productImage}` : null}
                            />
                        ),
                    }
                }
            },
            {
                title: t("table.productName"),
                dataIndex: ["productDto", "productName"],
                render: (productName, dataRow) => {
                    return {
                        props: {
                            style: dataRow.productDto.labelColor === 'none' ? {} : { background: dataRow.productDto.labelColor },
                        },
                        children: (
                            <div>
                                {productName}
                            </div>
                        ),
                    }
                }
            },
            {
                title: <div className="tb-al-r">{t("table.commission")}</div>,
                dataIndex: "value",
                width: "200px",
                align: 'right',
                render: (value, dataRow) => {
                    const _value = dataRow.kind === COLLABORATOR_PRODUCT_KIND_MONEY ? Utils.formatMoney(value) : value + '%'
                    return {
                        props: {
                            style: dataRow.productDto.labelColor === 'none' ? {} : { background: dataRow.productDto.labelColor },
                        },
                        children: (
                            <div className="tb-al-r">
                                {_value}
                            </div>
                        ),
                    }
                }
            },
        ];
    }

    loadDataTable(currentProps) {
        const queryString = qs.parse(currentProps.location.search);
        this.pagination.current = 1;
        if(!isNaN(queryString.page))
            this.pagination.current = parseInt(queryString.page);
        Object.keys(this.search).forEach(key => this.search[key] = queryString[key]);
        this.getList(queryString.createPage === '1' && 1000);
        this.setState({
            isShowModifiedModal: queryString.createPage === '1'
        })
    }

    getList(size) {
        const { getDataList } = this.props;
        const page = this.pagination.current ? this.pagination.current - 1 : 0;
        const params = {
            page,
            size: size || this.pagination.pageSize,
            search: this.search,
            collaboratorId: this.parentId,
        };
        getDataList({ params });
    }

    handleRoutingParent(prName) {
        const { location: { search } } = this.props;
        const queryString = qs.parse(search);
        const result = {};
        Object.keys(queryString).map(q => {
            if(q.startsWith(prName))
                result[q.substring(prName.length, q.length)] = queryString[q];
        })
        const qsMark = Object.keys(result).length > 0 ? "?" : "";
        return qsMark + qs.stringify(result);
    }

    getSearchFields() {
        const { t } = this.props;
        return [
            {
                key: "productName",
                seachPlaceholder: t("searchPlaceHolder.productName"),
                initialValue: this.search.username,
            },
        ];
    }

    handleShowCreatePage = (isEditing) => {
        const { location: { pathname, search }, history} = this.props;
        this.isEditing = false
        history.push(`${pathname}${search}&createPage=1`)
    }

    onCancelModal() {
        const { location: { pathname, search }, history} = this.props;
        const { createPage, ...queryString } = qs.parse(search)
        this.isEditing = false
        history.push(`${pathname}?${qs.stringify(queryString)}`)
    }

    render() {
        const {
            dataList,
            loading,
            uploadFile,
            t,
        } = this.props;
        const { isShowModifiedModal, isShowModifiedLoading, active } = this.state;
        const collaboratorProducts = dataList.data || [];
        this.pagination.total = dataList.totalElements || 0;
        return (<>
        <div className={`list-page${!isShowModifiedModal ? ' active' : ''}`}>
            {this.renderSearchForm()}
            <div className="action-bar">
            {this.renderCreateNewButton((
            <Button
                type="primary"
                onClick={() => this.handleShowCreatePage(false)}
            >
                {t("editButton")} <EditOutlined />
            </Button>
            ))}
            </div>
            <BaseTable
            loading={loading}
            columns={this.columns}
            rowKey={(record) => record.id}
            dataSource={collaboratorProducts}
            pagination={this.pagination}
            onChange={this.handleTableChange}
            />
        </div>
        {
            isShowModifiedModal ? (
                <div className="create-page">
                    <CreateCollaboratorProduct
                        handleBack={this.onCancelModal}
                        isEditing={this.isEditing}
                        collaboratorId={this.parentId}
                        collaboratorProducts={collaboratorProducts}
                        fetchCollaboratorsProductList={this.getList}
                        collaboratorName={this.parentName}
                    />
                </div>
            ) : null
        }
        </>
        );
    }
}

const mapStateToProps = (state) => ({
    loading: state.collaboratorProduct.tbCollaboratorProductLoading,
    dataList: state.collaboratorProduct.collaboratorProductData || {},
});

const mapDispatchToProps = (dispatch) => ({
    getDataList: (payload) => dispatch(actions.getCollaboratorProductList(payload)),
    getDataById: (payload) => dispatch(actions.getCollaboratorProductById(payload)),
    createData: (payload) => dispatch(actions.createCollaboratorProduct(payload)),
    updateData: (payload) => dispatch(actions.updateCollaboratorProduct(payload)),
    deleteData: (payload) => dispatch(actions.deleteCollaboratorProduct(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(['collaboratorProductListPage','listBasePage','constants', 'basicModal'])(CollaboratorProductListPage));
