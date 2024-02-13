import axios from "axios"

export const validate = (values) => {
    const errors = {}

    const alpha = new RegExp(/[a-z]/)
    const numbers = new RegExp(/[0-9]/)
    const { username , password ,password2 ,
    email ,first_name ,last_name ,sex ,image }
    = values

    //username validation
    if ( !username ){
        errors.username= "Oops! Looks like you left this field feeling a bit lonely."
    } else {
        if ( username.length < 5){
            errors.username = "Choose a username with at least 5 characters to join the username party!"
        }
    }

    //email validation
    if (!email) {
        errors.email = "Oops! Looks like you left this field feeling a bit lonely."
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
        errors.email = 'Whoops! That email address seems to be doing a little dance of its own.'
    }

    // password validation
    if (!password) {
        errors.password = "Oops! Looks like you left this field feeling a bit lonely."
    } else {
        if (password.length < 8) {
            errors.password = "Secure your account with a password of at least 9 characters."
        }
        if (!alpha.test(password) || !numbers.test(password)) {
            errors.password = "Create a password that's the perfect mix of characters and numbers for added security!"
        }
    }

    // password2 validation
    if (!password2) {
        errors.password2 = "Oops! Looks like you left this field feeling a bit lonely."
    } else {
        if (password != password2) {
            errors.password2 = "Passwords are like best friends; they need to match. Double-check and try again!"
        }
    }

    //first name validation
    if (!first_name) {
        errors.first_name = "Oops! Looks like you left this field feeling a bit lonely."
    }

    //last name validation
    if (!last_name) {
        errors.last_name = "Oops! Looks like you left this field feeling a bit lonely."
    } 

    //sex validation
    if (!sex) {
        errors.last_name = "Please select your gender."
    } 

    //image validation
    if (!image) {
        errors.image = "Pick a picture to personalize your profile, please!"
    } 

    return errors
}

export const asyncValidate = (values) => {
    const body = {
        username : values.username,
        email : values.email
    }

    return axios.post("auth/validation/", body).then( (res) => {/* username and email are valid*/}
    ,(err) => {
        const {data} = err.response
        if ( data.username ){
            throw {username: data.username.join()}
        } else {
            throw {email: data.email.join() }
        }
    })

}