import styles from './styles.module.css'
import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react'

interface ButtonProps
    extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {}

const Button: FC<ButtonProps> = ({ className, children, ...props }) => {
    return (
        <button className={styles.button} {...props}>
            {children}
        </button>
    )
}

export default Button
