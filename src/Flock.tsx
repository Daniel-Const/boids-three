/**
 * Flock - A group of boids
 *
 * A Flock is a group of Boids
 */

import { useEffect, useRef, useState } from "react";
import { Boid, type BoidObject } from "./Boid";
import { type TuneableParams } from "./Params";

const MAX_POSITION = 4;
const MAX_VELOCITY = 4;

// Custom hook for generating random boids
const useRandomBoids = (totalBoids: number) => {
  const [boids, setBoids] = useState<BoidObject[]>([]);
  const boidRefs: any = useRef([]);

  useEffect(() => {
    const randomBoids: BoidObject[] = [];
    for (let i = 0; i < totalBoids; i++) {
      randomBoids.push({
        position: {
          x: Math.random() * MAX_POSITION,
          y: Math.random() * 5,
          z: 1,
        },
        velocity: {
          x: Math.random() * MAX_VELOCITY,
          y: Math.random() * 1,
          z: 0,
        },
      });
      boidRefs.current[i] = null;
    }

    setBoids(randomBoids);
  }, [totalBoids]);

  return { boids, boidRefs };
};

export const Flock = ({ params }: { params: TuneableParams }) => {
  const { boids, boidRefs } = useRandomBoids(params.TOTAL_BOIDS);
  return boids.map(({ position, velocity }: BoidObject, index: number) => (
    <Boid
      key={index}
      startPosition={position}
      startVelocity={velocity}
      index={index}
      refs={boidRefs}
      group={Number((index + 1) % 2 == 0)}
      params={params}
    />
  ));
};
