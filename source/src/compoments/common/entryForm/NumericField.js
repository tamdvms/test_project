import React from 'react';

import { Form, InputNumber } from 'antd';

import BaseField from './BaseField';
import Utils from '../../../utils';

class NumericField extends BaseField {

    render() {
        const {
            label,
            fieldName,
            disabled,
            min,
            max,
            width,
            onChange,
            onBlur
        } = this.props;

        return (
            <Form.Item
                label={label}
                name={fieldName}
                rules={this.getRules()}
            >
                <InputNumber
                    placeholder={this.getPlaceHolder()}
                    max={max}
                    min={min}
                    disabled={disabled}
                    style={{width: width || '60%'}}
                    formatter={value => Utils.formatNumber(value)}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    onChange={onChange}
                    onBlur={onBlur}
                />
                
            </Form.Item>
        )
    }
}

export default NumericField;
