import { ArrowsRightLeftIcon, ArrowsUpDownIcon, EyeSlashIcon, UserIcon } from '@heroicons/react/24/outline'
import { useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDraggable } from 'react-use-draggable-scroll'
import { AuthContext } from '../context/AuthContext'

const ScheduleTable = ({ cinema, selectedDate }) => {
	const ref = useRef(null)
	const { auth } = useContext(AuthContext)
	const { events } = useDraggable(ref)
	const navigate = useNavigate()

	const getRowStart = (showtime) => {
		showtime = new Date(showtime)
		const hour = showtime.getHours()
		const min = showtime.getMinutes()
		return Math.round((60 * hour + min) / 5)
	}

	const getRowSpan = (length) => {
		return Math.round(length / 5)
	}

	const getRowStartRange = () => {
		let firstRowStart = 100000
		let lastRowEnd = 0
		let count = 0
		cinema.theaters.forEach((theater, index) => {
			theater.showtimes.forEach((showtime, index) => {
				if (
					new Date(showtime.showtime).getDate() === selectedDate.getDate() &&
					new Date(showtime.showtime).getMonth() === selectedDate.getMonth() &&
					new Date(showtime.showtime).getYear() === selectedDate.getYear()
				) {
					const rowStart = getRowStart(showtime.showtime)
					if (rowStart < firstRowStart) {
						firstRowStart = rowStart
					}
					if (rowStart + getRowSpan(showtime.movie.length) > lastRowEnd) {
						lastRowEnd = rowStart + getRowSpan(showtime.movie.length)
					}
					count++
				}
			})
		})
		return [firstRowStart, lastRowEnd, count]
	}

	const getTodayShowtimes = (theater) => {
		return theater.showtimes?.filter((showtime, index) => {
			return (
				new Date(showtime.showtime).getDate() === selectedDate.getDate() &&
				new Date(showtime.showtime).getMonth() === selectedDate.getMonth() &&
				new Date(showtime.showtime).getYear() === selectedDate.getYear()
			)
		})
	}

	function rowToNumber(column) {
		let result = 0
		for (let i = 0; i < column.length; i++) {
			const charCode = column.charCodeAt(i) - 64
			result = result * 26 + charCode
		}
		return result
	}

	const firstRowStart = getRowStartRange()[0]
	const gridRows = Math.max(1, getRowStartRange()[1] - getRowStartRange()[0])
	const showtimeCount = getRowStartRange()[2]
	const shiftStart = 3
	const shiftEnd = 2

	const isPast = (date) => {
		return date < new Date()
	}

	return (
		<>
			<div
				className={`grid min-h-[50vh] max-h-screen overflow-x-auto grid-cols-${cinema.theaters?.length.toString()} grid-rows-${
					gridRows + shiftEnd
				} rounded-2xl bg-gradient-to-br from-purple-100 to-pink-50 shadow-xl`}
				{...events}
				ref={ref}
			>
				{cinema.theaters?.map((theater, index) => {
					{
						return getTodayShowtimes(theater)?.map((showtime, index) => {
							return (
								<button
									title={`${showtime.movie.name}\n${new Date(showtime.showtime)
										.getHours()
										.toString()
										.padStart(2, '0')} : ${new Date(showtime.showtime)
										.getMinutes()
										.toString()
										.padStart(2, '0')} - ${new Date(
										new Date(showtime.showtime).getTime() + showtime.movie.length * 60000
									)
										.getHours()
										.toString()
										.padStart(2, '0')} : ${new Date(
										new Date(showtime.showtime).getTime() + showtime.movie.length * 60000
									)
										.getMinutes()
										.toString()
										.padStart(2, '0')}
												`}
									key={index}
									className={`flex transform flex-col items-center overflow-y-scroll row-span-${getRowSpan(
										showtime.movie.length
									)} row-start-${
										getRowStart(showtime.showtime) - firstRowStart + shiftStart
									} col-start-${theater.number} mx-2 my-1 rounded-xl p-2 text-center shadow-md transition-all duration-300 ${
										!isPast(new Date(showtime.showtime))
											? 'bg-white hover:scale-105 hover:bg-gray-50'
											: `bg-gray-200 ${
													auth.role === 'admin' ? 'hover:scale-105 hover:bg-gray-300' : 'cursor-not-allowed'
											  }`
									} ${!showtime.isRelease && 'ring-2 ring-inset ring-purple-800'}`}
									onClick={() => {
										if (!isPast(new Date(showtime.showtime)) || auth.role === 'admin')
											return navigate(`/showtime/${showtime._id}`)
									}}
								>
									{!showtime.isRelease && (
										<EyeSlashIcon
											className="mx-auto h-5 w-5 stroke-2 text-purple-800"
											title="Suất chiếu chưa phát hành"
										/>
									)}
									<p className="text-sm font-bold text-gray-800">{showtime.movie.name}</p>
									<p className="text-sm leading-3 text-gray-600">{`${new Date(showtime.showtime)
										.getHours()
										.toString()
										.padStart(2, '0')} : ${new Date(showtime.showtime)
										.getMinutes()
										.toString()
										.padStart(2, '0')} - ${new Date(
										new Date(showtime.showtime).getTime() + showtime.movie.length * 60000
									)
										.getHours()
										.toString()
										.padStart(2, '0')} : ${new Date(
										new Date(showtime.showtime).getTime() + showtime.movie.length * 60000
									)
										.getMinutes()
										.toString()
										.padStart(2, '0')}`}</p>
								</button>
							)
						})
					}
				})}

				{showtimeCount === 0 && (
					<div className="col-span-full row-start-3 flex items-center justify-center rounded-xl bg-white p-6 text-center text-xl font-semibold text-gray-600 shadow-lg">
						Không có suất chiếu nào
					</div>
				)}

				{cinema.theaters.map((theater, index) => (
					<div
						key={index}
						className="sticky top-0 row-span-1 row-start-1 flex flex-col items-center justify-center bg-gradient-to-br from-purple-800 to-pink-700 py-3 text-white shadow-lg"
					>
						<p className="text-2xl font-bold tracking-tight">{index + 1}</p>
						{auth.role === 'admin' && (
							<>
								<div className="mt-1 flex gap-2 text-xs">
									<p className="flex items-center gap-1">
										<ArrowsUpDownIcon className="h-3 w-3" />
										{theater.seatPlan.row === 'A'
											? theater.seatPlan.row
											: `A - ${theater.seatPlan.row}`}
									</p>
									<p className="flex items-center gap-1">
										<ArrowsRightLeftIcon className="h-3 w-3" />
										{theater.seatPlan.column === 1
											? theater.seatPlan.column
											: `1 - ${theater.seatPlan.column}`}
									</p>
								</div>
								<p className="mt-1 flex items-center gap-1 text-sm">
									<UserIcon className="h-4 w-4" />
									{(rowToNumber(theater.seatPlan.row) * theater.seatPlan.column).toLocaleString(
										'en-US'
									)}{' '}
									Ghế
								</p>
							</>
						)}
					</div>
				))}
			</div>
		</>
	)
}

export default ScheduleTable
