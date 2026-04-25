import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.forbeslogistix.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/forbesLogo.jpeg`;

const Seo = ({ title, description, path = "/", image = DEFAULT_OG_IMAGE }) => {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title.includes("Forbes Logistix") ? title : `${title} | Forbes Logistix`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Forbes Logistix" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default Seo;
