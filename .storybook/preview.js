import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { StylesProvider } from "@mui/styles";
import { theme } from "@dataware-tools/app-common";
import { SWRConfig } from "swr";
import { SwrOptions } from "../src/utils";
import baseConfig from "@dataware-tools/dev-tools-for-react/configs/.storybook/preview"

export const parameters = {
  ...baseConfig.parameters
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
