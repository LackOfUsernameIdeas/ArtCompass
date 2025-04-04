import { FC, Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import * as EmailValidator from "email-validator";
import SwiperComponent from "@/components/common/swiper/swiper";

interface ResetRequestProps {}

const ResetRequest: FC<ResetRequestProps> = () => {
  const [email, setEmail] = useState("");
  const [alerts, setAlerts] = useState<
    { message: string; color: string; icon: JSX.Element }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordResetRequest = async () => {
    setIsSubmitting(true);

    if (email == "") {
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

    if (!EmailValidator.validate(email)) {
      setAlerts([
        {
          message: "Невалиден формат на имейл адреса.",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/password-reset-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log(result);

        setAlerts([
          {
            message: "Изпратихме Ви линк за смяна на паролата успешно!",
            color: "success",
            icon: <i className="ri-check-line"></i>
          }
        ]);
      } else {
        setAlerts([
          {
            message:
              result.error || "Не успяхме да изпратим имейл. Опитайте отново.",
            color: "danger",
            icon: <i className="ri-error-warning-line"></i>
          }
        ]);
      }
    } catch (error) {
      setAlerts([
        {
          message: "Не успяхме да изпратим имейл. Опитайте отново.",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Fragment>
      <Helmet>
        {/* Задаване на фон за страницата */}
        <body className="bg-white dark:!bg-bodybg"></body>
      </Helmet>
      <div className="grid grid-cols-12 authentication mx-0 text-defaulttextcolor text-defaultsize">
        <div className="xxl:col-span-7 xl:col-span-7 lg:col-span-12 col-span-12">
          <div className="flex justify-center items-center h-full">
            <div className="p-[3rem]">
              {/* Заглавие и описание на страницата */}
              <p className="h5 font-semibold opsilion !text-3xl mb-2">
                Забравили сте паролата си?
              </p>
              <p className="mb-4 text-[#8c9097] dark:text-white/50 opacity-[0.7] font-normal">
                Въведете своя имейл тук и ако имате профил с него, ще получите
                линк за смяна на паролата.
              </p>

              {/* Извеждане на алерти, ако има */}
              {alerts.map((alert, idx) => (
                <div
                  className={`alert alert-${alert.color} flex items-center`}
                  role="alert"
                  key={idx}
                  style={{
                    width: "100%", // За да се заема пълната ширина
                    boxSizing: "border-box", // Включва padding в изчисляването на ширината
                    height: "auto",
                    marginBottom: "1rem", // Добавя разстояние между алармата и формата
                    wordBreak: "break-word", // Рапърва дълги съобщения правилно
                    padding: "0.75rem 1rem", // Подравнява padding-а
                    minHeight: "auto", // Позволява на алармата да се свие, ако съдържанието е по-малко
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
                {/* Формата за въвеждане на имейл */}
                <div className="xl:col-span-12 col-span-12 mt-0">
                  <label
                    htmlFor="reset-email"
                    className="form-label text-default opsilion"
                  >
                    Имейл
                  </label>
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control form-control-lg w-full !rounded-md"
                      id="reset-email"
                      placeholder="Въведете своя имейл адрес"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Бутон за изпращане на заявка за смяна на парола */}
                <div className="xl:col-span-12 col-span-12 grid mt-2">
                  <button
                    className="ti-btn ti-btn-primary w-full py-2 !text-lg opsilion"
                    onClick={handlePasswordResetRequest}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Изпращаме имейл..." : "Създай нова парола"}
                  </button>
                </div>
              </div>

              {/* Линк за връщане към формата за влизане */}
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

export default ResetRequest;
