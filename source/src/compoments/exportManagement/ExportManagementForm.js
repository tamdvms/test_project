import React from "react";
import { Form, Col, Row, Modal, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import BasicForm from "../common/entryForm/BasicForm";

import TextField from "../common/entryForm/TextField";

import Utils from "../../utils";
import { AppConstants, UploadFileTypes } from "../../constants";
import { showErrorMessage } from "../../services/notifyService";
import DropdownField from "../common/entryForm/DropdownField";
import UploadImageField from "../common/entryForm/UploadImageField";
import DatePickerField from "../common/entryForm/DatePickerField";
import NumericField from "../common/entryForm/NumericField";

class ExportManagementForm extends BasicForm {
	constructor(props) {
		super(props);
		this.state = {
			avatar: props.dataDetail.filePath
            ? `${AppConstants.contentRootUrl}${props.dataDetail.filePath}`
            : "",
			uploading: false,
			preview: false,
		}
	}

	getInitializeValue = () => {
		const { dataDetail, isEditing, categoryAutoComplete } = this.props;
		if(!isEditing) {
			return {
				categoryDto: {
					id: categoryAutoComplete[0]?.id
				}
			}
		}
		return {
			...dataDetail,
		}
	}

	uploadFileAvatar = (file, onSuccess) => {
        const { uploadFile } = this.props;
        this.setState({ uploading: true });
        uploadFile({
            params: { fileObjects: { file }, type: UploadFileTypes.DOCUMENT },
            onCompleted: (result) => {
            this.setFieldValue("filePath", result.data?.filePath);
            this.setState({
              avatar: `${AppConstants.contentRootUrl}${result.data.filePath}`
            });
            this.setState({ uploading: false });
            //onSuccess();
            },
            onError: (err) => {
            if (err && err.message) {
                showErrorMessage(err.message);
                this.setState({ uploading: false });
            }
            },
        });
    };

	validatePrice = (rule, price) => {
		const { t } = this.props;
		return !!(/^[0-9]+$/.exec(price))
        ? Promise.resolve()
        : Promise.reject(t("validationMessage.price"))
	}

	render() {
		const { formId, dataDetail, loadingSave, categoryAutoComplete, t } = this.props;
		const {
			uploading,
			avatar,
			preview,
		} = this.state;
		return (<>
			<Form
				id={formId}
				ref={this.formRef}
				layout="vertical"
				onFinish={this.handleSubmit}
				initialValues={this.getInitializeValue()}
			>
					<Row gutter={16}>
						<Col span={12}>
							<UploadImageField
								fieldName="filePath"
								loading={uploading}
								label={t("form.label.filePathExport")}
								imageUrl={avatar}
								onChange={this.handleChangeAvatar}
								uploadFile={this.uploadFileAvatar}
								disabled={loadingSave}
							/>
						</Col>
					</Row>
					<Row>
						{
							avatar ? (
								<Button
									style={{
										marginBottom: 8,
										marginTop: -24
									}}
									type="primary"
									onClick={() => this.setState({preview: true})}
								>
									<EyeOutlined />{t("form.label.preview")}
								</Button>
							) : null
						}
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<DropdownField
								fieldName={["categoryDto", "id"]}
								label={t("form.label.category")}
								required
								options={categoryAutoComplete}
								disabled={loadingSave}
								optionValue="id"
								optionLabel="categoryName"
							/>
						</Col>
						<Col span={12}>
							<TextField
							fieldName="code"
							label={t("form.label.code")}
							disabled={loadingSave}
							/>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<TextField
								type="number"
								fieldName="money"
								label={t("form.label.money")}
								required
								minLength={0}
								width="100%"
								disabled={loadingSave}
								validators={[this.validatePrice]}
							/>
						</Col>
						<Col span={12}>
							<TextField
							type="textarea"
							fieldName="note"
							label={t("form.label.note")}
							disabled={loadingSave}
							style={{ height: 110 }}
							/>
						</Col>
					</Row>
			</Form>
			<Modal
				bodyStyle={{ padding: 0 }}
				visible={preview}
				width={600}
				onCancel={() => this.setState({preview: false})}
				footer={false}
			>
				<img src={avatar} style={{
					width: 'auto',
					height: 'auto',
					maxWidth: '100%',
					maxHeight: '100vh',
					padding: 10,
					margin: '0 auto',
					display: 'block',
				}}/>
			</Modal>
		</>
		);
	}
}

export default ExportManagementForm;
