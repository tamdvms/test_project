import React from "react";
import { Form, Col, Row } from "antd";

import BasicForm from "../common/entryForm/BasicForm";
import TextField from "../common/entryForm/TextField";
import FieldSet from "../common/elements/FieldSet";
import DropdownField from "../common/entryForm/DropdownField";
import {
  AppConstants,
  STATUS_ACTIVE,
} from "../../constants";
import { commonStatus } from "../../constants/masterData";
import Utils from "../../utils";
import { showErrorMessage } from "../../services/notifyService";

class ProductForm extends BasicForm {

    getInitialValue = () => {
        const { dataDetail, isEditing, categoryAutoComplete } = this.props;
        if(!isEditing) {
        return {
            ...dataDetail,
            status: STATUS_ACTIVE,
            categoryId: categoryAutoComplete[0]?.id,
        }
        }
        return {
            ...dataDetail,
        }
    }

    render() {
        const { formId, dataDetail, loadingSave, isEditing, categoryAutoComplete } = this.props;
        return (
        <Form
            id={formId}
            ref={this.formRef}
            layout="vertical"
            onFinish={this.handleSubmit}
            initialValues={this.getInitialValue()}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <TextField
                    fieldName="productName"
                    label="Tên"
                    required
                    disabled={loadingSave}
                    />
                </Col>
                <Col span={12}>
                    <TextField
                        type="number"
                        fieldName="productPrice"
                        label="Giá tiền (VNĐ)"
                        required
                        minLength={0}
                        disabled={loadingSave}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <DropdownField
                        fieldName="categoryId"
                        label="Danh mục"
                        required
                        options={categoryAutoComplete}
                        optionValue="id"
                        optionLabel="categoryName"
                        disabled={loadingSave}
                    />
                </Col>
                <Col span={12}>
                    <DropdownField
                        fieldName="status"
                        label="Trạng thái"
                        required
                        options={commonStatus}
                        disabled={loadingSave}
                    />
                </Col>

            </Row>
        </Form>
        );
    }
}

export default ProductForm;
