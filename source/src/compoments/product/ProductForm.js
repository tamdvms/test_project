import React from "react";
import { Form, Col, Row } from "antd";
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

class ProductForm extends BasicForm {
    constructor(props) {
        super(props);
        this.state = {
        avatar: props.dataDetail.productImage
            ? `${AppConstants.contentRootUrl}/${props.dataDetail.productImage}`
            : "",
        uploading: false,
        color: props.dataDetail.labelColor ? props.dataDetail.labelColor : Utils.getRandomColor(),
		displayColorPicker: false,
        }
    }

    handleSubmit(formValues) {
		const { onSubmit } = this.props;
		const { color } = this.state;
		onSubmit({
			...formValues,
			...this.otherData,
			labelColor: color
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
        }
        }
        return {
            ...dataDetail,
        }
    }

    validatePrice = (rule, price) => !!(/^[0-9]+$/.exec(price))
        ? Promise.resolve()
        : Promise.reject('Price chỉ bao gồm các ký tự 0-9')

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
                    <DropdownField
                        fieldName="status"
                        label="Trạng thái"
                        required
                        options={commonStatus}
                        disabled={loadingSave}
                    />
                </Col>
                <Col span={12}>
					<Form.Item
					label="Chọn nhãn màu"
					>
						<div
						style={{
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
								width: '36px',
								height: '14px',
								borderRadius: '2px',
								background: color,
							}} />
						</div>
						{
						displayColorPicker
						? (
							<>
							<div style={{
								position: 'absolute',
								top: '0px',
								right: '0px',
								bottom: '0px',
								left: '0px',
							}} onClick={ this.handleClose }/>
							<div style={{
								position: 'static',
								zIndex: '2',
							}}>
								<SketchPicker color={ color } onChange={ this.handleChange }/>
							</div>
							</>
						)
							: null
						}
					</Form.Item>
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

export default ProductForm;
