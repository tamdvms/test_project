import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button } from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import qs from 'query-string';

import ListBasePage from "../ListBasePage";
import ProductForm from "../../compoments/product/ProductForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";

import { actions } from "../../actions";
import { FieldTypes } from "../../constants/formConfig";
import { AppConstants } from "../../constants";
import { categoryKinds, commonStatus } from "../../constants/masterData";

const { CATEGORY_KIND_PRODUCT } = categoryKinds;

class ProductListPage extends ListBasePage {
    initialSearch() {
        return { name: "", categoryId: null, status: null };
    }

    constructor(props) {
        super(props);
        const { t } = props;
        this.pagination = { pageSize: 100 };
        this.objectName =  "Sản phẩm";
        this.breadcrumbs = [
            { name: "Sản phẩm" },
        ];
        this.columns = [
            this.renderIdColumn(),
            {
                title: 'Tên',
                render: (dataRow) => {
                    return (
                        <span>
                            {dataRow.productName}
                        </span>
                    )
                }
            },
            {
                title: 'Danh mục',
                dataIndex: 'categoryId',
                render: (categoryId) => {
                    const { categoryAutoComplete } = this.props;
                    const findedCategory = categoryAutoComplete?.find(c => c.id === categoryId) || {};
                    return (
                        <div>{findedCategory.categoryName}</div>
                    )
                }
            },
            {
                title: <div className="tb-al-r">Giá tiền (VNĐ)</div>,
                dataIndex: 'productPrice',
                align: 'right',
                render: (productPrice) => {
                    return <span className="tb-al-r">{productPrice}</span>
                }
            },
            this.renderStatusColumn(),
            this.renderActionColumn(),
        ];
        this.actionColumns = {
            isEdit: true,
            isDelete: true,
            isChangeStatus: false,
        };

        this.props.getProductAutoComplete({ params: { kind: CATEGORY_KIND_PRODUCT }});
    }

    getSearchFields() {
        const { categoryAutoComplete } = this.props;
        return [
            {
                key: "name",
                seachPlaceholder: 'Tên',
                initialValue: this.search.name,
            },
            {
                key: "categoryId",
                seachPlaceholder: "Chọn danh mục",
                fieldType: FieldTypes.SELECT,
                options: categoryAutoComplete,
                optionLabelKey: 'categoryName',
                optionValueKey: 'id',
                initialValue: this.search.categoryId,
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

    render() {
        const {
            dataList,
            loading,
            uploadFile,
            categoryAutoComplete,
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
                categoryAutoComplete={categoryAutoComplete}
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
  getProductAutoComplete: (payload) => dispatch(actions.getProductCategoryAutoComplete(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductListPage);
