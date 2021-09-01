import React from "react";
import { Form, Col, Row, } from "antd";

import BasicForm from "../common/entryForm/BasicForm";
import TextField from "../common/entryForm/TextField";
import DropdownField from "../common/entryForm/DropdownField";
import CropImageFiled from "../common/entryForm/CropImageFiled";
import { commonStatus } from "../../constants/masterData";
import Utils from "../../utils";
import {
  STATUS_ACTIVE,
  AppConstants,
  UploadFileTypes,
} from "../../constants";
import { showErrorMessage } from "../../services/notifyService";
import FieldSet from "../common/elements/FieldSet"
import DatePickerField from "../common/entryForm/DatePickerField";
import { convertStringToDateTime, convertDateTimeToString } from "../../utils/datetimeHelper";

class CollaboratorForm extends BasicForm {
    constructor(props) {
        super(props);
        this.state = {
        avatar: props.dataDetail.avatarPath
            ? `${AppConstants.contentRootUrl}/${props.dataDetail.avatarPath }`
            : "",
        uploading: false,
        };
    }

    handleChangeAvatar = (info) => {
        if (info.file.status === "done") {
        Utils.getBase64(info.file.originFileObj, (avatar) =>
            this.setState({ avatar })
        );
        }
    };

    uploadFileAvatar = (file, onSuccess) => {
        const { uploadFile } = this.props;
        this.setState({ uploading: true });
        uploadFile({
        params: { fileObjects: { file }, type: UploadFileTypes.AVATAR },
        onCompleted: (result) => {
            this.setFieldValue("avatarPath", result.data.filePath);
            this.setState({ uploading: false });
            onSuccess();
        },
        onError: (err) => {
            if (err && err.message) {
            showErrorMessage(err.message);
            this.setState({ uploading: false });
            }
        },
        });
    };
    componentDidMount() {
        const { dataDetail } = this.props;
        this.setFieldValue("avatarPath", dataDetail.avatarPath);
    }

    getInitialFormValues = () => {
        const { isEditing, dataDetail } = this.props;
        if (!isEditing) {
            return {
                status: STATUS_ACTIVE,
            };
        }
        return {
            ...dataDetail,
            dateOfIssue: convertStringToDateTime(dataDetail.dateOfIssue, 'DD/MM/YYYY HH:mm:ss', 'DD/MM/YYYY'),
            birthday: convertStringToDateTime(dataDetail.birthday, 'DD/MM/YYYY HH:mm:ss', 'DD/MM/YYYY')
        };
    };

    validateToConfirmPassword = (rule, value) => {
        const {
        current: { validateFields, isFieldTouched },
        } = this.formRef;
        if (isFieldTouched("confirmPassword")) {
        validateFields(["confirmPassword"], { force: true });
        }
        return Promise.resolve();
    };

    compareToPassword = (rule, newPassword) => {
        const { t } = this.props;
        const password = this.getFieldValue("password");
        if ((password || newPassword) && password !== newPassword) {
        return Promise.reject(t("validationMessage.password"));
        } else {
        return Promise.resolve();
        }
    };

    onChangeDateBDate = (value) => {
        const Date = this.getFieldValue('birthday');
        if(Date) {
            this.setFieldValue('birthday', value);
        }
    }
    onChangeDateIssue = (value) => {
        const Date = this.getFieldValue('dateOfIssue');
        if(Date) {
            this.setFieldValue('dateOfIssue', value);
        }
    }

    handleSubmit(formValues) {
        const { onSubmit } = this.props;
        if(formValues.dateOfIssue) {
            formValues.dateOfIssue = formValues.dateOfIssue
        }
        if(formValues.birthday) {
            formValues.birthday = formValues.birthday
        }
        onSubmit({
            ...formValues,
            ...this.otherData,
            dateOfIssue: convertDateTimeToString(formValues.dateOfIssue, 'DD/MM/YYYY HH:mm:ss'),
            birthday: convertDateTimeToString(formValues.birthday, 'DD/MM/YYYY HH:mm:ss')
        });
    }

    render() {
        const {
        isEditing,
        formId,
        loadingSave,
        t,
        } = this.props;
        const { avatar, uploading } = this.state;

        return (
        <Form
            id={formId}
            ref={this.formRef}
            layout="vertical"
            onFinish={this.handleSubmit}
            initialValues={this.getInitialFormValues()}
        >
            <FieldSet
            title={t("form.fieldset.collaboratorInfo")}
            >
            <Row gutter={16}>
                <Col span={12}>
                    <CropImageFiled
                        fieldName="avatarPath"
                        loading={uploading}
                        label={t("form.label.avatar")}
                        imageUrl={avatar}
                        onChange={this.handleChangeAvatar}
                        uploadFile={this.uploadFileAvatar}
                        disabled={loadingSave}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <TextField
                    fieldName="username"
                    label={t("form.label.username")}
                    required
                    disabled={loadingSave || isEditing}
                    />
                </Col>
                <Col span={12}>
                    <TextField
                    fieldName="fullName"
                    label={t("form.label.fullName")}
                    required
                    disabled={loadingSave}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <TextField
                        type="password"
                        fieldName="password"
                        label={isEditing ? t("form.label.newPassword") : t("form.label.password")}
                        required={!isEditing}
                        validators={[this.validateToConfirmPassword]}
                        minLength={6}
                        disabled={loadingSave}
                    />
                </Col>
                <Col span={12}>
                    <TextField
                        fieldName="confirmPassword"
                        type="password"
                        label={isEditing ? t("form.label.typeNewPasswordAgain") : t("form.label.typePasswordAgain")}
                        required={!isEditing || this.getFieldValue("password")}
                        validators={[this.compareToPassword]}
                        disabled={loadingSave}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <DatePickerField
                    fieldName="birthday"
                    label={t("form.label.birthday")}
                    width="60%"
                    onChange={this.onChangeDateBDate}
                    format={"DD/MM/YYYY"}
                    disabled={loadingSave}
                    placeholder={t("form.placeholder.birthday")}
                    />
                </Col>
                <Col span={12}>
                    <TextField
                    fieldName="phone"
                    label={t("form.label.phone")}
                    type="number"
                    minLength={10}
                    maxLength={11}
                    required
                    disabled={loadingSave}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <TextField
                    fieldName="email"
                    label="E-mail"
                    type="email"
                    disabled={loadingSave}
                    placeholder={t("form.placeholder.email")}
                    />
                </Col>
                <Col span={12}>
                    <TextField
                    type="textarea"
                    fieldName="address"
                    label={t("form.label.address")}
                    disabled={loadingSave}
                    placeholder={t("form.placeholder.address")}
                    style={{height: 120}}
                    />
                </Col>
            </Row>
            </FieldSet>
            <FieldSet
            title={t("form.fieldset.personalIdentityCard")}
            >
            <Row gutter={16}>
                <Col span={12}>
                    <TextField
                    fieldName="identityNumber"
                    label={t("form.label.personalIdentityCard")}
                    minLength={12}
                    maxLength={12}
                    disabled={loadingSave}
                    placeholder={t("form.placeholder.personalIdentityCard")}
                    />
                </Col>
                <Col span={12}>
                    <TextField
                    fieldName="placeOfIssue"
                    label={t("form.label.placeOfIssue")}
                    disabled={loadingSave}
                    placeholder={t("form.placeholder.placeOfIssue")}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <DatePickerField
                    fieldName="dateOfIssue"
                    label={t("form.label.dateOfIssue")}
                    width="60%"
                    format={"DD/MM/YYYY"}
                    onChange={this.onChangeDateIssue}
                    disabled={loadingSave}
                    placeholder={t("form.placeholder.dateOfIssue")}
                    />
                </Col>
            </Row>
            </FieldSet>
            <FieldSet
            title={t("form.fieldset.bank")}
            >
            <Row gutter={16}>
                <Col span={12}>
                    <TextField
                    fieldName="bankName"
                    label={t("form.label.bankName")}
                    disabled={loadingSave}
                    placeholder={t("form.placeholder.bankName")}
                    />
                </Col>
                <Col span={12} >
                    <TextField
                    fieldName="bankNo"
                    label={t("form.label.bankNo")}
                    type="number"
                    minLength={8}
                    maxLength={15}
                    disabled={loadingSave}
                    placeholder={t("form.placeholder.bankNo")}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <TextField
                    fieldName="branchName"
                    label={t("form.label.branchName")}
                    disabled={loadingSave}
                    placeholder={t("form.placeholder.branchName")}
                    />
                </Col>
            </Row>
            </FieldSet>
            <FieldSet
            title={t("form.fieldset.status")}
            >
                <Row gutter={16}>
                    <Col span={12}>
                    <DropdownField
                        fieldName="status"
                        label={t("form.label.status")}
                        required
                        options={commonStatus}
                        disabled={loadingSave}
                    />
                    </Col>
                    <Col span={12}>
                    <TextField 
                        fieldName="note"
                        label={t("form.label.note")}
                        type="textarea"
                        style={{height: '120px'}}
                        disabled={loadingSave}
                    />
                    </Col>
                </Row>
            </FieldSet>
        </Form>
        );
    }
}

export default CollaboratorForm;
