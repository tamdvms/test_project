import React, { Component } from 'react';
import { Result } from 'antd';
import { withTranslation } from "react-i18next";

class Forbidden extends Component {

    componentWillMount() {
        const { changeBreadcrumb, t } = this.props;
        changeBreadcrumb([{name: t('breadcrumbs.currentPage')}]);
    }

    render() {
        const { t } = this.props;
        return (
            <Result
                status="403"
                title="403"
                subTitle={t('message.forbiddenMessage')}
            />
        )
    }
}

export default (withTranslation(['ForbiddenListPage'])(Forbidden));
