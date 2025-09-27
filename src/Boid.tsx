import { useFrame } from "@react-three/fiber";
import { useMemo, useState } from "react";
import type { Mesh, Vector3 } from "three";
import type { TuneableParams } from "./Params";

type Vec3 = { x: number; y: number; z: number };

interface BoidParams {
  startPosition: Vec3;
  startVelocity: Vec3;
  refs: any; // RefObject<Mesh>[];
  index: number; // Index of this boid in the refs array
  group: number; // flock group: 0 or 1
  params: TuneableParams;
}

export interface BoidObject {
  position: Vec3;
  velocity: Vec3;
}

export const Boid = ({
  startPosition,
  startVelocity,
  refs,
  index,
  group,
  params,
}: BoidParams) => {
  const [uuid, setUuid] = useState("");

  const size = 0.09;

  const {
    TURN_FACTOR,
    VISIBLE_RANGE,
    PROTECTED_RANGE,
    CENTERING_FACTOR,
    AVOID_FACTOR,
    MATCHING_FACTOR,
    BIAS_VAL,
    MAX_SPEED,
    MIN_SPEED,
    LEFT_MARGIN,
    RIGHT_MARGIN,
    TOP_MARGIN,
    BOTTOM_MARGIN,
  } = params;

  const ref = useMemo(() => {
    if (refs.current?.[index]) {
      refs.current[index].velocity = startVelocity;
    }
    return refs.current?.[index];
  }, [uuid]);

  const avoidBoundary = () => {
    if (ref.position.x < LEFT_MARGIN) {
      ref.velocity.x = ref.velocity.x + TURN_FACTOR;
    }

    if (ref.position.x > RIGHT_MARGIN) {
      ref.velocity.x = ref.velocity.x - TURN_FACTOR;
    }

    if (ref.position.y < BOTTOM_MARGIN) {
      ref.velocity.y = ref.velocity.y + TURN_FACTOR;
    }

    if (ref.position.y > TOP_MARGIN) {
      ref.velocity.y = ref.velocity.y - TURN_FACTOR;
    }
  };

  const get_distance = (boid: Mesh, otherBoid: Mesh) => {
    return Math.sqrt(
      Math.abs(boid.position.x - otherBoid.position.x) +
        Math.abs(boid.position.y - otherBoid.position.y),
    );
  };

  // Loop through all boids and update velocity accoring to positions
  const behavior = () => {
    let close_dx = 0;
    let close_dy = 0;

    let xvel_avg = 0;
    let yvel_avg = 0;

    let xpos_avg = 0;
    let ypos_avg = 0;

    let neighboring_boids = 0;

    // Iterate all except this boid
    for (const boid of refs.current) {
      const distance = get_distance(ref, boid);
      if (distance < VISIBLE_RANGE) {
        xvel_avg += boid.velocity.x;
        yvel_avg += boid.velocity.y;

        xpos_avg += boid.position.x;
        ypos_avg += boid.position.y;

        neighboring_boids += 1;
      }

      if (distance < PROTECTED_RANGE) {
        close_dx += ref.position.x - boid.position.x;
        close_dy += ref.position.y - boid.position.y;
      }
    }

    // Separation
    ref.velocity.x += close_dx * AVOID_FACTOR;
    ref.velocity.y += close_dy * AVOID_FACTOR;

    if (neighboring_boids > 0) {
      // Alignment
      xvel_avg = xvel_avg / neighboring_boids;
      yvel_avg = yvel_avg / neighboring_boids;
      ref.velocity.x += (xvel_avg - ref.velocity.x) * MATCHING_FACTOR;
      ref.velocity.y += (yvel_avg - ref.velocity.y) * MATCHING_FACTOR;

      // Cohesion
      xpos_avg = xpos_avg / neighboring_boids;
      ypos_avg = ypos_avg / neighboring_boids;
      ref.velocity.x += (xpos_avg - ref.position.x) * CENTERING_FACTOR;
      ref.velocity.y += (ypos_avg - ref.position.y) * CENTERING_FACTOR;
    }

    // Bias
    if (group === 0) {
      ref.velocity.x = (1 - BIAS_VAL) * ref.velocity.x + BIAS_VAL * 1;
    } else {
      ref.velocity.x = (1 - BIAS_VAL) * ref.velocity.x + BIAS_VAL * -1;
    }

    // Speed cap
    const speed = Math.sqrt(
      ref.velocity.x * ref.velocity.x + ref.velocity.y * ref.velocity.y,
    );
    if (speed > MAX_SPEED) {
      ref.velocity.x = (ref.velocity.x / speed) * MAX_SPEED;
      ref.velocity.y = (ref.velocity.y / speed) * MAX_SPEED;
    }
    if (speed < MIN_SPEED) {
      ref.velocity.x = (ref.velocity.x / speed) * MIN_SPEED;
      ref.velocity.y = (ref.velocity.y / speed) * MIN_SPEED;
    }
  };

  useFrame((_, delta) => {
    if (!ref) {
      return;
    }

    // Update velocities
    behavior();
    avoidBoundary();

    // Update position
    ref.position.x += ref.velocity.x * delta;
    ref.position.y += ref.velocity.y * delta;
  });

  return (
    <mesh
      position={[startPosition.x, startPosition.y, startPosition.z]}
      scale={1}
      ref={(r) => {
        refs.current[index] = r;
        setUuid(r?.uuid as string);
      }}
    >
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={"hotpink"} />
    </mesh>
  );
};
