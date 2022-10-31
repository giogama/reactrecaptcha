import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import ReCAPTCHA from "react-google-recaptcha";

import { processLogin } from './services/auth';

interface IFormRegisterData {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

function App() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<Array<string>>([]);
  const reRef = useRef<ReCAPTCHA>(null);

  const validationSchema = Yup.object().shape({
    fullname: Yup.string().required('Fullname is required'),
    username: Yup.string()
      .required('Username is required')
      .min(6, 'Username must be at least 6 characters')
      .max(20, 'Username must not exceed 20 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
    terms: Yup.bool().oneOf([true], 'Accept Terms is required')
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IFormRegisterData>({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async (formData: IFormRegisterData) => {
    setSubmitting(true);
    setServerErrors([]);

    const { current } = reRef;
    const token = current?.getValue();
    current?.reset();

    console.log(token, 'reToken');

    //console.log(process.env.REACT_APP_URL_RECAPTCHA_VALIDATE as string, 'Url Validade ReCaptcha')

    const accessToken = await processLogin();

    console.log(accessToken);

    // const response = await fetch("/api/auth", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     fullname: formData.fullname,
    //     username: formData.username,
    //     email: formData.email,
    //     password: formData.password,
    //     terms: formData.terms,
    //     token,
    //   }),
    // });
    // const data = await response.json();

    // if (data.errors) {
    //   setServerErrors(data.errors);
    // } else {
    //   console.log("success, redirect to home page");
    // }

    setSubmitting(false);

    console.log(JSON.stringify(formData, null, 2));
  };


  return (
    serverErrors.length > 0 ? (
      <ul>
        {serverErrors.map((itemError, index) => (
          <li key={index}>{itemError}</li>
        ))}
      </ul>
    ) : (

    <div className="register-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            {...register('fullname')}
            className={`form-control ${errors.fullname ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.fullname?.message}</div>
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            {...register('username')}
            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.username?.message}</div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            {...register('email')}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            {...register('password')}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            {...register('confirmPassword')}
            className={`form-control ${
              errors.confirmPassword ? 'is-invalid' : ''
            }`}
          />
          <div className="invalid-feedback">
            {errors.confirmPassword?.message}
          </div>
        </div>

        <div className="form-group form-check">
          <input
            type="checkbox"
            {...register('terms')}
            className={`form-check-input ${
              errors.terms ? 'is-invalid' : ''
            }`}
          />
          <label htmlFor="terms" className="form-check-label">
            I have read and agree to the Terms
          </label>
          <div className="invalid-feedback">{errors.terms?.message}</div>
        </div>

        <div className="form-group">
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_SITE_KEY as string}
              size='normal'
              ref={reRef} />
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            Register
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-warning float-right"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
    )
  );
}

export default App;
