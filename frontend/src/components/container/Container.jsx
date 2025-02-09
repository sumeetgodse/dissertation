import { useState, useMemo, useEffect } from "react";
import { extendTheme } from "@mui/material/styles";
import ChatIcon from "@mui/icons-material/Chat";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Chat } from "../chat";

const NAVIGATION = [
  {
    segment: "resources",
    title: "My Resources",
    icon: <ChatIcon />,
  },
  {
    segment: "services",
    title: "Services",
    icon: <ChatIcon />,
  },
  {
    segment: "admin",
    title: "Admin",
    icon: <ChatIcon />,
  },
];

const demoTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#0d47a1",
        },
        secondary: {
          main: "#82b1ff",
        },  background: {
          default: "#ffffff",
        },  text: {
          primary: "#333333",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#82b1ff",
        },
        secondary: {
          main: "#82b1ff",
        },
        background: {
          default: "#121212",
        },
        text: {
          primary: "#ffffff",
        },
      },
    },
  },
  colorSchemeSelector: "class",
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const useDemoRouter = (initialPath)=> {
  const [pathname, setPathname] = useState(initialPath);

  const router = useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
};

export const Container = () => {
  const router = useDemoRouter("/resources");

  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const headerElement = document.querySelector("header");
    if (headerElement) {
      const headerHeight = headerElement.offsetHeight;
      setHeaderHeight(headerHeight);
    }
  }, []);

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      branding={{
        logo: <img src="/catalog.png" />,
        title: "Product Catalog",
      }}
    >
      <DashboardLayout>
       <h1>Hello</h1>
      </DashboardLayout>
      <Chat headerHeight={headerHeight} />
    </AppProvider>
  );
};