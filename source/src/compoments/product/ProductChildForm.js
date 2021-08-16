import React from "react";
import { Form, Col, Row, Button } from "antd";
import { SketchPicker } from 'react-color';

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
import { commonStatus } from "../../constants/masterData";
import Utils from "../../utils";
import { showErrorMessage } from "../../services/notifyService";
import NumericField from "../common/entryForm/NumericField";
import RichTextField from "../common/entryForm/RichTextField";

class ProductChildForm extends BasicForm {
    constructor(props) {
        super(props);
        this.state = {
        avatar: props.dataDetail.productImage
            ? `${AppConstants.contentRootUrl}/${props.dataDetail.productImage}`
            : "",
        uploading: false,
        color: props.dataDetail.labelColor ? props.dataDetail.labelColor : this.defaultColor,
		displayColorPicker: false,
        }
    }

    handleResetColor = () => {
        this.setState({
            color: this.defaultColor
        })
    }

    handleSubmit(formValues) {
		const { onSubmit } = this.props;
		const { color } = this.state;
        if(color !== this.defaultColor) {
            formValues['labelColor'] = color;
        }
		onSubmit({
			...formValues,
			...this.otherData,
		});
	}

    handleClick = () => {
		this.setState({ displayColorPicker: !this.state.displayColorPicker })
	};

	handleClose = () => {
		this.setState({ displayColorPicker: false })
	};

	handleChange = (color) => {
		this.setState({ color: color.hex })
	};

    handleChangeAvatar = (info) => {
        console.log(info);
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
            this.setFieldValue("productImage", result.data.filePath);
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

    getInitialValue = () => {
        const { dataDetail, isEditing } = this.props;
        if(!isEditing) {
            return {
                ...dataDetail,
                status: STATUS_ACTIVE,
                saleoff: 0,
            }
        }
        return {
            ...dataDetail,
        }
    }

    validatePrice = (rule, price) => !!(/^[0-9]+$/.exec(price))
        ? Promise.resolve()
        : Promise.reject('Price chỉ bao gồm các ký tự 0-9')

    handleCloseColorPicker = (e) => {
        if(!this.colorPickerRef.current.contains(e.target) && !this.toggleColorPickerRef.current.contains(e.target)) {
            this.handleClose()
        }
    }

    render() {
        const { formId, dataDetail, loadingSave, isEditing } = this.props;
        const {
			uploading,
			avatar,
			color,
            displayColorPicker,
		} = this.state;
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
                    <CropImageFiled
                        fieldName="productImage"
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
                        label="Giá tiền"
                        required
                        minLength={0}
                        width="100%"
                        disabled={loadingSave}
                        validators={[this.validatePrice]}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <NumericField
                    fieldName="saleoff"
                    label="Giảm giá (%)"
                    disabled={loadingSave}
                    min={0}
                    max={100}
                    width="100%"
                    parser={(value) => Utils.formatIntegerNumber(value)}
                    />
                </Col>
                <Col span={12}>
					<Form.Item
					label="Chọn nhãn màu"
					>
                        <div style={{
                            display: 'flex',
                            alignItems: 'start',
                        }}>
                            <div
                            ref={this.toggleColorPickerRef}
                            style={{
                                marginTop: '1px',
                                padding: '5px',
                                background: '#fff',
                                borderRadius: '1px',
                                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                                display: 'inline-block',
                                cursor: 'pointer',
                            }}
                            onClick={ this.handleClick }
                            >
                                <div style={{
                                    width: '64px',
                                    height: '20px',
                                    borderRadius: '2px',
                                    background: color,
                                }} />
                            </div>
                            <Button type="ghost"
                            onClick={this.handleResetColor}
                            style={{
                                boxShadow: 'none'
                            }}
                            >Reset</Button>
                        </div>
                        <div
                        ref={this.colorPickerRef}
                        style={{
                            position: 'absolute',
                            zIndex: '2',
                            display: displayColorPicker ? 'block' : 'none'
                        }}
                        >
                            <SketchPicker color={ color } onChange={ this.handleChange }/>
                        </div>
					</Form.Item>
				</Col>
            </Row>
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
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <RichTextField
                        label="Mô tả"
                        fieldName="description"
                        disabled={loadingSave}
                    />
                </Col>
            </Row>
        </Form>
        );
    }
}

export default ProductChildForm;
