import React from "react";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { Layout } from "../../Layout";

interface Props {
  onSignIn: (email: string, password: string) => Promise<void>;
  onScreenChange: () => void;
  title: string;
  helpText?: string;
  error?: string;
}

export const SignIn = ({
  onSignIn,
  title,
  onScreenChange,
  helpText,
  error,
  children,
}: React.PropsWithChildren<Props>) => {
  const [loading, setLoading] = useState(false);

  function renderLoadingSpinner() {
    if (!loading) return null;

    return (
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white loading-button"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );
  }

  function handleSubmitClick(e: React.MouseEvent) {
    e.preventDefault();
    onScreenChange();
  }
  return (
    <Layout>
      {children}
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={async ({ email, password }) => {
          setLoading(true);
          await onSignIn(email, password);
          setLoading(false);
        }}
      >
        <Form className="flex flex-col justify-start gap-y-6">
          <label className="block">
            <Field
              name="email"
              placeholder="Email"
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 form-input"
            />
          </label>
          <label className="block">
            <Field
              name="password"
              type="password"
              placeholder="Password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 form-input"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 font-semibold bg-cyan-500 text-white rounded-full shadow-sm opacity-100 disabled:opacity-75"
          >
            {renderLoadingSpinner()} {title}
          </button>
          {error && (
            <p
              className={
                "font-bold text-slate-700 text-orange-600 dark:text-orange-600"
              }
            >
              {error}
            </p>
          )}
          {helpText && (
            <button
              className="font-bold text-slate-700 text-slate-800 cursor-pointer"
              onClick={handleSubmitClick}
            >
              {helpText} &rarr;
            </button>
          )}
        </Form>
      </Formik>
    </Layout>
  );
};
