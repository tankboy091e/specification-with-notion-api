import { GoPlus } from 'react-icons/go'
import buttonStyles from 'sass/widgets/add-button.module.scss'

export default function AddButton({
  size = 48,
  onClick,
} : {
  size?: number
  onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick}>
      <GoPlus size={size} className={buttonStyles.addButton} />
    </button>
  )
}
