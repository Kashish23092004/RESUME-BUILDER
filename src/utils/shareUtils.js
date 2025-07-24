// shareUtils.js

export const shareTextOnWhatsApp = (text) => {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};

export const shareTextOnFacebook = (text) => {
  const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};

export const shareTextOnTwitter = (text) => {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};

export const nativeWebShare = async (text) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Resume Enhancement",
        text,
      });
    } catch (error) {
      console.error("Sharing failed:", error);
      alert("Sharing was cancelled or failed.");
    }
  } else {
    alert("Web Share API not supported in this browser.");
  }
};
