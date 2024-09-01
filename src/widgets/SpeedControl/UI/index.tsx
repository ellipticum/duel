import React from 'react'
import styles from './styles.module.css'

interface SpeedControlProps {
    heroName: string
    speed: number
    fireRate: number
    autoFireInterval: number
    onSpeedChange: (speed: number) => void
    onFireRateChange: (rate: number) => void
    onAutoFireIntervalChange: (interval: number) => void
}

const SpeedControl: React.FC<SpeedControlProps> = ({
    heroName,
    speed,
    fireRate,
    autoFireInterval,
    onSpeedChange,
    onFireRateChange,
    onAutoFireIntervalChange
}) => {
    return (
        <div className={styles.controlWrapper}>
            <h3>{heroName} Controls</h3>
            <div className={styles.control}>
                <label>Speed: {speed}</label>
                <input
                    type='range'
                    min='1'
                    max='20'
                    value={speed}
                    onChange={(e) => onSpeedChange(Number(e.target.value))}
                />
            </div>
            {/*<div className={styles.control}>*/}
            {/*    <label>Fire Rate: {fireRate}</label>*/}
            {/*    <input*/}
            {/*        type='range'*/}
            {/*        min='1'*/}
            {/*        max='20'*/}
            {/*        value={fireRate}*/}
            {/*        onChange={(e) => onFireRateChange(Number(e.target.value))}*/}
            {/*    />*/}
            {/*</div>*/}
            <div className={styles.control}>
                <label>Auto Fire Interval (ms): {autoFireInterval}</label>
                <input
                    type='range'
                    min='100'
                    max='5000'
                    step='100'
                    value={autoFireInterval}
                    onChange={(e) => onAutoFireIntervalChange(Number(e.target.value))}
                />
            </div>
        </div>
    )
}

export default SpeedControl
