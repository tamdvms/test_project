import React from 'react';
import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';

import Utils from '../../../utils';

const KindTag = ({kind}) => {
    const kindItem = Utils.getCommonKindItem(kind);
    const {  t } = useTranslation('constants');
        if(kindItem)
            return (
                <Tag className="tag-kind" color={kindItem.color}>
                    {t(kindItem.label)}
                </Tag>
            )
        return null;
}

export default KindTag;