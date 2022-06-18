import * as yup from "yup";

export const schemaYupSignUp = yup.object({
  firstName: yup.string().required("Please enter your first name"),
  lastName: yup.string().required("Please enter your last name"),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter your email address"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must have at least 1 uppercase, 1 lowercase, 1 special character",
    })
    .required("Please enter your password"),
  repeatPassword: yup
    .string()
    .required("Please enter re-password")
    .oneOf([yup.ref("password")], "Passwords must be same!"),
  phoneNumber: yup.string().required("Please enter your phone number"),
  dateOfBirth: yup.string().required("Please enter your date of birth"),
});

export const schemaYupSignIn = yup.object({
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter your email address"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Please enter your password"),
});
