import React, {Component} from 'react';
import { Button, Modal } from 'antd';
import { withTranslation } from "react-i18next";

class BasicModal extends Component {

    getTitle() {
        const { hiddenTile, title, isEditing, objectName, t } = this.props;
        if(hiddenTile)
            return null;
        else if(title) {
            return title;
        }
        const name = objectName || '';
        return isEditing ? t('updateTitle', { objectName: name}) : t('createTitle', { objectName: name});
    }

    render() {
        const { visible, onOk, onCancel, loading, children, objectName, width, top, formId, bodyStyle, maskClosable, noFooter, additionalButton, className, closable = true, centered, t } = this.props;
        const formSubmitId = formId || `form-${objectName}`;
        let footerComponent = [<Button className="modal-btn-close" key="back" onClick={onCancel}>Đóng</Button>];
        if(onOk) {
            footerComponent.push(
                <Button className="modal-btn-save" key="submit" htmlType="submit" type="primary" loading={loading} form={formSubmitId}>
                   {t('saveButton')}
                </Button>
            )
        }
        if(additionalButton) {
            footerComponent.push(
                additionalButton
            )
        }
        return (
            <Modal
                closable={closable}
                className={className}
                maskClosable={!!maskClosable}
                bodyStyle={bodyStyle || { maxHeight: '84vh', overflow: 'auto'}}
                destroyOnClose // rerender child component when modal close
                style={{ top: top || 40 }}
                width={width || 800}
                visible={visible}
                title={this.getTitle()}
                onOk={onOk}
                onCancel={onCancel}
                footer={noFooter || footerComponent}
                centered={centered}
                >
                    {React.cloneElement(children, {
                        formId: formSubmitId,
                        onSubmit: onOk
                    })}
            </Modal>
        )
    }
}

export default withTranslation('basicModal')(BasicModal);
