import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../store/auth-store";
import DashboardLayout from "../Layout/DashboardLayout";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required."),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters long."),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match.",
  path: ["confirmNewPassword"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
    //   await changePassword(data.currentPassword, data.newPassword);
      alert("Password changed successfully!");
    } catch (error) {
    //   alert("Error changing password: " + error.message);
    }
  };

  return (
    <DashboardLayout>
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Change Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            type="password"
            placeholder="Your current password"
            {...register("currentPassword")}
            className="bg-slate-100 p-3 rounded-lg w-full"
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
          )}
        </div>
        <div>
          <input
            type="password"
            placeholder="Your new password"
            {...register("newPassword")}
            className="bg-slate-100 p-3 rounded-lg w-full"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
          )}
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm new password"
            {...register("confirmNewPassword")}
            className="bg-slate-100 p-3 rounded-lg w-full"
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-sm">{errors.confirmNewPassword.message}</p>
          )}
        </div>
        <button
          disabled={isSubmitting}
          className="bg-[#40de80] text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {isSubmitting ? "Loading..." : "Change Password"}
        </button>
      </form>
    </div>
    </DashboardLayout>
  );
};

export default ChangePassword;
