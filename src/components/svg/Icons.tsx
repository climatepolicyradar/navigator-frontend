interface IconProps {
  width?: string;
  height?: string;
  color?: string;
}

export function CloseIcon({ width = "20", height = "20", color = "currentColor" }: IconProps) {
  return (
    <svg
      style={{ width: `${width}px`, height: `${height}px` }}
      version="1.1"
      id="Capa_1"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 341.751 341.751"
    >
      <g>
        <g>
          <rect x="-49.415" y="149.542" transform="matrix(0.7072 -0.707 0.707 0.7072 -70.7868 170.8326)" width="440.528" height="42.667" />
        </g>
      </g>
      <g>
        <g>
          <rect x="149.569" y="-49.388" transform="matrix(0.707 -0.7072 0.7072 0.707 -70.7712 170.919)" width="42.667" height="440.528" />
        </g>
      </g>
    </svg>
  );
}

export function DocumentsIcon({ width, height, color = "currentColor" }: IconProps) {
  return (
    <svg
      version="1.1"
      fill={color}
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: `${width}px`, height: `${height}px` }}
      x="0px"
      y="0px"
      viewBox="0 0 957.599 957.6"
    >
      <g>
        <path
          d="M817.9,108.4h-28v687.901c0,45.699-37.2,82.898-82.899,82.898H423.3H197.7v25.5c0,29.201,23.7,52.9,52.9,52.9h283.6H817.8
        c29.2,0,52.899-23.699,52.899-52.9V161.3C870.7,132.1,847.1,108.4,817.9,108.4z"
        />
        <path
          d="M423.3,849.199h283.6c29.2,0,52.9-23.699,52.9-52.898V108.4V52.9c0-29.2-23.7-52.9-52.9-52.9H423.3H329v17.5
        c0.199,1.8,0.3,3.7,0.3,5.6v115.3V168c0,41.1-33.4,74.5-74.5,74.5h-29.6H109.9c-1.5,0-3.1-0.1-4.6-0.2H86.9v554.001
        c0,29.199,23.7,52.898,52.9,52.898h58H423.3L423.3,849.199z M434,669.4H249.1c-13.8,0-25-11.201-25-25c0-13.801,11.2-25,25-25h185
        c13.8,0,25,11.199,25,25C459.1,658.199,447.8,669.4,434,669.4z M619,541.801H249.1c-13.8,0-25-11.201-25-25c0-13.801,11.2-25,25-25
        H619c13.8,0,25,11.199,25,25C644,530.6,632.8,541.801,619,541.801z M249.1,356.3H619c13.8,0,25,11.2,25,25c0,13.8-11.2,25-25,25
        H249.1c-13.8,0-25-11.2-25-25C224.1,367.5,235.3,356.3,249.1,356.3z"
        />
        <path
          d="M109.9,212.5h144.9c0.1,0,0.3,0,0.4,0c24.2-0.2,43.8-19.8,44-44c0-0.1,0-0.3,0-0.4v-145c0-13.4-11-22.3-22.399-22.3
        c-5.5,0-11,2-15.6,6.6L94.1,174.5C80.1,188.5,90,212.5,109.9,212.5z"
        />
      </g>
    </svg>
  );
}

export function JurisdictionsIcon({ width, height, color = "currentColor" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      style={{ width: `${width}px`, height: `${height}px` }}
      version="1.1"
      viewBox="0 0 512 512.0001"
    >
      <g id="surface1">
        <path d="M 15 512 L 287 512 C 295.285156 512 302 505.285156 302 497 L 302 481 C 302 464.429688 288.570312 451 272 451 L 272 433.066406 C 272 409.320312 252.679688 390 228.933594 390 L 73.066406 390 C 49.320312 390 30 409.320312 30 433.066406 L 30 451 C 13.429688 451 0 464.429688 0 481 L 0 497 C 0 505.28125 6.71875 512 15 512 Z M 15 512 " />
        <path d="M 187.734375 330.34375 C 197.703125 343.574219 216.515625 346.21875 229.746094 336.246094 C 242.980469 326.277344 245.621094 307.464844 235.652344 294.230469 L 145.378906 174.4375 C 135.40625 161.203125 116.597656 158.5625 103.367188 168.53125 C 90.132812 178.503906 87.488281 197.3125 97.460938 210.546875 Z M 187.734375 330.34375 " />
        <path d="M 403.363281 167.851562 C 413.335938 181.082031 432.144531 183.726562 445.378906 173.753906 C 458.609375 163.785156 461.253906 144.976562 451.28125 131.742188 L 361.007812 11.949219 C 351.039062 -1.285156 332.226562 -3.929688 318.996094 6.042969 C 305.765625 16.015625 303.121094 34.824219 313.09375 48.058594 Z M 403.363281 167.851562 " />
        <path d="M 337.5625 255 C 359.734375 238.292969 376.378906 217.546875 386.789062 195.703125 L 281.75 56.3125 C 257.882812 60.300781 233.355469 70.578125 211.179688 87.289062 C 189.007812 103.996094 172.363281 124.742188 161.953125 146.582031 L 266.992188 285.980469 C 290.859375 281.992188 315.386719 271.710938 337.5625 255 Z M 337.5625 255 " />
        <path d="M 378.066406 258.90625 C 371.082031 266.023438 363.726562 272.847656 355.617188 278.960938 C 347.503906 285.070312 338.914062 290.261719 330.152344 295.015625 L 349.710938 320.972656 L 397.628906 284.867188 Z M 378.066406 258.90625 " />
        <path d="M 415.683594 308.824219 L 367.765625 344.929688 L 458.039062 464.726562 C 468.011719 477.960938 486.820312 480.601562 500.050781 470.632812 C 513.285156 460.660156 515.925781 441.851562 505.957031 428.617188 Z M 415.683594 308.824219 " />
      </g>
    </svg>
  );
}

export function AddIcon({ width, height, color = "currentColor" }: IconProps) {
  return (
    <svg
      id="bold"
      style={{ width: `${width}px`, height: `${height}px` }}
      fill={color}
      enableBackground="new 0 0 24 24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m14.25 0h-11.5c-1.52 0-2.75 1.23-2.75 2.75v15.5c0 1.52 1.23 2.75 2.75 2.75h6.59c-.54-1.14-.84-2.41-.84-3.75 0-1.15.22-2.25.63-3.26-.04.01-.08.01-.13.01h-5c-.55 0-1-.45-1-1s.45-1 1-1h5c.38 0 .72.22.88.54.65-1.01 1.49-1.87 2.48-2.54h-8.36c-.55 0-1-.45-1-1s.45-1 1-1h9c.55 0 1 .45 1 1 0 .05 0 .09-.01.13.93-.38 1.95-.6 3.01-.62v-5.76c0-1.52-1.23-2.75-2.75-2.75zm-6.25 6h-4c-.55 0-1-.45-1-1s.45-1 1-1h4c.55 0 1 .45 1 1s-.45 1-1 1z" />
      <path d="m17.25 10.5c-3.722 0-6.75 3.028-6.75 6.75s3.028 6.75 6.75 6.75 6.75-3.028 6.75-6.75-3.028-6.75-6.75-6.75zm2.75 7.75h-1.75v1.75c0 .552-.448 1-1 1s-1-.448-1-1v-1.75h-1.75c-.552 0-1-.448-1-1s.448-1 1-1h1.75v-1.75c0-.552.448-1 1-1s1 .448 1 1v1.75h1.75c.552 0 1 .448 1 1s-.448 1-1 1z" />
    </svg>
  );
}

export function SearchIcon({ width, height, color = "currentColor" }: IconProps) {
  return (
    <svg
      id="Layer_1"
      fill={color}
      style={{ width: `${width}px`, height: `${height}px` }}
      enableBackground="new 0 0 512.392 512.392"
      viewBox="0 0 512.392 512.392"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path d="m211.196 422c-116.346 0-211-94.654-211-211s94.654-211 211-211 211 94.654 211 211-94.654 211-211 211zm0-382c-94.29 0-171 76.71-171 171s76.71 171 171 171 171-76.71 171-171-76.71-171-171-171zm295.143 466.534c7.81-7.811 7.81-20.475 0-28.285l-89.5-89.5c-7.811-7.811-20.475-7.811-28.285 0s-7.81 20.475 0 28.285l89.5 89.5c3.905 3.905 9.024 5.857 14.143 5.857s10.236-1.952 14.142-5.857z" />
      </g>
    </svg>
  );
}

export function Search2Icon({ width, height, color = "currentColor" }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" style={{ width: `${width}px`, height: `${height}px` }}>
      <mask id="mask0_785_11660" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" style={{ maskType: "alpha" }}>
        <rect width="24" height="24" fill={color} />
      </mask>
      <g mask="url(#mask0_785_11660)">
        <path
          d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z"
          fill={color}
        />
      </g>
    </svg>
  );
}

export function MenuIcon({ color = "currentColor", width = "24", height = "24" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: `${width}px`, height: `${height}px` }}>
      <g>
        <path d="M3.30957 18V16H21.3096V18H3.30957ZM3.30957 13V11H21.3096V13H3.30957ZM3.30957 8V6H21.3096V8H3.30957Z" fill={color} />
      </g>
    </svg>
  );
}

export function EditIcon({ color = "currentColor" }) {
  return (
    <svg version="1.1" id="icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" fill={color}>
      <rect x="2" y="26" width="28" height="2" />
      <path
        d="M25.4,9c0.8-0.8,0.8-2,0-2.8c0,0,0,0,0,0l-3.6-3.6c-0.8-0.8-2-0.8-2.8,0c0,0,0,0,0,0l-15,15V24h6.4L25.4,9z M20.4,4L24,7.6
      l-3,3L17.4,7L20.4,4z M6,22v-3.6l10-10l3.6,3.6l-10,10H6z"
      />
      <rect id="_Transparent_Rectangle_" width="32" height="32" style={{ fill: "none" }} />
    </svg>
  );
}

export function DownloadIcon({ height = "19", width = "23", color = "currentColor" }: IconProps) {
  return (
    <svg style={{ width: `${width}px`, height: `${height}px` }} viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20.125 11.875V15.0417C20.125 15.4616 19.9231 15.8643 19.5636 16.1613C19.2042 16.4582 18.7167 16.625 18.2083 16.625H4.79167C4.28334 16.625 3.79582 16.4582 3.43638 16.1613C3.07693 15.8643 2.875 15.4616 2.875 15.0417V11.875M6.70833 7.91667L11.5 11.875M11.5 11.875L16.2917 7.91667M11.5 11.875V2.375"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DownloadPDFIcon({ height = "32", width = "32", color = "currentColor" }: IconProps) {
  return (
    <svg id="icon" xmlns="http://www.w3.org/2000/svg" style={{ width: `${width}px`, height: `${height}px` }} viewBox="0 0 32 32" fill={color}>
      <path d="M24,24v4H8V24H6v4H6a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2h0V24Z" />
      <polygon points="21 21 19.586 19.586 17 22.172 17 14 15 14 15 22.172 12.414 19.586 11 21 16 26 21 21" />
      <polygon points="28 4 28 2 22 2 22 12 24 12 24 8 27 8 27 6 24 6 24 4 28 4" />
      <path d="M17,12H13V2h4a3.0033,3.0033,0,0,1,3,3V9A3.0033,3.0033,0,0,1,17,12Zm-2-2h2a1.0011,1.0011,0,0,0,1-1V5a1.0011,1.0011,0,0,0-1-1H15Z" />
      <path d="M9,2H4V12H6V9H9a2.0027,2.0027,0,0,0,2-2V4A2.0023,2.0023,0,0,0,9,2ZM6,7V4H9l.001,3Z" />
      <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" style={{ fill: "none" }} width="32" height="32" />
    </svg>
  );
}

export function ViewDocumentCoverPageIcon({ height = "32", width = "32", color = "currentColor" }: IconProps) {
  return (
    <svg id="icon" xmlns="http://www.w3.org/2000/svg" style={{ width: `${width}px`, height: `${height}px` }} viewBox="0 0 32 32" fill={color}>
      <circle cx="22" cy="24" r="2" />
      <path
        id="_inner_path_"
        data-name="&lt;inner path&gt;"
        style={{ fill: "none" }}
        d="M22,28a4,4,0,1,1,4-4A4.0039,4.0039,0,0,1,22,28Zm0-6a2,2,0,1,0,2,2A2.0027,2.0027,0,0,0,22,22Z"
      />
      <path d="M29.7769,23.4785A8.64,8.64,0,0,0,22,18a8.64,8.64,0,0,0-7.7769,5.4785L14,24l.2231.5215A8.64,8.64,0,0,0,22,30a8.64,8.64,0,0,0,7.7769-5.4785L30,24ZM22,28a4,4,0,1,1,4-4A4.0045,4.0045,0,0,1,22,28Z" />
      <path d="M12,28H8V4h8v6a2.0058,2.0058,0,0,0,2,2h6v4h2V10a.9092.9092,0,0,0-.3-.7l-7-7A.9087.9087,0,0,0,18,2H8A2.0058,2.0058,0,0,0,6,4V28a2.0058,2.0058,0,0,0,2,2h4ZM18,4.4,23.6,10H18Z" />
      <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" style={{ fill: "none" }} width="32" height="32" />
    </svg>
  );
}

export function DownChevronIcon({ height = "16", width = "16", color = "currentColor" }: IconProps) {
  return (
    <svg style={{ width: `${width}px`, height: `${height}px` }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g fill={color} id="Layer_3" data-name="Layer 3">
        <path d="m18.646 6.354-6.646 6.646-6.646-6.646a1.914 1.914 0 0 0 -2.708 2.707l9 9a.5.5 0 0 0 .708 0l9-9a1.914 1.914 0 1 0 -2.708-2.707z" />
      </g>
    </svg>
  );
}

export function DownArrowIcon({ height = "16", width = "12", color = "currentColor" }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 16" fill="none" style={{ width: `${width}px`, height: `${height}px` }}>
      <path d="M11.2 10.4L10.072 9.272L6.4 12.936V0H4.8V12.936L1.128 9.264L0 10.4L5.6 16L11.2 10.4Z" fill={color} />
    </svg>
  );
}

export function DownLongArrowIcon({ height = "72", width = "12", color = "currentColor" }: IconProps) {
  return (
    <svg style={{ width: `${width}px`, height: `${height}px` }} viewBox="0 0 12 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 72L11.7735 62H0.226497L6 72ZM5 0L5 63H7L7 0L5 0Z" fill={color} />
    </svg>
  );
}

export function RightArrowIcon({ height = "32", width = "32", color = "currentColor" }: IconProps) {
  return (
    <svg style={{ width: `${width}px`, height: `${height}px` }} viewBox="0 0 29 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 10.5C1.17157 10.5 0.5 11.1716 0.5 12C0.5 12.8284 1.17157 13.5 2 13.5V10.5ZM28.0607 13.0607C28.6464 12.4749 28.6464 11.5251 28.0607 10.9393L18.5147 1.3934C17.9289 0.807611 16.9792 0.807611 16.3934 1.3934C15.8076 1.97919 15.8076 2.92893 16.3934 3.51472L24.8787 12L16.3934 20.4853C15.8076 21.0711 15.8076 22.0208 16.3934 22.6066C16.9792 23.1924 17.9289 23.1924 18.5147 22.6066L28.0607 13.0607ZM2 13.5H27V10.5H2V13.5Z"
        fill={color}
      />
    </svg>
  );
}

export function EyeIcon({ height = "80", width = "80", color = "currentColor" }: IconProps) {
  return (
    <svg style={{ width: `${width}px`, height: `${height}px` }} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.33325 39.9999C3.33325 39.9999 16.6666 13.3333 39.9999 13.3333C63.3332 13.3333 76.6666 39.9999 76.6666 39.9999C76.6666 39.9999 63.3332 66.6666 39.9999 66.6666C16.6666 66.6666 3.33325 39.9999 3.33325 39.9999Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M39.9999 49.9999C45.5228 49.9999 49.9999 45.5228 49.9999 39.9999C49.9999 34.4771 45.5228 29.9999 39.9999 29.9999C34.4771 29.9999 29.9999 34.4771 29.9999 39.9999C29.9999 45.5228 34.4771 49.9999 39.9999 49.9999Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function ReadMoreIcon({ height = "60", width = "60", color = "currentColor" }: IconProps) {
  return (
    <svg
      id="Capa_1"
      fill={color}
      enableBackground="new 0 0 512 512"
      style={{ width: `${width}px`, height: `${height}px` }}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path d="m195 136h302c8.291 0 15-6.709 15-15s-6.709-15-15-15h-302c-8.291 0-15 6.709-15 15s6.709 15 15 15z" />
        <path d="m497 196h-242c-8.291 0-15 6.709-15 15s6.709 15 15 15h242c8.291 0 15-6.709 15-15s-6.709-15-15-15z" />
        <path d="m497 286h-242c-8.291 0-15 6.709-15 15s6.709 15 15 15h242c8.291 0 15-6.709 15-15s-6.709-15-15-15z" />
        <path d="m497 376h-302c-8.291 0-15 6.709-15 15s6.709 15 15 15h302c8.291 0 15-6.709 15-15s-6.709-15-15-15z" />
        <path d="m205.587 245.376-59.982-59.982c-5.859-5.859-15.352-5.859-21.211 0s-5.859 15.352 0 21.211l34.395 34.395h-143.789c-8.291 0-15 6.709-15 15s6.709 15 15 15h143.789l-34.395 34.395c-5.859 5.859-5.859 15.352 0 21.211s15.351 5.86 21.211 0l59.982-59.982c5.806-5.791 5.897-15.367 0-21.248z" />
      </g>
    </svg>
  );
}

export function ExternalLinkIcon({ height = "32", width = "32", color = "currentColor" }: IconProps) {
  return (
    <svg id="icon" xmlns="http://www.w3.org/2000/svg" fill={color} style={{ width: `${width}px`, height: `${height}px` }} viewBox="0 0 32 32">
      <path d="M26,28H6a2.0027,2.0027,0,0,1-2-2V6A2.0027,2.0027,0,0,1,6,4H16V6H6V26H26V16h2V26A2.0027,2.0027,0,0,1,26,28Z" />
      <polygon points="20 2 20 4 26.586 4 18 12.586 19.414 14 28 5.414 28 12 30 12 30 2 20 2" />
      <rect
        id="_Transparent_Rectangle_"
        data-name="&lt;Transparent Rectangle&gt;"
        style={{ width: `${width}px`, height: `${height}px`, fill: "none" }}
      />
    </svg>
  );
}

export const DocumentIcon = ({ height = "32", width = "32", color = "currentColor" }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: `${width}px`, height: `${height}px` }}>
      <mask id="mask0_8122_184911" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" style={{ maskType: "alpha" }}>
        <rect width="24" height="24" fill={color} />
      </mask>
      <g mask="url(#mask0_8122_184911)">
        <path
          d="M8 18H16V16H8V18ZM8 14H16V12H8V14ZM6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V4C4 3.45 4.19583 2.97917 4.5875 2.5875C4.97917 2.19583 5.45 2 6 2H14L20 8V20C20 20.55 19.8042 21.0208 19.4125 21.4125C19.0208 21.8042 18.55 22 18 22H6Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export const GlobeIcon = ({ height = "32", width = "32", color = "currentColor" }: IconProps) => {
  return (
    <svg
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      clipRule="evenodd"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <path
        d="M10.0003 18.3334C8.86144 18.3334 7.78505 18.1147 6.77116 17.6772C5.75727 17.2397 4.87185 16.6424 4.11491 15.8855C3.35796 15.1286 2.76074 14.2431 2.32324 13.2292C1.88574 12.2154 1.66699 11.139 1.66699 10.0001C1.66699 8.8473 1.88574 7.76744 2.32324 6.7605C2.76074 5.75355 3.35796 4.87161 4.11491 4.11466C4.87185 3.35772 5.75727 2.7605 6.77116 2.323C7.78505 1.8855 8.86144 1.66675 10.0003 1.66675C11.1531 1.66675 12.233 1.8855 13.2399 2.323C14.2469 2.7605 15.1288 3.35772 15.8857 4.11466C16.6427 4.87161 17.2399 5.75355 17.6774 6.7605C18.1149 7.76744 18.3337 8.8473 18.3337 10.0001C18.3337 11.139 18.1149 12.2154 17.6774 13.2292C17.2399 14.2431 16.6427 15.1286 15.8857 15.8855C15.1288 16.6424 14.2469 17.2397 13.2399 17.6772C12.233 18.1147 11.1531 18.3334 10.0003 18.3334ZM10.0003 16.6251C10.3614 16.1251 10.6739 15.6042 10.9378 15.0626C11.2017 14.5209 11.417 13.9445 11.5837 13.3334H8.41699C8.58366 13.9445 8.79894 14.5209 9.06283 15.0626C9.32671 15.6042 9.63921 16.1251 10.0003 16.6251ZM7.83366 16.2917C7.58366 15.8334 7.36491 15.3577 7.17741 14.8647C6.98991 14.3716 6.83366 13.8612 6.70866 13.3334H4.25033C4.6531 14.0279 5.15658 14.632 5.76074 15.1459C6.36491 15.6598 7.05588 16.0417 7.83366 16.2917ZM12.167 16.2917C12.9448 16.0417 13.6357 15.6598 14.2399 15.1459C14.8441 14.632 15.3475 14.0279 15.7503 13.3334H13.292C13.167 13.8612 13.0107 14.3716 12.8232 14.8647C12.6357 15.3577 12.417 15.8334 12.167 16.2917ZM3.54199 11.6667H6.37533C6.33366 11.389 6.30241 11.1147 6.28158 10.8438C6.26074 10.573 6.25033 10.2917 6.25033 10.0001C6.25033 9.70841 6.26074 9.42716 6.28158 9.15633C6.30241 8.8855 6.33366 8.61119 6.37533 8.33341H3.54199C3.47255 8.61119 3.42046 8.8855 3.38574 9.15633C3.35102 9.42716 3.33366 9.70841 3.33366 10.0001C3.33366 10.2917 3.35102 10.573 3.38574 10.8438C3.42046 11.1147 3.47255 11.389 3.54199 11.6667ZM8.04199 11.6667H11.9587C12.0003 11.389 12.0316 11.1147 12.0524 10.8438C12.0732 10.573 12.0837 10.2917 12.0837 10.0001C12.0837 9.70841 12.0732 9.42716 12.0524 9.15633C12.0316 8.8855 12.0003 8.61119 11.9587 8.33341H8.04199C8.00033 8.61119 7.96908 8.8855 7.94824 9.15633C7.92741 9.42716 7.91699 9.70841 7.91699 10.0001C7.91699 10.2917 7.92741 10.573 7.94824 10.8438C7.96908 11.1147 8.00033 11.389 8.04199 11.6667ZM13.6253 11.6667H16.4587C16.5281 11.389 16.5802 11.1147 16.6149 10.8438C16.6496 10.573 16.667 10.2917 16.667 10.0001C16.667 9.70841 16.6496 9.42716 16.6149 9.15633C16.5802 8.8855 16.5281 8.61119 16.4587 8.33341H13.6253C13.667 8.61119 13.6982 8.8855 13.7191 9.15633C13.7399 9.42716 13.7503 9.70841 13.7503 10.0001C13.7503 10.2917 13.7399 10.573 13.7191 10.8438C13.6982 11.1147 13.667 11.389 13.6253 11.6667ZM13.292 6.66675H15.7503C15.3475 5.9723 14.8441 5.36814 14.2399 4.85425C13.6357 4.34036 12.9448 3.95841 12.167 3.70841C12.417 4.16675 12.6357 4.64244 12.8232 5.1355C13.0107 5.62855 13.167 6.13897 13.292 6.66675ZM8.41699 6.66675H11.5837C11.417 6.05564 11.2017 5.47925 10.9378 4.93758C10.6739 4.39591 10.3614 3.87508 10.0003 3.37508C9.63921 3.87508 9.32671 4.39591 9.06283 4.93758C8.79894 5.47925 8.58366 6.05564 8.41699 6.66675ZM4.25033 6.66675H6.70866C6.83366 6.13897 6.98991 5.62855 7.17741 5.1355C7.36491 4.64244 7.58366 4.16675 7.83366 3.70841C7.05588 3.95841 6.36491 4.34036 5.76074 4.85425C5.15658 5.36814 4.6531 5.9723 4.25033 6.66675Z"
        fill={color}
      />
    </svg>
  );
};

export const PDFIcon = ({ height = "32", width = "32", color = "currentColor" }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: `${width}px`, height: `${height}px` }}>
      <path
        d="M11.363 2c4.155 0 2.637 6 2.637 6s6-1.65 6 2.457v11.543h-16v-20h7.363zm.826-2h-10.189v24h20v-14.386c0-2.391-6.648-9.614-9.811-9.614zm4.811 13h-2.628v3.686h.907v-1.472h1.49v-.732h-1.49v-.698h1.721v-.784zm-4.9 0h-1.599v3.686h1.599c.537 0 .961-.181 1.262-.535.555-.658.587-2.034-.062-2.692-.298-.3-.712-.459-1.2-.459zm-.692.783h.496c.473 0 .802.173.915.644.064.267.077.679-.021.948-.128.351-.381.528-.754.528h-.637v-2.12zm-2.74-.783h-1.668v3.686h.907v-1.277h.761c.619 0 1.064-.277 1.224-.763.095-.291.095-.597 0-.885-.16-.484-.606-.761-1.224-.761zm-.761.732h.546c.235 0 .467.028.576.228.067.123.067.366 0 .489-.109.199-.341.227-.576.227h-.546v-.944z"
        fill={color}
      />
    </svg>
  );
};

export const Loading = ({ height = "16", width = "16", color = "currentColor" }: IconProps) => {
  return (
    <svg
      className="animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke={color} strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill={color}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export const TranslationIcon = ({ height = "68", width = "89", color = "currentColor" }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none">
      <mask id="mask0_1846_4439" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" style={{ maskType: "alpha" }}>
        <rect width="24" height="24" fill={color} />
      </mask>
      <g mask="url(#mask0_1846_4439)">
        <path
          d="M11.9 22L16.45 10H18.55L23.1 22H21L19.95 18.95H15.1L14 22H11.9ZM15.7 17.2H19.3L17.55 12.25H17.45L15.7 17.2ZM4 19L2.6 17.6L7.65 12.55C7.01667 11.85 6.4625 11.125 5.9875 10.375C5.5125 9.625 5.1 8.83333 4.75 8H6.85C7.15 8.6 7.47083 9.14167 7.8125 9.625C8.15417 10.1083 8.56667 10.6167 9.05 11.15C9.78333 10.35 10.3917 9.52917 10.875 8.6875C11.3583 7.84583 11.7667 6.95 12.1 6H1V4H8V2H10V4H17V6H14.1C13.75 7.18333 13.275 8.33333 12.675 9.45C12.075 10.5667 11.3333 11.6167 10.45 12.6L12.85 15.05L12.1 17.1L9 14L4 19Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export const Video = ({ height = "90", width = "90", color = "currentColor" }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" style={{ width: `${width}px`, height: `${height}px` }}>
      <path
        fill={color}
        d="M 15 4 C 10.814 4 5.3808594 5.0488281 5.3808594 5.0488281 L 5.3671875 5.0644531 C 3.4606632 5.3693645 2 7.0076245 2 9 L 2 15 L 2 15.001953 L 2 21 L 2 21.001953 A 4 4 0 0 0 5.3769531 24.945312 L 5.3808594 24.951172 C 5.3808594 24.951172 10.814 26.001953 15 26.001953 C 19.186 26.001953 24.619141 24.951172 24.619141 24.951172 L 24.621094 24.949219 A 4 4 0 0 0 28 21.001953 L 28 21 L 28 15.001953 L 28 15 L 28 9 A 4 4 0 0 0 24.623047 5.0546875 L 24.619141 5.0488281 C 24.619141 5.0488281 19.186 4 15 4 z M 12 10.398438 L 20 15 L 12 19.601562 L 12 10.398438 z"
      />
    </svg>
  );
};

export const SpeakerIcon = ({ height = "32", width = "32", color = "currentColor" }: IconProps) => {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: `${width}px`, height: `${height}px` }}>
      <g>
        <path
          d="M24 17.3333V14.6667H29.3334V17.3333H24ZM25.6 26.6667L21.3334 23.4667L22.9334 21.3333L27.2 24.5333L25.6 26.6667ZM22.9334 10.6667L21.3334 8.53334L25.6 5.33334L27.2 7.46667L22.9334 10.6667ZM6.66669 25.3333V20H5.33335C4.60002 20 3.97224 19.7389 3.45002 19.2167C2.9278 18.6944 2.66669 18.0667 2.66669 17.3333V14.6667C2.66669 13.9333 2.9278 13.3056 3.45002 12.7833C3.97224 12.2611 4.60002 12 5.33335 12H10.6667L17.3334 8V24L10.6667 20H9.33335V25.3333H6.66669ZM18.6667 20.4667V11.5333C19.2667 12.0667 19.75 12.7167 20.1167 13.4833C20.4834 14.25 20.6667 15.0889 20.6667 16C20.6667 16.9111 20.4834 17.75 20.1167 18.5167C19.75 19.2833 19.2667 19.9333 18.6667 20.4667ZM5.33335 14.6667V17.3333H11.4L14.6667 19.2667V12.7333L11.4 14.6667H5.33335Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export const AlertCircleIcon = ({ height = "24", width = "24", color = "currentColor" }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: `${width}px`, height: `${height}px` }}>
      <path
        d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const BookOpenIcon = ({ height = "24", width = "24", color = "currentColor" }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: `${width}px`, height: `${height}px` }}>
      <path
        d="M12 7C12 5.93913 11.5786 4.92172 10.8284 4.17157C10.0783 3.42143 9.06087 3 8 3H2V18H9C9.79565 18 10.5587 18.3161 11.1213 18.8787C11.6839 19.4413 12 20.2044 12 21M12 7V21M12 7C12 5.93913 12.4214 4.92172 13.1716 4.17157C13.9217 3.42143 14.9391 3 16 3H22V18H15C14.2044 18 13.4413 18.3161 12.8787 18.8787C12.3161 19.4413 12 20.2044 12 21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DocumentMagnifyIcon = ({ height = "24", width = "24", color = "currentColor" }: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: `${width}px`, height: `${height}px` }}>
      <g>
        <path
          d="M7.63341 11.3333C7.83341 11.3333 8.03064 11.3083 8.22508 11.2583C8.41953 11.2083 8.60008 11.1333 8.76675 11.0333L10.4001 12.6666L11.3334 11.7333L9.70008 10.0999C9.80008 9.93325 9.87508 9.7527 9.92508 9.55825C9.97508 9.36381 10.0001 9.16658 10.0001 8.96658C10.0001 8.32214 9.7723 7.7777 9.31675 7.33325C8.86119 6.88881 8.31119 6.66658 7.66675 6.66658C7.0223 6.66658 6.4723 6.89436 6.01675 7.34992C5.56119 7.80547 5.33341 8.35547 5.33341 8.99992C5.33341 9.64436 5.55564 10.1944 6.00008 10.6499C6.44453 11.1055 6.98897 11.3333 7.63341 11.3333ZM7.66675 9.99992C7.38897 9.99992 7.15286 9.9027 6.95841 9.70825C6.76397 9.51381 6.66675 9.2777 6.66675 8.99992C6.66675 8.72214 6.76397 8.48603 6.95841 8.29158C7.15286 8.09714 7.38897 7.99992 7.66675 7.99992C7.94453 7.99992 8.18064 8.09714 8.37508 8.29158C8.56953 8.48603 8.66675 8.72214 8.66675 8.99992C8.66675 9.2777 8.56953 9.51381 8.37508 9.70825C8.18064 9.9027 7.94453 9.99992 7.66675 9.99992ZM4.00008 14.6666C3.63341 14.6666 3.31953 14.536 3.05841 14.2749C2.7973 14.0138 2.66675 13.6999 2.66675 13.3333V2.66659C2.66675 2.29992 2.7973 1.98603 3.05841 1.72492C3.31953 1.46381 3.63341 1.33325 4.00008 1.33325H9.33341L13.3334 5.33325V13.3333C13.3334 13.6999 13.2029 14.0138 12.9417 14.2749C12.6806 14.536 12.3667 14.6666 12.0001 14.6666H4.00008ZM8.66675 5.99992H12.0001L8.66675 2.66659V5.99992Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export const LegislativeIcon = ({ height = "24", width = "24", color = "currentColor" }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: `${width}px`, height: `${height}px` }}>
      <mask id="mask0_8126_184928" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" style={{ maskType: "alpha" }}>
        <rect width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_8126_184928)">
        <path
          d="M2 21V19H11V7.825C10.5667 7.675 10.1917 7.44167 9.875 7.125C9.55833 6.80833 9.325 6.43333 9.175 6H6L9 13C9 13.8333 8.65833 14.5417 7.975 15.125C7.29167 15.7083 6.46667 16 5.5 16C4.53333 16 3.70833 15.7083 3.025 15.125C2.34167 14.5417 2 13.8333 2 13L5 6H3V4H9.175C9.375 3.41667 9.73333 2.9375 10.25 2.5625C10.7667 2.1875 11.35 2 12 2C12.65 2 13.2333 2.1875 13.75 2.5625C14.2667 2.9375 14.625 3.41667 14.825 4H21V6H19L22 13C22 13.8333 21.6583 14.5417 20.975 15.125C20.2917 15.7083 19.4667 16 18.5 16C17.5333 16 16.7083 15.7083 16.025 15.125C15.3417 14.5417 15 13.8333 15 13L18 6H14.825C14.675 6.43333 14.4417 6.80833 14.125 7.125C13.8083 7.44167 13.4333 7.675 13 7.825V19H22V21H2ZM16.625 13H20.375L18.5 8.65L16.625 13ZM3.625 13H7.375L5.5 8.65L3.625 13ZM12 6C12.2833 6 12.5208 5.90417 12.7125 5.7125C12.9042 5.52083 13 5.28333 13 5C13 4.71667 12.9042 4.47917 12.7125 4.2875C12.5208 4.09583 12.2833 4 12 4C11.7167 4 11.4792 4.09583 11.2875 4.2875C11.0958 4.47917 11 4.71667 11 5C11 5.28333 11.0958 5.52083 11.2875 5.7125C11.4792 5.90417 11.7167 6 12 6Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export const LightblubIcon = ({ height = "24", width = "24", color = "currentColor" }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: `${width}px`, height: `${height}px` }}>
      <mask id="mask0_8127_184940" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" style={{ maskType: "alpha" }}>
        <rect width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_8127_184940)">
        <path
          d="M12 22C11.56 22 11.1833 21.8433 10.87 21.53C10.5567 21.2167 10.4 20.84 10.4 20.4H13.6C13.6 20.84 13.4433 21.2167 13.13 21.53C12.8167 21.8433 12.44 22 12 22ZM8.8 19.6V18H15.2V19.6H8.8ZM9 17.2C8.08 16.6533 7.35 15.92 6.81 15C6.27 14.08 6 13.08 6 12C6 10.3333 6.58333 8.91667 7.75 7.75C8.91667 6.58333 10.3333 6 12 6C13.6667 6 15.0833 6.58333 16.25 7.75C17.4167 8.91667 18 10.3333 18 12C18 13.08 17.73 14.08 17.19 15C16.65 15.92 15.92 16.6533 15 17.2H9Z"
          fill={color}
        />
        <line x1="12" y1="5" x2="12" y2="1.5" stroke={color} />
        <line x1="17.677" y1="6.87905" x2="20.3489" y2="4.61827" stroke={color} />
        <line y1="-0.5" x2="3.5" y2="-0.5" transform="matrix(-0.763393 -0.645935 -0.645935 0.763393 6 7.26074)" stroke={color} />
        <line x1="19.25" y1="11.5" x2="22.75" y2="11.5" stroke={color} />
        <line x1="1.25" y1="11.5" x2="4.75" y2="11.5" stroke={color} />
      </g>
    </svg>
  );
};

export const CopyIcon = ({ height = "24", width = "24", color = "currentColor" }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: `${width}px`, height: `${height}px` }}>
      <mask id="mask0_8291_291" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" style={{ maskType: "alpha" }}>
        <rect width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_8291_291)">
        <path
          d="M9 18C8.45 18 7.97917 17.8042 7.5875 17.4125C7.19583 17.0208 7 16.55 7 16V4C7 3.45 7.19583 2.97917 7.5875 2.5875C7.97917 2.19583 8.45 2 9 2H18C18.55 2 19.0208 2.19583 19.4125 2.5875C19.8042 2.97917 20 3.45 20 4V16C20 16.55 19.8042 17.0208 19.4125 17.4125C19.0208 17.8042 18.55 18 18 18H9ZM9 16H18V4H9V16ZM5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V6H5V20H16V22H5Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export const FindInDocIcon = ({ height = "24", width = "24", color = "currentColor" }: IconProps) => {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: `${width}px`, height: `${height}px` }}>
      <mask id="mask0_1616_10180" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48" style={{ maskType: "alpha" }}>
        <rect width="48" height="48" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_1616_10180)">
        <path
          d="M29.5 40L33.5 44H12C10.9 44 9.95833 43.6083 9.175 42.825C8.39167 42.0417 8 41.1 8 40V8C8 6.9 8.39167 5.95833 9.175 5.175C9.95833 4.39167 10.9 4 12 4H30L40 16V40C40 40.6667 39.8583 41.275 39.575 41.825C39.2917 42.375 38.9 42.8333 38.4 43.2L28 32.9C27.4333 33.2667 26.8167 33.5417 26.15 33.725C25.4833 33.9083 24.7667 34 24 34C21.8 34 19.9167 33.2167 18.35 31.65C16.7833 30.0833 16 28.2 16 26C16 23.8 16.7833 21.9167 18.35 20.35C19.9167 18.7833 21.8 18 24 18C26.2 18 28.0833 18.7833 29.65 20.35C31.2167 21.9167 32 23.8 32 26C32 26.7667 31.9083 27.4833 31.725 28.15C31.5417 28.8167 31.2667 29.4333 30.9 30L36 35.2V17.4L28.1 8H12V40H29.5ZM24 30C25.1 30 26.0417 29.6083 26.825 28.825C27.6083 28.0417 28 27.1 28 26C28 24.9 27.6083 23.9583 26.825 23.175C26.0417 22.3917 25.1 22 24 22C22.9 22 21.9583 22.3917 21.175 23.175C20.3917 23.9583 20 24.9 20 26C20 27.1 20.3917 28.0417 21.175 28.825C21.9583 29.6083 22.9 30 24 30Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export const ManyDocumentsIcon = ({ height = "24", width = "24", color = "currentColor" }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" style={{ width: `${width}px`, height: `${height}px` }}>
      <path
        d="M10 14H14V12H10V14ZM10 11H18V9H10V11ZM10 8H18V6H10V8ZM8 18C7.45 18 6.97917 17.8042 6.5875 17.4125C6.19583 17.0208 6 16.55 6 16V4C6 3.45 6.19583 2.97917 6.5875 2.5875C6.97917 2.19583 7.45 2 8 2H20C20.55 2 21.0208 2.19583 21.4125 2.5875C21.8042 2.97917 22 3.45 22 4V16C22 16.55 21.8042 17.0208 21.4125 17.4125C21.0208 17.8042 20.55 18 20 18H8ZM8 16H20V4H8V16ZM4 22C3.45 22 2.97917 21.8042 2.5875 21.4125C2.19583 21.0208 2 20.55 2 20V6H4V20H18V22H4Z"
        fill={color}
      />
    </svg>
  );
};

export const FacebookIcon = ({ height = "20", width = "24", color = "currentColor" }: IconProps) => {
  return (
    <svg
      aria-label="Facebook Icon"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
};

export const InstagramIcon = ({ height = "20", width = "24", color = "currentColor" }: IconProps) => {
  return (
    <svg
      aria-label="Instagram Icon"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
};

export const LinkedInIcon = ({ height = "20", width = "24", color = "currentColor" }: IconProps) => {
  return (
    <svg
      aria-label="LinkedIn Icon"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
};

export const TwitterIcon = ({ height = "20", width = "24", color = "currentColor" }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill={color} width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.6874 3.0625L12.6907 8.77425L8.37045 3.0625H2.11328L9.58961 12.8387L2.50378 20.9375H5.53795L11.0068 14.6886L15.7863 20.9375H21.8885L14.095 10.6342L20.7198 3.0625H17.6874ZM16.6232 19.1225L5.65436 4.78217H7.45745L18.3034 19.1225H16.6232Z" />
    </svg>
  );
};

export const ContextSearchIcon = ({ height = "24", width = "24", color = "currentColor" }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" style={{ width: `${width}px`, height: `${height}px` }}>
      <mask id="mask0_1038_1359" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" style={{ maskType: "alpha" }}>
        <rect width="24" height="24" fill={color} />
      </mask>
      <g mask="url(#mask0_1038_1359)">
        <path
          d="M2 19V17H12V19H2ZM2 14V12H7V14H2ZM2 9V7H7V9H2ZM20.6 19L16.75 15.15C16.35 15.4333 15.9125 15.6458 15.4375 15.7875C14.9625 15.9292 14.4833 16 14 16C12.6167 16 11.4375 15.5125 10.4625 14.5375C9.4875 13.5625 9 12.3833 9 11C9 9.61667 9.4875 8.4375 10.4625 7.4625C11.4375 6.4875 12.6167 6 14 6C15.3833 6 16.5625 6.4875 17.5375 7.4625C18.5125 8.4375 19 9.61667 19 11C19 11.4833 18.9292 11.9625 18.7875 12.4375C18.6458 12.9125 18.4333 13.35 18.15 13.75L22 17.6L20.6 19ZM14 14C14.8333 14 15.5417 13.7083 16.125 13.125C16.7083 12.5417 17 11.8333 17 11C17 10.1667 16.7083 9.45833 16.125 8.875C15.5417 8.29167 14.8333 8 14 8C13.1667 8 12.4583 8.29167 11.875 8.875C11.2917 9.45833 11 10.1667 11 11C11 11.8333 11.2917 12.5417 11.875 13.125C12.4583 13.7083 13.1667 14 14 14Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export const AccordianOpenIcon = ({ height = "20", width = "20", color = "currentColor" }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" style={{ width: `${width}px`, height: `${height}px` }}>
      <g>
        <mask id="mask0_48_5358" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20" style={{ maskType: "alpha" }}>
          <rect width="20" height="20" fill="none" />
        </mask>
        <g mask="url(#mask0_48_5358)">
          <path d="M9.25 10.75H5V9.25H9.25V5H10.75V9.25H15V10.75H10.75V15H9.25V10.75Z" fill={color} />
        </g>
      </g>
    </svg>
  );
};

export const AccordianCloseIcon = ({ height = "20", width = "20", color = "currentColor" }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" style={{ width: `${width}px`, height: `${height}px` }}>
      <g>
        <mask id="mask0_48_5358" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20" style={{ maskType: "alpha" }}>
          <rect width="20" height="20" fill="none" />
        </mask>
        <g mask="url(#mask0_48_5380)">
          <path d="M4.83203 10.75V9.25H15.1654V10.75H4.83203Z" fill={color} />
        </g>
      </g>
    </svg>
  );
};
