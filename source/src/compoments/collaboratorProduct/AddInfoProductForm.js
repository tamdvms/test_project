import React from "react";
import { Form, Col, Row } from "antd";

import BasicForm from "../common/entryForm/BasicForm";
import TextField from "../common/entryForm/TextField";
import FieldSet from "../common/elements/FieldSet";
import DropdownField from "../common/entryForm/DropdownField";
import CropImageFiled from "../common/entryForm/CropImageFiled";
import {
  AppConstants,
  UploadFileTypes,
  STATUS_ACTIVE,
} from "../../constants";
import {
    commonStatus,
    COLLABORATOR_PRODUCT_KIND_MONEY,
    COLLABORATOR_PRODUCT_KIND_PERCENT,
} from "../../constants/masterData";
import Utils from "../../utils";
import { showErrorMessage } from "../../services/notifyService";
import { actions } from '../../actions';
import NumericField from "../common/entryForm/NumericField";

class AddInfoProductForm extends BasicForm {
    constructor(props) {
        super(props)
        this.state = {
            kind: props.dataDetail.kind || COLLABORATOR_PRODUCT_KIND_MONEY
        }
    }

    getInitialValue = () => {
        const { dataDetail, isEditing } = this.props
        if(!isEditing) {
            return {
                kind: COLLABORATOR_PRODUCT_KIND_MONEY
            }
        }
        return {
            ...dataDetail,
        }
    }

    handleChangeKind = (value) => {
        this.setState({
            kind: value
        })
    }

    render() {
        const { formId, isEditing, dataDetail, t } = this.props;
        const { kind } = this.state;
        const { currencySymbol } = actions.getUserData()?.settings?.["Money and Number"]
        const valueKinds = [
            {
                value: COLLABORATOR_PRODUCT_KIND_MONEY,
                label: `${t("form.money")} (${currencySymbol})`
            },
            {
                value: COLLABORATOR_PRODUCT_KIND_PERCENT,
                label: `${t("form.percent")} (%)`
            },
        ]
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
                    <DropdownField
                        fieldName="kind"
                        label={t("form.label.kind")}
                        required
                        options={valueKinds}
                        onChange={this.handleChangeKind}
                    />
                </Col>
                <Col span={12}>
                    <NumericField
                    fieldName="value"
                    label={`${t("form.label.commission")} (${kind === COLLABORATOR_PRODUCT_KIND_MONEY ? currencySymbol : '%'})`}
                    min={0}
                    max={kind === COLLABORATOR_PRODUCT_KIND_MONEY ? Infinity : 100}
                    width="100%"
                    required
                    parser={(value) => Utils.formatIntegerNumber(value)}
                    />
                </Col>
            </Row>
        </Form>
        );
    }
}

export default AddInfoProductForm;
