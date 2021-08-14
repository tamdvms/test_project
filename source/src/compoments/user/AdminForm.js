import React from "react";
import { Form, Col, Row } from "antd";
import { SketchPicker } from 'react-color';

import BasicForm from "../common/entryForm/BasicForm";
import TextField from "../common/entryForm/TextField";
import DropdownField from "../common/entryForm/DropdownField";

import { commonStatus, commonLanguages } from "../../constants/masterData";
import CropImageFiled from "../common/entryForm/CropImageFiled";

import {
  AppConstants,
  UploadFileTypes,
  STATUS_ACTIVE,
} from "../../constants";
import Utils from "../../utils";
import { showErrorMessage } from "../../services/notifyService";

// import { actions } from "../../actions";
// const { getUserData } = actions;

class AdminForm extends BasicForm {
	constructor(props) {
		super(props);
		this.state = {
			logo: props.dataDetail.avatar
				? `${AppConstants.contentRootUrl}/${props.dataDetail.avatar}`
				: "",
			uploading: false,
			color: props.dataDetail.labelColor ? props.dataDetail.labelColor : '#498D49',
			displayColorPicker: false,
		};
	}

	componentDidMount() {
		const { dataDetail } = this.props;
		this.setFieldValue("avatar", dataDetail.avatar);
	}

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
		return Promise.reject("Mật khẩu không khớp!");
		} else {
		return Promise.resolve();
		}
	};

	handleChangeLogo = (info) => {
		console.log(info);
		if (info.file.status === "done") {
		Utils.getBase64(info.file.originFileObj, (logo) =>
			this.setState({ logo })
		);
		}
	};

	uploadFileLogo = (file, onSuccess) => {
		const { uploadFile } = this.props;
		this.setState({ uploading: true });
		uploadFile({
		params: { fileObjects: { file }, type: UploadFileTypes.AVATAR },
		onCompleted: (result) => {
			// this.otherData.logoPath = result.data.filePath;
			this.setFieldValue("avatar", result.data.filePath);
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

	getInitialFormValues = () => {
		const { isEditing, dataDetail } = this.props;
		if (!isEditing) {
		return {
			status: STATUS_ACTIVE,
		};
		}
		return dataDetail;
	};

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

	render() {
		const { isEditing, formId, loadingSave, showColorPicker } = this.props;
		const {
			uploading,
			logo,
			color,
			displayColorPicker,
		} = this.state;
		return (
		<Form
			id={formId}
			ref={this.formRef}
			layout="vertical"
			onFinish={this.handleSubmit}
			initialValues={this.getInitialFormValues()}
		>
			<Row gutter={16}>
			<Col span={12}>
				<CropImageFiled
				fieldName="avatar"
				loading={uploading}
				label="Ảnh đại diện"
				imageUrl={logo}
				onChange={this.handleChangeLogo}
				uploadFile={this.uploadFileLogo}
				disabled={loadingSave}
				/>
			</Col>
			</Row>
			<Row gutter={16}>
			<Col span={12}>
				<TextField
				fieldName="username"
				min={6}
				label="Tên đăng nhập"
				disabled={isEditing || loadingSave}
				required={!isEditing}
				validators={[Utils.validateUsernameForm]}
				/>
			</Col>
			<Col span={12}>
				<TextField fieldName="fullName" label="Họ và tên" required disabled={loadingSave}/>
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
				type="password"
				fieldName="confirmPassword"
				label={isEditing ? "Xác nhận mật khẩu mới" : "Xác nhận mật khẩu"}
				required={!isEditing || this.getFieldValue("password")}
				validators={[this.compareToPassword]}
				disabled={loadingSave}
				/>
			</Col>
			</Row>
			<Row gutter={16}>
			<Col span={12}>
				<TextField fieldName="email" label="E-mail" type="email" disabled={loadingSave}/>
			</Col>
			<Col span={12}>
				<TextField
				type="number"
				fieldName="phone"
				label="Số điện thoại"
				required
				minLength={10}
				disabled={loadingSave}
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
				<Col span={12} hidden={!showColorPicker}>
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
		</Form>
		);
	}
}

export default AdminForm;
