import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { closeAlert } from '../actions';

const Alerts = ({ alertReducer }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!alertReducer.type) {
      const timeoutId = setTimeout(() => {
        dispatch(closeAlert());
      }, 8000);

      return () => clearTimeout(timeoutId);
    }
  }, [alertReducer.type, dispatch]);

  const handleCloseAlert = () => {
    dispatch(closeAlert());
  };

  return (
    <>
      {alertReducer.type === 'success' && (
        <div className="alert success-alert animated flash">
          <div className="float-right point-effect" onClick={handleCloseAlert}>
            <i className="fa fa-close"></i>
          </div>
          <p>{alertReducer.msg}</p>
        </div>
      )}
      {alertReducer.type === 'error' && (
        <div className="alert error-alert animated flash">
          <div className="float-right point-effect" onClick={handleCloseAlert}>
            <i className="fa fa-close"></i>
          </div>
          <p>{alertReducer.msg}</p>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ alertReducer }) => ({
  alertReducer,
});

export default connect(mapStateToProps)(Alerts);
