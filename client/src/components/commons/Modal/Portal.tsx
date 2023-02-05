import { FC, ReactNode, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  children: ReactNode;
  wrapperId?: string;
}
function createWrapperAndAppendToBody(wrapperId: string) {
  const wrapperElement = document.createElement("div");
  wrapperElement.setAttribute("id", wrapperId);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
}
const Portal: FC<Props> = ({
  children,
  wrapperId = "react-portal-wrapper",
}) => {
  const [wrapperElement, setWrapperElement] = useState(null);

  useLayoutEffect(() => {
    let element: any = document.getElementById(wrapperId);
    let systemCreated = false;

    if (!element) {
      systemCreated = true;
      element = createWrapperAndAppendToBody(wrapperId);
    }
    setWrapperElement(element);

    return () => {
      if (systemCreated && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  if (wrapperElement === null) return null;

  return createPortal(children, wrapperElement);
};

export default Portal;
