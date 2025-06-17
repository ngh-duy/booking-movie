import axios from 'axios'
import { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import CinemaLists from './CinemaLists'
import DateSelector from './DateSelector'
import Loading from './Loading'
import TheaterShort from './TheaterShort'

const TheaterListsByMovie = ({ movies, selectedMovieIndex, setSelectedMovieIndex, auth }) => {
	const [selectedDate, setSelectedDate] = useState(
		(sessionStorage.getItem('selectedDate') && new Date(sessionStorage.getItem('selectedDate'))) || new Date()
	)
	const [theaters, setTheaters] = useState([])
	const [isFetchingTheatersDone, setIsFetchingTheatersDone] = useState(false)
	const [selectedCinemaIndex, setSelectedCinemaIndex] = useState(
		parseInt(sessionStorage.getItem('selectedCinemaIndex'))
	)
	const [cinemas, setCinemas] = useState([])
	const [isFetchingCinemas, setIsFetchingCinemas] = useState(true)

	const fetchCinemas = async (data) => {
		try {
			setIsFetchingCinemas(true)
			let response
			if (auth.role === 'admin') {
				response = await axios.get('/cinema/unreleased', {
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				})
			} else {
				response = await axios.get('/cinema')
			}
			// console.log(response.data.data)
			setCinemas(response.data.data)
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingCinemas(false)
		}
	}

	useEffect(() => {
		fetchCinemas()
	}, [])

	const fetchTheaters = async (data) => {
		try {
			setIsFetchingTheatersDone(false)
			let response
			if (auth.role === 'admin') {
				response = await axios.get(
					`/theater/movie/unreleased/${
						movies[selectedMovieIndex]._id
					}/${selectedDate.toISOString()}/${new Date().getTimezoneOffset()}`,
					{
						headers: {
							Authorization: `Bearer ${auth.token}`
						}
					}
				)
			} else {
				response = await axios.get(
					`/theater/movie/${
						movies[selectedMovieIndex]._id
					}/${selectedDate.toISOString()}/${new Date().getTimezoneOffset()}`
				)
			}
			setTheaters(
				response.data.data.sort((a, b) => {
					if (a.cinema.name > b.cinema.name) return 1
					if (a.cinema.name === b.cinema.name && a.number > b.number) return 1
					return -1
				})
			)
			setIsFetchingTheatersDone(true)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		fetchTheaters()
	}, [selectedMovieIndex, selectedDate])

	const props = {
		cinemas,
		selectedCinemaIndex,
		setSelectedCinemaIndex,
		fetchCinemas,
		auth,
		isFetchingCinemas
	}

	const filteredTheaters = theaters.filter((theater) => {
		if (selectedCinemaIndex === 0 || !!selectedCinemaIndex) {
			return theater.cinema?.name === cinemas[selectedCinemaIndex]?.name
		}
		return true
	})

	return (
		<>
			<CinemaLists {...props} />
			<div className="mx-4 h-fit rounded-2xl bg-gradient-to-br from-purple-200 to-pink-100 text-gray-900 shadow-xl sm:mx-8">
				<div className="flex flex-col gap-8 p-6 sm:p-8">
					<DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
					<div className="flex flex-col gap-6 rounded-xl bg-gradient-to-br from-purple-100 to-white p-6 shadow-lg">
						<div className="flex items-center gap-6">
							<img 
								src={movies[selectedMovieIndex].img} 
								className="w-36 rounded-lg shadow-md transition-all duration-300 hover:scale-105" 
								alt={movies[selectedMovieIndex].name}
							/>
							<div className="space-y-2">
								<h4 className="text-2xl font-bold tracking-tight text-gray-800">{movies[selectedMovieIndex].name}</h4>
								<p className="text-lg font-medium text-gray-600">
									Thời lượng : {movies[selectedMovieIndex].length || '-'} phút
								</p>
							</div>
						</div>
					</div>
					{isFetchingTheatersDone ? (
						<div className="flex flex-col gap-6">
							{filteredTheaters.map((theater, index) => {
								return (
									<div
										key={index}
										className={`flex flex-col ${
											index !== 0 &&
											filteredTheaters[index - 1]?.cinema.name !==
												filteredTheaters[index].cinema.name &&
											'mt-8'
										}`}
									>
										{filteredTheaters[index - 1]?.cinema.name !==
											filteredTheaters[index].cinema.name && (
											<div className="rounded-t-xl bg-gradient-to-br from-purple-900 to-pink-800 px-4 py-3 text-center text-2xl font-semibold text-white shadow-lg">
												<h2 className="tracking-tight">{theater.cinema.name}</h2>
											</div>
										)}
										<TheaterShort
											theaterId={theater._id}
											movies={movies}
											selectedDate={selectedDate}
											filterMovie={movies[selectedMovieIndex]}
											rounded={
												index == filteredTheaters.length ||
												filteredTheaters[index + 1]?.cinema.name !==
													filteredTheaters[index].cinema.name
											}
										/>
									</div>
								)
							})}
							{filteredTheaters.length === 0 && (
								<p className="text-center text-xl font-medium text-gray-600">
									Không có suất chiếu nào
								</p>
							)}
						</div>
					) : (
						<Loading />
					)}
				</div>
			</div>
		</>
	)
}

export default TheaterListsByMovie
