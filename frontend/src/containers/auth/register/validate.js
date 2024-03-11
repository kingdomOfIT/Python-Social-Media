import axios from "axios"

const validations = {
    username: {
        validate: (value) => {
            if (!value) return "Oops! Looks like you left this field feeling a bit lonely.";
            if (value.length < 5) return "Choose a username with at least 5 characters to join the username party!";
            return null;
        }
    },
    email: {
        validate: (value) => {
            if (!value) return "Oops! Looks like you left this field feeling a bit lonely.";
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) return "Whoops! That email address seems to be doing a little dance of its own.";
            return null;
        }
    },
    password: {
        validate: (value) => {
            if (!value) return "Oops! Looks like you left this field feeling a bit lonely.";
            if (value.length < 8) return "Secure your account with a password of at least 9 characters.";
            const alpha = new RegExp(/[a-z]/);
            const numbers = new RegExp(/[0-9]/);
            if (!alpha.test(value) || !numbers.test(value)) return "Create a password that's the perfect mix of characters and numbers for added security!";
            return null;
        }
    },
    password2: {
        validate: (value, values) => {
            if (!value) return "Oops! Looks like you left this field feeling a bit lonely.";
            if (value !== values.password) return "Passwords are like best friends; they need to match. Double-check and try again!";
            return null;
        }
    },
    first_name: {
        validate: (value) => {
            if (!value) return "Oops! Looks like you left this field feeling a bit lonely.";
            return null;
        }
    },
    last_name: {
        validate: (value) => {
            if (!value) return "Oops! Looks like you left this field feeling a bit lonely.";
            return null;
        }
    },
    sex: {
        validate: (value) => {
            if (!value) return "Please select your gender.";
            return null;
        }
    },
    image: {
        validate: (value) => {
            if (!value) return "Pick a picture to personalize your profile, please!";
            return null;
        }
    }
}

export const validate = (values) => {
    const errors = {};

    Object.entries(validations).forEach(([field, validation]) => {
        const error = validation.validate(values[field], values);
        if (error) errors[field] = error;
    });

    return errors;
}

export const asyncValidate = (values) => {
    const body = {
        username: values.username,
        email: values.email
    };

    return axios.post("auth/validation/", body).then((res) => {
        // username and email are valid
    }).catch((err) => {
        const { data } = err.response;
        if (data.username) {
            throw { username: data.username.join() };
        } else {
            throw { email: data.email.join() };
        }
    });
}
