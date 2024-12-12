import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../store/auth-store";
import { useNavigate } from "react-router-dom";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    middleName: z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    contact: z.string().min(10, "Contact must be at least 10 digits"),
    address: z.string().min(1, "Address is required"),
    location: z.object({
      state: z.string().min(1, "State is required"),
      ward: z.string().optional(),
      lga: z.string().optional(),
      address: z.string().optional(),
      coordinates: z
        .object({
          latitude: z.coerce.number().optional(),
          longitude: z.coerce.number().optional(),
        })
        .optional(),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const {
      email,
      password,
      firstName,
      lastName,
      middleName,
      contact,
      address,
      location,
    } = data;
    await register(
      email,
      password,
      firstName,
      lastName,
      middleName,
      contact,
      address,
      location
    );
    navigate("/dashboard");
  };
  console.log("error", errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label
          htmlFor="firstName"
          className="block text-sm font-medium text-gray-700"
        >
          First Name
        </label>
        <input
          {...registerField("firstName")}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
        {errors.firstName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="lastName"
          className="block text-sm font-medium text-gray-700"
        >
          Last Name
        </label>
        <input
          {...registerField("lastName")}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
        {errors.lastName && (
          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="middleName"
          className="block text-sm font-medium text-gray-700"
        >
          Middle Name
        </label>
        <input
          {...registerField("middleName")}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <input
          {...registerField("email")}
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="contact"
          className="block text-sm font-medium text-gray-700"
        >
          Contact (Phone Number)
        </label>
        <input
          {...registerField("contact")}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
        {errors.contact && (
          <p className="mt-1 text-sm text-red-600">{errors.contact.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <input
          {...registerField("address")}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          {...registerField("password")}
          type="password"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          {...registerField("confirmPassword")}
          type="password"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Location Fields */}
      <div>
        <label
          htmlFor="location.state"
          className="block text-sm font-medium text-gray-700"
        >
          State
        </label>
        <input
          {...registerField("location.state")}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
        {errors.location?.state && (
          <p className="mt-1 text-sm text-red-600">
            {errors.location?.state.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="location.ward"
          className="block text-sm font-medium text-gray-700"
        >
          Ward (Optional)
        </label>
        <input
          {...registerField("location.ward")}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
      </div>

      <div>
        <label
          htmlFor="location.lga"
          className="block text-sm font-medium text-gray-700"
        >
          LGA (Optional)
        </label>
        <input
          {...registerField("location.lga")}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
      </div>

      <div>
        <label
          htmlFor="location.address"
          className="block text-sm font-medium text-gray-700"
        >
          Full Address (Optional)
        </label>
        <input
          {...registerField("location.address")}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
      </div>

      <div>
        <label
          htmlFor="location.coordinates.latitude"
          className="block text-sm font-medium text-gray-700"
        >
          Latitude
        </label>
        <input
          {...registerField("location.coordinates.latitude")}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
        {errors.location?.coordinates?.latitude && (
          <p className="mt-1 text-sm text-red-600">
            {errors.location?.coordinates?.latitude.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="location.coordinates.longitude"
          className="block text-sm font-medium text-gray-700"
        >
          Longitude
        </label>
        <input
          {...registerField("location.coordinates.longitude")}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
        {errors.location?.coordinates?.longitude && (
          <p className="mt-1 text-sm text-red-600">
            {errors.location?.coordinates?.longitude.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
};

export default RegisterForm;
