/**
 * Tuneable Params
 *
 * Hyperparameters for controlling the Boid behavior
 * UI for controlling these params
 */

import {
  Box,
  Checkbox,
  Collapsible,
  Slider,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { ParamSlider } from "./Slider";

export interface TuneableParams {
  // Behavior
  TURN_FACTOR: number;
  VISIBLE_RANGE: number;
  PROTECTED_RANGE: number;
  CENTERING_FACTOR: number;
  AVOID_FACTOR: number;
  MATCHING_FACTOR: number;
  BIAS_VAL: number;

  // Speed
  MAX_SPEED: number;
  MIN_SPEED: number;

  // Boundary
  LEFT_MARGIN: number;
  RIGHT_MARGIN: number;
  TOP_MARGIN: number;
  BOTTOM_MARGIN: number;
  FAR_MARGIN: number;
  CLOSE_MARGIN: number;

  TOTAL_BOIDS: number;

  SHOW_BOUNDARY: boolean;
}

const default_params = {
  TURN_FACTOR: 0.1,
  VISIBLE_RANGE: 0.5,
  PROTECTED_RANGE: 0.5,
  CENTERING_FACTOR: 0.01,
  AVOID_FACTOR: 0.08,
  MATCHING_FACTOR: 0.05,
  BIAS_VAL: 0.002,

  MAX_SPEED: 5,
  MIN_SPEED: 2,

  LEFT_MARGIN: -2.5,
  RIGHT_MARGIN: 2.5,
  TOP_MARGIN: 2,
  BOTTOM_MARGIN: -2,
  FAR_MARGIN: 2.5,
  CLOSE_MARGIN: -2.5,

  TOTAL_BOIDS: 500,

  SHOW_BOUNDARY: false,
};

export const useTuneableParams = () => {
  const [params, setParams] = useState<TuneableParams>(default_params);
  return {
    params,
    setParams,
  };
};

export const ParamInputs = ({
  params,
  onChange,
}: {
  params: TuneableParams;
  onChange: (params: Partial<TuneableParams>) => void;
}) => {
  return (
    <Box
      style={{
        position: "absolute",
        right: "0",
        zIndex: 9000,
        paddingTop: "1em",
        paddingRight: "1em",
      }}
    >
      <Collapsible.Root unmountOnExit>
        <Stack gap="4">
          <Collapsible.Trigger width="200px" style={{ color: "white" }}>
            Settings
          </Collapsible.Trigger>
          <Collapsible.Content>
            <ParamSlider
              value={params.TOTAL_BOIDS}
              label={"Total Boids"}
              min={1}
              max={1500}
              step={1}
              onChange={(value: number) =>
                onChange({ ...params, TOTAL_BOIDS: value })
              }
            />
            <ParamSlider
              value={params.VISIBLE_RANGE}
              label={"Visible Range"}
              min={0.1}
              max={1}
              step={0.1}
              onChange={(value: number) =>
                onChange({ ...params, VISIBLE_RANGE: value })
              }
            />
            <ParamSlider
              value={params.PROTECTED_RANGE}
              label={"Protected Range"}
              min={0.1}
              max={1}
              step={0.1}
              onChange={(value: number) =>
                onChange({ ...params, PROTECTED_RANGE: value })
              }
            />
            <ParamSlider
              value={params.CENTERING_FACTOR}
              label={"Centering Factor"}
              min={0.01}
              max={1}
              step={0.01}
              onChange={(value: number) =>
                onChange({ ...params, CENTERING_FACTOR: value })
              }
            />
            <ParamSlider
              value={params.AVOID_FACTOR}
              label={"Avoid Factor"}
              min={0.01}
              max={1}
              step={0.01}
              onChange={(value: number) =>
                onChange({ ...params, AVOID_FACTOR: value })
              }
            />
            <ParamSlider
              value={params.MATCHING_FACTOR}
              label={"Matching Factor"}
              min={0.01}
              max={1}
              step={0.01}
              onChange={(value: number) =>
                onChange({ ...params, MATCHING_FACTOR: value })
              }
            />
            <Checkbox.Root
              style={{ paddingTop: "1em" }}
              onChange={(e) => {
                onChange({ ...params, SHOW_BOUNDARY: !params.SHOW_BOUNDARY });
              }}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label style={{ color: "white" }}>
                Show Boundary
              </Checkbox.Label>
            </Checkbox.Root>
          </Collapsible.Content>
        </Stack>
      </Collapsible.Root>
    </Box>
  );
};
