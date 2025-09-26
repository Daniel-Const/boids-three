import { useFrame } from "@react-three/fiber";
import { useMemo, useState } from "react";
import type { BufferGeometry, BufferGeometryEventMap, Material, Mesh, NormalBufferAttributes, Object3DEventMap } from "three";
import type { TuneableParams } from "./Params";

interface Vec3 {
    x: number;
    y: number;
    z: number;
}

export interface BoidObject {
    position: Vec3;
    velocity: Vec3;
}

interface BoidParams {
    refs: { current: BoidObject[] };
    index: number; // Index of this boid in the refs array
    group: number; // flock group: 0 or 1
    params: TuneableParams
    startPosition: Vec3;
    startVelocity: Vec3;
}

const BOID_SIZE = 0.09

export const Boid = ({ refs, index, group, params, startPosition, startVelocity }: BoidParams) => {
    const [uuid, setUuid] = useState("")
    const {
        LEFT_MARGIN,
        RIGHT_MARGIN,
        TOP_MARGIN,
        BOTTOM_MARGIN,
        TURN_FACTOR,
        VISIBLE_RANGE,
        PROTECTED_RANGE,
        CENTERING_FACTOR,
        AVOID_FACTOR,
        MATCHING_FACTOR,
        BIAS_VAL,
        MAX_SPEED,
        MIN_SPEED,
    } = params

    /**
     * Memo for accessing this boid from the list of boid refs
     * When the UUID changes it means it has been attached to the threejs mesh reference
     */
    const boidRef = useMemo<BoidObject>(() => {
        // Use a default BoidObject when the ref has not been attached
        return refs.current?.[index]
    }, [uuid])

    // Get the distance between two boids
    const get_distance = (boid: BoidObject, otherBoid: BoidObject) => {
        return Math.sqrt(Math.abs(boid.position.x - otherBoid.position.x) + Math.abs(boid.position.y - otherBoid.position.y))
    }

    // Turn around if outside the boundary
    const avoidBoundary = () => {
        if (boidRef.position.x < LEFT_MARGIN) {
            boidRef.velocity.x = boidRef.velocity.x + TURN_FACTOR
        } else if (boidRef.position.x > RIGHT_MARGIN) {
            boidRef.velocity.x = boidRef.velocity.x - TURN_FACTOR
        }
        if (boidRef.position.y < TOP_MARGIN) {
            boidRef.velocity.y = boidRef.velocity.y + TURN_FACTOR
        } else if (boidRef.position.y > BOTTOM_MARGIN) {
            boidRef.velocity.y = boidRef.velocity.y - TURN_FACTOR
        }
    }

    /**
     * Boid Behavior
     * 
     * Loop through all other boids and update velocities according to the following signals:
     * - Separation
     * - Alignment
     * - Cohesion
     * - Bias
     */
    const behavior = () => {
        let close_dx = 0
        let close_dy = 0

        let xvel_avg = 0
        let yvel_avg = 0

        let xpos_avg = 0
        let ypos_avg = 0

        let neighboring_boids = 0

        // Iterate all except this boid
        for (const boid of refs.current) {
            const distance = get_distance(boidRef, boid)
            if (distance < VISIBLE_RANGE) {
                xvel_avg += boid.velocity.x
                yvel_avg += boid.velocity.y

                xpos_avg += boid.position.x
                ypos_avg += boid.position.y

                neighboring_boids += 1
            }

            if (distance < PROTECTED_RANGE) {
                close_dx += boidRef.position.x - boid.position.x
                close_dy += boidRef.position.y - boid.position.y
            }
        }

        // Separation
        boidRef.velocity.x += close_dx * AVOID_FACTOR
        boidRef.velocity.y += close_dy * AVOID_FACTOR

        if (neighboring_boids > 0) {
            // Alignment
            xvel_avg = xvel_avg / neighboring_boids
            yvel_avg = yvel_avg / neighboring_boids
            boidRef.velocity.x += (xvel_avg - boidRef.velocity.x) * MATCHING_FACTOR
            boidRef.velocity.y += (yvel_avg - boidRef.velocity.y) * MATCHING_FACTOR

            // Cohesion
            xpos_avg = xpos_avg / neighboring_boids
            ypos_avg = ypos_avg / neighboring_boids
            boidRef.velocity.x += (xpos_avg - boidRef.position.x) * CENTERING_FACTOR
            boidRef.velocity.y += (ypos_avg - boidRef.position.y) * CENTERING_FACTOR
        }

        // Bias
        if (group === 0) {
            boidRef.velocity.x = (1 - BIAS_VAL) * boidRef.velocity.x + (BIAS_VAL * 1)
        } else {
            boidRef.velocity.x = (1 - BIAS_VAL) * boidRef.velocity.x + (BIAS_VAL * -1)
        }

        // Speed cap
        const speed = Math.sqrt(boidRef.velocity.x * boidRef.velocity.x + boidRef.velocity.y * boidRef.velocity.y)
        if (speed > MAX_SPEED) {
            boidRef.velocity.x = (boidRef.velocity.x / speed) * MAX_SPEED
            boidRef.velocity.y = (boidRef.velocity.y / speed) * MAX_SPEED
        }
        if (speed < MIN_SPEED) {
            boidRef.velocity.x = (boidRef.velocity.x / speed) * MIN_SPEED
            boidRef.velocity.y = (boidRef.velocity.y / speed) * MIN_SPEED
        }
    }

    useFrame((_, delta) => {
        if (!boidRef) {
            return
        }

        // Update velocities
        behavior()
        avoidBoundary()

        // Update position
        boidRef.position.x += boidRef.velocity.x * delta
        boidRef.position.y += boidRef.velocity.y * delta
    })

    return (
        <mesh
            position={[startPosition.x, startPosition.y, startPosition.z]}
            scale={1}
            ref={(r) => {
                refs.current[index] = { ...r, velocity: startVelocity } as BoidObject
                setUuid(r?.uuid as string)
            }}
        >
            <boxGeometry args={[BOID_SIZE, BOID_SIZE, BOID_SIZE]} />
            <meshStandardMaterial color={'hotpink'} />
        </mesh>
    )
}