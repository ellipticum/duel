import { useEffect, useRef } from 'react'

type Hero = {
    x: number
    y: number
    radius: number
    color: string
    speed: number
    direction: 1 | -1
}

const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>(0)
    const hero1: Hero = { x: 50, y: 50, radius: 20, color: 'blue', speed: 2, direction: 1 }
    const hero2: Hero = { x: 750, y: 50, radius: 20, color: 'red', speed: 2, direction: 1 }

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

        const updateHeroPosition = (hero: Hero) => {
            hero.y += hero.speed * hero.direction
            if (hero.y - hero.radius <= 0 || hero.y + hero.radius >= canvas.height) {
                hero.direction *= -1
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            updateHeroPosition(hero1)
            updateHeroPosition(hero2)
            drawHero(hero1)
            drawHero(hero2)
            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            cancelAnimationFrame(animationRef.current)
        }
    }, [])

    return <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid black' }} />
}

export default Canvas
