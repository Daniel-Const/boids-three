import { useState } from "react";
import { Slider, Text, VStack } from "@chakra-ui/react";

export const ParamSlider = ({
  value,
  label,
  min,
  max,
  step,
  onChange,
}: {
  value: number;
  label: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) => {
  const [localValue, setLocalValue] = useState<number>(value);

  return (
    <VStack align="flex-start">
      <Text style={{ color: "white" }}>
        {label}: {localValue}
      </Text>
      <Slider.Root
        width="200px"
        colorPalette={"teal"}
        min={min}
        max={max}
        step={step}
        direction={"rtl"}
        value={[localValue]}
        flexDirection={"row"}
        onValueChange={(e) => setLocalValue(e.value[0])}
        onValueChangeEnd={(e) => onChange(e.value[0])}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.Root>
    </VStack>
  );
};
