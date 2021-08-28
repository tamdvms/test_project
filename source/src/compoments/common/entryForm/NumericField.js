import React from 'react';

import { Form, InputNumber } from 'antd';

import BaseField from './BaseField';
import Utils from '../../../utils';
import { withTranslation } from 'react-i18next';

class NumericField extends BaseField {

    parser(value) {
        return value.replace(/\$\s?|(,*)/g, '');
    }

    formatter(value) {
        return Utils.formatNumber(value);
    }

    render() {
        const {
            label,
            fieldName,
            disabled,
            min,
            max,
            width,
            onChange,
            onBlur,
            formatter,
            parser,
            className,
            defaultValue,
        } = this.props;

        return (
            <Form.Item
                label={label}
                name={fieldName}
                rules={this.getRules()}
                className={className}
            >
                <InputNumber
                    placeholder={this.getPlaceHolder()}
                    max={max}
                    min={min}
                    disabled={disabled}
                    style={{width: width || '60%'}}
                    formatter={formatter || this.formatter}
                    parser={parser || this.parser}
                    onChange={onChange}
                    onBlur={onBlur}
                    defaultValue={defaultValue}
                />
                
            </Form.Item>
        )
    }
}

export default withTranslation('baseField')(NumericField);
