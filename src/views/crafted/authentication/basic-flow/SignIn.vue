<template>
  <!--begin::Wrapper-->
  <div class="">
    <!--begin::Form-->
    <Form
      class="form w-100"
      id="kt_login_signin_form"
      @submit="onSubmitLogin"
      :validation-schema="login"
    >
      <!-- <div class="text-center fw-bold mb-6 fs-1">
        Masuk ke CMS EDUMU
      </div> -->

      <!--begin::Input group-->
      <div class="fv-row mb-6">
        <!--begin::Label-->
        <label class="form-label fs-6 fw-medium text-black-50">Kode Sekolah</label>
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          class="form-control form-control-lg form-control-solid bg-white border-secondary border-2"
          type="text"
          name="kode"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="kode" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-6">
        <!--begin::Label-->
        <label class="form-label fs-6 fw-medium text-black-50">Username</label>
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          class="form-control form-control-lg form-control-solid bg-white border-secondary border-2"
          type="text"
          name="username"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="username" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-6">
        <!--begin::Wrapper-->
        <label class="form-label fw-medium text-black-50 fs-6">Password</label>
        <!--end::Wrapper-->

        <!--begin::Input-->
        <Field
          class="form-control form-control-lg form-control-solid bg-white border-secondary border-2"
          type="password"
          name="password"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="text-center mt-10">
        <!--begin::Submit button-->
        <button
          type="submit"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
          style="border-radius: 50px;"
        >
          <span class="indicator-label"> Masuk </span>

          <span class="indicator-progress">
            Tunggu Sebentar...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
        <!--end::Submit button-->
      </div>
      <!--end::Actions-->
    </Form>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script setup>
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form } from "vee-validate";
import { Actions, Mutations } from "@/store/enums/StoreEnums";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.min.js";
import * as Yup from "yup";
import axios from "axios";
import QueryString from "qs";
import { useToast } from "vue-toast-notification";

const store = useStore();
const router = useRouter();

const submitButton = ref();

//Create form validation object
const login = Yup.object().shape({
  kode: Yup.string().required().label("Kode"),
  username: Yup.string().required().label("Username"),
  password: Yup.string().min(4).required().label("Password"),
});

//Form submit function
const onSubmitLogin = async (values) => {
  // Clear existing errors
  store.dispatch(Actions.LOGOUT);

  axios.post('https://apisekolah.edumu.id/v1prod/sekolah', QueryString.stringify({code: values.kode}))
    .then(res => {
      if (res.data.status) {
        postLogin(values, res.data.data.sekolahs[0])
      } else {
        useToast().error(res.data.text)
      }
    })
    .catch(err => {
      console.log(err)
      useToast().error(err.message)
    })

  return false

  if (submitButton.value) {
    // eslint-disable-next-line
    submitButton.value.disabled = true;
    // Activate indicator
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  // Send login request
  await store.dispatch(Actions.LOGIN, values);
  const [errorName] = Object.keys(store.getters.getErrors);
  const error = store.getters.getErrors[errorName];

  if (!error) {
    Swal.fire({
      text: "You have successfully logged in!",
      icon: "success",
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn fw-bold btn-light-primary",
      },
    }).then(function () {
      // Go to page after successfully login
      router.push({ name: "dashboard" });
    });
  } else {
    Swal.fire({
      text: error[0],
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "Try again!",
      customClass: {
        confirmButton: "btn fw-bold btn-light-danger",
      },
    });
  }

  //Deactivate indicator
  submitButton.value?.removeAttribute("data-kt-indicator");
  // eslint-disable-next-line
    submitButton.value.disabled = false;
};

function postLogin(data, sekolah) {
  const formData = {
    user_username: data.username,
    user_kunci: data.password,
    user_kodesekolah: data.kode,
    user_namasekolah: sekolah.sekolah_nama,
  }

  const loginUrl = data.kode === process.env.VUE_APP_REVAMP_SCHOOL
    ? `${process.env.VUE_APP_REVAMP_API_URL}/login`
    : `${process.env.VUE_APP_API_URL}/${data.kode}/apischool/login`

  axios.post(loginUrl, QueryString.stringify(formData))
  .then(res => {
    if (res.data.success) {
      store.dispatch(Actions.LOGIN, {...res.data.data, ...sekolah})

      Swal.fire({
      text: "You have successfully logged in!",
      icon: "success",
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn fw-bold btn-light-primary",
      },
      }).then(function () {
        router.push({ name: "dashboard" });
      });

    } else {
      useToast().error(res.data.message)
    }
  }).catch(err => {
    console.log(err)
    useToast().error(err.message)
  })
}
</script>
