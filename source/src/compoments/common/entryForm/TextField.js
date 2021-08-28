import React from 'react';

import { Form, Input } from 'antd';
import { withTranslation } from 'react-i18next';

import BaseField from './BaseField';
const { TextArea } = Input;

class TextField extends BaseField {

    getMaxLengthMsg() {
        const { maxLength, maxLengthMsg, t } = this.props;
        return maxLengthMsg || t('maxLengthMsg', { var: maxLength});
    }

    getMinLengthMsg() {
        const { minLength, minLengthMsg, t } = this.props;
        return minLengthMsg || t('minLengthMsg', { var: minLength});
    }

    getTextFieldRules() {
        const { maxLength, minLength, type, invalidEmailMsg, t } = this.props;
        const rules = [];
        if(maxLength) {
            rules.push({max: maxLength, message: this.getMaxLengthMsg()});
        }
        if(minLength) {
            rules.push({min: minLength, message: this.getMinLengthMsg()});
        }
        if(type === 'email') {
            rules.push({
                type,
                message: invalidEmailMsg || t('invalidEmailMsg')
            })
        }

        return rules;
    }
    render() {
        const {
            type,
            size,
            label,
            fieldName,
            disabled,
            onBlur,
            validateStatus,
            help,
            style,
            className,
            onChange,
        } = this.props;

        return (
            <Form.Item
                className={className}
                label={label}
                name={fieldName}
                validateStatus={validateStatus}
                help={help}
                rules={[
                    ...this.getRules(),
                    ...this.getTextFieldRules()
                ]}
            >
                {
                    type === 'textarea'
                    ?
                    <TextArea onChange={onChange} style={style} placeholder={this.getPlaceHolder()} disabled={disabled} onBlur={onBlur}/>
                    :
                    <Input onChange={onChange} style={style} size={size} placeholder={this.getPlaceHolder()} disabled={disabled} type={type} onBlur={onBlur}/>
                } 
            </Form.Item>
        )
    }
}

export default withTranslation(['textField', 'baseField'])(TextField);