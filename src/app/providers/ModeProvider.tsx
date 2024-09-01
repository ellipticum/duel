'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

export enum Mode {
    Dark = 'dark',
    Light = 'light'
}

interface IModeContext {
    mode: Mode
    toggleMode: () => void
}

const ModeContext = createContext<IModeContext | undefined>(undefined)

interface Props {
    children: ReactNode
}

export const useMode = () => {
    const context = useContext(ModeContext)

    if (!context) {
        throw new Error('useMode must be used within a ModeProvider')
    }

    return context
}

const ModeProvider = ({ children }: Props) => {
    const [mode, setMode] = useState<Mode>(Mode.Light)

    const saveMode = (mode: Mode) => {
        document.documentElement.setAttribute('data-mode', mode)
        document.cookie = `mode=${mode}; path=/; max-age: 31536000`
    }

    useEffect(() => {
        const savedMode = document.cookie.replace(
            /(?:(?:^|.*;\s*)mode\s*=\s*([^;]*).*$)|^.*$/,
            '$1'
        ) as Mode

        if (savedMode) {
            setMode(savedMode)
        }
    }, [])

    const toggleMode = () => {
        const newMode = mode === Mode.Light ? Mode.Dark : Mode.Light

        setMode(newMode)
        saveMode(newMode)
    }

    return <ModeContext.Provider value={{ mode, toggleMode }}>{children}</ModeContext.Provider>
}

export default ModeProvider
