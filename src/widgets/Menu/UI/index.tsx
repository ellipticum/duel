import React, { FC, useState, useRef, useEffect } from 'react'
import styles from './styles.module.css'

interface MenuProps {
    color: string
    onColorChange: (color: string) => void
    style?: React.CSSProperties
    onClose?: () => void // Пропс для закрытия меню при клике вне его
}

const defaultColors = [
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
    '#000000',
    '#FFFFFF'
]

const CustomColorPicker: FC<MenuProps> = ({ color, onColorChange, style, onClose }) => {
    const [customColor, setCustomColor] = useState(color)
    const menuRef = useRef<HTMLDivElement>(null)

    const handleCustomColorChange = (newColor: string) => {
        setCustomColor(newColor)
        onColorChange(newColor)
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            if (onClose) {
                onClose()
            }
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div ref={menuRef} className={styles.customColorPicker} style={style}>
            <label className={styles.colorLabel}>
                <input
                    type='color'
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className={styles.colorInputPicker}
                    onClick={(e) => e.stopPropagation()}
                />
            </label>
            <div className={styles.colorPalette}>
                {defaultColors.map((defaultColor) => (
                    <div
                        key={defaultColor}
                        onClick={() => handleCustomColorChange(defaultColor)}
                        className={`${styles.colorBlock} ${customColor === defaultColor ? styles.selected : ''}`}
                        style={{ backgroundColor: defaultColor }}
                    />
                ))}
            </div>
        </div>
    )
}

export default CustomColorPicker
