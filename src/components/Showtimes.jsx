import { EyeSlashIcon } from '@heroicons/react/24/outline'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Showtimes = ({ showtimes, movies, selectedDate, filterMovie, showMovieDetail = true }) => {
	const { auth } = useContext(AuthContext)

	const navigate = useNavigate()
	const sortedShowtimes = showtimes?.reduce((result, showtime) => {
		const { movie, showtime: showDateTime, seats, _id, isRelease } = showtime

		if (filterMovie && filterMovie._id !== movie) {
			return result // skip
		}

		if (
			new Date(showDateTime).getDate() === selectedDate.getDate() &&
			new Date(showDateTime).getMonth() === selectedDate.getMonth() &&
			new Date(showDateTime).getFullYear() === selectedDate.getFullYear()
		) {
			if (!result[movie]) {
				result[movie] = []
			}
			result[movie].push({ showtime: showDateTime, seats, _id, isRelease })
		}
		return result
	}, {})

	// Sort the showtimes array for each movie by showtime
	sortedShowtimes &&
		Object.values(sortedShowtimes).forEach((movie) => {
			movie.sort((a, b) => new Date(a.showtime) - new Date(b.showtime))
		})

	const isPast = (date) => {
		return date < new Date()
	}

	if (Object.keys(sortedShowtimes).length === 0) {
		return <p className="text-center text-lg font-medium text-gray-600">Không có suất chiếu nào</p>
	}
	return (
		<>
			{movies?.map((movie, index) => {
				return (
					sortedShowtimes &&
					sortedShowtimes[movie._id] && (
						<div key={index} className="flex items-center">
							{showMovieDetail && (
								<img
									src={movie.img}
									className="w-36 transform px-4 shadow-lg transition-all duration-300 hover:scale-105"
								/>
							)}
							<div className="mr-4 flex flex-col gap-3 pb-6 pt-3">
								{showMovieDetail && (
									<div>
										<h4 className="text-2xl font-semibold tracking-tight text-gray-800">
											{movie.name}
										</h4>
										<p className="text-md font-medium text-gray-600">
											Thời lượng: {movie.length || '-'} phút
										</p>
									</div>
								)}
								<div className="flex flex-wrap items-center gap-3 pt-2">
									{sortedShowtimes[movie._id]?.map((showtime, index) => {
										return (
											<button
												key={index}
												title={`${new Date(showtime.showtime)
													.getHours()
													.toString()
													.padStart(2, '0')} : ${new Date(showtime.showtime)
													.getMinutes()
													.toString()
													.padStart(2, '0')} - ${new Date(
													new Date(showtime.showtime).getTime() + movie.length * 60000
												)
													.getHours()
													.toString()
													.padStart(2, '0')} : ${new Date(
													new Date(showtime.showtime).getTime() + movie.length * 60000
												)
													.getMinutes()
													.toString()
													.padStart(2, '0')}
														`}
												className={
													isPast(new Date(showtime.showtime))
														? `flex transform items-center gap-2 rounded-xl bg-gradient-to-br from-gray-100 to-white px-4 py-2 text-lg font-medium text-gray-900 shadow-md transition-all duration-300 hover:scale-105 active:scale-95 ${
																auth.role !== 'admin' && 'cursor-not-allowed'
														  } ${
																auth.role === 'admin' &&
																'to-gray-100 hover:from-gray-200'
														  }`
														: new Date(showtime.showtime).getTime() ===
														  new Date(
																sortedShowtimes[movie._id].find(
																	(s) => new Date(s.showtime) > new Date()
																).showtime
														  ).getTime()
														? 'flex transform items-center gap-2 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 px-4 py-2 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-400 active:scale-95'
														: 'flex transform items-center gap-2 rounded-xl bg-gradient-to-br from-gray-600 to-gray-500 px-4 py-2 text-lg font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-gray-500 hover:to-gray-400 active:scale-95'
												}
												onClick={() => {
													if (!isPast(new Date(showtime.showtime)) || auth.role === 'admin')
														return navigate(`/showtime/${showtime._id}`)
												}}
											>
												{!showtime.isRelease && (
													<EyeSlashIcon
														className="h-6 w-6"
														title="Suất chiếu chưa phát hành"
													/>
												)}
												{`${new Date(showtime.showtime)
													.getHours()
													.toString()
													.padStart(2, '0')} : ${new Date(showtime.showtime)
													.getMinutes()
													.toString()
													.padStart(2, '0')}`}
											</button>
										)
									})}
								</div>
							</div>
						</div>
					)
				)
			})}
		</>
	)
}

export default Showtimes
