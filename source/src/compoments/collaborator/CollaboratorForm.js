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
import { convertTimezoneToUtc } from "../../utils/datetimeHelper";

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
        const { isEditing, dataDetail,} = this.props;
        if (!isEditing) {
        return {
            status: STATUS_ACTIVE,
        };
        }
        return dataDetail;
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
        const password = this.getFieldValue("password");
        if ((password || newPassword) && password !== newPassword) {
        return Promise.reject("Mật khẩu không khớp vui lòng thử lại");
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
        onSubmit({
            ...formValues,
            ...this.otherData,
            birthday: convertTimezoneToUtc(formValues.birthday, 'DD/MM/YYYY'),
            dateOfIssue: convertTimezoneToUtc(formValues.dateOfIssue, 'DD/MM/YYYY')
        });
    }

  render() {
    const {
      isEditing,
      formId,
      loadingSave,
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
          title="Thông tin CTV"
        >
        <Row gutter={16}>
            <Col span={12}>
                <CropImageFiled
                    fieldName="avatarPath"
                    loading={uploading}
                    label="Ảnh đại diện"
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
                label="Tài khoản đăng nhập"
                required
                disabled={loadingSave || isEditing}
                />
            </Col>
            <Col span={12}>
                <TextField
                fieldName="fullName"
                label="Họ và tên"
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
                    label={isEditing ? "Mật khẩu mới" : "Mật khẩu"}
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
                    label={isEditing ? "Nhập lại mật khẩu mới" : "Nhập lại mật khẩu"}
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
                label="Ngày sinh"
                width="60%"
                onChange={this.onChangeDateBDate}
                format={"DD/MM/YYYY"}
                disabled={loadingSave}
                placeholder="Chọn ngày sinh"
                />
            </Col>
            <Col span={12}>
                <TextField
                fieldName="phone"
                label="Số điện thoại"
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
                placeholder="Nhập email"
                />
            </Col>
            <Col span={12}>
                <TextField
                fieldName="address"
                label="Địa chỉ"
                disabled={loadingSave}
                placeholder="Nhập địa chỉ"
                />
            </Col>
        </Row>
        </FieldSet>
        <FieldSet
          title="CMND"
        >
        <Row gutter={16}>
            <Col span={12}>
                <TextField
                fieldName="identityNumber"
                label="CMND"
                minLength={12}
                maxLength={12}
                disabled={loadingSave}
                placeholder="Nhập số CMND"
                />
            </Col>
            <Col span={12}>
                <TextField
                fieldName="placeOfIssue"
                label="Nơi đăng ký"
                disabled={loadingSave}
                placeholder="Nhập nơi đăng ký"
                />
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <DatePickerField
                fieldName="dateOfIssue"
                label="Ngày đăng ký"
                width="60%"
                format={"DD/MM/YYYY"}
                onChange={this.onChangeDateIssue}
                disabled={loadingSave}
                placeholder="Chọn ngày đăng ký"
                />
            </Col>
        </Row>
        </FieldSet>
        <FieldSet
          title="Ngân hàng"
        >
        <Row gutter={16}>
            <Col span={12}>
                <TextField
                fieldName="bankName"
                label="Tên ngân hàng"
                disabled={loadingSave}
                placeholder="Nhập tên ngân hàng"
                />
            </Col>
            <Col span={12} >
                <TextField
                fieldName="bankNo"
                label="Số tài khoản"
                type="number"
                minLength={8}
                maxLength={15}
                disabled={loadingSave}
                placeholder="Nhập STK"
                />
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <TextField
                fieldName="branchName"
                label="Chi nhánh"
                disabled={loadingSave}
                placeholder="Nhập chi nhánh"
                />
            </Col>
        </Row>
        </FieldSet>
        <FieldSet
          title="Trạng thái"
        >
            <Row gutter={16}>
                <Col span={12}>
                <DropdownField
                    fieldName="status"
                    label="Trạng thái"
                    required
                    options={commonStatus}
                    disabled={loadingSave}
                />
                </Col>
                <Col span={12}>
                <TextField 
                    fieldName="note"
                    label="Ghi chú"
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
