import { apiSlice } from "@/features/api";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (formData) => ({
        url: "/signup",
        method: "POST",
        body: formData,
      }),
    }),
    login: builder.mutation({
      query: (formData) => ({
        url: "/login",
        method: "POST",
        body: formData,
      }),
      onQueryStarted: async (_arg, { queryFulfilled, getCacheEntry }) => {
        await queryFulfilled;
        const cacheEntry = getCacheEntry();
        if (cacheEntry.isSuccess && cacheEntry.data) {
          try {
            localStorage.setItem("user", JSON.stringify(cacheEntry.data));
            localStorage.setItem("isGuest", "false");
          } catch (err) {
            console.log(
              "Couldn't save public user info to local storage:",
              err,
            );
          }
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "DELETE",
      }),
    }),
  }),
});

export const { useSignupMutation, useLoginMutation, useLogoutMutation } =
  authApiSlice;
