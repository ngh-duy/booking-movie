import { ArrowsRightLeftIcon, ArrowsUpDownIcon, UserIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import Loading from './Loading'
import Showtimes from './Showtimes'

const TheaterShort = ({ theaterId, movies, selectedDate, filterMovie, rounded = false }) => {
	const { auth } = useContext(AuthContext)
	const [theater, setTheater] = useState({})
	const [isFetchingTheaterDone, setIsFetchingTheaterDone] = useState(false)

	const fetchTheater = async (data) => {
		try {
			setIsFetchingTheaterDone(false)
			let response
			if (auth.role === 'admin') {
				response = await axios.get(`/theater/unreleased/${theaterId}`, {
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				})
			} else {
				response = await axios.get(`/theater/${theaterId}`)
			}
			// console.log(response.data.data)
			setTheater(response.data.data)
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingTheaterDone(true)
		}
	}

	useEffect(() => {
		fetchTheater()
	}, [theaterId])

	function rowToNumber(column) {
		let result = 0
		for (let i = 0; i < column.length; i++) {
			const charCode = column.charCodeAt(i) - 64 // Convert character to ASCII and adjust to 1-based index
			result = result * 26 + charCode
		}
		return result
	}

	if (!isFetchingTheaterDone) {
		return <Loading />
	}

	return (
		<div
			className={`flex flex-col bg-gradient-to-br from-purple-100 to-white shadow-md transition-all duration-300 hover:shadow-lg sm:flex-row sm:rounded-tr-none ${
				rounded && 'rounded-b-xl'
			}`}
		>
			<div className="flex flex-col sm:flex-row">
				<div
					className={`flex min-w-[140px] flex-row items-center justify-center gap-x-3 bg-gradient-to-br from-purple-900 to-pink-800 px-6 py-2 text-2xl font-bold text-white shadow-md sm:flex-col ${
						rounded && 'sm:rounded-bl-xl'
					}`}
				>
					<p className="text-sm tracking-wide">Rạp chiếu</p>
					<p className="text-3xl leading-8 tracking-tight">{theater.number}</p>
				</div>
				{auth.role === 'admin' && (
					<div
						className={`flex w-full min-w-[180px] flex-row justify-center gap-x-6 border-b-2 border-purple-200 bg-gradient-to-br from-purple-100 to-white px-6 py-2 text-sm font-bold sm:w-fit sm:flex-col sm:border-none`}
					>
						<div className="flex items-center gap-3">
							<ArrowsUpDownIcon className="h-6 w-6 text-purple-600" />
							{theater?.seatPlan?.row === 'A' ? (
								<h4 className="text-gray-800">Hàng : A</h4>
							) : (
								<h4 className="text-gray-800">Hàng : A - {theater?.seatPlan?.row}</h4>
							)}
						</div>
						<div className="flex items-center gap-3">
							<ArrowsRightLeftIcon className="h-6 w-6 text-purple-600" />
							{theater?.seatPlan?.column === 1 ? (
								<h4 className="text-gray-800">Cột : 1</h4>
							) : (
								<h4 className="text-gray-800">Cột : 1 - {theater?.seatPlan?.column}</h4>
							)}
						</div>
						<div className="flex items-center gap-3">
							<UserIcon className="h-6 w-6 text-purple-600" />
							<h4 className="text-gray-800">
								{(rowToNumber(theater.seatPlan.row) * theater.seatPlan.column).toLocaleString('en-US')}{' '}
								Ghế
							</h4>
						</div>
					</div>
				)}
			</div>
			<div className="mx-6 flex items-center">
				<Showtimes
					showtimes={theater.showtimes}
					movies={movies}
					selectedDate={selectedDate}
					filterMovie={filterMovie}
					showMovieDetail={false}
				/>
			</div>
		</div>
	)
}
export default TheaterShort
