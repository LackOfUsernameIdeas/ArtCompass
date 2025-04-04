import { FC, Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SwiperComponent from "@/components/common/swiper/swiper";

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
              <p className="h5 font-semibold opsilion !text-3xl mb-2">
                Смяна на паролата
              </p>
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
                    className="form-label text-default opsilion"
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
                    className="form-label text-default opsilion"
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
                    className={`ti-btn w-full bg-primary hover:bg-primarydark text-white !text-lg opsilion rounded-[0.25rem] text-default w-full h-11 font-semibold mt-3`}
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
                    Върнете се към формата за влизане
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Страничен панел с изображение или лого */}
        <SwiperComponent />
      </div>
    </Fragment>
  );
};

export default Resetcover;
