import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "tippy.js/themes/light-border.css";
import "tippy.js/themes/material.css";
import "tippy.js/themes/translucent.css";

class TippyManager {
  private instances: any[] = [];

  init() {
    if (typeof window !== "undefined") {
      document.addEventListener("DOMContentLoaded", () => {
        this.setupTooltips();
      });
    }
  }

  setupTooltips() {
    const triggers = document.querySelectorAll("[data-tippy-config]");

    triggers.forEach((trigger) => {
      try {
        const configStr = trigger.getAttribute("data-tippy-config");
        if (!configStr) return;

        const config = JSON.parse(configStr);

        const instance = tippy(trigger as Element, {
          content: config.content,
          placement: config.placement,
          trigger: config.trigger,
          theme: config.theme,
          animation: config.animation,
          arrow: config.arrow,
          interactive: config.interactive,
          delay: config.delay,
          allowHTML: true,
          zIndex: 9999,
          appendTo: () => document.body,
        });

        this.instances.push(instance);
      } catch (error) {
        console.warn("Failed to initialize tooltip:", error);
      }
    });
  }

  destroy() {
    this.instances.forEach((instance) => {
      if (instance && instance.destroy) {
        instance.destroy();
      }
    });
    this.instances = [];
  }

  refresh() {
    this.destroy();
    this.setupTooltips();
  }
}

// Global instance
const tippyManager = new TippyManager();

// Auto-initialize
if (typeof window !== "undefined") {
  tippyManager.init();

  // Handle Astro page transitions
  document.addEventListener("astro:page-load", () => {
    tippyManager.refresh();
  });

  // Re-initialize after any dynamic content changes
  document.addEventListener("astro:after-swap", () => {
    tippyManager.refresh();
  });
}

export default tippyManager;
