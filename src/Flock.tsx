/**
 * Flock - A group of boids
 * 
 * A Flock is a group of Boids
 */

import { useEffect, useRef, useState } from "react"
import { Boid, type BoidObject } from "./Boid"
import { useTuneableParams } from "./Params"

const TOTAL_BOIDS = 500
const MAX_POSITION = 5
const MAX_VELOCITY = 4

/**
 * Custom hook for generating random boids
 */
const useRandomBoids = () => {
    const [boids, setBoids] = useState<BoidObject[]>([])
    const boidRefs: any = useRef([])

    useEffect(() => {
        const randomBoids: BoidObject[] = []
        for (let i = 0; i < TOTAL_BOIDS; i++) {
            randomBoids.push({
                position: { x: Math.random() * MAX_POSITION, y: Math.random() * 5, z: 1 },
                velocity: { x: Math.random() * MAX_VELOCITY, y: Math.random() * 1, z: 0 },
            })
            boidRefs.current[i] = null
        }

        setBoids(randomBoids)
    }, [])

    return { boids, boidRefs }
}

export const Flock = () => {
    const { boids, boidRefs } = useRandomBoids()
    const { params } = useTuneableParams()

    return (
        boids.map(
            ({ position, velocity }: BoidObject, index: number) => (
                <Boid
                    key={index}
                    startPosition={position}
                    startVelocity={velocity}
                    index={index}
                    refs={boidRefs}
                    group={Number((index + 1) % 2 == 0)}
                    params={params}
                />
            )
        )
    )
}