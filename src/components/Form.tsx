import {
  FormHTMLAttributes,
  useRef,
  Children,
  cloneElement,
  isValidElement,
  forwardRef,
  useImperativeHandle,
} from "react";

import { AnyObjectSchema, ValidationError } from "yup";

import { InputHandle } from "./Input";

export interface FormHandle<T> {
  getFormValue: () => { [key: string]: string | number | null };
  getFieldValue: (name: keyof T) => string | number | undefined;
  setFieldValue: (name: keyof T, value: string) => void;
  validate: (callback: (formObject: T) => void) => void;
}

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  className?: string;
  validationSchema: AnyObjectSchema;
}

function FormComponent<T>(
  { children, validationSchema, ...props }: FormProps,
  ref: React.ForwardedRef<FormHandle<T>>
) {
  const formRef = useRef<HTMLFormElement>(null);
  const childrenRef = useRef<InputHandle[]>([]);

  const getField = (name: string | number | symbol) => {
    return childrenRef.current.find((c) => c.getName() === name);
  };

  const getFormValue = () => {
    const formObject: { [key: string]: string | number } = {};
    childrenRef.current.forEach((input) => {
      formObject[input.getName()] = input.getUnmaskedValue() as string;
    });
    return formObject;
  };

  const getFieldValue = (name: keyof T) => {
    return getField(name)?.getUnmaskedValue();
  };

  const setFieldValue = (name: keyof T, value: string) => {
    getField(name)?.setValue(value);
  };

  const validate = (callback: (formObject: T) => void) => {
    validationSchema
      .validate(getFormValue(), { abortEarly: false })
      .then((formObject) => {
        callback(formObject);
      })
      .catch((e: ValidationError) => {
        e.inner.forEach((error) => {
          if (error.path) {
            getField(error.path)?.setError(error.message);
          }
        });
      });
  };

  useImperativeHandle(ref, () => ({
    getFormValue,
    getFieldValue,
    setFieldValue,
    validate,
  }));

  return (
    <form ref={formRef} {...props}>
      {Children.map(children, (child, index) => {
        if (
          isValidElement(child) &&
          typeof child.type !== "string" &&
          child?.props?.type !== "button" &&
          child?.props?.type !== "submit"
        ) {
          return cloneElement(child, {
            ref: (ref: InputHandle) => (childrenRef.current[index] = ref),
          } as never);
        } else {
          return cloneElement(child as never);
        }
      })}
    </form>
  );
}

export const Form = forwardRef(FormComponent);
