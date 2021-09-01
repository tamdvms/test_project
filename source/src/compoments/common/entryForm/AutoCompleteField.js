import React from 'react';

import { Form, Select } from 'antd';
import BaseField from './BaseField';
import Utils from '../../../utils';
import { withTranslation } from 'react-i18next';

const Option = Select.Option;
class AutoCompleteField extends BaseField {

    onFilterOption = (input, option) => {
        return Utils.removeAccents(option.children.toLowerCase()).indexOf(Utils.removeAccents(input.toLowerCase())) >= 0
    }
   
    render() {
        const {
            loading,
            label,
            mode,
            fieldName,
            disabled,
            options,
            optionValue,
            optionLabel,
            optionOther,
            allowClear,
            onSelect,
            onChange,
            onDeselect,
            onSearch,
            onBlur,
            renderCustomOption,
            optionLabelProp,
            autoComplete,
            className,
            t,
        } = this.props;

        const optionValueKey = optionValue || 'value';
        const optionLabelKey = optionLabel || 'label';
        const optionOtherKey = optionOther || 'other';

        const selectOptions = options || [];

        return (
            <Form.Item
                label={label}
                name={fieldName}
                rules={this.getRules()}
                className={className}
            >
              
                {
                    <Select
                        optionLabelProp={optionLabelProp}
                        showSearch
                        allowClear={allowClear}
                        disabled={disabled}
                        placeholder={this.getPlaceHolder()}
                        loading={loading}
                        defaultActiveFirstOption={false}
                        showArrow={loading || false}
                        onSearch={onSearch}
                        filterOption={onSearch ? false : this.onFilterOption}
                        onChange= {onChange}
                        onSelect={onSelect}
                        onDeselect={onDeselect}
                        onBlur={onBlur}
                        mode={mode}
                        autoComplete={autoComplete}
                    >
                    {
                        selectOptions
                        ?
                        selectOptions.map(option => 
                            renderCustomOption ?
                            renderCustomOption(option[optionValueKey], option[optionValueKey], option)
                            :
                            <Option key={option[optionValueKey]} value={option[optionValueKey]} other={option[optionOtherKey]} >
                                {t(option[optionLabelKey])}
                            </Option>
                        )
                        :
                        null
                    }
                </Select>
                }


            </Form.Item>
        )
    }
}

export default withTranslation(['constants', 'baseField'])(AutoCompleteField);