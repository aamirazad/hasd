import { pocketbaseLoader } from "astro-loader-pocketbase";
import { defineCollection } from "astro:content";
import {
  POCKETBASE_SUPER_EMAIL,
  POCKETBASE__SUPER_PASSWORD,
} from "astro:env/server";

const pages = defineCollection({
  loader: pocketbaseLoader({
    url: "https://db.aamira.me",
    collectionName: "h_pages",
    updatedField: "updated",
    superuserCredentials: {
      email: POCKETBASE_SUPER_EMAIL,
      password: POCKETBASE__SUPER_PASSWORD,
    },
  }),
});

export const collections = { pages };
