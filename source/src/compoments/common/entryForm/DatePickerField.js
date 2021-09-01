import React from 'react';

import { Form, DatePicker } from 'antd';

import BaseField from './BaseField';

import { DATE_FORMAT_DISPLAY } from '../../../constants'

import { withTranslation } from 'react-i18next';

class DatePickerField extends BaseField {

    render() {
        const {
            width,
            size,
            format,
            label,
            fieldName,
            disabled,
            disabledDate,
            onChange,
            placeholder,
        } = this.props;
        const dateFormat = format || DATE_FORMAT_DISPLAY;
        return (
            <Form.Item
                label={label}
                name={fieldName}
                rules={this.getRules()}
            >
                <DatePicker
                    size={size}
                    disabledDate={disabledDate}
                    style={{width: width || '50%'}}
                    format={dateFormat}
                    disabled={disabled}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            </Form.Item>
        )
    }
}

export default withTranslation(['datePickerField', 'baseField'])(DatePickerField);
