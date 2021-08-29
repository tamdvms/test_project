import React from 'react';
import { Tag } from 'antd';
import { REG_SOURCE_PHONE, REG_SOURCE_GOOGLE, REG_SOURCE_FACEBOOK } from '../../../constants';
import { useTranslation } from 'react-i18next';

const colorArr = {
    [REG_SOURCE_PHONE]: { color: '#2db7f5', text: 'Phone' },
    [REG_SOURCE_FACEBOOK]: { color: '#4267B2', text: 'FaceBook' },
    [REG_SOURCE_GOOGLE]: { color: '#DB4437', text: 'Google' },
}

const SourceTag = ({source}) => {
    const colorItem = colorArr[source];
    const { t } = useTranslation('constants');
    if(colorItem)
        return (
            <Tag color={colorItem.color}>{t(colorItem.text)}</Tag>
        )
    return null;
}

export default SourceTag;
