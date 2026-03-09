const redirectToRequestedPage = (blogName) => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            decideNavigation(blogName);
          } else {
            localStorage.setItem("navigatedFrom", blogName);
            window.location.href = "/auth.html";
          }
      });
}

const decideNavigation = (blogName) => {
    if (blogName === "why-youtubers-should-not-buy-youtube-subscribers" || blogName === "video-content-marketing" || blogName === "top-youtube-vloggers-usa" || blogName === "increase-subscribers-organically" || blogName === "how-to-rank-youtube-videos" || blogName === "how-to-improve-youtube-videos-organic-reach" || blogName === "how-to-get-more-youtube-subscribers" || blogName === "grow-fashion-youtube-channel") {
       window.location.href = "/youtube-consulting-services/youtube-video-seo-service.html";     
    } else if (blogName === "youtube-channel-monetization-requirements" || blogName === "how-travel-youtubers-make-money") {
    window.location.href = "/youtube-consulting-services/youtube-monetization-service.html";  
    } else if (blogName === "youtube-stats" ) {
    window.location.href = "/youtube-consulting-sessions/youtube-video-seo-session.html";  
    } else if (blogName === "youtube-channel-monetization-requirements" || blogName === "how-tech-youtubers-make-money" || blogName === "how-comedy-youtubers-can-make-money" || blogName === "how-beauty-youtubers-make-money" || blogName === "grow-lifestyle-youtube-channel") {
        window.location.href = "/youtube-consulting-services/youtube-monetization-service.html";
    } else if (blogName === "top-prank-youtubers-usa") {
        window.location.href = "/youtube-consulting-sessions/youtube-video-editing-session.html";   
    } else if (blogName === "top-lifestyle-youtubers-usa" || blogName === "top-fitness-youtubers-usa" || blogName === "top-beauty-youtube-channels-usa" || blogName === "how-can-investment-youtubers-make-money" || blogName === "grow-travel-youtube-channel" || blogName === "grow-tech-youtube-channel" || blogName === "grow-food-youtube-channel" || blogName === "grow-beauty-youtube-channel" || blogName === "10-tips-grow-automobile-youtube-channel") {
        window.location.href = "/youtube-consulting-services/youtube-video-editing-service.html";   
    } else if (blogName === "how-youtubers-can-grow-youtube-channel" || blogName === "how-to-get-more-youtube-views" || blogName === "how-to-build-youtube-audience") {
        window.location.href = "/youtube-consulting-services/youtube-video-editing-service.html";   
    } else if (blogName === "how-prank-youtubers-can-make-money" || blogName === "how-can-investment-youtubers-make-money" || blogName === "how-comedy-youtubers-can-make-money" || blogName === "how-auto-youtubers-can-make-money") {
        window.location.href = "/youtube-consulting-sessions/youtube-monetization-session.html";    
    }    
};

const getOffer = () => {
        window.location.href = "/";
  }