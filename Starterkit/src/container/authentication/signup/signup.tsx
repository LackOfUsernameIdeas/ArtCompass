import { FC, Fragment, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import img2 from "../../../assets/images/authentication/2.png";
import img3 from "../../../assets/images/authentication/3.png";
import desktoplogo from "../../../assets/images/brand-logos/desktop-logo.png";
import desktopdarklogo from "../../../assets/images/brand-logos/desktop-dark.png";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import * as EmailValidator from "email-validator";

interface SignupcoverProps {}

const Signupcover: FC<SignupcoverProps> = () => {
  // State management for the form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [emptyFields, setEmptyFields] = useState({ 
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const [passwordshow1, setpasswordshow1] = useState(false);
  const [passwordshow2, setpasswordshow2] = useState(false);

  const [alerts, setAlerts] = useState<
    { message: string; color: string; icon: JSX.Element }[]
  >([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      // Redirect to the app if token exists
      navigate(`${import.meta.env.BASE_URL}app/home/`);
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));

    setEmptyFields((prevState) => ({
      ...prevState,
      [id]: false, // Reset field error when typing
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emptyFirstName = !formData.firstName;
    const emptyLastName = !formData.lastName;
    const emptyEmail = !formData.email;
    const emptyPassword = !formData.password;
    const emptyConfirmPassword = !formData.confirmPassword;

    if (
      emptyFirstName || emptyLastName || emptyEmail || emptyPassword || emptyConfirmPassword) {
        setEmptyFields({ 
        firstName: emptyFirstName,
        lastName: emptyLastName,
        email: emptyEmail, 
        password: emptyPassword,
        confirmPassword: emptyConfirmPassword,
        });

      setAlerts([
        {
          message: "Всички полета са задължителни!",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      return;
    }

    if (!EmailValidator.validate(formData.email)) {
      setAlerts([
        {
          message: "Невалиден формат на имейл адреса.",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlerts([
        {
          message: "Паролите не съвпадат!",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      return;
    }

    const passwordStrengthRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordStrengthRegex.test(formData.password)) {
      setAlerts([
        {
          message:
            "Паролата трябва да е дълга поне 8 знака и да включва комбинация от главни букви, малки букви и цифри.",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      return;
    }

    setAlerts([
      {
        message: "Моля, изчакайте...",
        color: "warning",
        icon: <i className="ri-error-warning-fill"></i>
      }
    ]);

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Нещо се обърка! :(");
      }

      // Redirect to the verification page
      navigate(
        `${
          import.meta.env.BASE_URL
        }authentication/twostepverification/twostepcover`,
        {
          state: { email: formData.email }
        }
      );
    } catch (error: any) {
      let errorMessage = "";
      switch (true) {
        case error.message.includes("Duplicate entry"):
          errorMessage = "Потребител с този имейл адрес вече съществува!";
          break;
        default:
          errorMessage = error.message;
          break;
      }
      setAlerts([
        {
          message: errorMessage,
          color: "danger",
          icon: <i className="ri-error-warning-fill"></i>
        }
      ]);
    }
  };

  return (
    <Fragment>
      <Helmet>
        <body className="bg-white dark:!bg-bodybg"></body>
      </Helmet>
      <div className="grid grid-cols-12 authentication mx-0 text-defaulttextcolor text-defaultsize">
        <div className="xxl:col-span-7 xl:col-span-7 lg:col-span-12 col-span-12">
          <div className="flex justify-center items-center h-full">
            <div className="p-[3rem]">
              <div className="mb-4">
                <Link
                  aria-label="anchor"
                  to={`${import.meta.env.BASE_URL}app/home/`}
                >
                  <img
                    src={desktoplogo}
                    alt=""
                    className="authentication-brand desktop-logo"
                  />
                  <img
                    src={desktopdarklogo}
                    alt=""
                    className="authentication-brand desktop-dark"
                  />
                </Link>
              </div>
              <p className="h5 font-semibold mb-2">Създаване на профил</p>
              <p className="mb-4 text-[#8c9097] dark:text-white/50 opacity-[0.7] font-normal">
                Присъединете се към (име на проекта) и създайте профил!
              </p>

              {alerts.map((alert, idx) => (
                <div
                  className={`alert alert-${alert.color} flex items-center`}
                  role="alert"
                  key={idx}
                >
                  {alert.icon}
                  <div>{alert.message}</div>
                </div>
              ))}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-12 gap-y-4">
                  <div className="xl:col-span-12 col-span-12 mt-0">
                    <label
                      htmlFor="signup-firstname"
                      className="form-label text-default"
                    >
                      Име
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg w-full !rounded-md ${emptyFields.firstName ? 'empty-field' : ''}`}
                      id="firstName"
                      placeholder="Въведете своето първо име"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                  <div className="xl:col-span-12 col-span-12">
                    <label
                      htmlFor="signup-lastname"
                      className="form-label text-default"
                    >
                      Фамилия
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg w-full !rounded-md ${emptyFields.lastName ? 'empty-field' : ''}`}
                      id="lastName"
                      placeholder="Въведете своята фамилия"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="xl:col-span-12 col-span-12">
                    <label
                      htmlFor="signup-email"
                      className="form-label text-default"
                    >
                      Имейл
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg w-full !rounded-md ${emptyFields.email ? 'empty-field' : ''}`}
                      id="email"
                      placeholder="Въведете своя имейл"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="xl:col-span-12 col-span-12">
                    <label
                      htmlFor="signup-password"
                      className="form-label text-default"
                    >
                      Парола
                    </label>
                    <div className="input-group">
                      <input
                        type={passwordshow1 ? "text" : "password"}
                        className={`form-control form-control-lg w-full !rounded-e-none ${emptyFields.password ? 'empty-field' : ''}`}
                        id="password"
                        placeholder="Въведете парола от поне 8 знака"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        aria-label="button"
                        className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                        onClick={() => setpasswordshow1(!passwordshow1)}
                        type="button"
                        id="button-addon2"
                      >
                        <i
                          className={`${
                            passwordshow1 ? "ri-eye-line" : "ri-eye-off-line"
                          } align-middle`}
                        ></i>
                      </button>
                    </div>
                  </div>
                  <div className="xl:col-span-12 col-span-12 mb-4">
                    <label
                      htmlFor="signup-confirmpassword"
                      className="form-label text-default"
                    >
                      Потвърждаване на паролата
                    </label>
                    <div className="input-group">
                      <input
                        type={passwordshow2 ? "text" : "password"}
                        className={`form-control form-control-lg w-full !rounded-e-none ${emptyFields.confirmPassword ? 'empty-field' : ''}`}
                        id="confirmPassword"
                        placeholder="Повторете своята парола"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                      <button
                        aria-label="button"
                        className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                        onClick={() => setpasswordshow2(!passwordshow2)}
                        type="button"
                        id="button-addon21"
                      >
                        <i
                          className={`${
                            passwordshow2 ? "ri-eye-line" : "ri-eye-off-line"
                          } align-middle`}
                        ></i>
                      </button>
                    </div>
                  </div>
                  <div className="xl:col-span-12 col-span-12 grid mt-2">
                    <button
                      type="submit"
                      className="ti-btn ti-btn-lg bg-primary text-white !font-medium dark:border-defaultborder/10"
                    >
                      Създай профил
                    </button>
                  </div>
                </div>
              </form>
              <div className="text-center">
                <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mt-4">
                  Вече имате профил?{" "}
                  <Link
                    to={`${
                      import.meta.env.BASE_URL
                    }authentication/signin/signincover/`}
                    className="text-primary"
                  >
                    Влезнете в профила си!
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="xxl:col-span-5 xl:col-span-5 lg:col-span-5 col-span-12 xl:block hidden px-0">
          <div className="authentication-cover">
            <div className="aunthentication-cover-content rounded">
              <div className="swiper keyboard-control">
                <Swiper
                  spaceBetween={30}
                  navigation={true}
                  centeredSlides={true}
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  modules={[Pagination, Autoplay, Navigation]}
                  className="mySwiper"
                >
                  <SwiperSlide>
                    <div className="text-white text-center p-[3rem] flex items-center justify-center">
                      <div>
                        <div className="mb-[3rem]">
                          <img
                            src={img2}
                            className="authentication-image"
                            alt=""
                          />
                        </div>
                        <h6 className="font-semibold text-[1rem]">Sign Up</h6>
                        <p className="font-normal text-[.875rem] opacity-[0.7]">
                          {" "}
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Ipsa eligendi expedita aliquam quaerat nulla
                          voluptas facilis. Porro rem voluptates possimus, ad,
                          autem quae culpa architecto, quam labore blanditiis at
                          ratione.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="text-white text-center p-[3rem] flex items-center justify-center">
                      <div>
                        <div className="mb-[3rem]">
                          <img
                            src={img3}
                            className="authentication-image"
                            alt=""
                          />
                        </div>
                        <h6 className="font-semibold text-[1rem]">Sign Up</h6>
                        <p className="font-normal text-[.875rem] opacity-[0.7]">
                          {" "}
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Ipsa eligendi expedita aliquam quaerat nulla
                          voluptas facilis. Porro rem voluptates possimus, ad,
                          autem quae culpa architecto, quam labore blanditiis at
                          ratione.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="text-white text-center p-[3rem] flex items-center justify-center">
                      <div>
                        <div className="mb-[3rem]">
                          <img
                            src={img2}
                            className="authentication-image"
                            alt=""
                          />
                        </div>
                        <h6 className="font-semibold text-[1rem]">Sign Up</h6>
                        <p className="font-normal text-[.875rem] opacity-[0.7]">
                          {" "}
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Ipsa eligendi expedita aliquam quaerat nulla
                          voluptas facilis. Porro rem voluptates possimus, ad,
                          autem quae culpa architecto, quam labore blanditiis at
                          ratione.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Signupcover;
