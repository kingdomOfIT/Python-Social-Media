import React, { Fragment, useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import CircularProgress from '@material-ui/core/CircularProgress';
import { validate } from './validate';
import RenderField from './renderField';

const UserImage = ({ handleSubmit, onFormSubmit, previousPage }) => {
    const [progress, setProgress] = useState(false);

    const onSubmit = async (formData) => {
        setProgress(true);
        await onFormSubmit(formData);
        setProgress(false);
    };

    return (
        <Fragment>
            <div className="form-box">
                <form
                    encType="multipart/form-data"
                    onSubmit={handleSubmit(onSubmit)}
                    className="animated wow fadeIn"
                >
                    <legend className="text-center form-legend">Profile picture</legend>
                    <Field id="f-input" name="image" type="file" component={RenderField} />

                    <div className="centered-content">
                        <div className="centered-content-inner">
                            <button
                                type="button"
                                onClick={previousPage}
                                className="btn btn-general mt-3 btn-login mr-2"
                            >
                                Previous
                            </button>
                            <button className="btn btn-general mt-3 mr-2 btn-login">Submit</button>
                            {progress && <CircularProgress />}
                        </div>
                    </div>
                </form>
            </div>
        </Fragment>
    );
};

export default reduxForm({
    form: 'register',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate: validate,
})(UserImage);
