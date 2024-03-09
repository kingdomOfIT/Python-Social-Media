import React, { Component, Fragment } from 'react'
import { Field, reduxForm } from "redux-form"
import renderField from "./renderField"
import { validate } from "./validate"

export class UserPersonalInfo extends Component {
    render() {
        const { nextPage  ,previousPage} = this.props
        const { handleSubmit } = this.props
        return (
            <Fragment>
                <div className="form-box ">
                    <form onSubmit={handleSubmit(nextPage)} className="animated wow fadeIn">
                        <legend className="text-center form-legend"> About you </legend>
                        <Field
                            name="first_name"
                            type="text"
                            component={renderField}
                            placeholder = "First Name"
                        />

                        <Field
                            name="last_name"
                            type="text"
                            component={renderField}
                            placeholder = "Last Name"
                        />
                        <Field
                            name="sex"
                            label="media/img/man_gender.png"
                            type="radio"
                            gender="Male"
                            value="male"
                            labelId = "male"
                            component={renderField}
                        />
                        <Field
                            name="sex"
                            label="media/img/women_gender.png"
                            gender="Female"
                            type="radio"
                            value="female"
                            labelId="female"
                            component={renderField}
                        />
    
                        <div className="centered-content">
                            <div className="centered-content-inner">
                                <button
                                onClick={previousPage} className="btn btn-general mt-3 btn-login"
                                > Previous </button>
                                <button className="btn btn-general mt-3 btn-login"> Next </button>
                            </div>
                        </div>
                    </form>
</div>
            </Fragment>
        )
    }
}

export default reduxForm({
    'form': 'register',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    'validate': validate,
})(UserPersonalInfo)
