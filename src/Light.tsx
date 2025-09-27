import { useHelper, type SpotLightProps } from "@react-three/drei";
import { useRef } from "react";
import { SpotLightHelper } from "three";

export const CustomSpotLight = (
  props: SpotLightProps & { helper: boolean },
) => {
  const ref: any = useRef(null);
  if (props.helper) {
    useHelper(ref, SpotLightHelper, "red");
  }
  return <spotLight ref={ref} {...props} />;
};
