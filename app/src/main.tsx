import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import App from "./pages/App.tsx";
import Signincover from "./container/authentication/signin/Signin.tsx";
import Authenticationlayout from "./pages/AuthenticationRoute.tsx";
import Resetcover from "./container/authentication/resetpassword/Resetpassword.tsx";
import Signupcover from "./container/authentication/signup/Signup.tsx";
import Twostepcover from "./container/authentication/twostepverification/Twostepverification.tsx";
import MoviesSeriesRecommendations from "./container/recommendations/movies_series/MoviesSeriesRecommendations.tsx";
import BooksRecommendations from "./container/recommendations/books/BooksRecommendations.tsx";
import "./index.scss";
import ResetRequest from "./container/authentication/resetpassword/Resetrequest.tsx";
import PrivateRoute from "./pages/PrivateRoute.tsx";
import PlatformStats from "./container/platformStats/PlatformStats.tsx";
import MoviesSeriesIndividualStats from "./container/individualStats/movies_series/MoviesSeriesIndividualStats.tsx";
import BooksIndividualStats from "./container/individualStats/books/BooksIndividualStats.tsx";
import Watchlist from "./container/saveLists/movies_series/Watchlist.tsx";
import Readlist from "./container/saveLists/books/Readlist.tsx";
import Contact from "./container/contact/Contact.tsx";
import Test from "./container/test/test.tsx";
import ChooseRecommendations from "./container/recommendations/choose/ChooseRecommendations.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.Fragment>
    <BrowserRouter>
      <React.Suspense fallback={<div>Зареждане...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />

          <Route
            path="/app"
            element={
              <PrivateRoute>
                <App />
              </PrivateRoute>
            }
          >
            {/* Default route */}
            <Route path="recommendations" element={<ChooseRecommendations />} />
            <Route index path="platformStats" element={<PlatformStats />} />

            <Route
              path="recommendations/movies_series"
              element={<MoviesSeriesRecommendations />}
            />
            <Route
              path="recommendations/books"
              element={<BooksRecommendations />}
            />
            <Route
              path="individualStats/movies_series"
              element={<MoviesSeriesIndividualStats />}
            />
            <Route
              path="individualStats/books"
              element={<BooksIndividualStats />}
            />
            <Route path="saveLists/movies_series" element={<Watchlist />} />
            <Route path="saveLists/books" element={<Readlist />} />
            <Route path="test" element={<Test />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          <Route path="/" element={<Authenticationlayout />}>
            <Route
              path="resetpassword/resetcover/:token"
              element={<Resetcover />}
            />
            <Route path="resetpassword" element={<ResetRequest />} />
            <Route path="signup" element={<Signupcover />} />
            <Route path="signin" element={<Signincover />} />
            <Route path="twostepverification" element={<Twostepcover />} />
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  </React.Fragment>
);
