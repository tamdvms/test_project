import React from "react";
import { Form, Col, Row } from "antd";

import BasicForm from "../common/entryForm/BasicForm";
import TextField from "../common/entryForm/TextField";
import FieldSet from "../common/elements/FieldSet";
import DropdownField from "../common/entryForm/DropdownField";
import {
  STATUS_ACTIVE,
} from "../../constants";
import { commonStatus } from "../../constants/masterData";
import Utils from "../../utils";
import { showErrorMessage } from "../../services/notifyService";

class CollaboratorCategoryForm extends BasicForm {

    getInitialValue = () => {
        const { dataDetail, isEditing } = this.props;
        if(!isEditing) {
        return {
            ...dataDetail,
            status: STATUS_ACTIVE,
        }
        }
        return {
        ...dataDetail,
        }
    }

    render() {
        const { formId, dataDetail, loadingSave, isEditing } = this.props;
        const { avatar, uploading } = this.state;
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
                    fieldName="categoryName"
                    label="Tên danh mục"
                    required
                    disabled={loadingSave}
                    />
                </Col>
                <Col span={12}>
                    <TextField
                    type="textarea"
                    fieldName="categoryDescription"
                    label="Mô tả"
                    required
                    style={{
                        height: 100
                    }}
                    disabled={loadingSave}/>
                </Col>
            </Row>
            <Row gutter={16}>
                {
                    isEditing ? (
                        <Col span={12}>
                            <DropdownField
                                fieldName="status"
                                label="Trạng thái"
                                required
                                options={commonStatus}
                                disabled={loadingSave}
                            />
                        </Col>
                    ) : null
                }
            </Row>
        </Form>
        );
    }
}

export default CollaboratorCategoryForm;
