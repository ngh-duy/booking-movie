import { CheckIcon } from '@heroicons/react/24/outline'
import { memo, useState } from 'react'

const Seat = ({ seat, setSelectedSeats, selectable, isAvailable }) => {
	const [isSelected, setIsSelected] = useState(false)
	return !isAvailable ? (
		<button
			title={`${seat.row}${seat.number}`}
			className="flex h-10 w-10 cursor-not-allowed items-center justify-center"
		>
			<div className="h-8 w-8 transform rounded-lg bg-gray-500 shadow-md transition-all duration-300 hover:scale-110"></div>
		</button>
	) : isSelected ? (
		<button
			title={`${seat.row}${seat.number}`}
			className="flex h-10 w-10 items-center justify-center"
			onClick={() => {
				setIsSelected(false)
				setSelectedSeats((prev) => prev.filter((e) => e !== `${seat.row}${seat.number}`))
			}}
		>
			<div className="flex h-8 w-8 transform items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95">
				<CheckIcon className="h-5 w-5 stroke-[3] text-white" />
			</div>
		</button>
	) : (
		<button
			title={`${seat.row}${seat.number}`}
			className={`flex h-10 w-10 items-center justify-center ${!selectable && 'cursor-not-allowed'}`}
			onClick={() => {
				if (selectable) {
					setIsSelected(true)
					setSelectedSeats((prev) => [...prev, `${seat.row}${seat.number}`])
				}
			}}
		>
			<div className="h-8 w-8 transform rounded-lg bg-white shadow-md transition-all duration-300 hover:scale-110 hover:bg-gray-50 active:scale-95"></div>
		</button>
	)
}

export default memo(Seat)
