import React from 'react';
import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';

import Utils from '../../../utils';

const StatusTag = ({status}) => {
    const statusItem = Utils.getCommonStatusItem(status);
    const { t } = useTranslation('constants');
        if(statusItem)
            return (
                <Tag className="tag-status" color={statusItem.color}>
                    {t(statusItem.label)}
                </Tag>
            )
        return null;
}

export default StatusTag;