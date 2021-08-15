import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button, Divider } from "antd";
import { UserOutlined, PlusOutlined, CheckOutlined, DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
import qs from 'query-string';
import StatusTag from '../../compoments/common/elements/StatusTag';

import ListBasePage from "../ListBasePage";
import ProductForm from "../../compoments/product/ProductForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";

import { actions } from "../../actions";
import { FieldTypes } from "../../constants/formConfig";
import { AppConstants } from "../../constants";
import { commonStatus } from "../../constants/masterData";
import Utils from "../../utils";
import { STATUS_ACTIVE } from "../../constants";

class ProductListPage extends ListBasePage {
    initialSearch() {
        return { name: "", status: null };
    }

    constructor(props) {
        super(props);
        const { location: { search } } = props;
        const { categoryName, categoryId } = qs.parse(search);
        this.categoryId = categoryId;
        this.pagination = { pageSize: 100 };
        this.objectName =  "Sản phẩm";
        this.breadcrumbs = [
            { name: "Sản phẩm" },
            { name: categoryName}
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
                            style: dataRow.labelColor === 'none' ? {} : { background: dataRow.labelColor },
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
                width: 100,
                render: (avatarPath, dataRow) => {
                    return {
                        props: {
                            style: dataRow.labelColor === 'none' ? {} : { background: dataRow.labelColor },
                        },
                        children: (
                            <Avatar
                                className="table-avatar"
                                size="large"
                                icon={<UserOutlined />}
                                src={avatarPath ? `${AppConstants.contentRootUrl}${avatarPath}` : null}
                            />
                        ),
                    }
                }
            },
            {
                title: 'Tên',
                render: (dataRow) => {
                    return {
                        props: {
                            style: dataRow.labelColor === 'none' ? {} : { background: dataRow.labelColor },
                        },
                        children: (
                            <span>
                                {dataRow.productName}
                            </span>
                        ),
                    }
                }
            },
            {
                title: <div className="tb-al-r">Giá tiền</div>,
                dataIndex: 'productPrice',
                align: 'right',
                render: (productPrice, dataRow) => {
                    return {
                        props: {
                            style: dataRow.labelColor === 'none' ? {} : { background: dataRow.labelColor },
                        },
                        children: (
                            <span className="tb-al-r">{Utils.formatMoney(productPrice)}</span>
                        ),
                    }
                }
            },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                width: '100px',
                render: (status, dataRow) => {
                    return {
                        props: {
                            style: dataRow.labelColor === 'none' ? {} : { background: dataRow.labelColor },
                        },
                        children: (
                            <StatusTag status={status}/>
                        ),
                    }
                }
            },
            this.renderActionColumn(),
        ];
        this.actionColumns = {
            isEdit: true,
            isDelete: true,
            isChangeStatus: false,
        };
    }

    renderActionColumn = () => {
        return {
            title: 'Hành động',
            width: '100px',
            align: 'center',
            render: (dataRow) => {
                return {
                    props: {
                        style: dataRow.labelColor === 'none' ? {} : { background: dataRow.labelColor },
                    },
                    children: this.getActionColumn(dataRow)
                }
            }
        }
    }

    getActionColumn = (dataRow) => {
        const actionColumns = [];
        if(this.actionColumns.isEdit) {
            actionColumns.push(this.renderEditButton((
                <Button type="link" onClick={() => this.getDetail(dataRow.id)} className="no-padding">
                    { this.actionColumns.isEdit.icon || <EditOutlined/> }
                </Button>
            )))
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

    componentWillReceiveProps(nextProps) {
        if(nextProps.location.search !== this.props.location.search) {
            const { location: { search } } = nextProps;
            const { categoryName, categoryId } = qs.parse(search);
            this.categoryId = categoryId;
            this.pagination = { pageSize: 100 };
            this.objectName =  "Sản phẩm";
            this.breadcrumbs = [
                { name: "Sản phẩm" },
                { name: categoryName}
            ];
            const { changeBreadcrumb } = nextProps;
            if(this.breadcrumbs.length > 0) {
                changeBreadcrumb(this.breadcrumbs);
            }
            this.loadDataTable(nextProps);
        }
    }

    prepareCreateData(data) {
		return {
			...data,
            categoryId: this.categoryId,
			description: data.description
				&& data.description.replaceAll(
					AppConstants.contentRootUrl,
					"{{baseUrl}}"
				),
		}
	}

	prepareUpdateData(data) {
        return {
            ...data,
            id: this.dataDetail.id,
            categoryId: this.categoryId,
			description: data.description
				&& data.description.replaceAll(
					AppConstants.contentRootUrl,
					"{{baseUrl}}"
				),
        };
    }

    getDataDetailMapping(data) {
        return {
			...data,
			description: data.description
				&& data.description.replaceAll(
					"{{baseUrl}}",
					AppConstants.contentRootUrl
				),
		}
    }

    getSearchFields() {
        return [
            {
                key: "name",
                seachPlaceholder: 'Tên',
                initialValue: this.search.name,
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

    getList() {
        const { getDataList } = this.props;
        const page = this.pagination.current ? this.pagination.current - 1 : 0;
        const params = { page, size: this.pagination.pageSize, search: this.search, categoryId: this.categoryId};
        getDataList({ params });
    }

    render() {
        const {
            dataList,
            loading,
            uploadFile,
        } = this.props;
        const { isShowModifiedModal, isShowModifiedLoading } = this.state;
        const productData = dataList.data || [];
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
                        <PlusOutlined /> Thêm mới
                    </Button>
                ))
            }
            </div>
            <BaseTable
            loading={loading}
            columns={this.columns}
            rowKey={(record) => record.id}
            dataSource={productData}
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
            <ProductForm
                isEditing={this.isEditing}
                dataDetail={this.isEditing ? this.dataDetail : {}}
                uploadFile={uploadFile}
                loadingSave={isShowModifiedLoading}
            />
            </BasicModal>
        </div>
        );
    }
}

const mapStateToProps = (state) => ({
  loading: state.product.tbProductLoading,
  dataList: state.product.productData || {},
  categoryAutoComplete: state.product.categoryAutoComplete || [],
});

const mapDispatchToProps = (dispatch) => ({
  getDataList: (payload) => dispatch(actions.getProductList(payload)),
  getDataById: (payload) => dispatch(actions.getProductById(payload)),
  updateData: (payload) => dispatch(actions.updateProduct(payload)),
  deleteData: (payload) => dispatch(actions.deleteProduct(payload)),
  createData: (payload) => dispatch(actions.createProduct(payload)),
  uploadFile: (payload) => dispatch(actions.uploadFile(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductListPage);
