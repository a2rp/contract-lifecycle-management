import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading/index.jsx";

const OverviewPage = lazy(() => import("./pages/overview/index.jsx"));
const AgreementsPage = lazy(() => import("./pages/agreements/index.jsx"));
const ReviewsPage = lazy(() => import("./pages/reviewQueue/index.jsx"));
const RenewalsPage = lazy(() => import("./pages/renewals/index.jsx"));
const PlaybooksPage = lazy(() => import("./pages/playbooks/index.jsx"));
const NotFoundPage = lazy(() => import("./pages/notFound/index.jsx"));

const AppRoutes = ({ pageProps }) => {
  const location = useLocation();
  return (
    <Suspense fallback={<Loading />} key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<OverviewPage {...pageProps} />} />
        <Route path="/agreements" element={<AgreementsPage {...pageProps} />} />
        <Route path="/reviews" element={<ReviewsPage {...pageProps} />} />
        <Route path="/renewals" element={<RenewalsPage {...pageProps} />} />
        <Route path="/playbooks" element={<PlaybooksPage {...pageProps} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
