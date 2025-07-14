import { computePosition, flip, shift, offset, arrow } from "@floating-ui/dom";

class TooltipManager {
  private tooltips = new Map();
  private activeTooltip = null;

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.setupTooltips();
    });
  }

  setupTooltips() {
    const triggers = document.querySelectorAll("[data-tooltip-content]");

    triggers.forEach((trigger) => {
      const content = trigger.getAttribute("data-tooltip-content");
      const placement = trigger.getAttribute("data-tooltip-placement") || "top";
      const triggerType =
        trigger.getAttribute("data-tooltip-trigger") || "hover";
      const delay = parseInt(
        trigger.getAttribute("data-tooltip-delay") || "100",
      );

      if (!content) return;

      const tooltip = this.createTooltip(content, placement);
      this.tooltips.set(trigger, { tooltip, placement, delay });

      this.attachEvents(trigger, tooltip, triggerType, delay);
    });
  }

  createTooltip(content, placement) {
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.setAttribute("data-placement", placement);
    tooltip.innerHTML = `
      <div class="tooltip-content">${content}</div>
      <div class="tooltip-arrow"></div>
    `;
    document.body.appendChild(tooltip);
    return tooltip;
  }

  attachEvents(trigger, tooltip, triggerType, delay) {
    let showTimeout;
    let hideTimeout;

    const showTooltip = () => {
      clearTimeout(hideTimeout);
      showTimeout = setTimeout(() => {
        this.show(trigger, tooltip);
      }, delay);
    };

    const hideTooltip = () => {
      clearTimeout(showTimeout);
      hideTimeout = setTimeout(() => {
        this.hide(tooltip);
      }, 100);
    };

    if (triggerType === "hover") {
      trigger.addEventListener("mouseenter", showTooltip);
      trigger.addEventListener("mouseleave", hideTooltip);
      tooltip.addEventListener("mouseenter", () => clearTimeout(hideTimeout));
      tooltip.addEventListener("mouseleave", hideTooltip);
    } else if (triggerType === "click") {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        if (this.activeTooltip === tooltip) {
          this.hide(tooltip);
        } else {
          this.hideAll();
          this.show(trigger, tooltip);
        }
      });
    } else if (triggerType === "focus") {
      trigger.addEventListener("focus", showTooltip);
      trigger.addEventListener("blur", hideTooltip);
    }
  }

  async show(trigger, tooltip) {
    this.hideAll();
    this.activeTooltip = tooltip;

    const arrowElement = tooltip.querySelector(".tooltip-arrow");
    const placement = tooltip.getAttribute("data-placement");

    const {
      x,
      y,
      placement: finalPlacement,
      middlewareData,
    } = await computePosition(trigger, tooltip, {
      placement: placement,
      middleware: [
        offset(8),
        flip(),
        shift({ padding: 8 }),
        arrow({ element: arrowElement }),
      ],
    });

    // Position tooltip
    Object.assign(tooltip.style, {
      left: `${x}px`,
      top: `${y}px`,
    });

    // Position arrow
    if (middlewareData.arrow) {
      const { x: arrowX, y: arrowY } = middlewareData.arrow;

      Object.assign(arrowElement.style, {
        left: arrowX != null ? `${arrowX}px` : "",
        top: arrowY != null ? `${arrowY}px` : "",
      });
    }

    tooltip.setAttribute("data-placement", finalPlacement);
    tooltip.classList.add("show");
  }

  hide(tooltip) {
    if (tooltip) {
      tooltip.classList.remove("show");
      if (this.activeTooltip === tooltip) {
        this.activeTooltip = null;
      }
    }
  }

  hideAll() {
    this.tooltips.forEach(({ tooltip }) => {
      this.hide(tooltip);
    });
  }

  // Clean up method for SPA navigation
  destroy() {
    this.hideAll();
    this.tooltips.forEach(({ tooltip }) => {
      tooltip.remove();
    });
    this.tooltips.clear();
  }
}

// Global instance
const tooltipManager = new TooltipManager();

// Auto-initialize
tooltipManager.init();

// Handle Astro page transitions
document.addEventListener("astro:page-load", () => {
  tooltipManager.destroy();
  tooltipManager.setupTooltips();
});

// Handle clicks outside to close click-triggered tooltips
document.addEventListener("click", (e) => {
  const isTooltipTrigger = e.target.closest('[data-tooltip-trigger="click"]');
  const isTooltip = e.target.closest(".tooltip");

  if (!isTooltipTrigger && !isTooltip) {
    tooltipManager.hideAll();
  }
});

export default tooltipManager;
