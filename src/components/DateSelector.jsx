import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext'

const DateSelector = ({ selectedDate, setSelectedDate }) => {
	const { auth } = useContext(AuthContext)
	const wrapperRef = useRef(null)
	const [isEditing, SetIsEditing] = useState(false)

	const handlePrevDay = () => {
		const prevDay = new Date(selectedDate)
		prevDay.setDate(prevDay.getDate() - 1)
		setSelectedDate(prevDay)
		sessionStorage.setItem('selectedDate', prevDay)
	}

	const handleNextDay = () => {
		const nextDay = new Date(selectedDate)
		nextDay.setDate(nextDay.getDate() + 1)
		setSelectedDate(nextDay)
		sessionStorage.setItem('selectedDate', nextDay)
	}

	const handleToday = () => {
		const today = new Date()
		setSelectedDate(today)
		sessionStorage.setItem('selectedDate', today)
	}

	const formatDate = (date) => {
		const weekday = date.toLocaleString('default', { weekday: 'long' })
		const day = date.getDate()
		const month = date.toLocaleString('default', { month: 'long' })
		const year = date.getFullYear()
		return `${weekday} ${day} ${month} ${year}`
	}

	const DateShort = ({ date, selectedDate }) => {
		const day = date.getDate()
		const weekday = date.toLocaleString('default', { weekday: 'short' })

		const isThisDate =
			selectedDate.getDate() === date.getDate() &&
			selectedDate.getMonth() === date.getMonth() &&
			selectedDate.getFullYear() === date.getFullYear()

		const isToday = new Date(date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)

		return (
			<button
				title={formatDate(date)}
				className={`flex min-w-[52px] transform flex-col items-center justify-center rounded-xl p-2 font-semibold shadow-md transition-all duration-300 hover:scale-105 active:scale-95 ${
					isThisDate
						? 'bg-gradient-to-br from-purple-800 to-pink-700 text-white shadow-lg'
						: isToday
						? 'bg-gradient-to-br from-purple-100 to-white ring-2 ring-inset ring-purple-800 hover:from-white hover:to-white'
						: isPast(date)
						? 'bg-gradient-to-br from-gray-600 to-gray-500 text-white hover:from-gray-500 hover:to-gray-400'
						: 'bg-gradient-to-br from-purple-100 to-white hover:from-white hover:to-white'
				}`}
				onClick={() => {
					setSelectedDate(date)
					sessionStorage.setItem('selectedDate', date)
				}}
			>
				<p className="text-sm font-medium">{weekday}</p>
				<p className="text-xl font-bold">{day}</p>
			</button>
		)
	}

	const isPast = (date) => {
		return new Date(date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
	}

	const handleChange = (event) => {
		setSelectedDate(new Date(event.target.value))
	}

	function generateDateRange(startDate, endDate) {
		const dates = []
		const currentDate = new Date(startDate)

		while (currentDate <= endDate) {
			dates.push(new Date(currentDate.getTime()))
			currentDate.setDate(currentDate.getDate() + 1)
		}

		return dates
	}

	function getPastAndNextDateRange() {
		const today = new Date()
		const pastDays = new Date(today)
		if (auth.role === 'admin') {
			pastDays.setDate(today.getDate() - 7)
		}

		const nextDays = new Date(today)
		nextDays.setDate(today.getDate() + 14)

		return generateDateRange(pastDays, nextDays)
	}

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, false)
		return () => {
			document.removeEventListener('click', handleClickOutside, false)
		}
	}, [])

	const handleClickOutside = (event) => {
		if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
			SetIsEditing(false)
		}
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="relative flex items-stretch justify-between gap-3 rounded-xl bg-gradient-to-br from-purple-800 to-pink-700 p-3 font-semibold text-white shadow-lg">
				{auth.role === 'admin' || !isPast(new Date().setDate(selectedDate.getDate() - 1)) ? (
					<button
						title="Quay lại ngày hôm trước"
						className="transform rounded-lg p-1 transition-all duration-300 hover:scale-110 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 active:scale-95"
						onClick={handlePrevDay}
					>
						<ChevronLeftIcon className="h-10 w-10 text-white" />
					</button>
				) : (
					<div className="h-10 w-10"></div>
				)}

				{isEditing ? (
					<div className="w-full" ref={wrapperRef}>
						<input
							title="Chọn ngày"
							type="Date"
							min={auth.role !== 'admin' && new Date().toLocaleDateString('en-CA')}
							required
							autoFocus
							className="w-full rounded-lg border border-white bg-gradient-to-br from-purple-800 to-pink-700 px-2 text-center text-2xl font-semibold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-200 sm:text-3xl"
							value={selectedDate.toLocaleDateString('en-CA')}
							onChange={handleChange}
							style={{ colorScheme: 'dark' }}
						/>
					</div>
				) : (
					<div
						className="flex w-full transform cursor-pointer items-center justify-center rounded-lg text-center text-xl transition-all duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 active:scale-95 sm:text-2xl"
						onClick={() => {
							SetIsEditing(true)
						}}
					>
						{formatDate(selectedDate)}
					</div>
				)}

				<div className="flex items-center justify-between gap-3">
					<button
						title="Đến ngày hôm sau"
						className="transform rounded-lg p-1 transition-all duration-300 hover:scale-110 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 active:scale-95"
						onClick={handleNextDay}
					>
						<ChevronRightIcon className="h-10 w-10 text-white" />
					</button>
					<button
						title="Quay lại hôm nay"
						className="transform rounded-lg p-1 transition-all duration-300 hover:scale-110 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 active:scale-95"
						onClick={handleToday}
					>
						<ArrowPathIcon className="h-10 w-10 text-white" />
					</button>
				</div>
			</div>
			<div className="flex gap-3 overflow-auto pb-2">
				{getPastAndNextDateRange().map((date, index) => (
					<DateShort key={index} date={date} selectedDate={selectedDate} />
				))}
			</div>
		</div>
	)
}

export default DateSelector
