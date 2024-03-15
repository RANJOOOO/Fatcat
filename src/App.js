import "../src/style/main.scss";
import Home from "./pages/Home.js";
import { Route, Routes, useNavigate } from "react-router-dom";
import Profile from "./pages/profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SingleArt from "./components/explore/singleArt";
import Navbar from "./components/navbar";
import Explore from "./components/explore/explore";
import Drop from "./components/explore/drop";
import Stats from "./pages/stats";
import Notifications from "./components/notifications";
import AccountSettings from "./components/settings/accountSettings";
import NotificationSettings from "./components/settings/notificationSettings";
import Collections from "./components/explore/exploreCollections";
import Admin from "./components/admin/admin";
import Error from "./components/error";
import ReportIssue from "./components/reportIssue";
import CreateArt from "./components/createArt/createArt";
import MintArt from "./components/createArt/mintArt";
import Whitelist from "./components/admin/whitelist";
import Dashboard from "./components/admin/dashboard";
import SpotLight from "./components/admin/spotLight";
import FeaturedArt from "./components/admin/featured";
import ArtistApllied from "./components/admin/artistapplied.js";
import SiteSetting from "./components/admin/siteSetting";
import Market from "./components/admin/market";
import Blacklist from "./components/admin/blacklist";
import NoNetwork from "./components/noNetwork";
import CreateArtTabs from "./components/createArt/createArtTabs";
import SelectArtTab from "./components/createArt/selectArtTab";
import ListforSale from "./components/listforSale";
import ListforOffer from "./components/listforOffer";
import ExploreCollections from "./components/explore/exploreCollections";
import SingleArt2 from "./components/explore/singleArt2";
import Verify from "./components/verify";
import Footer from "./components/footer";
import FooterV2 from "./components/footerV2";
import CreateCollection from "./components/createArt/createCollection";
import EditCollection from "./components/createArt/editCollection";
import Banner from "./components/banner";
import Spotlight from "./pages/spotlight";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  flare,
  songbird,
  flareTestnet,
  songbirdTestnet,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import Applyform from "./components/applyform/Applyform";
import AllCollections from "./components/allcollections";
import { getTopBannerText } from "./firebase/firebase";
import { useEffect, useState } from "react";
import CollectionApllied from "./components/admin/collectionApplied.js";
import useLocalStorage from "use-local-storage";

function App() {
  const navigate = useNavigate();
  const [bannerEnable, setBannerEnable] = useState(false);
  // const [bannerOpen, setBannerOpen] = useState(true);
  const [bannerText, setBannerText] = useState("");
  const [bannerOpen, setBannerOpen] = useLocalStorage(true);

  const navigateToHome = () => {
    navigate("/");
  };
  const navigateToDiscord = () => {
    navigate("/sign-in");
  };

  const getbanner = () => {
    getTopBannerText().then((banner) => {
      console.log("banner: ", banner);
      setBannerEnable(banner?.enable);
      setBannerText(banner?.text);
    });
  };
  console.log(bannerOpen);
  const closeBanner = () => {
    setBannerOpen(false);
  };

  useEffect(() => {
    getbanner();
  }, []);

  // Get the current route path
  const currentPath = window.location.pathname;

  const isHomeRoute = currentPath === "/";

  const { chains, publicClient } = configureChains(
    [flare, songbird, flareTestnet, songbirdTestnet],
    [publicProvider()]
  );
  const { connectors } = getDefaultWallets({
    appName: "fatcat",
    projectId: "af6a837ee2e1f5cce8a95b447794ec55",
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return (
    <div className="App">
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider coolMode chains={chains}>
          <ToastContainer />
          {bannerEnable && isHomeRoute ? (
            bannerOpen == undefined ? (
              <Banner message={bannerText} onClose={closeBanner} />
            ) : (
              <></>
            )
          ) : null}
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify/:id" element={<Verify />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            {/* <Route path="/single-artwork2" element={<SingleArt />} /> */}
            <Route path="/explore" element={<Explore />} />
            <Route path="/drops" element={<Drop />} />

            <Route path="/stats" element={<Stats />} />
            <Route path="/notification" element={<Notifications />} />
            <Route
              path="/notification-settings"
              element={<NotificationSettings />}
            />

            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/report-issue"
              element={<ReportIssue hide="hide-class" />}
            />

            {/* ----------Errors */}
            <Route
              path="*"
              element={
                <Error
                  heading="Error 404"
                  errorMessage="Whoops! Looks like the page you're looking for doesn’t exist. Please
                   double check the URL."
                  buttonText="Go home"
                  onClick={navigateToHome}
                  navPath="/"
                />
              }
            />

            {/* ------------Discord----------- */}
            <Route
              path="/something-went-wrong"
              element={
                <Error
                  heading="Oops.."
                  errorMessage="Something went wrong on our end. Please reach out to our team on Discord if the issue persists."
                  buttonText="Go to Discord"
                  onClick={navigateToDiscord}
                  navPath=""
                />
              }
            />
            {/* ----------------down for maintenance-------------- */}
            <Route
              path="/down-for-maintenance"
              element={
                <Error
                  heading="Sorry."
                  errorMessage="We’re currently down for maintenance. Check out our Discord channel for updates."
                  buttonText="Go to Discord"
                  onClick={navigateToDiscord}
                />
              }
            />
            {/* --------------- admin panel --------------- */}
            <Route path="/whitelist" element={<Whitelist />} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/spotlight" element={<SpotLight />} />
            <Route path="/site-settings" element={<SiteSetting />} />
            <Route path="/featured-art" element={<FeaturedArt />} />
            <Route path="/artist-applied" element={<ArtistApllied />} />
            <Route path="/collection-applied" element={<CollectionApllied />} />
            <Route path="/marketing-promotions" element={<Market />} />
            <Route path="/black-list" element={<Blacklist />} />
            <Route path="/no-network" element={<NoNetwork />} />
            <Route path="/create-artworks" element={<CreateArtTabs />} />
            <Route path="/create-art/:id" element={<CreateArt />} />
            <Route path="/create-art/" element={<CreateArt />} />
            <Route path="/mint-art" element={<MintArt />} />
            <Route path="/select" element={<SelectArtTab />} />
            <Route path="/list-forSale" element={<ListforSale />} />
            <Route path="/list-forOffer" element={<ListforOffer />} />
            <Route path="/blogs" element={<Spotlight />} />
            <Route path="/apply" element={<Applyform />} />
            <Route path="/create-collections" element={<CreateCollection />} />
            <Route path="/edit-collections/:id" element={<EditCollection />} />
            <Route path="/allcollections" element={<AllCollections />} />
            <Route
              path="/explore-collections/:id"
              element={<ExploreCollections />}
            />
            <Route path="/single-artwork" element={<SingleArt2 />} />
            <Route path="/single-artwork/:id" element={<SingleArt2 />} />
          </Routes>
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
