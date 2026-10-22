// DEMO ONLY — swap for real auth before production.
export const HY_OFFERS_USER = "hy_admin";
export const HY_OFFERS_PASSWORD = "HyOffers@2026";

const KEY = "zv_hy_offers_session";

export const hyOffersLogin = (userId: string, password: string) => {
  if (userId.trim().toLowerCase() === HY_OFFERS_USER && password === HY_OFFERS_PASSWORD) {
    sessionStorage.setItem(KEY, "1");
    return true;
  }
  return false;
};

export const hyOffersLogout = () => sessionStorage.removeItem(KEY);
export const isHyOffersAuthed = () => sessionStorage.getItem(KEY) === "1";
