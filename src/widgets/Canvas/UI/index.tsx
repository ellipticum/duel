'use client'

import { useEffect, useRef, useState } from 'react'
import Menu from '@/widgets/Menu/UI'
import styles from './styles.module.css'
import Button from '@/shared/UI/Button'
import ModeToggleButton from '@/features/Mode/UI/ModeToggleButton'
import SpeedControl from '@/widgets/SpeedControl/UI'

interface Hero {
    id: string
    x: number
    y: number
    health: number
    radius: number
    color: string
    speed: number
    fireRate: number
    directionX: 1 | -1
    directionY: 1 | -1
    autoFireInterval: number
}

interface Projectile {
    x: number
    y: number
    radius: number
    color: string
    speed: number
    direction: 1 | -1
    shooterId: string
}

const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>(0)
    const projectilesRef = useRef<Projectile[]>([])
    const autoFireIntervalsRef = useRef<{ [key: string]: NodeJS.Timeout }>({})
    const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
    const [heroes, setHeroes] = useState<Hero[]>([
        {
            id: 'hero1',
            x: 50,
            y: 50,
            health: 100,
            radius: 20,
            color: 'rgb(255, 0, 0)',
            speed: 1,
            fireRate: 10,
            directionX: 1,
            directionY: 1,
            autoFireInterval: 1000
        },
        {
            id: 'hero2',
            x: 750,
            y: 50,
            health: 100,
            radius: 20,
            color: 'rgb(20, 90, 255)',
            speed: 1,
            fireRate: 10,
            directionX: 1,
            directionY: 1,
            autoFireInterval: 1000
        }
    ])
    const [menuVisible, setMenuVisible] = useState(false)
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)
    const [selectedHero, setSelectedHero] = useState<Hero | null>(null)
    const [hitCounts, setHitCounts] = useState<{ [key: string]: number }>({
        hero1: 0,
        hero2: 0
    })

    const handleCanvasClick = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        const clickX = e.clientX - rect.left
        const clickY = e.clientY - rect.top

        const checkHeroClick = (hero: Hero) => {
            const dist = Math.hypot(hero.x - clickX, hero.y - clickY)
            return dist <= hero.radius
        }

        const clickedHero = heroes.find(checkHeroClick)

        if (clickedHero) {
            setSelectedHero(clickedHero)
            setMenuPosition({ x: e.clientX, y: e.clientY })
            setMenuVisible(true)
        } else {
            setMenuVisible(false)
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        setCursorPosition({ x: mouseX, y: mouseY })
    }

    const handleColorChange = (color: string) => {
        console.log(color)

        if (selectedHero) {
            setHeroes((prev) =>
                prev.map((hero) => (hero.id === selectedHero.id ? { ...hero, color } : hero))
            )
        }
    }

    const handleSpeedChange = (id: string, speed: number) => {
        setHeroes((prev) => prev.map((hero) => (hero.id === id ? { ...hero, speed } : hero)))
    }

    const handleFireRateChange = (id: string, fireRate: number) => {
        setHeroes((prev) => prev.map((hero) => (hero.id === id ? { ...hero, fireRate } : hero)))
    }

    const handleAutoFireIntervalChange = (id: string, interval: number) => {
        setHeroes((prev) =>
            prev.map((hero) => (hero.id === id ? { ...hero, autoFireInterval: interval } : hero))
        )
    }

    const handleFire = (shooter: Hero) => {
        const direction = shooter.x < canvasRef.current!.width / 2 ? 1 : -1
        projectilesRef.current.push({
            x: shooter.x,
            y: shooter.y,
            radius: 5,
            color: shooter.color,
            speed: shooter.fireRate,
            direction,
            shooterId: shooter.id
        })
    }

    const startAutoFire = (hero: Hero) => {
        if (autoFireIntervalsRef.current[hero.id]) {
            clearInterval(autoFireIntervalsRef.current[hero.id])
        }
        autoFireIntervalsRef.current[hero.id] = setInterval(() => {
            handleFire(hero)
        }, hero.autoFireInterval)
    }

    useEffect(() => {
        heroes.forEach((hero) => startAutoFire(hero))

        return () => {
            // Clear all intervals on cleanup
            Object.values(autoFireIntervalsRef.current).forEach(clearInterval)
        }
    }, [heroes])

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return

        const drawHero = (hero: Hero) => {
            ctx.beginPath()
            ctx.arc(hero.x, hero.y, hero.radius, 0, Math.PI * 2)
            ctx.fillStyle = hero.color
            ctx.fill()
            ctx.closePath()
        }

        const drawProjectile = (projectile: Projectile) => {
            ctx.beginPath()
            ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2)
            ctx.fillStyle = projectile.color
            ctx.fill()
            ctx.closePath()
        }

        const updateHeroPosition = (hero: Hero) => {
            const distToCursor = Math.hypot(hero.x - cursorPosition.x, hero.y - cursorPosition.y)
            if (distToCursor <= hero.radius + 10) {
                hero.directionX *= Math.random() < 0.5 ? 1 : -1
                hero.directionY *= Math.random() < 0.5 ? 1 : -1
            }

            hero.x += hero.speed * hero.directionX
            hero.y += hero.speed * hero.directionY

            if (hero.x - hero.radius <= 0 || hero.x + hero.radius >= canvas.width) {
                hero.directionX *= -1
            }
            if (hero.y - hero.radius <= 0 || hero.y + hero.radius >= canvas.height) {
                hero.directionY *= -1
            }
        }

        const updateProjectiles = () => {
            projectilesRef.current = projectilesRef.current
                .map((p) => {
                    const newX = p.x + p.speed * p.direction
                    if (newX - p.radius <= 0 || newX + p.radius >= canvas.width) {
                        return null
                    }
                    return {
                        ...p,
                        x: newX
                    }
                })
                .filter((p) => p !== null) as Projectile[]
        }

        const checkCollision = (projectile: Projectile, hero: Hero) => {
            if (projectile.shooterId === hero.id) {
                return false
            }

            const dist = Math.hypot(hero.x - projectile.x, hero.y - projectile.y)

            return dist <= projectile.radius + hero.radius
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            heroes.forEach(updateHeroPosition)

            heroes.forEach(drawHero)

            updateProjectiles()

            projectilesRef.current.forEach((projectile) => {
                drawProjectile(projectile)
                heroes.forEach((hero) => {
                    if (checkCollision(projectile, hero)) {
                        setHitCounts((prev) => ({
                            ...prev,
                            [hero.id]: prev[hero.id] + 1
                        }))
                    }
                })
            })

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            cancelAnimationFrame(animationRef.current)
        }
    }, [cursorPosition, heroes])

    return (
        <div className={styles.wrapper} onClick={handleCanvasClick} onMouseMove={handleMouseMove}>
            <div className={styles.top}>
                <div className={styles.counter}>
                    <div className={styles.counterContent}>
                        {heroes.map((hero) => (
                            <div key={hero.id} className={styles.hero}>
                                <div className={styles.heroName}>{hero.id}</div>
                                <div className={styles.heroCount}>{hitCounts[hero.id]}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <ModeToggleButton />
                </div>
            </div>
            <div className={styles.content}>
                <canvas className={styles.canvas} ref={canvasRef} width={800} height={600} />
                <div className={styles.buttons}>
                    {heroes.map((hero) => (
                        <Button key={hero.id} onClick={() => handleFire(hero)}>
                            Fire {hero.id}
                        </Button>
                    ))}
                </div>
            </div>

            <div className={styles.panel}>
                {heroes.map((hero) => (
                    <SpeedControl
                        key={hero.id}
                        heroName={hero.id}
                        speed={hero.speed}
                        fireRate={hero.fireRate}
                        autoFireInterval={hero.autoFireInterval}
                        onSpeedChange={(speed) => handleSpeedChange(hero.id, speed)}
                        onFireRateChange={(rate) => handleFireRateChange(hero.id, rate)}
                        onAutoFireIntervalChange={(interval) =>
                            handleAutoFireIntervalChange(hero.id, interval)
                        }
                    />
                ))}
            </div>

            {menuVisible && menuPosition && (
                <Menu
                    color={selectedHero?.color || 'white'}
                    onColorChange={handleColorChange}
                    style={{ top: menuPosition.y, left: menuPosition.x }}
                />
            )}
        </div>
    )
}

export default Canvas
