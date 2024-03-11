import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

import UserInfo from './UserInfo';
import UserPersonelInfo from './UserPersonelInfo';
import UserImage from './UserImage';
import { register } from '../../../actions/auth_actions';
import { clearForm } from '../../../actions/index';
import AnimatePage from '../../../components/AnimatePage';

const Register = ({ authReducer, register, clearForm }) => {
  const [page, setPage] = useState(1);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    return () => {
      clearForm();
    };
  }, [clearForm]);

  const getNext = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  const getPrevious = useCallback(() => {
    setPage((prevPage) => prevPage - 1);
  }, []);

  const onFormSubmit = useCallback(
    (initValues) => {
      const { password2, ...userInfo } = initValues;
      setProgress(true);

      let userForm = new FormData();
      for (let key in userInfo) {
        if (key === 'image') {
          userForm.append(key, userInfo[key][0]);
        } else {
          userForm.append(key, userInfo[key]);
        }
      }

      register(userForm, () => {
        setProgress(false);
      });
    },
    [register]
  );

  const renderForm = () => {
    switch (page) {
      case 1:
        return <UserInfo nextPage={getNext} />;
      case 2:
        return <UserPersonelInfo nextPage={getNext} previousPage={getPrevious} />;
      case 3:
        return (
          <UserImage
            onFormSubmit={onFormSubmit}
            previousPage={getPrevious}
            progress={progress}
          />
        );
      default:
        return null;
    }
  };

  const { isAuthenticated, user } = authReducer;

  if (isAuthenticated) {
    return <Redirect to="/" />;
  } else if (!isAuthenticated && user !== null) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="register-page">
      <AnimatePage />
      <div className="register-page-content">
        <div className="register-page-photo">
          <img src={page === 3 ? '/media/img/remove.png' : '/media/img/remove.png'} alt="register" />
        </div>
        <div>{renderForm()}</div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ authReducer }) => {
  return { authReducer };
};

export default connect(mapStateToProps, { register, clearForm })(Register);
