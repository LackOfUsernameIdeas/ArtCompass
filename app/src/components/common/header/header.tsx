import { FC, Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import store from "../../../redux/store";
import { connect } from "react-redux";
import { ThemeChanger } from "../../../redux/action";
import logo from "../../../assets/images/brand-logos/logo_large.png";
import logoPink from "../../../assets/images/brand-logos/logo_large_pink.png";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({ local_varaiable, ThemeChanger }: any) => {
  const ToggleDark = () => {
    ThemeChanger({
      ...local_varaiable,
      class: local_varaiable.class == "dark" ? "light" : "dark",
      dataHeaderStyles: local_varaiable.class == "dark" ? "light" : "dark",
      dataMenuStyles:
        local_varaiable.dataNavLayout == "horizontal"
          ? local_varaiable.class == "dark"
            ? "light"
            : "dark"
          : "dark"
    });
    const theme = store.getState();

    if (theme.class != "dark") {
      ThemeChanger({
        ...theme,
        bodyBg: "",
        Light: "",
        darkBg: "",
        inputBorder: ""
      });
      localStorage.setItem("artlighttheme", "light");
      localStorage.removeItem("artdarktheme");
      localStorage.removeItem("artMenu");
      localStorage.removeItem("artHeader");
    } else {
      localStorage.setItem("artdarktheme", "dark");
      localStorage.removeItem("artlighttheme");
      localStorage.removeItem("artMenu");
      localStorage.removeItem("artHeader");
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");

    // Redirect to sign-in page
    navigate(`${import.meta.env.BASE_URL}signin/`);
  };

  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isToggleHovered, setIsToggleHovered] = useState(false);
  const [isLogOutHovered, setIsLogOutHovered] = useState(false);

  return (
    <Fragment>
      <header className="app-header relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-[-1] opacity-70"></div>

        <nav className="main-header !h-[3.75rem]" aria-label="Global">
          <div className="main-header-container ps-[0.725rem] pe-[1rem] ">
            <div className="header-content-left">
              <div className="header-element">
                <div className="horizontal-logo">
                  <a
                    href={`${import.meta.env.BASE_URL}app/recommendations/`}
                    className="header-logo"
                    onMouseEnter={() => setIsLogoHovered(true)}
                    onMouseLeave={() => setIsLogoHovered(false)}
                  >
                    <img
                      src={local_varaiable.class == "dark" ? logoPink : logo}
                      alt="logo"
                      className="logo"
                      style={{
                        transform: isLogoHovered ? "scale(1.8)" : "scale(1.5)",
                        transformOrigin: "center",
                        transition: "transform 0.3s ease"
                      }}
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="header-content-right">
              <div
                className="header-element header-theme-mode hidden !items-center sm:block !py-[1rem] md:!px-[0.65rem] px-2 opacity-[0.8]"
                onClick={() => ToggleDark()}
                style={{
                  transform: isToggleHovered ? "scale(1.1)" : "scale(0.9)", // Increase size on hover
                  transformOrigin: "center",
                  transition: "transform 0.3s ease" // Smooth transition
                }}
                onMouseEnter={() => setIsToggleHovered(true)}
                onMouseLeave={() => setIsToggleHovered(false)}
              >
                <Link
                  aria-label="anchor"
                  className="hs-dark-mode-active:hidden flex hs-dark-mode group flex-shrink-0 justify-center items-center gap-2 rounded-full font-medium text-defaulttextcolor transition-all text-xs dark:bg-bgdark dark:hover:bg-black/20 dark:text-white/80 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                  to="#"
                  data-hs-theme-click-value="dark"
                >
                  <i className="bx bx-moon header-link-icon text-defaulttextcolor dark:text-white/80 font-semibold"></i>
                </Link>
                <Link
                  aria-label="anchor"
                  className="hs-dark-mode-active:flex hidden hs-dark-mode group flex-shrink-0 justify-center items-center gap-2 rounded-full font-medium text-defaulttextcolor transition-all text-xs dark:bg-bodybg dark:bg-bgdark dark:hover:bg-black/20 dark:text-white/80 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                  to="#"
                  data-hs-theme-click-value="light"
                >
                  <i className="bx bx-sun header-link-icon text-defaulttextcolor dark:text-white/80 font-semibold"></i>
                </Link>
              </div>

              <div
                className="header-element md:!px-[0.65rem] px-2 hs-dropdown !items-center ti-dropdown [--placement:bottom-left]"
                style={{
                  transform: isLogOutHovered ? "scale(1.1)" : "scale(0.9)", // Increase size on hover
                  transformOrigin: "center",
                  transition: "transform 0.3s ease" // Smooth transition
                }}
                onMouseEnter={() => setIsLogOutHovered(true)}
                onMouseLeave={() => setIsLogOutHovered(false)}
              >
                <button
                  className="w-full opsilion ti-dropdown-item !text-base !p-[0.65rem] !inline-flex items-center opacity-[0.8]"
                  onClick={handleLogout}
                >
                  <i className="ti ti-logout text-defaulttextcolor dark:text-white/80 font-semibold me-2"></i>
                  Излизане
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  local_varaiable: state
});

export default connect(mapStateToProps, { ThemeChanger })(Header);
