"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import ReactMapGl, {
  LngLatBounds,
  MapRef,
  Marker,
  ViewState,
  ViewStateChangeEvent,
} from "react-map-gl";
import { useLocalStorage } from "usehooks-ts";
import "mapbox-gl/dist/mapbox-gl.css";
import Pin from "../../public/pin.png";
import Sidebar from "./Sidebar";

export const data = [
  {
    business_status: "OPERATIONAL",
    formatted_address: "Matije Korvina 17, Subotica 24000, Serbia",
    geometry: {
      location: {
        lat: 46.10307450000001,
        lng: 19.6668156,
      },
      viewport: {
        northeast: {
          lat: 46.10449372989272,
          lng: 19.66827512989272,
        },
        southwest: {
          lat: 46.10179407010728,
          lng: 19.66557547010728,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
    name: "Q Bar",
    opening_hours: {
      open_now: false,
    },
    photos: [
      {
        height: 1440,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/110593006321923926153">Tanja Mačković</a>',
        ],
        photo_reference:
          "ATplDJalcgBrBGW3EQyE4uQZQubzPmX1skSZEyp6i2oxn8P9nKo-SkxdQeuvdkbAmi8ccpK9pI95wYo0mFjUlNDX9UoF3uToYQP2wqe_rv9HBJjXVNVilvLqam-SdWOTw2aDmFeSrZufWfMug8KHqJ_cm8HwO2IzCFVuiaqilu3Y60BOT9GZ",
        width: 1080,
      },
    ],
    place_id: "ChIJex4A8zNnQ0cRy1N0cNCZgH8",
    plus_code: {
      compound_code: "4M38+6P Subotica",
      global_code: "8FRX4M38+6P",
    },
    rating: 3.9,
    reference: "ChIJex4A8zNnQ0cRy1N0cNCZgH8",
    types: ["night_club", "point_of_interest", "establishment"],
    user_ratings_total: 14,
  },
  {
    business_status: "OPERATIONAL",
    formatted_address: "Banijska 4, Subotica 24000, Serbia",
    geometry: {
      location: {
        lat: 46.1016872,
        lng: 19.6859972,
      },
      viewport: {
        northeast: {
          lat: 46.10302452989272,
          lng: 19.68731357989272,
        },
        southwest: {
          lat: 46.10032487010728,
          lng: 19.68461392010728,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
    name: "Caffe Bar Bleja",
    opening_hours: {
      open_now: true,
    },
    photos: [
      {
        height: 3024,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/112275182131634558645">A Google User</a>',
        ],
        photo_reference:
          "ATplDJZWWV_X7JhndEQ5lGUhHpC0TzRnuhcYyNuhC8O1d4rpZWW5IP4PWkobgrUhTP5AkLGj_0ljrrkuicBaUC4a9VBPhLpM2AlIEzZ715qzLmyeeEbzVTRYdg8zexwuZxRgkzTclU93EMgio3EcEA_FRKCYKGDkgU_ntZZ9_JRaVPrrnTbZ",
        width: 4032,
      },
    ],
    place_id: "ChIJpxo9xdxhQ0cRs3zt553cAWM",
    plus_code: {
      compound_code: "4M2P+M9 Subotica",
      global_code: "8FRX4M2P+M9",
    },
    rating: 4.4,
    reference: "ChIJpxo9xdxhQ0cRs3zt553cAWM",
    types: [
      "bar",
      "cafe",
      "night_club",
      "food",
      "point_of_interest",
      "establishment",
    ],
    user_ratings_total: 5,
  },
  {
    business_status: "OPERATIONAL",
    formatted_address: "Matije Korvina 16, Subotica 24000, Serbia",
    geometry: {
      location: {
        lat: 46.1024162,
        lng: 19.6678679,
      },
      viewport: {
        northeast: {
          lat: 46.10375797989272,
          lng: 19.66918297989272,
        },
        southwest: {
          lat: 46.10105832010728,
          lng: 19.66648332010728,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
    name: "BakarBar",
    opening_hours: {
      open_now: true,
    },
    photos: [
      {
        height: 2268,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/114757788882350581418">A Google User</a>',
        ],
        photo_reference:
          "ATplDJYDOIG-t6cQs42kjryoI038J4Sq8uKFseJjQSetDbR3U2sjADldICYhpMcRH2jeZOe0UUyg2ADBb2m9KVEt7vqUB8-0uIYb3fAfpccytH6OAew6iKmEMNGBsYZ0EG_xJf3IpHspVB-syIvBaV9H7LXQ_T0dQhSGiV4R7GBoOE_LnGTO",
        width: 4032,
      },
    ],
    place_id: "ChIJv0X6PiVnQ0cRUX3v9pT1e1Y",
    plus_code: {
      compound_code: "4M29+X4 Subotica",
      global_code: "8FRX4M29+X4",
    },
    rating: 4.9,
    reference: "ChIJv0X6PiVnQ0cRUX3v9pT1e1Y",
    types: ["bar", "point_of_interest", "establishment"],
    user_ratings_total: 18,
  },
  {
    business_status: "OPERATIONAL",
    formatted_address: "Lajoša Joa 74, Subotica 24000, Serbia",
    geometry: {
      location: {
        lat: 46.088093,
        lng: 19.6716673,
      },
      viewport: {
        northeast: {
          lat: 46.08934962989272,
          lng: 19.67305717989272,
        },
        southwest: {
          lat: 46.08664997010727,
          lng: 19.67035752010727,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
    name: "Ljiljan cocktail bar",
    opening_hours: {
      open_now: false,
    },
    photos: [
      {
        height: 2992,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/110693561573219858853">Mišo Guljaš</a>',
        ],
        photo_reference:
          "ATplDJbfnd0u1WGlm6r9yuYeUDo3_zt2oV4tPhzHCVaRwjTzFkJ2wjwFaLoZs0WitYao53awCkMZ51ct3bbNQm5X8301AwHqDDGcDrA_Wt3WjLxBMb1Nwi7ZftT1q6Tj37JgV5gPzq3-ux-uTzWMi2YI9G6_RbEzUlkgevWZtA9-J_ha0fk4",
        width: 2992,
      },
    ],
    place_id: "ChIJQ5M9dLthQ0cRW4VZwjsV4xI",
    plus_code: {
      compound_code: "3MQC+6M Subotica",
      global_code: "8FRX3MQC+6M",
    },
    rating: 4.9,
    reference: "ChIJQ5M9dLthQ0cRW4VZwjsV4xI",
    types: ["bar", "point_of_interest", "establishment"],
    user_ratings_total: 62,
  },
  {
    business_status: "CLOSED_TEMPORARILY",
    formatted_address:
      "1A Vatroslava Lisinskog, 24000, Subotica, Severno-bački okrug, Subotica 24000, Serbia",
    geometry: {
      location: {
        lat: 46.1051353,
        lng: 19.6679351,
      },
      viewport: {
        northeast: {
          lat: 46.10651037989272,
          lng: 19.66928507989272,
        },
        southwest: {
          lat: 46.10381072010728,
          lng: 19.66658542010727,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
    name: "Flair Bar",
    permanently_closed: true,
    photos: [
      {
        height: 3096,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/110038442491745840402">David V</a>',
        ],
        photo_reference:
          "ATplDJav-5DJUpv9QwkuRmOku9ElD60afZ_rkhA8N7LhDgrEodCtOtoPdztXzJi59obRR63Tpmb8RZVpQvDSqnopHYv2jmq9RP89ncz2d3nR3Wr713jvoFGWwSQlfKqUVweYszKQHM7XGbWCHJpuBTg5auB52nNwfh3butOlSrQOfhbkeH9Y",
        width: 4128,
      },
    ],
    place_id: "ChIJ9xSy2LdmQ0cR3A46Z0wMRLQ",
    plus_code: {
      compound_code: "4M49+34 Subotica",
      global_code: "8FRX4M49+34",
    },
    rating: 4.1,
    reference: "ChIJ9xSy2LdmQ0cR3A46Z0wMRLQ",
    types: ["bar", "point_of_interest", "establishment"],
    user_ratings_total: 72,
  },
  {
    business_status: "OPERATIONAL",
    formatted_address: "Segedinski put 5, Subotica 24000, Serbia",
    geometry: {
      location: {
        lat: 46.10025710000001,
        lng: 19.6753882,
      },
      viewport: {
        northeast: {
          lat: 46.10155212989272,
          lng: 19.67672237989272,
        },
        southwest: {
          lat: 46.09885247010727,
          lng: 19.67402272010728,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
    name: "Oasis Pub",
    opening_hours: {
      open_now: true,
    },
    photos: [
      {
        height: 720,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/105687842601776817596">A Google User</a>',
        ],
        photo_reference:
          "ATplDJaEhbL7W04n4IP5rf8xI2KbTOvdZJLqhvVxzw6-Y8o38Ian8OlnvU94ZNKv14f8oxvjniSY7IsT3wLltLEZ2rBDgjKie0kZTELh8igetYEmCzX2l2AlPNrFBaEq53J89kCC01EdsATQCnN-vDq52gTEs1T448HCOItshWCXSnwybmRt",
        width: 1079,
      },
    ],
    place_id: "ChIJ35cgOMtmQ0cRfwq4F65Wbww",
    plus_code: {
      compound_code: "4M2G+45 Subotica",
      global_code: "8FRX4M2G+45",
    },
    price_level: 2,
    rating: 4.7,
    reference: "ChIJ35cgOMtmQ0cRfwq4F65Wbww",
    types: ["bar", "point_of_interest", "establishment"],
    user_ratings_total: 606,
  },
  {
    business_status: "OPERATIONAL",
    formatted_address: "Korzo 8, Subotica 24000, Serbia",
    geometry: {
      location: {
        lat: 46.10052229999999,
        lng: 19.6680281,
      },
      viewport: {
        northeast: {
          lat: 46.10197747989272,
          lng: 19.66965252989272,
        },
        southwest: {
          lat: 46.09927782010728,
          lng: 19.66695287010728,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
    name: "Wine community bar",
    opening_hours: {
      open_now: true,
    },
    photos: [
      {
        height: 3024,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/114071720517216422028">Andrey Myshkin</a>',
        ],
        photo_reference:
          "ATplDJa25Kk7q2L3gfkL3jbc0k-8Qg6Nsx3sPLtB34_fagKr-W3JkVTusjwwdwRt3-JqiZTZZgFd-p5yEwYMM1hpqYaqI-TMO-N5PlIjJKvLE1kiQp7Lx3xK4qwcL4TwRSyVudAtFw_VPDjJbR-TZIlcrdYTX_j03sSTFC5_9QExRIuHYuDa",
        width: 4032,
      },
    ],
    place_id: "ChIJy9i41jlnQ0cRnh_nl0KB77M",
    plus_code: {
      compound_code: "4M29+66 Subotica",
      global_code: "8FRX4M29+66",
    },
    rating: 4.8,
    reference: "ChIJy9i41jlnQ0cRnh_nl0KB77M",
    types: ["bar", "point_of_interest", "establishment"],
    user_ratings_total: 36,
  },
  {
    business_status: "OPERATIONAL",
    formatted_address: "Matije Korvina 2, Subotica 24000, Serbia",
    geometry: {
      location: {
        lat: 46.1010974,
        lng: 19.6684839,
      },
      viewport: {
        northeast: {
          lat: 46.10244397989273,
          lng: 19.66981977989272,
        },
        southwest: {
          lat: 46.09974432010728,
          lng: 19.66712012010728,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
    name: "Klein House Social Bar and Art Gallery",
    opening_hours: {
      open_now: true,
    },
    photos: [
      {
        height: 1620,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/116833701240623886440">A Google User</a>',
        ],
        photo_reference:
          "ATplDJaYPATA60zYnIo3wzhV4Q6emWn0koe-8C9rd_FM_fTUNYeHkLbMhbYcj40x-i6Kk5Zhjfyf4opfr_9jr5KWqWDe4x7j_tLwrKcmBN192Oxgq3fxf6bo6gO67i2KBiREjVElsSd9WF81EjzrwTZhDpW0jsfTRxO33Riro2hGYBJJNGyt",
        width: 1080,
      },
    ],
    place_id: "ChIJY1eFWM5mQ0cRMdNVQ-It_kc",
    plus_code: {
      compound_code: "4M29+C9 Subotica",
      global_code: "8FRX4M29+C9",
    },
    price_level: 1,
    rating: 4.7,
    reference: "ChIJY1eFWM5mQ0cRMdNVQ-It_kc",
    types: [
      "cafe",
      "bar",
      "liquor_store",
      "food",
      "point_of_interest",
      "store",
      "establishment",
    ],
    user_ratings_total: 193,
  },
  {
    business_status: "OPERATIONAL",
    formatted_address: "Petra Drapšina 11, Subotica 24000, Serbia",
    geometry: {
      location: {
        lat: 46.098381,
        lng: 19.662872,
      },
      viewport: {
        northeast: {
          lat: 46.09972752989272,
          lng: 19.66426667989272,
        },
        southwest: {
          lat: 46.09702787010727,
          lng: 19.66156702010728,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
    icon_background_color: "#7B9EB0",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
    name: "Manarola Bar",
    opening_hours: {
      open_now: false,
    },
    photos: [
      {
        height: 4032,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/110242256939312946245">A Google User</a>',
        ],
        photo_reference:
          "ATplDJafWUd74jO70rYTNTZ2Xq-Mq7QNd7J5ll7-ldJB2CLTkUe60iEQJksIXxsHfnDYUnmkTQET94oAC6f8qXmHpaRWjT-lboU4MZiDw8O7unKNH_ISqlUZiaRsgwNaVOka1kGJ2yIi-kSc6rhbpDUZgjIXpKNyKRFZ45q51Rkd8eE4DEzE",
        width: 3024,
      },
    ],
    place_id: "ChIJR21w-ngRW0cRkJCM847uY78",
    plus_code: {
      compound_code: "3MX7+94 Subotica",
      global_code: "8FRX3MX7+94",
    },
    rating: 4.3,
    reference: "ChIJR21w-ngRW0cRkJCM847uY78",
    types: ["point_of_interest", "establishment"],
    user_ratings_total: 6,
  },
  {
    business_status: "CLOSED_TEMPORARILY",
    formatted_address: "Kireška 49, Subotica 24000, Serbia",
    geometry: {
      location: {
        lat: 46.1094296,
        lng: 19.6783793,
      },
      viewport: {
        northeast: {
          lat: 46.11070322989272,
          lng: 19.67982612989272,
        },
        southwest: {
          lat: 46.10800357010728,
          lng: 19.67712647010728,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
    name: "Trozubac Caffe bar",
    permanently_closed: true,
    place_id: "ChIJN9NoYDVnQ0cRZDbo6EkMNTw",
    plus_code: {
      compound_code: "4M5H+Q9 Subotica",
      global_code: "8FRX4M5H+Q9",
    },
    rating: 0,
    reference: "ChIJN9NoYDVnQ0cRZDbo6EkMNTw",
    types: ["bar", "point_of_interest", "establishment"],
    user_ratings_total: 0,
  },
  {
    business_status: "OPERATIONAL",
    formatted_address: "Šumska 13, Subotica 24000, Serbia",
    geometry: {
      location: {
        lat: 46.1088268,
        lng: 19.6585594,
      },
      viewport: {
        northeast: {
          lat: 46.10996722989272,
          lng: 19.66010417989272,
        },
        southwest: {
          lat: 46.10726757010728,
          lng: 19.65740452010727,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
    name: "Caffe Bar Sidro",
    opening_hours: {
      open_now: true,
    },
    photos: [
      {
        height: 3024,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/104627340586902003420">Aleksandar Poljvas</a>',
        ],
        photo_reference:
          "ATplDJZVcKyztQbtcy7iGzUCatHGLDnXL-KeTci2cxfZR3EYzJy81bF70ADeIfp1UsrFkTriQeaZsI9FhaQU3rFvUqbEMPnC51CXwiKYxCS1B2-20NQl_AlsP1xG5i4foYRWQr2LibOeIVgO_rl2CZepDiNS-W__Qr3Ndnty43dLd9kilGG7",
        width: 4032,
      },
    ],
    place_id: "ChIJCYwxQ79mQ0cRaDyc2YF_xiI",
    plus_code: {
      compound_code: "4M55+GC Subotica",
      global_code: "8FRX4M55+GC",
    },
    rating: 4.5,
    reference: "ChIJCYwxQ79mQ0cRaDyc2YF_xiI",
    types: ["bar", "point_of_interest", "establishment"],
    user_ratings_total: 47,
  },
  {
    business_status: "OPERATIONAL",
    formatted_address: "Trg republike 6, Subotica 24000, Serbia",
    geometry: {
      location: {
        lat: 46.1005498,
        lng: 19.6643606,
      },
      viewport: {
        northeast: {
          lat: 46.10198112989272,
          lng: 19.66537592989272,
        },
        southwest: {
          lat: 46.09928147010727,
          lng: 19.66267627010728,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
    name: "The Code",
    opening_hours: {
      open_now: true,
    },
    photos: [
      {
        height: 4000,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/110965294261140618919">Danijela Petkovic</a>',
        ],
        photo_reference:
          "ATplDJa2z0RfgRYyS01U8fOg3ynpE62KgKuHeyh1h9VIjLSUx5KOIWqyZ621bjVf4CXuenZZaeDS_UaWp8xEZ8iDfLPOP8K049CKG7jlsRCjUKahKajg8M31tZOpwCZlAhidutH6g9Dq4OTlk4TQ1kMt4AiYNma2LaKKdUXww9aSJloibnHg",
        width: 3000,
      },
    ],
    place_id: "ChIJbbJXMc9mQ0cR2qaEIYdjNyA",
    plus_code: {
      compound_code: "4M27+6P Subotica",
      global_code: "8FRX4M27+6P",
    },
    price_level: 2,
    rating: 4.2,
    reference: "ChIJbbJXMc9mQ0cR2qaEIYdjNyA",
    types: ["night_club", "point_of_interest", "establishment"],
    user_ratings_total: 161,
  },
  {
    business_status: "OPERATIONAL",
    formatted_address: "Matije Korvina 4, Subotica 24000, Serbia",
    geometry: {
      location: {
        lat: 46.1012946,
        lng: 19.6684057,
      },
      viewport: {
        northeast: {
          lat: 46.10263757989272,
          lng: 19.66972597989272,
        },
        southwest: {
          lat: 46.09993792010727,
          lng: 19.66702632010728,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
    name: "Beer & Caffe Bar",
    opening_hours: {
      open_now: true,
    },
    photos: [
      {
        height: 1848,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/118036645906412635076">A Google User</a>',
        ],
        photo_reference:
          "ATplDJZw0hbQ6b8jY301DSrIEbIDGRb9NyrUskXyoCUnscN7rbzczzycton5QqiXdhFESySjXVgInXYQh2AR2IdL_pXadREW43tF2xYckfXdGoPY2ZzM1oMQ4Lzh9YxJUD4CVcWilYeqCTLl8CtMXiXF91DzMPNhFQ4TY4Ptiu0dL39sniLl",
        width: 2768,
      },
    ],
    place_id: "ChIJw1dsVMhmQ0cRoCNyhSOPuBU",
    plus_code: {
      compound_code: "4M29+G9 Subotica",
      global_code: "8FRX4M29+G9",
    },
    price_level: 2,
    rating: 4.8,
    reference: "ChIJw1dsVMhmQ0cRoCNyhSOPuBU",
    types: ["bar", "point_of_interest", "establishment"],
    user_ratings_total: 408,
  },
  {
    business_status: "OPERATIONAL",
    formatted_address: "Subotica 454123, Serbia",
    geometry: {
      location: {
        lat: 46.0878818,
        lng: 19.6452708,
      },
      viewport: {
        northeast: {
          lat: 46.08935732989272,
          lng: 19.64679927989272,
        },
        southwest: {
          lat: 46.08665767010728,
          lng: 19.64409962010728,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
    name: "Bikers bar ''Kod Vukoja''",
    opening_hours: {
      open_now: true,
    },
    photos: [
      {
        height: 3456,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/101043773289501448335">Jasna Franciskovic</a>',
        ],
        photo_reference:
          "ATplDJa1o4JTNDsTqBfNU7-3R-2mrnS-IZCeW2ET6TWFlDdXV11Uf3o6Ut1Gem6BtSk7lYPvVDt0sOlHY2-upD5Dtx6J8Awdy9HN1Fq78NIGRfA45Arl2lZTK-ta6060V5U1Z2q49DIVTkT32BrMnrSAboNEfqNqvvmPBuje6FQQUhb-mLuO",
        width: 4608,
      },
    ],
    place_id: "ChIJpxv0yyBnQ0cR2njiXO-iVSc",
    plus_code: {
      compound_code: "3JQW+54 Subotica",
      global_code: "8FRX3JQW+54",
    },
    rating: 4.6,
    reference: "ChIJpxv0yyBnQ0cR2njiXO-iVSc",
    types: ["bar", "point_of_interest", "establishment"],
    user_ratings_total: 87,
  },
  {
    business_status: "OPERATIONAL",
    formatted_address: "Zorkina, Subotica 451751, Serbia",
    geometry: {
      location: {
        lat: 46.1185509,
        lng: 19.6356622,
      },
      viewport: {
        northeast: {
          lat: 46.11984187989272,
          lng: 19.63704997989272,
        },
        southwest: {
          lat: 46.11714222010728,
          lng: 19.63435032010728,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
    name: "Caffe Bar Max",
    place_id: "ChIJ_cAl1bdnQ0cRvuWmznzUSuA",
    plus_code: {
      compound_code: "4J9P+C7 Subotica",
      global_code: "8FRX4J9P+C7",
    },
    rating: 4.4,
    reference: "ChIJ_cAl1bdnQ0cRvuWmznzUSuA",
    types: ["bar", "point_of_interest", "establishment"],
    user_ratings_total: 12,
  },
  {
    business_status: "OPERATIONAL",
    formatted_address: "Vase Stajića 15, Subotica 24000, Serbia",
    geometry: {
      location: {
        lat: 46.1033576,
        lng: 19.6690874,
      },
      viewport: {
        northeast: {
          lat: 46.10461952989272,
          lng: 19.67048147989272,
        },
        southwest: {
          lat: 46.10191987010727,
          lng: 19.66778182010728,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
    name: "Good Alibi doo",
    opening_hours: {
      open_now: true,
    },
    photos: [
      {
        height: 2606,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/111293847309572457245">A Google User</a>',
        ],
        photo_reference:
          "ATplDJZXtLQfRQPzqVF-o0BsUayGifU3Fg1wAY_HSg68qanA_LYBHFa1HXsQ0fOCAqhGUb46J7dSHGo0UKmHqVWf5mb3qlXYjEjj47fLTBeygMV5RZU7Cd1Ri52-xuricDbW7u-rXzRK1kzB6n9x-xZS0HhP2MqcCPyHBEJeaoKgBt_ns_Jh",
        width: 2606,
      },
    ],
    place_id: "ChIJ3aWwPmxnQ0cRxMq-qfj1OhQ",
    plus_code: {
      compound_code: "4M39+8J Subotica",
      global_code: "8FRX4M39+8J",
    },
    rating: 0,
    reference: "ChIJ3aWwPmxnQ0cRxMq-qfj1OhQ",
    types: ["bar", "point_of_interest", "establishment"],
    user_ratings_total: 0,
  },
  {
    business_status: "OPERATIONAL",
    formatted_address: "Age Mamužića 2, Subotica 24000, Serbia",
    geometry: {
      location: {
        lat: 46.0988455,
        lng: 19.665136,
      },
      viewport: {
        northeast: {
          lat: 46.10017437989272,
          lng: 19.66644367989272,
        },
        southwest: {
          lat: 46.09747472010727,
          lng: 19.66374402010728,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/cafe-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/cafe_pinlet",
    name: "DOT CONCEPT BAR",
    opening_hours: {
      open_now: false,
    },
    photos: [
      {
        height: 4032,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/104528453420391384171">A Google User</a>',
        ],
        photo_reference:
          "ATplDJbogLbwOcvcCa4QmSO-RtaR5cWRKgKl4vwAw9v1wVot61xa2Kx_0x5CxWxZ7SNYItwBM-bELBfi1cpQUus8Xzz-hbLe6Dsggav9El_uWgHG3gWk0abgo0bWdLfbkbJV9QvFhG-Z7I-N8mfsnAKwXAUCgRTFJS4YSFRir9v8FkJy5V0a",
        width: 3024,
      },
    ],
    place_id: "ChIJWcms-s5mQ0cRhDKnT5oqwFU",
    plus_code: {
      compound_code: "3MX8+G3 Subotica",
      global_code: "8FRX3MX8+G3",
    },
    price_level: 1,
    rating: 4.8,
    reference: "ChIJWcms-s5mQ0cRhDKnT5oqwFU",
    types: ["cafe", "bar", "food", "point_of_interest", "establishment"],
    user_ratings_total: 169,
  },
  {
    business_status: "OPERATIONAL",
    formatted_address: "Korzo 7A, Subotica 24000, Serbia",
    geometry: {
      location: {
        lat: 46.1006278,
        lng: 19.6674418,
      },
      viewport: {
        northeast: {
          lat: 46.10183047989273,
          lng: 19.66847852989272,
        },
        southwest: {
          lat: 46.09913082010728,
          lng: 19.66577887010727,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/cafe-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/cafe_pinlet",
    name: "KAFA BAR",
    opening_hours: {
      open_now: true,
    },
    photos: [
      {
        height: 4032,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/104192008501436536872">Steve Davis</a>',
        ],
        photo_reference:
          "ATplDJaD9nOtvhTV0qyHrsaJ9ehi86_T1l9XpNx5woZvLNLErc7Wsaz12KS371vFly_208CMO465Bc91NKbgywX_7ANzN2T9lu-9pXgN4Xrasfk1Uf88JBbRzURrwF4FHx8-kjt4SNAMGgHT5Py8NlUwy7h8SipZBUOiFSuokK5bvkuJi1TS",
        width: 2268,
      },
    ],
    place_id: "ChIJYcesgnFnQ0cRDOdqhjcnjU0",
    plus_code: {
      compound_code: "4M28+7X Subotica",
      global_code: "8FRX4M28+7X",
    },
    price_level: 2,
    rating: 4.6,
    reference: "ChIJYcesgnFnQ0cRDOdqhjcnjU0",
    types: ["cafe", "food", "point_of_interest", "establishment"],
    user_ratings_total: 141,
  },
  {
    business_status: "OPERATIONAL",
    formatted_address: "Prvomajska, Subotica 24111, Serbia",
    geometry: {
      location: {
        lat: 46.0898925,
        lng: 19.6720575,
      },
      viewport: {
        northeast: {
          lat: 46.09124232989272,
          lng: 19.67340732989272,
        },
        southwest: {
          lat: 46.08854267010727,
          lng: 19.67070767010728,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
    name: '"Čupko" Kokičar Subotica',
    opening_hours: {
      open_now: true,
    },
    photos: [
      {
        height: 4000,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/103601147353406955352">Dejan Stipic</a>',
        ],
        photo_reference:
          "ATplDJaNQyqIA0QotuKD-vkZu6bsLBH8pjm3a71OWjevMmbTD7Q-INhM-tC-20b2HlwEKAG7hg1EIxIYTCjTBCpkFTLWITkDceSqcEll7nLjivgj3nuINfgOrl2uUNJY4y1NrpWu2ioH3JmloHqaJJl96l-d1fVmrkrUqzvozbSUkujpgOSn",
        width: 2252,
      },
    ],
    place_id: "ChIJ5bEfMFZhQ0cRtlsCqw1dUN4",
    plus_code: {
      compound_code: "3MQC+XR Subotica",
      global_code: "8FRX3MQC+XR",
    },
    rating: 1.3,
    reference: "ChIJ5bEfMFZhQ0cRtlsCqw1dUN4",
    types: ["bar", "point_of_interest", "establishment"],
    user_ratings_total: 3,
  },
  {
    business_status: "OPERATIONAL",
    formatted_address: "Vase Stajića 14, Subotica 24000, Serbia",
    geometry: {
      location: {
        lat: 46.103083,
        lng: 19.6688967,
      },
      viewport: {
        northeast: {
          lat: 46.10443097989271,
          lng: 19.67024747989272,
        },
        southwest: {
          lat: 46.10173132010727,
          lng: 19.66754782010728,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/cafe-71.png",
    icon_background_color: "#FF9E67",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/cafe_pinlet",
    name: "Caffe Bar Bongo",
    opening_hours: {
      open_now: true,
    },
    place_id: "ChIJx_QiqslmQ0cR_O_cOZnWlYk",
    plus_code: {
      compound_code: "4M39+6H Subotica",
      global_code: "8FRX4M39+6H",
    },
    rating: 4.8,
    reference: "ChIJx_QiqslmQ0cR_O_cOZnWlYk",
    types: ["cafe", "food", "point_of_interest", "establishment"],
    user_ratings_total: 8,
  },
];

const Map = () => {
  const mapRef = useRef<MapRef | null>(null);
  const [viewport, setViewport] = useLocalStorage<ViewState>("viewport", {
    latitude: 46.09167269144208,
    longitude: 19.66244234405549,
    zoom: 10,
    bearing: 0,
    pitch: 30,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  });
  const [token, setToken] = useState("");
  const [mapBounds, setMapBounds] = useState<LngLatBounds | null>(null);
  const [id, setId] = useState<string>("");

  const onMove = useCallback(
    (e: ViewStateChangeEvent) => {
      setViewport(e.viewState);
    },
    [setViewport],
  );

  const onDragEnd = useCallback(() => {
    if (mapRef.current) {
      setMapBounds(mapRef.current.getMap().getBounds());
    }
  }, [mapRef]);

  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
      const { token } = await res.json();
      return token;
    };

    fetchToken().then(setToken);
  }, []);

  useEffect(() => {
    onDragEnd();
  }, [onDragEnd, viewport]);

  if (!token) return;

  return (
    <div className="text-black relative">
      <ReactMapGl
        ref={mapRef}
        style={{ width: "100%", height: "calc(100vh - 64px)", cursor: "grab" }}
        {...viewport}
        mapboxAccessToken={token}
        mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
        onMove={onMove}
        onDragEnd={async () => {
          const { _sw, _ne } = mapBounds as LngLatBounds;
          const { lat: lat1, lng: lng1 } = _sw;
          const { lat: lat2, lng: lng2 } = _ne;
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/venues?bounds=${lat1},${lng1}|${lat2},${lng2}`,
          );

          const data = await res.json();
          console.log({ data });
          // const res = await fetch(
          //   `https://maps.googleapis.com/maps/api/place/textsearch/json?query=bar|night_club&key=${process.env.GOOGLE_PLACES_API_KEY}&bounds=${lat1},${lng1}|${lat2},${lng2}`,
          // );
          // const data = await res.json();
          // console.log(data);
        }}
      >
        {data.map((d) => (
          <div key={d.place_id} className="z-10">
            <Marker
              latitude={d.geometry.location.lat}
              longitude={d.geometry.location.lng}
            >
              <div
                className="w-10 h-10 hover:cursor-pointer hover:bg-red-500 bg-white"
                style={{ maskImage: `url(${Pin.src})`, maskMode: "alpha" }}
                onClick={() => setId(d.place_id)}
              ></div>
            </Marker>
          </div>
        ))}
      </ReactMapGl>
      <Sidebar setId={setId} id={id} />
    </div>
  );
};

export default Map;
