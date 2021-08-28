import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import ProfileForm from "../../compoments/account/ProfileForm";
import { actions } from "../../actions";
import {
  showErrorMessage,
  showSucsessMessage,
} from "../../services/notifyService";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.onUpdate = this.onUpdate.bind(this);
  }

  componentWillMount() {
    const {
      changeBreadcrumb,
      getProfile,
      showFullScreenLoading,
      currentUser,
      t
    } = this.props;
    showFullScreenLoading();
    getProfile({ kind: currentUser.kind });
    changeBreadcrumb([{ name: t('breadcrumbs.currentPage') }]);
  }

  onUpdate(valueForm) {
    const {
      updateProfile,
      profileData,
      hideFullScreenLoading,
      changeUserData,
      t,
    } = this.props;
    this.setState({ loading: true });
    updateProfile({
      params: { kind: profileData.kind, ...valueForm },
      onCompleted: (data) => {
        changeUserData({
          fullName: valueForm.fullName,
          avatar: valueForm.avatar,
          logo: valueForm.logo,
        });
        this.setState({ loading: false });
        hideFullScreenLoading();
        if (data.success === false) {
          showErrorMessage(t('message.updateProfileFail'));
        } else {
          showSucsessMessage(t('message.updateProfileSuccess'));
        }
      },
      onError: () => {
        this.setState({ loading: false });
        hideFullScreenLoading();
        showErrorMessage(t('message.updateProfileFail'));
      },
    });
  }

  getProfileData = () => {
    const { profileData } = this.props;
    return {
      ...profileData.account,
      ...profileData,
    };
  };
  render() {
    const { uploadFile, fullScreenLoading, t } = this.props;
    const { loading } = this.state;
    const profileData = this.getProfileData();
    if (
      profileData &&
      Object.keys(profileData).length > 0 &&
      fullScreenLoading === false
    ) {
      return (
        <div className="profile-container">
          <div className="profile-content">
            <ProfileForm
              onSubmit={this.onUpdate}
              loading={loading}
              userData={profileData}
              uploadFile={uploadFile}
              t={t}
            />
          </div>
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = (state) => ({
  profileData: state.account.data || {},
  fullScreenLoading: state.appCommon.fullScreenLoading,
});

const mapDispatchToProps = (dispatch) => ({
  getProfile: (payload) => dispatch(actions.getProfile(payload)),
  updateProfile: (payload) => dispatch(actions.updateProfile(payload)),
  uploadFile: (payload) => dispatch(actions.uploadFile(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('profilePage')(ProfilePage));
