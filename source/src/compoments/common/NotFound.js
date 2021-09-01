import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { withTranslation } from 'react-i18next';

class NotFound extends Component {
    render() {
        const { t } = this.props;
        return (
            <div className="page-not-found">
                <h1 className="title">
                    404
                </h1>
                <div className="desc">
                    {t('notFoundMsg')}
                </div>
                <Link to="/"><Button className="go-back-btn" type="primary" size="large">{t('goBack')}</Button></Link>
            </div>
        );
    }
}

export default withTranslation(['notFound'])(NotFound);