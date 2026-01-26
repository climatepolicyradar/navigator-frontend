export function getCookie(cname: string) {
  const name = cname + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function getAllCookies(): Record<string, string> {
  const cookies: Record<string, string> = {};
  const cookieString = document.cookie;

  if (cookieString) {
    cookieString.split(";").forEach((cookie) => {
      const [key, value] = cookie.split("=").map((part) => part.trim());
      if (key && value) {
        cookies[key] = value;
      }
    });
  }

  return cookies;
}

export function setCookie(cname: string, cvalue: string, domain: string) {
  const d = new Date();
  const y = d.getFullYear() + 1;
  d.setFullYear(y);
  const expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + "; domain=" + domain + "; path=/;";
}

export function deleteCookie(cname: string, domain: string) {
  document.cookie = `${cname}=; domain=${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}
