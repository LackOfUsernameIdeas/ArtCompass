import { FC, Fragment, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import logo from "../../../assets/images/brand-logos/logo-large.png";
import logoPink from "../../../assets/images/brand-logos/logo-large-pink.png";

// Импортиране на стиловете за Swiper
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Импортиране на необходимите модули за Swiper
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Интерфейс за компонентата Resetcover
interface ResetcoverProps {}

const Resetcover: FC<ResetcoverProps> = () => {
  // Състояния за показване на пароли и въведени данни
  const [passwordShow1, setPasswordShow1] = useState(false);
  const [passwordShow2, setPasswordShow2] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Състояние за показване на съобщения за грешки или успех
  const [alerts, setAlerts] = useState<
    { message: string; color: string; icon: JSX.Element }[]
  >([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Извличане на токена от URL параметъра
  const { token } = useParams(); // Assuming the token is passed in the URL as a parameter
  console.log("token: ", token);
  const navigate = useNavigate();

  // useEffect за валидация на токена при зареждане на компонента
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/token-validation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ token })
          }
        );

        if (!response.ok) {
          throw new Error("Token validation failed");
        }

        const result = await response.json();
        console.log("result: ", result);
        if (!result.valid) navigate("/signin"); // Пренасочване към формата за влизане при невалиден токен
      } catch (error) {
        console.error("Error validating token:", error);
        navigate("/signin"); // Пренасочване към грешка ако не може да се валидара токенът
      }
    };

    validateToken();
  }, [token, navigate]);

  // Обработчик за промяна на паролата
  const handlePasswordReset = async () => {
    setIsSubmitting(true);

    // Проверка за празни полета
    if (newPassword == "" || confirmPassword == "") {
      setAlerts([
        {
          message: "Всички полета са задължителни!",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      setIsSubmitting(false);
      return;
    }

    // Проверка дали паролите съвпадат
    if (newPassword !== confirmPassword) {
      setAlerts([
        ...alerts,
        {
          message: "Паролите не са еднакви!",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      setIsSubmitting(false);
      return;
    }

    try {
      // Изпращане на новата парола към API-то
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/password-reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token, // Токенът от URL
            newPassword
          })
        }
      );

      const result = await response.json();

      if (response.ok) {
        setAlerts([
          ...alerts,
          {
            message:
              "Сменихте паролата си успешно! Препращане към формата за влизане...",
            color: "success",
            icon: <i className="ri-check-line"></i>
          }
        ]);
        navigate("/signin/"); // Пренасочване към формата за влизане след успешна смяна на паролата
      } else {
        setAlerts([
          ...alerts,
          {
            message: result.error || "Възникна грешка!",
            color: "danger",
            icon: <i className="ri-error-warning-fill"></i>
          }
        ]);
      }
    } catch (error) {
      setAlerts([
        ...alerts,
        {
          message: "Не успяхме да сменим паролата Ви! Опитайте отново.",
          color: "danger",
          icon: <i className="ri-error-warning-fill"></i>
        }
      ]);
    } finally {
      setIsSubmitting(false);
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
              <p className="h5 font-semibold mb-2">Смяна на паролата</p>
              <p className="mb-4 text-[#8c9097] dark:text-white/50 opacity-[0.7] font-normal">
                Сменете своята парола тук!
              </p>
              {alerts.map((alert, idx) => (
                <div
                  className={`alert alert-${alert.color} flex items-center`}
                  role="alert"
                  key={idx}
                  style={{
                    width: "100%", // Осигурява цялостна ширина
                    boxSizing: "border-box", // Включва padding при изчисляване на ширината
                    height: "auto",
                    marginBottom: "1rem", // Добавя разстояние между съобщението и формата
                    wordBreak: "break-word", // Разбива дълги съобщения правилно
                    padding: "0.75rem 1rem", // Настройка на padding за типичен размер на съобщение
                    minHeight: "auto", // Позволява на съобщението да се свие при малки съдържания
                    alignItems: "center"
                  }}
                >
                  <div
                    style={{
                      marginRight: "0.5rem",
                      fontSize: "1.25rem",
                      lineHeight: "1"
                    }}
                  >
                    {alert.icon}
                  </div>
                  <div style={{ lineHeight: "1.2" }}>
                    <b>{alert.message}</b>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-12 gap-y-4">
                <div className="xl:col-span-12 col-span-12 mt-0">
                  <label
                    htmlFor="reset-newpassword"
                    className="form-label text-default"
                  >
                    Нова парола
                  </label>
                  <div className="input-group">
                    <input
                      type={passwordShow1 ? "text" : "password"}
                      className="form-control form-control-lg !rounded-e-none"
                      id="reset-password"
                      placeholder="Въведете новата си парола (мин. 8 знака)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      onClick={() => setPasswordShow1(!passwordShow1)}
                      aria-label="button"
                      className="ti-btn ti-btn-light !mb-0 !rounded-s-none"
                      type="button"
                      id="button-addon2"
                    >
                      <i
                        className={`${
                          passwordShow1 ? "ri-eye-line" : "ri-eye-off-line"
                        } align-middle`}
                      ></i>
                    </button>
                  </div>
                </div>
                <div className="xl:col-span-12 col-span-12 mt-0">
                  <label
                    htmlFor="reset-confirmpassword"
                    className="form-label text-default"
                  >
                    Потвърждаване на паролата
                  </label>
                  <div className="input-group">
                    <input
                      type={passwordShow2 ? "text" : "password"}
                      className="form-control form-control-lg !rounded-e-none"
                      id="reset-cpassword"
                      placeholder="Повторете своята парола"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      onClick={() => setPasswordShow2(!passwordShow2)}
                      aria-label="button"
                      className="ti-btn ti-btn-light !mb-0 !rounded-s-none"
                      type="button"
                      id="button-addon2"
                    >
                      <i
                        className={`${
                          passwordShow2 ? "ri-eye-line" : "ri-eye-off-line"
                        } align-middle`}
                      ></i>
                    </button>
                  </div>
                </div>
                <div className="xl:col-span-12 col-span-12 grid mt-2">
                  <button
                    onClick={handlePasswordReset}
                    disabled={isSubmitting}
                    className={`ti-btn w-full bg-primary hover:bg-primarydark text-white rounded-[0.25rem] text-default w-full h-11 font-semibold mt-3`}
                  >
                    {isSubmitting ? "Моля, изчакайте..." : "Смяна на парола"}
                  </button>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mt-4">
                  Объркахте нещо?{" "}
                  <Link
                    to={`${import.meta.env.BASE_URL}signin/`}
                    className="text-primary"
                  >
                    Върни се към формата за влизане
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Страничен панел с изображение или лого */}
        <div className="xxl:col-span-5 xl:col-span-5 lg:col-span-5 col-span-12 xl:block hidden px-0">
          <div className="authentication-cover ">
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
                  {/* Слайд 1 */}
                  <SwiperSlide>
                    <div className="text-white text-center p-[3rem] flex items-center justify-center flex-col lg:space-y-8 md:space-y-4 sm:space-y-2 space-y-2">
                      <div>
                        {/* Лого за светъл режим */}
                        <div className="mb-[6rem] dark:hidden">
                          <img
                            src={logoPink}
                            className="authentication-image"
                            alt="Logo"
                            style={{ width: "100%", height: "auto" }}
                          />
                        </div>

                        {/* Лого за тъмен режим */}
                        <div className="mb-[4rem] hidden dark:block">
                          <img
                            src={logo}
                            className="authentication-image"
                            alt="Logo"
                            style={{
                              width: "100%",
                              height: "auto"
                            }}
                          />
                        </div>

                        {/* Заглавие и описание на приложението */}
                        <h6 className="font-semibold text-[1rem] lg:text-[1.325rem] sm:text-[1.325rem]">
                          Добре дошли в Кино Компас!
                        </h6>
                        <p className="font-normal text-[0.875rem] opacity-[0.7] lg:mt-6 sm:text-[1rem] ">
                          Това е вашият гид за откриване на филми и сериали за
                          всяко настроение, анализирайки вашите предпочитания и
                          предлагайки персонализирани препоръки с помощта на
                          изкуствен интелект!
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                  {/* Допълнителни слайдове, ако е необходимо */}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Resetcover;
