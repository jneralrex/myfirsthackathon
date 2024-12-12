import React from 'react';
import AuthLayout from '../components/Layout/AuthLayout';
import LoginForm from '../components/Auth/LoginForm';

const Login = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account"
      alternativeAction={{
        text: "",
        linkText: "",
        href: "/register",
      }}
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;