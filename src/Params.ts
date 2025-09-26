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
    BOTTOM_MARGIN: -2
}

export const useTuneableParams = () => {
    const [params, setParams] = useState<TuneableParams>(default_params)
    return {
        params,
        setParams
    }
}