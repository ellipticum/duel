import { RiMoonFill, RiSunFill } from '@remixicon/react'
import { Mode, useMode } from '@/app/providers/ModeProvider'

const ModeToggleButton = () => {
    const { mode, toggleMode } = useMode()

    return (
        <button onClick={toggleMode}>
            {mode === Mode.Light ? <RiMoonFill size='24px' /> : <RiSunFill size='24px' />}
        </button>
    )
}

export default ModeToggleButton
