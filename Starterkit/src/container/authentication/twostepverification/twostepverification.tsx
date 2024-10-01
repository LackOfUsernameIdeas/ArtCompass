import { FC, Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import desktopdarklogo from "../../../assets/images/brand-logos/desktop-dark.png";
import img2 from "../../../assets/images/authentication/2.png";
import img3 from "../../../assets/images/authentication/3.png";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Helmet } from "react-helmet-async";

interface TwostepcoverProps {}

const Twostepcover: FC<TwostepcoverProps> = () => {
  const inputRefs: any = {
    one: useRef(null),
    two: useRef(null),
    three: useRef(null),
    four: useRef(null),
    five: useRef(null),
    six: useRef(null)
  };

  const [resendCooldown, setResendCooldown] = useState(0);
  const [loading, setLoading] = useState(true);

  const [alerts, setAlerts] = useState<
    { message: string; color: string; icon: JSX.Element }[]
  >([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state as { email: string };

  useEffect(() => {
    // Проверява дали потребителя е вече в профила си
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      // Препраща към приложението, ако съществува токен
      navigate(`${import.meta.env.BASE_URL}app/home/`);
    }
  }, [navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false); // Спира зареждането когато приключи времето за изчакване
    }
  }, [resendCooldown]);

  const handleInputChange = useCallback(
    (currentId: any, nextId: any) => {
      const currentInput = inputRefs[currentId].current;

      if (currentInput && currentInput.value.length === 1) {
        const nextInput = inputRefs[nextId] ? inputRefs[nextId].current : null;

        if (nextInput) {
          nextInput.focus();
        }
      }
    },
    [inputRefs]
  );

  const handleVerification = async () => {
    const verificationCode =
      inputRefs.one.current.value +
      inputRefs.two.current.value +
      inputRefs.three.current.value +
      inputRefs.four.current.value +
      inputRefs.five.current.value +
      inputRefs.six.current.value;

    try {
      const response = await fetch("http://localhost:5000/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, verificationCode })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Неуспешна верификация!");
      }

      const data = await response.json();

      setAlerts([
        {
          message: data.message,
          color: "success",
          icon: <i className="ri-check-line"></i>
        }
      ]);

      setTimeout(() => {
        navigate(
          `${import.meta.env.BASE_URL}signin`
        );
      }, 1000);
    } catch (error: any) {
      setAlerts([
        {
          message: error.message,
          color: "danger",
          icon: <i className="ri-error-warning-fill"></i>
        }
      ]);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return; // Не позволява повторно изпращане, ако времето за изчакване тече

    setLoading(true); // Докато се изпраща кода се показва колело за зареждане
    console.log(email);

    try {
      const response = await fetch("http://localhost:5000/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Не успяхме да изпратим кода отново!"
        );
      }

      const data = await response.json();
      setAlerts([
        {
          message: data.message,
          color: "success",
          icon: <i className="ri-check-line"></i>
        }
      ]);

      setResendCooldown(60); // Изчаква 60 секунди
    } catch (error: any) {
      setAlerts([
        {
          message: error.message,
          color: "danger",
          icon: <i className="ri-error-warning-fill"></i>
        }
      ]);
    } finally {
      setLoading(false); // Спира зареждането
    }
  };

  return (
    <Fragment>
      <Helmet>
        <body className="bg-white dark:!bg-bodybg"></body>
      </Helmet>
      <div className="grid grid-cols-12 authentication mx-0 text-defaulttextcolor text-defaultsize">
        <div className="xxl:col-span-7 xl:col-span-7 lg:col-span-12 col-span-12">
          <div className="grid grid-cols-12  items-center h-full">
            <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3 sm:col-span-2"></div>
            <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-8 col-span-12">
              <div className="p-[3rem]">
                <div className="mb-4">
                  <Link
                    aria-label="anchor"
                    to={`${import.meta.env.BASE_URL}app/home/`}
                  >
                    <img
                      src={desktopdarklogo}
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
                <p className="font-semibold mb-2 text-xl">
                  Потвърдете профила си!
                </p>
                <p className="mb-4 text-[#8c9097] dark:text-white/50 opacity-[0.7] font-normal">
                  Въведете 6-цифрения код, който изпратихме на Вашия имейл!
                </p>
                <div className="grid grid-cols-12 gap-4">
                  <div className="xl:col-span-12 col-span-12 mb-4">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-2 px-1">
                        <input
                          type="text"
                          className="!px-0 form-control w-full !rounded-md form-control-lg text-center !text-[1rem]"
                          required
                          id="one"
                          maxLength={1}
                          onChange={() => handleInputChange("one", "two")}
                          ref={inputRefs.one}
                        />
                      </div>
                      <div className="col-span-2 px-1">
                        <input
                          type="text"
                          className="!px-0 form-control w-full !rounded-md form-control-lg text-center !text-[1rem]"
                          required
                          id="two"
                          maxLength={1}
                          onChange={() => handleInputChange("two", "three")}
                          ref={inputRefs.two}
                        />
                      </div>
                      <div className="col-span-2 px-1">
                        <input
                          type="text"
                          className="!px-0 form-control w-full !rounded-md form-control-lg text-center !text-[1rem]"
                          required
                          id="three"
                          maxLength={1}
                          onChange={() => handleInputChange("three", "four")}
                          ref={inputRefs.three}
                        />
                      </div>
                      <div className="col-span-2 px-1">
                        <input
                          type="text"
                          className="!px-0 form-control w-full !rounded-md form-control-lg text-center !text-[1rem]"
                          required
                          id="four"
                          maxLength={1}
                          onChange={() => handleInputChange("four", "five")}
                          ref={inputRefs.four}
                        />
                      </div>
                      <div className="col-span-2 px-1">
                        <input
                          type="text"
                          className="!px-0 form-control w-full !rounded-md form-control-lg text-center !text-[1rem]"
                          required
                          id="five"
                          maxLength={1}
                          onChange={() => handleInputChange("five", "six")}
                          ref={inputRefs.five}
                        />
                      </div>
                      <div className="col-span-2 px-1">
                        <input
                          type="text"
                          className="!px-0 form-control w-full !rounded-md form-control-lg text-center !text-[1rem]"
                          required
                          id="six"
                          maxLength={1}
                          onChange={() =>
                            handleInputChange("six", "nextInputId")
                          }
                          ref={inputRefs.six}
                        />
                      </div>
                    </div>
                    <div className="form-check mt-2 mb-0 !ps-0">
                      <label
                        className="form-check-label"
                        htmlFor="defaultCheck1"
                      >
                        Не получихте код?
                        {loading ? (
                          <div
                            className="ti-spinner mt-1 me-2 ms-3 text-danger"
                            role="status"
                          >
                            <span className="sr-only">Зареждане...</span>
                          </div>
                        ) : resendCooldown > 0 ? (
                          <span className="text-danger ms-2">
                            Ще можете да изпратите нов код след{" "}
                            <b>{resendCooldown}</b> сек.
                          </span>
                        ) : (
                          <button
                            onClick={handleResendCode}
                            className="text-primary ms-2 inline-block"
                          >
                            Изпращане отново
                          </button>
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="xl:col-span-12 col-span-12 grid">
                    <button
                      onClick={handleVerification}
                      className="ti-btn ti-btn-lg bg-primary text-white !font-medium dark:border-defaultborder/10"
                    >
                      Потвърди
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[0.75rem] text-danger mt-4">
                    <sup>
                      <i className="ri-asterisk"></i>
                    </sup>
                    Не споделяйте този код с никого!
                  </p>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3 sm:col-span-2 "></div>
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
                        <h6 className="font-semibold text-[1rem]">
                          Verify Your Account
                        </h6>
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
                        <h6 className="font-semibold text-[1rem]">
                          Verify Your Account
                        </h6>
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
                        <h6 className="font-semibold text-[1rem]">
                          Verify Your Account
                        </h6>
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

export default Twostepcover;
