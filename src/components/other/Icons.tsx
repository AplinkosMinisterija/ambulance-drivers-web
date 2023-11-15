import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiOutlineDownload,
  AiOutlineLeft,
  AiOutlineMail,
  AiOutlineRight
} from "react-icons/ai";
import { BiCalendarEvent, BiMinusCircle, BiTrip, BiUser } from "react-icons/bi";
import { BsMap } from "react-icons/bs";

import { FiClock, FiPhone } from "react-icons/fi";
import { IoIosLogOut, IoMdCalendar } from "react-icons/io";
import { IoCloseOutline, IoLocationSharp } from "react-icons/io5";
import {
  MdArrowBack,
  MdExitToApp,
  MdKeyboardArrowDown,
  MdList,
  MdTune
} from "react-icons/md";
import { TiLocation } from "react-icons/ti";

export interface IconProps {
  name: string;
  className?: string;
}

const Icon = ({ name, className }: IconProps) => {
  switch (name) {
    case "map":
      return <BsMap className={className} />;

    case "date":
      return <BiCalendarEvent className={className} />;

    case "MapLocation":
      return <IoLocationSharp className={className} />;
    case "filter":
      return <MdTune className={className} />;
    case "delete":
      return <BiMinusCircle className={className} />;
    case "calendar":
      return <IoMdCalendar className={className} />;
    case "arrowDown":
      return <AiFillCaretDown className={className} />;
    case "arrowUp":
      return <AiFillCaretUp className={className} />;
    case "close":
      return <IoCloseOutline className={className} />;

    case "leftArrow":
      return <AiOutlineLeft className={className} />;
    case "rightArrow":
      return <AiOutlineRight className={className} />;

    case "backMobile":
      return <MdArrowBack className={className} />;
    case "phone":
      return <FiPhone className={className} />;

    case "logout":
      return <IoIosLogOut className={className} />;
    case "time":
      return <FiClock className={className} />;
    case "exit":
      return <MdExitToApp className={className} />;
    case "distance":
      return <BiTrip className={className} />;
    case "userEmail":
      return <AiOutlineMail className={className} />;
    case "list":
      return <MdList className={className} />;
    case "export":
      return <AiOutlineDownload className={className} />;
    case "user":
      return <BiUser className={className} />;
    case "dropdownArrow":
      return <MdKeyboardArrowDown className={className} />;
    case "location":
      return <TiLocation className={className} />;

    case "logo":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="67.305"
          height="40"
          viewBox="0 0 67.305 40"
        >
          <g
            id="Group_317"
            data-name="Group 317"
            transform="translate(-305.913 -56.255)"
          >
            <path
              id="Path_464"
              fill="#121a55"
              d="M322.635,67.757a8.777,8.777,0,0,1,3.372,3.621,11.511,11.511,0,0,1,1.217,5.369,11.26,11.26,0,0,1-1.217,5.328,8.91,8.91,0,0,1-3.372,3.59,10.079,10.079,0,0,1-8.731.531,6.315,6.315,0,0,1-2.705-2.122l-.354,2.31h-4.933V57.143h5.952V68.569a6.723,6.723,0,0,1,2.477-1.53,9.715,9.715,0,0,1,3.372-.551A9.51,9.51,0,0,1,322.635,67.757Zm-2.768,12.477a5.576,5.576,0,0,0,.021-7.034,4.3,4.3,0,0,0-3.319-1.343,4.5,4.5,0,0,0-3.371,1.322,4.775,4.775,0,0,0-1.291,3.486,4.967,4.967,0,0,0,1.28,3.559,4.44,4.44,0,0,0,3.382,1.353A4.312,4.312,0,0,0,319.867,80.233Z"
              data-name="Path 464"
              transform="translate(0 -0.513)"
            />
            <path
              id="Path_465"
              fill="#13c9e7"
              d="M369.517,134.217a3.745,3.745,0,0,1,.021,5.39,4.255,4.255,0,0,1-5.671,0,3.744,3.744,0,0,1,.021-5.369,3.857,3.857,0,0,1,2.81-1.123A3.928,3.928,0,0,1,369.517,134.217Z"
              data-name="Path 465"
              transform="translate(-32.855 -44.434)"
            />
            <rect
              id="Rectangle_129"
              width="5.952"
              height="19.23"
              fill="#121a55"
              data-name="Rectangle 129"
              transform="translate(330.866 66.64)"
            />
            <path
              id="Path_466"
              fill="#121a55"
              d="M388.811,62.727a3.744,3.744,0,0,1-.021-5.39,4.255,4.255,0,0,1,5.671,0,3.743,3.743,0,0,1-.022,5.369,3.854,3.854,0,0,1-2.809,1.123A3.928,3.928,0,0,1,388.811,62.727Z"
              data-name="Path 466"
              transform="translate(-47.257)"
            />
            <rect
              id="Rectangle_130"
              width="5.952"
              height="19.23"
              fill="#121a55"
              data-name="Rectangle 130"
              transform="translate(341.397 66.64)"
            />
            <path
              id="Path_467"
              fill="#121a55"
              d="M431.657,80.562a8.808,8.808,0,0,1,3.372,3.6,12.358,12.358,0,0,1,0,10.7,8.874,8.874,0,0,1-3.372,3.61,9.448,9.448,0,0,1-4.922,1.28,9.877,9.877,0,0,1-3.371-.541,6.614,6.614,0,0,1-2.476-1.519v10.572h-5.952v-28.3h4.932l.354,2.227a6.385,6.385,0,0,1,2.706-2.133,9.358,9.358,0,0,1,3.808-.759A9.51,9.51,0,0,1,431.657,80.562Zm-2.767,12.518a5.578,5.578,0,0,0,.021-7.034,4.3,4.3,0,0,0-3.32-1.342,4.5,4.5,0,0,0-3.372,1.321,4.833,4.833,0,0,0-1.29,3.528,4.892,4.892,0,0,0,1.28,3.538,4.474,4.474,0,0,0,3.382,1.332A4.315,4.315,0,0,0,428.889,93.081Z"
              data-name="Path 467"
              transform="translate(-63.028 -13.319)"
            />
          </g>
        </svg>
      );
    case "modernShare":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          viewBox="0 0 566 670"
        >
          <path d="M255 12c4-4 10-8 16-8s12 3 16 8l94 89c3 4 6 7 8 12 2 6 0 14-5 19-7 8-20 9-28 2l-7-7-57-60 2 54v276c0 12-10 22-22 22-12 1-24-10-23-22V110l1-43-60 65c-5 5-13 8-21 6a19 19 0 0 1-16-17c-1-7 2-13 7-18l95-91z" />
          <path d="M43 207c16-17 40-23 63-23h83v46h-79c-12 0-25 3-33 13-8 9-10 21-10 33v260c0 13 0 27 6 38 5 12 18 18 30 19l14 1h302c14 0 28 0 40-8 11-7 16-21 16-34V276c0-11-2-24-9-33-8-10-22-13-34-13h-78v-46h75c13 0 25 1 37 4 16 4 31 13 41 27 11 17 14 37 14 57v280c0 20-3 41-15 58a71 71 0 0 1-45 27c-11 2-23 3-34 3H109c-19-1-40-4-56-15-14-9-23-23-27-38-4-12-5-25-5-38V270c1-22 6-47 22-63z" />
        </svg>
      );

    case "share":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          viewBox="0 0 120 169"
        >
          <g fill="currentColor">
            <path d="M60 0l28 28-2 2a586 586 0 0 0-4 4L64 15v90h-8V15L38 34l-4-4-2-2L60 0z" />
            <path d="M0 49h44v8H8v104h104V57H76v-8h44v120H0V49z" />
          </g>
        </svg>
      );
    default:
      return null;
  }
};

export default Icon;
