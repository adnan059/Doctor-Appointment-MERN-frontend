export const tokenChecker = (msg, dispatch, logout) => {
  if (msg === "Invalid Token") {
    dispatch(logout());
  } else {
    return;
  }
};
