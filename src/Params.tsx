/**
 * Tuneable Params
 *
 * Hyperparameters for controlling the Boid behavior
 * UI for controlling these params
 */

import { Box, Slider, Stack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

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
  const [localParams, setLocalParams] = useState<TuneableParams>(params);
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
      <Stack gap="4">
        <VStack align="flex-start">
          <Text style={{ color: "white" }}>
            Total Boids: {localParams.TOTAL_BOIDS}
          </Text>
          <Slider.Root
            width="200px"
            colorPalette={"teal"}
            min={1}
            max={1000}
            direction={"rtl"}
            value={[localParams.TOTAL_BOIDS]}
            flexDirection={"row"}
            onValueChange={(e) =>
              setLocalParams({ ...localParams, TOTAL_BOIDS: e.value[0] })
            }
            onValueChangeEnd={(e) => onChange({ TOTAL_BOIDS: e.value[0] })}
          >
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.Root>
        </VStack>
      </Stack>
    </Box>
  );
};
