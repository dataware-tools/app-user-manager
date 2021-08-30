import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { StylesProvider } from "@material-ui/styles";
import { theme } from "@dataware-tools/app-common";
import { SWRConfig } from "swr";
import { SwrOptions } from "../src/utils";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
  (Story, context) => {
    return (
      <>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <StylesProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SWRConfig value={SwrOptions}>
              <Story {...context} />
            </SWRConfig>
          </ThemeProvider>
        </StylesProvider>
      </>
    );
  },
];
