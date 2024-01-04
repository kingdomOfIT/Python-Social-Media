import React, { Component ,Fragment } from 'react'
import { Field , reduxForm } from "redux-form"
import renderField from "./renderField"
import { validate ,asyncValidate } from "./validate"

export class UserInfo extends Component {
    render() {
        const {nextPage} = this.props
        const { handleSubmit } = this.props
        return (
            <Fragment>
                <div className="form-box ">
                    <form onSubmit={handleSubmit(nextPage)} className="animated wow fadeIn">
                        <legend className="text-center form-legend"> Credentials </legend>
                        <Field 
                            name="username"
                            type = "text"
                            component={renderField}
                            placeholder = "Username"
                        />
    
                        <Field
                            name="email"
                            type="email"
                            component={renderField}
                            placeholder = "Email"
                        />
    
                        <Field
                            name="password"
                            type="password"
                            component={renderField}
                            placeholder = "Password"
                        />
    
                        <Field
                            name="password2"
                            type="password"
                            component={renderField}
                            placeholder = "Password again"
                        />
    
                        <div className="centered-content">
                            <div className="centered-content-inner">
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
    asyncValidate,
    asyncBlurFields: ['username','email']
})(UserInfo)
