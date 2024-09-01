import React from 'react'
import Canvas from '@/widgets/Canvas/UI'
import ModeProvider from '@/app/providers/ModeProvider'
import styles from '@/shared/styles/pages/Home.module.scss'

const Home = () => {
    return (
        <ModeProvider>
            <Canvas />
        </ModeProvider>
    )
}

export default Home
