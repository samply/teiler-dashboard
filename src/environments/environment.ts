export const environment = {
  production: false,
  config: (window as any).env.teiler.config || {
    BACKGROUND_IMAGE_URL: "",
    LOGO_URL: "",
    COLOR_PALETTE: "",
  }
};
