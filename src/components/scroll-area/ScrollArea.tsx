import { forwardRef } from "react";
import * as RadixScrollArea from "@radix-ui/react-scroll-area";
import { cn } from "../../utils/cn";
import type { ScrollAreaProps } from "./ScrollArea.types";

/**
 * HC1 ScrollArea — cross-browser scroll container with themed
 * scrollbars.
 *
 * Wraps @radix-ui/react-scroll-area which provides the viewport,
 * thumb, and corner primitives. Native browser scrollbars are hidden;
 * our themed track/thumb render on top so scrollbars look identical
 * on macOS, Windows, iOS, and Android.
 */

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { className, orientation = "vertical", scrollbars = "auto", children, ...rest },
  forwardedRef,
) {
  const showVertical   = orientation === "vertical"   || orientation === "both";
  const showHorizontal = orientation === "horizontal" || orientation === "both";

  return (
    <RadixScrollArea.Root
      ref={forwardedRef}
      data-slot="scroll-area"
      type={scrollbars}
      className={cn("relative overflow-hidden", className)}
      {...rest}
    >
      <RadixScrollArea.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          "size-full rounded-[inherit]",
          "focus-visible:outline focus-visible:outline-[2px]",
          "focus-visible:outline-[color:var(--hc-color-border-focus)] focus-visible:outline-offset-[-2px]",
        )}
      >
        {children}
      </RadixScrollArea.Viewport>

      {showVertical && <ScrollBar orientation="vertical" />}
      {showHorizontal && <ScrollBar orientation="horizontal" />}
      <RadixScrollArea.Corner
        className="bg-[color:var(--hc-color-bg-subtle)]"
      />
    </RadixScrollArea.Root>
  );
});
ScrollArea.displayName = "ScrollArea";

function ScrollBar({ orientation }: { orientation: "vertical" | "horizontal" }) {
  return (
    <RadixScrollArea.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none select-none p-[2px]",
        "transition-colors duration-150 ease-standard motion-reduce:duration-0",
        orientation === "vertical"
          ? "h-full w-[10px] border-l border-l-transparent"
          : "h-[10px] w-full flex-col border-t border-t-transparent",
      )}
    >
      <RadixScrollArea.Thumb
        data-slot="scroll-area-thumb"
        className={cn(
          "relative flex-1 rounded-full",
          "bg-[color:var(--hc-color-border-strong)]",
          "before:absolute before:left-1/2 before:top-1/2",
          "before:size-full before:min-h-[44px] before:min-w-[44px]",
          "before:-translate-x-1/2 before:-translate-y-1/2",
        )}
      />
    </RadixScrollArea.Scrollbar>
  );
}
