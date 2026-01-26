export function removeClass(el: HTMLElement, className: string) {
  if (el?.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
  }
}

export function addClass(el: HTMLElement, className: string) {
  if (el?.classList) {
    el.classList.add(className);
  } else {
    if (!el) return;
    el.className += " " + className;
  }
}
