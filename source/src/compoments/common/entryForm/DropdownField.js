import React from 'react';

import { Form, Select } from 'antd';

import BaseField from './BaseField';
import { FieldTypes } from '../../../constants/formConfig';

class DropdownField extends BaseField {
    constructor(props) {
        super(props);
        this.fieldType = FieldTypes.SELECT;
    }
    render() {
        const {
            label,
            loading,
            fieldName,
            disabled,
            mode,
            tagRender,
            options,
            optionValue,
            optionLabel,
            optionOther,
            labelInValue,
            onSelect,
            onChange,
            noStyle,
            dropdownClassName,
            allowClear,
        } = this.props;

        let optionValueKey = optionValue || 'value';
        let optionLabelKey = optionLabel || 'label';
        const optionOtherKey = optionOther || 'other';

        return (
            <Form.Item label={label}
                name={fieldName}
                rules={this.getRules()}
                shouldUpdate={false}
                noStyle={noStyle}
            >
                <Select
                    loading={loading}
                    placeholder={this.getPlaceHolder()}
                    mode={mode}
                    disabled={disabled}
                    onSelect={onSelect}
                    onChange={onChange}
                    tagRender={tagRender}
                    dropdownClassName={dropdownClassName}
                    allowClear={allowClear}
                >
                    {
                        options
                        ?
                        options.map(item =>
                        <Select.Option key={item[optionValueKey]} value={item[optionValueKey]} other={item[optionOtherKey]}>{item[optionLabelKey]}{labelInValue?` (${item[optionValueKey]})` : null}</Select.Option>
                        )
                        :
                        null
                    }
                </Select>
            </Form.Item>
        )
    }
}

export default DropdownField;